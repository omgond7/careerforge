import { NextRequest } from 'next/server';
import { getAuthUser, apiSuccess, apiError } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { logAuditRequest } from '@/lib/audit-logger';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return apiError('Unauthorized', 401);

  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Find the resume and verify ownership
  const resume = await db.resume.findUnique({
    where: { id },
  });

  if (!resume) {
    return apiError('Resume not found', 404);
  }

  if (resume.userId !== user.id) {
    return apiError('Forbidden', 403);
  }

  // Delete resume
  await db.resume.delete({
    where: { id },
  });

  // Log Audit Event
  await logAuditRequest(req, {
    userId: user.id,
    action: 'RESUME_DELETE',
    entityType: 'RESUME',
    entityId: id,
    metadata: { name: resume.name },
  });

  return apiSuccess({ message: 'Resume deleted successfully' });
}
