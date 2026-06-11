import { NextRequest, NextResponse } from 'next/server';
import { Receiver } from '@upstash/qstash';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { checkAndCleanStaleJobs } from '@/lib/queues';

export const maxDuration = 60; // Allow background workers to run for up to 60 seconds

export async function POST(req: NextRequest) {
  // Automatically detect and transition stale jobs before processing new requests
  await checkAndCleanStaleJobs();

  const bodyText = await req.text();
  let body: any;

  try {
    body = JSON.parse(bodyText);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // 1. Verify QStash Signature if running in production or keys are present
  if (process.env.QSTASH_CURRENT_SIGNING_KEY) {
    const receiver = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || process.env.QSTASH_CURRENT_SIGNING_KEY,
    });

    const signature = req.headers.get('upstash-signature') || '';

    try {
      const isValid = await receiver.verify({ signature, body: bodyText });
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } catch (err) {
      console.error('QStash verification failed', err);
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
    }
  }

  const { type, payload } = body;

  try {
    switch (type) {
      case 'resume-parse':
        // Heavy resume parsing logic here
        console.log(`Processing resume parse for user ${payload.userId}, resume ${payload.resumeId}`);
        break;

      case 'github-sync':
        console.log(`Processing github sync for user ${payload.userId}`);
        break;

      case 'notifications':
        await db.notification.create({
          data: {
            userId: payload.userId,
            type: payload.type as any,
            title: payload.title,
            body: payload.body,
          },
        });
        console.log(`Processed notification for user ${payload.userId}`);
        break;

      case 'BACKGROUND_JOB': {
        const { jobId } = payload;
        
        // Atomically transition the job to PROCESSING using compare-and-swap (updateMany)
        const updateResult = await db.backgroundJob.updateMany({
          where: {
            id: jobId,
            status: { in: ['PENDING', 'FAILED'] },
          },
          data: {
            status: 'PROCESSING',
            error: null, // Clear any previous error on retry
          },
        });

        if (updateResult.count === 0) {
          // The job was not transitioned. Check why.
          const jobData = await db.backgroundJob.findUnique({ where: { id: jobId } });
          if (!jobData) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
          }
          if (jobData.status === 'COMPLETED') {
            // Already processed successfully. Return 200 (Idempotent Success)
            return NextResponse.json({ success: true, message: 'Job already completed, skipping.' });
          }
          if (jobData.status === 'PROCESSING') {
            // Another worker is actively running this job. Return 202 (Accepted/In-progress) to avoid duplicate execution
            return NextResponse.json({ success: true, message: 'Job is currently being processed by another worker.' }, { status: 202 });
          }
          return NextResponse.json({ error: `Invalid job status transition from ${jobData.status}` }, { status: 400 });
        }

        try {
          let result;
          const jobData = await db.backgroundJob.findUnique({ where: { id: jobId } });
          if (!jobData?.payload) throw new Error('Job payload missing');

          if (payload.jobType === 'JOB_ANALYZE') {
            const { performJobAnalysis } = await import('@/lib/services/job-analyzer');
            result = await performJobAnalysis(jobId, jobData.payload as any);
          } else if (payload.jobType === 'ROADMAP_GENERATE') {
            const { performRoadmapGenerate } = await import('@/lib/services/roadmap-generator');
            result = await performRoadmapGenerate(jobId, jobData.payload as any);
          } else if (payload.jobType === 'RESUME_GENERATE') {
            const { performResumeGenerate } = await import('@/lib/services/resume-generator');
            result = await performResumeGenerate(jobId, jobData.payload as any);
          } else if (payload.jobType === 'ATS_SCORE') {
            const { performAtsScore } = await import('@/lib/services/resume-ats-scorer');
            result = await performAtsScore(jobId, jobData.payload as any);
          } else if (payload.jobType === 'INTERVIEW_GENERATE') {
            const { performInterviewGenerate } = await import('@/lib/services/interview-generator');
            result = await performInterviewGenerate(jobId, jobData.payload as any);
          } else if (payload.jobType === 'INTERVIEW_EVALUATE') {
            const { performInterviewEvaluate } = await import('@/lib/services/interview-evaluator');
            result = await performInterviewEvaluate(jobId, jobData.payload as any);
          } else {
            throw new Error(`Unsupported BACKGROUND_JOB type: ${payload.jobType}`);
          }

          // Atomically transition from PROCESSING to COMPLETED
          const completeResult = await db.backgroundJob.updateMany({
            where: {
              id: jobId,
              status: 'PROCESSING',
            },
            data: { 
              status: 'COMPLETED', 
              result: result as any,
              completedAt: new Date(),
            },
          });

          if (completeResult.count === 0) {
            console.warn(`Job ${jobId} was processed but could not be transitioned to COMPLETED. Current state changed during execution.`);
          }
          
        } catch (jobError: any) {
          logger.error('Background worker job execution failed', {
            jobId,
            jobType: payload.jobType,
            error: jobError.message || String(jobError),
          });

          // Fetch the latest retry status
          const currentJob = await db.backgroundJob.findUnique({ where: { id: jobId } });
          const newRetryCount = (currentJob?.retryCount ?? 0) + 1;
          const maxRetries = currentJob?.maxRetries ?? 3;
          const isFinalFailure = newRetryCount >= maxRetries;

          await db.backgroundJob.updateMany({
            where: {
              id: jobId,
              status: 'PROCESSING',
            },
            data: { 
              status: isFinalFailure ? 'FAILED' : 'PENDING',
              retryCount: newRetryCount,
              error: jobError.message || String(jobError),
            },
          });

          if (isFinalFailure) {
            // Return 200 so QStash doesn't retry anymore
            return NextResponse.json({ success: false, error: 'Job execution failed and max retries exhausted' });
          } else {
            // Return 500 error to trigger QStash retry mechanism
            return NextResponse.json({ error: 'Job execution failed, scheduling retry' }, { status: 500 });
          }
        }
        break;
      }

      default:
        console.warn(`Unknown job type: ${type}`);
    }
  } catch (error) {
    console.error(`Failed to process job ${type}:`, error);
    return NextResponse.json({ error: 'Job processing failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
