import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, parseBody } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { z } from 'zod';

export const GET = requireAuth(async (req, user) => {
  const profile = await db.userProfile.findUnique({ where: { userId: user.id } });
  const u = await db.user.findUnique({ where: { id: user.id }, select: { name: true, email: true, avatarUrl: true } });
  return apiSuccess({ ...profile, ...u });
});

const patchSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional().nullable().or(z.string().length(0)),
  headline: z.string().max(200).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  websiteUrl: z.string().url().optional().nullable().or(z.string().length(0)),
  linkedinUrl: z.string().url().optional().nullable().or(z.string().length(0)),
  githubUrl: z.string().url().optional().nullable().or(z.string().length(0)),
});

export const PATCH = requireAuth(async (req, user) => {
  const parsed = await parseBody(req, patchSchema);
  if (parsed.error) return parsed.error;

  const { name, avatarUrl, headline, bio, location, websiteUrl, linkedinUrl, githubUrl } = parsed.data;

  await db.user.update({ 
    where: { id: user.id }, 
    data: { 
      ...(name && { name }), 
      ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }) 
    } 
  });

  const profileData = {
    headline,
    bio,
    location,
    websiteUrl: websiteUrl || null,
    linkedinUrl: linkedinUrl || null,
    githubUrl: githubUrl || null,
  };

  const profile = await db.userProfile.upsert({
    where: { userId: user.id },
    update: profileData,
    create: { userId: user.id, ...profileData },
  });

  return apiSuccess(profile);
});
