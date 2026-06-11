import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export interface AuditLogPayload {
  userId?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Centralized Audit Logging Service.
 * Wraps operations in try/catch to ensure database or connection failures
 * never disrupt the core user workflows.
 */
export async function logAudit(payload: AuditLogPayload): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: payload.userId || null,
        action: payload.action,
        entityType: payload.entityType || null,
        entityId: payload.entityId || null,
        metadata: payload.metadata || undefined,
        ipAddress: payload.ipAddress || null,
        userAgent: payload.userAgent || null,
      },
    });
  } catch (error) {
    // Fail-silent design to prevent breaking business operations
    console.error('Audit Log System Error (Suppressed):', error);
  }
}

/**
 * Extracts request IP and User Agent to log audit events from NextRequest.
 */
export async function logAuditRequest(
  req: NextRequest | Request,
  payload: Omit<AuditLogPayload, 'ipAddress' | 'userAgent'>
): Promise<void> {
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
  const userAgent = req.headers.get('user-agent') || '';
  
  return logAudit({
    ...payload,
    ipAddress,
    userAgent,
  });
}

/**
 * Retention Strategy: Purge audit logs older than N days.
 */
export async function purgeAuditLogs(retentionDays = 90): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await db.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
    return result.count;
  } catch (error) {
    console.error('Audit Log Retention Purge Error:', error);
    return 0;
  }
}
