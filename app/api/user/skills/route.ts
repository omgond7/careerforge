import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, parseBody } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { z } from 'zod';

export const GET = requireAuth(async (req, user) => {
  const profile = await db.userProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return apiError('Profile not found', 404);

  const skills = await db.userSkill.findMany({
    where: { userProfileId: profile.id },
    include: { skill: true },
    orderBy: { addedAt: 'desc' },
  });
  return apiSuccess(skills);
});

const skillSchema = z.object({
  skillName: z.string().min(1).max(50),
  category: z.string().max(50).optional().nullable(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
  source: z.string().optional().nullable(),
});

export const POST = requireAuth(async (req, user) => {
  const parsed = await parseBody(req, skillSchema);
  if (parsed.error) return parsed.error;

  const { skillName, category, level, source } = parsed.data;

  const profile = await db.userProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return apiError('Profile not found', 404);

  // Find or create skill
  const skill = await db.skill.upsert({
    where: { name: skillName },
    create: { name: skillName, category: category ?? 'General' },
    update: {},
  });

  const userSkill = await db.userSkill.upsert({
    where: { userProfileId_skillId: { userProfileId: profile.id, skillId: skill.id } },
    create: { 
      userProfileId: profile.id, 
      skillId: skill.id, 
      level: level ?? 'INTERMEDIATE', 
      source: source || 'manual' 
    },
    update: { 
      level: level ?? 'INTERMEDIATE', 
      source: source || 'manual' 
    },
    include: { skill: true },
  });

  return apiSuccess(userSkill, 201);
});
