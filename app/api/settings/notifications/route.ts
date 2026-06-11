import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, parseBody } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { z } from 'zod';

export const GET = requireAuth(async (req, user) => {
  const prefs = await db.notificationPrefs.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  });
  return apiSuccess(prefs);
});

const prefsSchema = z.object({
  jobAlerts: z.boolean().optional(),
  resumeReady: z.boolean().optional(),
  applicationUpdates: z.boolean().optional(),
  skillSuggestions: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});

export const PATCH = requireAuth(async (req, user) => {
  const parsed = await parseBody(req, prefsSchema);
  if (parsed.error) return parsed.error;

  const prefs = await db.notificationPrefs.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...parsed.data },
    update: parsed.data,
  });
  return apiSuccess(prefs);
});
