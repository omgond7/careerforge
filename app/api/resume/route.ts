import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const GET = requireAuth(async (req, user) => {
  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    include: { versions: { orderBy: { createdAt: 'desc' } } },
    orderBy: { updatedAt: 'desc' },
  });
  return apiSuccess(resumes);
});
