import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, parseBody } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { z } from 'zod';

export const GET = requireAuth(async (req, user) => {
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      profile: {
        include: {
          skills: { include: { skill: true } },
          experience: true,
          education: true,
          projects: true,
          certifications: true,
        },
      },
      githubSync: true,
      linkedinSync: true,
      notificationPrefs: true,
    },
  });
  if (!dbUser) return apiError('User not found', 404);

  // Sanitize user object to prevent data leaks of passwords and access tokens
  const { passwordHash, ...safeUser } = dbUser;
  if (safeUser.githubSync) {
    (safeUser.githubSync as any).accessToken = undefined;
  }
  if (safeUser.linkedinSync) {
    (safeUser.linkedinSync as any).accessToken = undefined;
  }

  return apiSuccess(safeUser);
});

const patchSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional().or(z.string().length(0)),
});

export const PATCH = requireAuth(async (req, user) => {
  const parsed = await parseBody(req, patchSchema);
  if (parsed.error) return parsed.error;

  const { name, avatarUrl } = parsed.data;

  const updated = await db.user.update({
    where: { id: user.id },
    data: { 
      ...(name && { name }), 
      ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }) 
    },
  });

  const { passwordHash, ...safeUpdated } = updated;

  return apiSuccess(safeUpdated);
});
