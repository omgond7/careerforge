import { NextRequest } from 'next/server';

export const maxDuration = 60;
import { requireAuth, apiSuccess, apiError, logUsage, rateLimit, RATE_LIMITS, checkDailyAILimit, incrementDailyAIUsage } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { enqueueBackgroundJob } from '@/lib/queues';

export const GET = requireAuth(async (req, user) => {
  const sessions = await db.interviewSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return apiSuccess(sessions);
});

export const POST = requireAuth(async (req, user) => {
  // Check daily AI limit
  const dailyLimit = await checkDailyAILimit(user.id, (user as any).subscriptionTier || 'FREE');
  if (!dailyLimit.allowed) {
    return apiError('Daily AI limit exceeded. Upgrade to Pro for more.', 429);
  }

  // Rate limit
  try {
    const { allowed } = await rateLimit(`interview:${user.id}`, RATE_LIMITS.USER_AI);
    if (!allowed) return apiError('Rate limit exceeded. Try again later.', 429);
  } catch (rlError) {
    console.error('Redis Rate Limiting Error:', rlError);
  }
  const body = await req.json().catch(() => ({}));
  const { type, company, role, jobId, numQuestions = 5 } = body;

  const backgroundJob = await db.backgroundJob.create({
    data: {
      userId: user.id,
      jobType: 'INTERVIEW_GENERATE',
      status: 'PENDING',
      payload: { userId: user.id, type, company, role, jobId, numQuestions },
    },
  });

  await enqueueBackgroundJob(backgroundJob.id, 'INTERVIEW_GENERATE');

  const { logAuditRequest } = await import('@/lib/audit-logger');
  await logAuditRequest(req, {
    userId: user.id,
    action: 'INTERVIEW_GENERATE',
    entityType: 'BACKGROUND_JOB',
    entityId: backgroundJob.id,
    metadata: { type, company, role, jobId, numQuestions },
  });

  return apiSuccess(
    {
      jobId: backgroundJob.id,
      status: 'PENDING',
      message: 'Interview session generation has been queued for background processing.',
    },
    202
  );
});
