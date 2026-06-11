import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/admin/audit-logs/route';
import { db } from '@/lib/db';
import * as rbac from '@/lib/rbac';

// Mock NextAuth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

// Mock rbac helpers
vi.mock('@/lib/rbac', () => ({
  verifyRole: vi.fn(),
  Role: { ADMIN: 'ADMIN', STUDENT: 'STUDENT', RECRUITER: 'RECRUITER' },
}));

// Mock DB
vi.mock('@/lib/db', () => ({
  db: {
    auditLog: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
  },
}));

// Mock audit logger
vi.mock('@/lib/audit-logger', () => ({
  purgeAuditLogs: vi.fn(),
  logAuditRequest: vi.fn(),
}));

describe('Audit Logs API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/admin/audit-logs', () => {
    it('should throw error if user is not authorized', async () => {
      (rbac.verifyRole as any).mockRejectedValue(new Error('Forbidden'));

      const req = new NextRequest('http://localhost/api/admin/audit-logs');
      const res = await GET(req);

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe('Forbidden');
    });

    it('should query and return audit logs with correct filters', async () => {
      (rbac.verifyRole as any).mockResolvedValue({ id: 'admin-1', role: 'ADMIN' });
      (db.auditLog.count as any).mockResolvedValue(10);
      (db.auditLog.findMany as any).mockResolvedValueOnce([
        { id: 'log-1', action: 'LOGIN', createdAt: new Date() },
      ]);
      (db.auditLog.findMany as any).mockResolvedValueOnce([
        { action: 'LOGIN' }, { action: 'LOGOUT' },
      ]);
      (db.user.findMany as any).mockResolvedValue([
        { id: 'u1', name: 'User 1' },
      ]);

      const req = new NextRequest(
        'http://localhost/api/admin/audit-logs?userId=u1&action=LOGIN&startDate=2026-06-01&endDate=2026-06-11'
      );
      const res = await GET(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.logs.length).toBe(1);
      expect(db.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'u1',
            action: 'LOGIN',
            createdAt: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        })
      );
    });
  });

  describe('POST /api/admin/audit-logs', () => {
    it('should purge logs and record purge action', async () => {
      const purgeMock = await import('@/lib/audit-logger');
      (rbac.verifyRole as any).mockResolvedValue({ id: 'admin-1', role: 'ADMIN' });
      (purgeMock.purgeAuditLogs as any).mockResolvedValue(12);

      const req = new NextRequest('http://localhost/api/admin/audit-logs', {
        method: 'POST',
        body: JSON.stringify({ retentionDays: 30 }),
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.data.deletedCount).toBe(12);
      expect(purgeMock.purgeAuditLogs).toHaveBeenCalledWith(30);
      expect(purgeMock.logAuditRequest).toHaveBeenCalledWith(
        req,
        expect.objectContaining({
          userId: 'admin-1',
          action: 'ADMIN_ACTION',
        })
      );
    });
  });
});
