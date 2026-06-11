import { NextRequest } from 'next/server';

export const maxDuration = 60;
import { getAuthUser, apiSuccess, apiError, logUsage, rateLimit, RATE_LIMITS, checkDailyAILimit, incrementDailyAIUsage } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { getJobAnalysisCacheKey, safeGetCache } from '@/lib/cache-utils';
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
    const { allowed } = await rateLimit(`job_analyze:${user.id!}`, RATE_LIMITS.USER_AI);
    if (!allowed) return apiError('Rate limit exceeded. Try again later.', 429);
  } catch (rlError) {
    console.error('Redis Rate Limiting Error:', rlError);
  }

  const body = await req.json().catch(() => ({}));
  const { company, jobTitle, jobDescription, jobUrl } = body;
  if (!jobDescription || !company || !jobTitle) {
    return apiError('company, jobTitle, and jobDescription are required', 400);
  }

  // Cache check using SHA-256 hash key
  const cacheKey = getJobAnalysisCacheKey(user.id!, jobDescription);
  const cached = await safeGetCache(cacheKey);
  if (cached) return apiSuccess(JSON.parse(cached));

  // Create Background Job instead of awaiting AI completion
  const backgroundJob = await db.backgroundJob.create({
    data: {
      userId: user.id!,
      jobType: 'JOB_ANALYZE',
      status: 'PENDING',
      payload: { userId: user.id!, company, jobTitle, jobDescription, jobUrl },
    },
  });

  // Enqueue job to QStash
  await enqueueBackgroundJob(backgroundJob.id, 'JOB_ANALYZE');

  const { logAuditRequest } = await import('@/lib/audit-logger');
  await logAuditRequest(req, {
    userId: user.id!,
    action: 'JOB_ANALYZE',
    entityType: 'BACKGROUND_JOB',
    entityId: backgroundJob.id,
    metadata: { company, jobTitle, jobUrl },
  });

  // Return the background job ID so the client can poll the status
  return apiSuccess(
    {
      jobId: backgroundJob.id,
      status: 'PENDING',
      message: 'Job analysis has been queued for background processing.',
    },
    202
  );
}
