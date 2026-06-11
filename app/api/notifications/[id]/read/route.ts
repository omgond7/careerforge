import { NextRequest } from 'next/server';
import { getAuthUser, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const resolvedParams = await params;
  const { id } = resolvedParams;

  await db.notification.updateMany({ where: { id, userId: user.id }, data: { isRead: true } });
  return apiSuccess({ marked: true });
}
