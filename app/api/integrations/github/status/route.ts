import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const GET = requireAuth(async (req, user) => {
  const sync = await db.githubSync.findUnique({ where: { userId: user.id } });
  if (!sync) return apiSuccess({ connected: false });
  return apiSuccess({ 
    connected: true, 
    username: sync.githubUsername, 
    lastSyncedAt: sync.lastSyncedAt, 
    projectsImported: sync.projectsImported, 
    totalStars: sync.totalStars, 
    topLanguages: sync.topLanguages,
    contributions: sync.contributions,
    rawData: sync.rawData
  });
});
