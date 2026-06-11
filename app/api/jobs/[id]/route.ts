import { NextRequest } from 'next/server';
import { getAuthUser, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const job = await db.jobAnalysis.findFirst({
    where: { id, userId: user.id },
    include: { gaps: { orderBy: [{ priority: 'asc' }] } },
  });
  
  if (!job) return apiError('Job not found', 404);
  return apiSuccess(job);
}

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const body = await req.json().catch(() => ({}));
  
  // Update details (e.g. toggle isSaved status)
  const job = await db.jobAnalysis.updateMany({
    where: { id, userId: user.id },
    data: { isSaved: body.isSaved },
  });
  
  return apiSuccess(job);
}
