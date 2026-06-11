import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-helpers';
import { verifyRole, Role } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    // 1. Verify caller is ADMIN (Database check)
    await verifyRole(Role.ADMIN);

    // 2. Parse search parameters
    const searchParams = req.nextUrl.searchParams;
    const filterUserId = searchParams.get('userId');
    const filterAction = searchParams.get('action');
    const filterStartDate = searchParams.get('startDate');
    const filterEndDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const whereClause: any = {};

    if (filterUserId) {
      whereClause.userId = filterUserId;
    }

    if (filterAction) {
      whereClause.action = filterAction;
    }

    if (filterStartDate || filterEndDate) {
      whereClause.createdAt = {};
      if (filterStartDate) {
        whereClause.createdAt.gte = new Date(filterStartDate);
      }
      if (filterEndDate) {
        const end = new Date(filterEndDate);
        end.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = end;
      }
    }

    // 3. Fetch count and logs
    const [total, logs] = await Promise.all([
      db.auditLog.count({ where: whereClause }),
      db.auditLog.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: page * limit,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // 4. Fetch list of distinct actions and users for dropdowns
    const [distinctActions, users] = await Promise.all([
      db.auditLog.findMany({
        distinct: ['action'],
        select: { action: true },
      }),
      db.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    return apiSuccess({
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      filters: {
        actions: distinctActions.map((a) => a.action),
        users,
      },
    });
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401);
    if (err.message === 'Forbidden') return apiError('Forbidden', 403);
    return apiError(err.message || 'Internal Server Error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await verifyRole(Role.ADMIN);
    const body = await req.json().catch(() => ({}));
    const { retentionDays = 90 } = body;

    const { purgeAuditLogs, logAuditRequest } = await import('@/lib/audit-logger');
    const deletedCount = await purgeAuditLogs(retentionDays);

    await logAuditRequest(req, {
      userId: adminUser.id,
      action: 'ADMIN_ACTION',
      entityType: 'AUDIT_LOG',
      metadata: { adminAction: 'PURGE_AUDIT_LOGS', retentionDays, deletedCount },
    });

    return apiSuccess({ deletedCount, message: `Successfully purged ${deletedCount} audit logs.` });
  } catch (err: any) {
    if (err.message === 'Unauthorized') return apiError('Unauthorized', 401);
    if (err.message === 'Forbidden') return apiError('Forbidden', 403);
    return apiError(err.message || 'Internal Server Error', 500);
  }
}
