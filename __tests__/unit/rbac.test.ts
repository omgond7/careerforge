import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hasRole, getAndVerifyDbUser, verifyRole, verifyOwnership, auditRoleChange, Role } from '@/lib/rbac';
import { db } from '@/lib/db';
import * as apiHelpers from '@/lib/api-helpers';

// Mock getAuthUser
vi.mock('@/lib/api-helpers', () => ({
  getAuthUser: vi.fn(),
}));

// Mock db
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    roleAuditLog: {
      create: vi.fn(),
    },
  },
}));

describe('RBAC Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hasRole', () => {
    it('should match single role', () => {
      expect(hasRole(Role.ADMIN, Role.ADMIN)).toBe(true);
      expect(hasRole(Role.STUDENT, Role.ADMIN)).toBe(false);
      expect(hasRole(undefined, Role.ADMIN)).toBe(false);
    });

    it('should match role in array of required roles', () => {
      expect(hasRole(Role.RECRUITER, [Role.ADMIN, Role.RECRUITER])).toBe(true);
      expect(hasRole(Role.STUDENT, [Role.ADMIN, Role.RECRUITER])).toBe(false);
    });
  });

  describe('getAndVerifyDbUser', () => {
    it('should fetch user from db', async () => {
      const mockUser = { id: 'u1', email: 'test@example.com', name: 'Test', role: Role.STUDENT };
      (db.user.findUnique as any).mockResolvedValue(mockUser);

      const user = await getAndVerifyDbUser('u1');
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u1' },
        select: { id: true, email: true, name: true, role: true, emailVerified: true },
      });
      expect(user).toEqual(mockUser);
    });
  });

  describe('verifyRole', () => {
    it('should throw Unauthorized if no session user', async () => {
      (apiHelpers.getAuthUser as any).mockResolvedValue(null);
      await expect(verifyRole(Role.ADMIN)).rejects.toThrow('Unauthorized');
    });

    it('should throw User not found if db user is null', async () => {
      (apiHelpers.getAuthUser as any).mockResolvedValue({ id: 'u1' });
      (db.user.findUnique as any).mockResolvedValue(null);
      await expect(verifyRole(Role.ADMIN)).rejects.toThrow('User not found');
    });

    it('should throw Forbidden if role does not match', async () => {
      (apiHelpers.getAuthUser as any).mockResolvedValue({ id: 'u1' });
      (db.user.findUnique as any).mockResolvedValue({ id: 'u1', role: Role.STUDENT });
      await expect(verifyRole(Role.ADMIN)).rejects.toThrow('Forbidden');
    });

    it('should return user if role matches', async () => {
      const mockUser = { id: 'u1', role: Role.ADMIN };
      (apiHelpers.getAuthUser as any).mockResolvedValue({ id: 'u1' });
      (db.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await verifyRole(Role.ADMIN);
      expect(result).toEqual(mockUser);
    });
  });

  describe('verifyOwnership', () => {
    it('should throw Unauthorized if no session user', async () => {
      (apiHelpers.getAuthUser as any).mockResolvedValue(null);
      await expect(verifyOwnership('resource-user-id')).rejects.toThrow('Unauthorized');
    });

    it('should throw User not found if user not in db', async () => {
      (apiHelpers.getAuthUser as any).mockResolvedValue({ id: 'u1' });
      (db.user.findUnique as any).mockResolvedValue(null);
      await expect(verifyOwnership('resource-user-id')).rejects.toThrow('User not found');
    });

    it('should return user if user owns resource', async () => {
      const mockUser = { id: 'u1', role: Role.STUDENT };
      (apiHelpers.getAuthUser as any).mockResolvedValue({ id: 'u1' });
      (db.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await verifyOwnership('u1');
      expect(result).toEqual(mockUser);
    });

    it('should return user if user is ADMIN and does not own resource', async () => {
      const mockUser = { id: 'admin-1', role: Role.ADMIN };
      (apiHelpers.getAuthUser as any).mockResolvedValue({ id: 'admin-1' });
      (db.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await verifyOwnership('student-1');
      expect(result).toEqual(mockUser);
    });

    it('should throw Forbidden if user is not ADMIN and does not own resource', async () => {
      const mockUser = { id: 'student-2', role: Role.STUDENT };
      (apiHelpers.getAuthUser as any).mockResolvedValue({ id: 'student-2' });
      (db.user.findUnique as any).mockResolvedValue(mockUser);

      await expect(verifyOwnership('student-1')).rejects.toThrow('Forbidden');
    });
  });

  describe('auditRoleChange', () => {
    it('should call db.roleAuditLog.create', async () => {
      (db.roleAuditLog.create as any).mockResolvedValue({ id: 'log-1' });
      await auditRoleChange('target-u', 'admin-u', Role.STUDENT, Role.ADMIN, 'Promotion');
      expect(db.roleAuditLog.create).toHaveBeenCalledWith({
        data: {
          userId: 'target-u',
          changedById: 'admin-u',
          oldRole: Role.STUDENT,
          newRole: Role.ADMIN,
          reason: 'Promotion',
        },
      });
    });
  });
});
