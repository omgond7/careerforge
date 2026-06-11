import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export const GET = requireAuth(async (req, user) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status')?.toUpperCase();

  const applications = await db.application.findMany({
    where: { 
      userId: user.id, 
      ...(status ? { status: status as any } : {}) 
    },
    include: { timeline: { orderBy: { changedAt: 'desc' }, take: 5 } },
    orderBy: { lastUpdated: 'desc' },
  });
  return apiSuccess(applications);
});

export const POST = requireAuth(async (req, user) => {
  const body = await req.json().catch(() => ({}));
  const { jobTitle, company, status, jobId, resumeId, notes, appliedDate } = body;

  if (!jobTitle || !company) {
    return apiError('jobTitle and company are required', 400);
  }

  // Normalize status casing to match uppercase Prisma enum
  const appStatus = status ? status.toUpperCase() : 'APPLIED';

  const application = await db.application.create({
    data: {
      userId: user.id,
      jobTitle,
      company,
      status: appStatus as any,
      jobId,
      resumeId,
      notes,
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      timeline: { 
        create: { 
          status: appStatus as any, 
          note: 'Application created' 
        } 
      },
    },
    include: { timeline: true },
  });

  return apiSuccess(application, 201);
});
