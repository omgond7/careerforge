import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const GET = requireAuth(async (req, user) => {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');

  if (jobId) {
    const job = await db.jobAnalysis.findFirst({
      where: { id: jobId, userId: user.id },
      include: { gaps: { orderBy: [{ priority: 'asc' }, { gapType: 'asc' }] } },
    });
    if (!job) return apiError('Job not found', 404);
    return apiSuccess({ matchScore: job.matchScore, matchLevel: job.matchLevel, gaps: job.gaps });
  }

  // Overall gap summary across all recent jobs
  const profile = await db.userProfile.findUnique({
    where: { userId: user.id },
    include: { skills: { include: { skill: true } } },
  });
  const recentJobs = await db.jobAnalysis.findMany({
    where: { userId: user.id },
    include: { gaps: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // Aggregate most common gaps
  const gapMap = new Map<string, number>();
  for (const job of recentJobs) {
    for (const gap of job.gaps) {
      if (gap.skillName) {
        gapMap.set(gap.skillName, (gapMap.get(gap.skillName) ?? 0) + 1);
      }
    }
  }

  const topGaps = Array.from(gapMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  return apiSuccess({ topGaps, profileSkills: profile?.skills.map(s => s.skill.name) ?? [] });
});
