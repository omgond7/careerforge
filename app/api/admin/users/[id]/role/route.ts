import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiSuccess, apiError, parseBody } from '@/lib/api-helpers';
import { verifyRole, Role } from '@/lib/rbac';
import { z } from 'zod';

const updateRoleSchema = z.object({
  role: z.enum([Role.STUDENT, Role.RECRUITER, Role.ADMIN]),
  reason: z.string().min(1).max(255).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const targetUserId = resolvedParams.id;

  try {
    // 1. Verify caller is ADMIN (Database check)
    const adminUser = await verifyRole(Role.ADMIN);

    // 2. Parse body
    const parsed = await parseBody(req, updateRoleSchema);
    if (parsed.error) return parsed.error;
    const { role: newRole, reason } = parsed.data;

    // 3. Prevent self-demotion or self-change (privilege management rule)
    if (targetUserId === adminUser.id) {
      return apiError('Admins cannot change their own roles to prevent lockouts', 400);
    }

    // 4. Fetch target user to ensure they exist and get old role
    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true },
    });
    if (!targetUser) {
      return apiError('User not found', 404);
    }

    const oldRole = targetUser.role;
    if (oldRole === newRole) {
      return apiError('User already has this role', 400);
    }

    // 5. Update user role and log to audit trail in a transaction
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
      });

      await tx.roleAuditLog.create({
        data: {
          userId: targetUserId,
          changedById: adminUser.id,
          oldRole,
          newRole,
          reason: reason || 'Admin update',
        },
      });
    });

    const { logAuditRequest } = await import('@/lib/audit-logger');
    await logAuditRequest(req, {
      userId: adminUser.id,
      action: 'ROLE_CHANGE',
      entityType: 'USER',
      entityId: targetUserId,
      metadata: { oldRole, newRole, reason },
    });

    await logAuditRequest(req, {
      userId: adminUser.id,
      action: 'ADMIN_ACTION',
      entityType: 'USER',
      entityId: targetUserId,
      metadata: { adminAction: 'ROLE_CHANGE', targetUserId, oldRole, newRole },
    });

    return apiSuccess({ message: `Role updated from ${oldRole} to ${newRole}` });
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401);
    if (err.message === 'Forbidden') return apiError('Forbidden', 403);
    return apiError(err.message || 'Internal Server Error', 500);
  }
}
