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

  const session = await db.interviewSession.findFirst({
    where: { id, userId: user.id },
  });
  if (!session) return apiError('Session not found', 404);
  return apiSuccess(session);
}
