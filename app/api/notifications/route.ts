import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const GET = requireAuth(async (req, user) => {
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get('unread') === 'true';

  const notifications = await db.notification.findMany({
    where: { userId: user.id, ...(unreadOnly ? { isRead: false } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = await db.notification.count({ where: { userId: user.id, isRead: false } });

  return apiSuccess({ notifications, unreadCount });
});

export const POST = requireAuth(async (req, user) => {
  await db.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });
  return apiSuccess({ markedAllRead: true });
});
