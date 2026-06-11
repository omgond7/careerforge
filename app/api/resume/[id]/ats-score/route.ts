import { NextRequest } from 'next/server';
import { getAuthUser, apiSuccess, apiError, logUsage, rateLimit, RATE_LIMITS, checkDailyAILimit, incrementDailyAIUsage } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { enqueueBackgroundJob } from '@/lib/queues';

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  // Check daily AI limit
  const dailyLimit = await checkDailyAILimit(user.id!, (user as any).subscriptionTier || 'FREE');
  if (!dailyLimit.allowed) {
    return apiError('Daily AI limit exceeded. Upgrade to Pro for more.', 429);
  }

  // Rate limit
  try {
    const { allowed } = await rateLimit(`ats_score:${user.id!}`, RATE_LIMITS.USER_AI);
    if (!allowed) return apiError('Rate limit exceeded. Try again later.', 429);
  } catch (rlError) {
    console.error('Redis Rate Limiting Error:', rlError);
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const resume = await db.resume.findFirst({ where: { id, userId: user.id! } });
  if (!resume) return apiError('Resume not found', 404);

  const body = await req.json().catch(() => ({}));
  const { jobDescription } = body;

  const backgroundJob = await db.backgroundJob.create({
    data: {
      userId: user.id!,
      jobType: 'ATS_SCORE',
      status: 'PENDING',
      payload: { userId: user.id!, resumeId: id, jobDescription },
    },
  });

  await enqueueBackgroundJob(backgroundJob.id, 'ATS_SCORE');

  const { logAuditRequest } = await import('@/lib/audit-logger');
  await logAuditRequest(req, {
    userId: user.id!,
    action: 'ATS_SCORING',
    entityType: 'RESUME',
    entityId: id,
    metadata: { jobId: backgroundJob.id },
  });

  return apiSuccess(
    {
      jobId: backgroundJob.id,
      status: 'PENDING',
      message: 'Resume scoring has been queued for background processing.',
    },
    202
  );
}
