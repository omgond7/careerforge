import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const GET = requireAuth(async (req, user) => {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return apiSuccess([]);
  }

  // Search Jobs
  const jobs = await db.jobAnalysis.findMany({
    where: {
      userId: user.id,
      OR: [
        { jobTitle: { contains: q, mode: 'insensitive' } },
        { company: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 5,
  });

  // Search Interview Sessions
  const interviews = await db.interviewSession.findMany({
    where: {
      userId: user.id,
      OR: [
        { role: { contains: q, mode: 'insensitive' } },
        { company: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 5,
  });

  // Search Roadmaps
  const roadmaps = await db.careerRoadmap.findMany({
    where: {
      userId: user.id,
      OR: [
        { targetRoleTitle: { contains: q, mode: 'insensitive' } },
        { targetCompany: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 5,
  });

  // Combine and map results
  const results: any[] = [];

  jobs.forEach((j) => {
    results.push({
      id: j.id,
      type: 'job',
      title: `${j.jobTitle} at ${j.company}`,
      subtitle: j.company,
      score: j.matchScore || null,
      href: `/job-intelligence/${j.id}`,
    });
  });

  interviews.forEach((i) => {
    results.push({
      id: i.id,
      type: 'interview',
      title: `${i.role} Interview Practice`,
      subtitle: i.company || 'General',
      score: i.score || null,
      href: i.completedAt ? `/interview-prep/results/${i.id}` : `/interview-prep`,
    });
  });

  roadmaps.forEach((r) => {
    results.push({
      id: r.id,
      type: 'roadmap',
      title: `Roadmap: ${r.targetRoleTitle}`,
      subtitle: r.targetCompany || 'General',
      href: `/roadmap`,
    });
  });

  return apiSuccess(results);
});
