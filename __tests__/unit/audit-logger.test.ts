import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logAudit, logAuditRequest, purgeAuditLogs } from '@/lib/audit-logger';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

// Mock DB
vi.mock('@/lib/db', () => ({
  db: {
    auditLog: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe('Audit Logger Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logAudit', () => {
    it('should create audit log successfully', async () => {
      (db.auditLog.create as any).mockResolvedValue({ id: 'log-123' });
      await logAudit({
        userId: 'u1',
        action: 'TEST_ACTION',
        entityType: 'TEST_ENTITY',
        entityId: 'e1',
        metadata: { foo: 'bar' },
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      });

      expect(db.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'u1',
          action: 'TEST_ACTION',
          entityType: 'TEST_ENTITY',
          entityId: 'e1',
          metadata: { foo: 'bar' },
          ipAddress: '127.0.0.1',
          userAgent: 'test-agent',
        },
      });
    });

    it('should suppress errors and not throw if db write fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (db.auditLog.create as any).mockRejectedValue(new Error('DB connection lost'));

      await expect(logAudit({ action: 'TEST_FAIL' })).resolves.not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('logAuditRequest', () => {
    it('should extract headers and log audit request', async () => {
      (db.auditLog.create as any).mockResolvedValue({ id: 'log-123' });
      const req = new NextRequest('http://localhost', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'Mozilla/5.0',
        },
      });

      await logAuditRequest(req, {
        userId: 'u2',
        action: 'REQUEST_ACTION',
        entityType: 'ENTITY',
        entityId: 'id-1',
      });

      expect(db.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'u2',
          action: 'REQUEST_ACTION',
          entityType: 'ENTITY',
          entityId: 'id-1',
          metadata: undefined,
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
        },
      });
    });
  });

  describe('purgeAuditLogs', () => {
    it('should delete audit logs older than retention period', async () => {
      (db.auditLog.deleteMany as any).mockResolvedValue({ count: 5 });
      const count = await purgeAuditLogs(30);

      expect(count).toBe(5);
      expect(db.auditLog.deleteMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            lt: expect.any(Date),
          },
        },
      });
    });

    it('should return 0 and suppress errors if delete fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (db.auditLog.deleteMany as any).mockRejectedValue(new Error('Purge failed'));

      const count = await purgeAuditLogs(30);
      expect(count).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
