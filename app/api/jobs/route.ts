import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const GET = requireAuth(async (req, user) => {
  const { searchParams } = new URL(req.url);
  const saved = searchParams.get('saved') === 'true';
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const page = parseInt(searchParams.get('page') ?? '1');

  const jobs = await db.jobAnalysis.findMany({
    where: { userId: user.id, ...(saved ? { isSaved: true } : {}) },
    include: { gaps: { take: 3, orderBy: { priority: 'asc' } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const total = await db.jobAnalysis.count({ 
    where: { userId: user.id, ...(saved ? { isSaved: true } : {}) } 
  });

  return apiSuccess({ jobs, total, page, limit });
});
