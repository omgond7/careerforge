import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const GET = requireAuth(async (req, user) => {
  const sync = await db.linkedinSync.findUnique({ where: { userId: user.id } });
  if (!sync) return apiSuccess({ connected: false });
  const raw = (sync.rawData as any) || {};
  return apiSuccess({
    connected: true,
    linkedinProfileUrl: sync.linkedinProfileUrl,
    lastSyncedAt: sync.lastSyncedAt,
    experiences: raw.experiences || [],
    skills: raw.skills || [],
    connectionsCount: sync.connectionsCount,
    endorsements: raw.endorsements || 0,
    recommendations: raw.recommendations || 0,
  });
});
