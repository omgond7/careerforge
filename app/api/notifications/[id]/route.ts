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

  const notification = await db.notification.findFirst({
    where: { id, userId: user.id },
  });
  if (!notification) return apiError('Notification not found', 404);
  return apiSuccess(notification);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const resolvedParams = await params;
  const { id } = resolvedParams;

  await db.notification.deleteMany({
    where: { id, userId: user.id },
  });

  return apiSuccess({ deleted: true });
}
