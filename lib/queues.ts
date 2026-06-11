import { Client } from '@upstash/qstash';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

const client = new Client({
  token: process.env.QSTASH_TOKEN || '',
});

// Helper to determine the absolute webhook URL
const getWebhookUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/workers`;
};

export async function enqueueResumeParse(userId: string, resumeId: string) {
  if (!process.env.QSTASH_TOKEN) {
    console.warn('QSTASH_TOKEN missing, job not queued');
    return;
  }
  await client.publishJSON({
    url: getWebhookUrl(),
    body: { type: 'resume-parse', payload: { userId, resumeId } },
  });
}

export async function enqueueGithubSync(userId: string) {
  if (!process.env.QSTASH_TOKEN) {
    console.warn('QSTASH_TOKEN missing, job not queued');
    return;
  }
  await client.publishJSON({
    url: getWebhookUrl(),
    body: { type: 'github-sync', payload: { userId } },
  });
}

export async function enqueueNotification(userId: string, type: string, title: string, body: string) {
  if (!process.env.QSTASH_TOKEN) {
    console.warn('QSTASH_TOKEN missing, job not queued');
    return;
  }
  await client.publishJSON({
    url: getWebhookUrl(),
    body: { type: 'notifications', payload: { userId, type, title, body } },
  });
}

export async function enqueueBackgroundJob(jobId: string, type: string) {
  if (!process.env.QSTASH_TOKEN) {
    console.warn('QSTASH_TOKEN missing, job not queued');
    return;
  }
  await client.publishJSON({
    url: getWebhookUrl(),
    body: { type: 'BACKGROUND_JOB', payload: { jobId, jobType: type } },
    retries: 3, // Enable robust retry handling
  });
}

/**
 * Automatically transitions stale background jobs to FAILED status.
 * - PENDING jobs remaining for > 15 minutes.
 * - PROCESSING jobs remaining for > 30 minutes.
 */
export async function checkAndCleanStaleJobs(): Promise<void> {
  const now = new Date();
  
  // 15 minutes ago
  const pendingTtlLimit = new Date(now.getTime() - 15 * 60 * 1000);
  // 30 minutes ago
  const processingTtlLimit = new Date(now.getTime() - 30 * 60 * 1000);

  try {
    // 1. Clean stale PENDING jobs
    const stalePending = await db.backgroundJob.findMany({
      where: {
        status: 'PENDING',
        createdAt: { lt: pendingTtlLimit },
      },
      select: { id: true, jobType: true, userId: true },
    });

    if (stalePending.length > 0) {
      await db.backgroundJob.updateMany({
        where: {
          id: { in: stalePending.map(j => j.id) },
        },
        data: {
          status: 'FAILED',
          error: 'Job timed out in PENDING status (>15 minutes)',
        },
      });

      for (const job of stalePending) {
        logger.warn('Stale job detected and marked as FAILED (PENDING timeout)', {
          jobId: job.id,
          jobType: job.jobType,
          userId: job.userId,
        });
      }
    }

    // 2. Clean stale PROCESSING jobs
    const staleProcessing = await db.backgroundJob.findMany({
      where: {
        status: 'PROCESSING',
        updatedAt: { lt: processingTtlLimit },
      },
      select: { id: true, jobType: true, userId: true },
    });

    if (staleProcessing.length > 0) {
      await db.backgroundJob.updateMany({
        where: {
          id: { in: staleProcessing.map(j => j.id) },
        },
        data: {
          status: 'FAILED',
          error: 'Job timed out in PROCESSING status (>30 minutes)',
        },
      });

      for (const job of staleProcessing) {
        logger.warn('Stale job detected and marked as FAILED (PROCESSING timeout)', {
          jobId: job.id,
          jobType: job.jobType,
          userId: job.userId,
        });
      }
    }
  } catch (error) {
    logger.error('Failed to run stale job detection', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
