import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, parseBody } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { z } from 'zod';

export const GET = requireAuth(async (req, user) => {
  const profile = await db.userProfile.findUnique({
    where: { userId: user.id },
    include: {
      skills: { include: { skill: true } },
      experience: { orderBy: { startDate: 'desc' } },
      education: { orderBy: { startYear: 'desc' } },
      projects: { orderBy: { createdAt: 'desc' } },
      certifications: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!profile) return apiError('Profile not found', 404);
  return apiSuccess(profile);
});

const profileSchema = z.object({
  headline: z.string().max(200).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  websiteUrl: z.string().url().optional().nullable().or(z.string().length(0)),
  linkedinUrl: z.string().url().optional().nullable().or(z.string().length(0)),
  githubUrl: z.string().url().optional().nullable().or(z.string().length(0)),
  portfolioUrl: z.string().url().optional().nullable().or(z.string().length(0)),
  experienceYears: z.number().min(0).max(50).optional().nullable(),
  targetRole: z.string().max(100).optional().nullable(),
  targetCompany: z.string().max(100).optional().nullable(),
});

export const PATCH = requireAuth(async (req, user) => {
  const parsed = await parseBody(req, profileSchema);
  if (parsed.error) return parsed.error;

  const {
    headline,
    bio,
    location,
    websiteUrl,
    linkedinUrl,
    githubUrl,
    portfolioUrl,
    experienceYears,
    targetRole,
    targetCompany
  } = parsed.data;

  // Clean empty URLs to null
  const cleanData = {
    headline,
    bio,
    location,
    websiteUrl: websiteUrl || null,
    linkedinUrl: linkedinUrl || null,
    githubUrl: githubUrl || null,
    portfolioUrl: portfolioUrl || null,
    experienceYears,
    targetRole,
    targetCompany
  };

  const profile = await db.userProfile.upsert({
    where: { userId: user.id },
    update: cleanData,
    create: { userId: user.id, ...cleanData },
  });

  // Recalculate profile completeness
  const completeness = calculateCompleteness(profile);
  await db.userProfile.update({ where: { id: profile.id }, data: { profileCompleteness: completeness } });

  return apiSuccess({ ...profile, profileCompleteness: completeness });
});

function calculateCompleteness(profile: any): number {
  const fields = ['headline', 'bio', 'location', 'linkedinUrl', 'githubUrl', 'experienceYears', 'targetRole'];
  const filled = fields.filter(f => profile[f] !== null && profile[f] !== undefined && profile[f] !== '').length;
  return Math.round((filled / fields.length) * 100);
}
