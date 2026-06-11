import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import { verifyRole, Role } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    // 1. Verify caller is ADMIN (Database check)
    await verifyRole(Role.ADMIN);

    // 2. Fetch users
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // 3. Fetch role audit logs
    const auditLogs = await db.roleAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        changedBy: { select: { name: true, email: true } },
      },
    });

    return apiSuccess({ users, auditLogs });
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401);
    if (err.message === 'Forbidden') return apiError('Forbidden', 403);
    return apiError(err.message || 'Internal Server Error', 500);
  }
}
