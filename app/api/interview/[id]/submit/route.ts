import { NextRequest } from 'next/server';

export const maxDuration = 60;
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
    const { allowed } = await rateLimit(`interview_submit:${user.id!}`, RATE_LIMITS.USER_AI);
    if (!allowed) return apiError('Rate limit exceeded. Try again later.', 429);
  } catch (rlError) {
    console.error('Redis Rate Limiting Error:', rlError);
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const session = await db.interviewSession.findFirst({ where: { id, userId: user.id! } });
  if (!session) return apiError('Session not found', 404);

  const body = await req.json().catch(() => ({}));
  const { answers } = body; // [{ questionId, answer }]

  const backgroundJob = await db.backgroundJob.create({
    data: {
      userId: user.id!,
      jobType: 'INTERVIEW_EVALUATE',
      status: 'PENDING',
      payload: { userId: user.id!, interviewSessionId: id, answers },
    },
  });

  await enqueueBackgroundJob(backgroundJob.id, 'INTERVIEW_EVALUATE');

  const { logAuditRequest } = await import('@/lib/audit-logger');
  await logAuditRequest(req, {
    userId: user.id!,
    action: 'INTERVIEW_SUBMIT',
    entityType: 'INTERVIEW_SESSION',
    entityId: id,
    metadata: { jobId: backgroundJob.id },
  });

  return apiSuccess(
    {
      jobId: backgroundJob.id,
      status: 'PENDING',
      message: 'Interview evaluation has been queued for background processing.',
    },
    202
  );
}
