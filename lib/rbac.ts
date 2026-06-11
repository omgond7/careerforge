import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/api-helpers';
import { Role } from './generated/prisma/client';

export { Role };

/**
 * Checks if a user has the required role(s).
 */
export function hasRole(userRole: Role | undefined | null, requiredRoles: Role | Role[]): boolean {
  if (!userRole) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  return userRole === requiredRoles;
}

/**
 * Database-level authorization check. Fetches the user from the database
 * to verify their role (bypassing stale JWT issues).
 */
export async function getAndVerifyDbUser(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, emailVerified: true },
  });
  return user;
}

/**
 * Helper to require a role in API routes or Server Actions.
 * Returns the db user if authorized, otherwise throws.
 */
export async function verifyRole(requiredRoles: Role | Role[]) {
  const user = await getAuthUser();
  if (!user?.id) {
    throw new Error('Unauthorized');
  }

  // Database-level verification to prevent stale JWT/session bypass
  const dbUser = await getAndVerifyDbUser(user.id);
  if (!dbUser) {
    throw new Error('User not found');
  }

  if (!hasRole(dbUser.role, requiredRoles)) {
    throw new Error('Forbidden');
  }

  return dbUser;
}

/**
 * Verifies that the current user owns a resource (i.e. resourceUserId === user.id),
 * or is an Admin who has bypass rights.
 */
export async function verifyOwnership(resourceUserId: string) {
  const user = await getAuthUser();
  if (!user?.id) {
    throw new Error('Unauthorized');
  }

  const dbUser = await getAndVerifyDbUser(user.id);
  if (!dbUser) {
    throw new Error('User not found');
  }

  if (dbUser.id === resourceUserId) {
    return dbUser;
  }

  if (dbUser.role === Role.ADMIN) {
    return dbUser;
  }

  throw new Error('Forbidden');
}

/**
 * Creates an audit log entry when a user's role is changed.
 */
export async function auditRoleChange(
  targetUserId: string,
  adminUserId: string,
  oldRole: Role,
  newRole: Role,
  reason?: string
) {
  return db.roleAuditLog.create({
    data: {
      userId: targetUserId,
      changedById: adminUserId,
      oldRole,
      newRole,
      reason,
    },
  });
}
