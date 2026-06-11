import { NextRequest } from 'next/server';

export const maxDuration = 60;
import { getAuthUser, apiSuccess, apiError, logUsage, rateLimit, RATE_LIMITS, checkDailyAILimit, incrementDailyAIUsage } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { enqueueBackgroundJob } from '@/lib/queues';

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  // Check daily AI limit
  const dailyLimit = await checkDailyAILimit(user.id!, (user as any).subscriptionTier || 'FREE');
  if (!dailyLimit.allowed) {
    return apiError('Daily AI limit exceeded. Upgrade to Pro for more.', 429);
  }

  // Rate limit
  try {
    const { allowed } = await rateLimit(`resume_generate:${user.id!}`, RATE_LIMITS.USER_AI);
    if (!allowed) return apiError('Rate limit exceeded. Try again later.', 429);
  } catch (rlError) {
    console.error('Redis Rate Limiting Error:', rlError);
  }

  const body = await req.json().catch(() => ({}));
  const { jobId, resumeId } = body;
  if (!jobId) return apiError('jobId required', 400);

  const backgroundJob = await db.backgroundJob.create({
    data: {
      userId: user.id!,
      jobType: 'RESUME_GENERATE',
      status: 'PENDING',
      payload: { userId: user.id!, jobId, resumeId },
    },
  });

  await enqueueBackgroundJob(backgroundJob.id, 'RESUME_GENERATE');

  const { logAuditRequest } = await import('@/lib/audit-logger');
  await logAuditRequest(req, {
    userId: user.id!,
    action: 'RESUME_GENERATE',
    entityType: 'BACKGROUND_JOB',
    entityId: backgroundJob.id,
    metadata: { jobId, resumeId },
  });

  return apiSuccess(
    {
      jobId: backgroundJob.id,
      status: 'PENDING',
      message: 'Resume generation has been queued for background processing.',
    },
    202
  );
}
