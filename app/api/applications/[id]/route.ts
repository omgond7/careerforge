import { NextRequest } from 'next/server';
import { getAuthUser, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const app = await db.application.findFirst({
    where: { id, userId: user.id },
    include: { timeline: { orderBy: { changedAt: 'desc' } }, job: true, resume: true },
  });
  if (!app) return apiError('Application not found', 404);
  return apiSuccess(app);
}

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const body = await req.json().catch(() => ({}));
  const { status, notes, nextActionDate, nextActionNote, salaryOffered, rejectionReason, timelineNote } = body;

  const existing = await db.application.findFirst({ where: { id, userId: user.id } });
  if (!existing) return apiError('Application not found', 404);

  // Normalize status casing to match uppercase Prisma enum
  const appStatus = status ? status.toUpperCase() : undefined;

  const updated = await db.application.update({
    where: { id },
    data: {
      ...(appStatus && { status: appStatus as any }),
      ...(notes !== undefined && { notes }),
      ...(nextActionDate && { nextActionDate: new Date(nextActionDate) }),
      ...(nextActionNote !== undefined && { nextActionNote }),
      ...(salaryOffered !== undefined && { salaryOffered }),
      ...(rejectionReason !== undefined && { rejectionReason }),
    },
    include: { timeline: { orderBy: { changedAt: 'desc' } } },
  });

  // Add timeline entry if status changed
  if (appStatus && appStatus !== existing.status) {
    await db.applicationTimeline.create({
      data: { 
        applicationId: id, 
        status: appStatus as any, 
        note: timelineNote || 'Status updated' 
      },
    });
  }

  return apiSuccess(updated);
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const existing = await db.application.findFirst({ where: { id, userId: user.id } });
  if (!existing) return apiError('Application not found', 404);

  await db.application.delete({ where: { id } });
  return apiSuccess({ deleted: true });
}
