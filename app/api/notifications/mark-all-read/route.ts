import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const POST = requireAuth(async (req, user) => {
  await db.notification.updateMany({ 
    where: { userId: user.id, isRead: false }, 
    data: { isRead: true } 
  });
  return apiSuccess({ marked: true });
});
