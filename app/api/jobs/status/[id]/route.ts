import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { checkAndCleanStaleJobs } from '@/lib/queues';

export const GET = requireAuth(async (req: NextRequest, user, context) => {
  const { id } = await context.params;
  
  if (!id) {
    return apiError('Job ID is required', 400);
  }

  // Run stale job detection to ensure current state is accurate
  await checkAndCleanStaleJobs();

  const job = await db.backgroundJob.findUnique({
    where: { id },
  });

  if (!job) {
    return apiError('Job not found', 404);
  }

  if (job.userId !== user.id) {
    return apiError('Unauthorized', 403);
  }

  return apiSuccess({
    id: job.id,
    jobType: job.jobType,
    status: job.status,
    result: job.result,
    error: job.error,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  });
});
