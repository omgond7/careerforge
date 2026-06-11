import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiSuccess, apiError, parseBody, rateLimit, RATE_LIMITS, getClientIP } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long').max(100),
});

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const { allowed } = await rateLimit(`reset:${ip}`, RATE_LIMITS.IP_AUTH);
  if (!allowed) {
    return apiError('Too many password reset attempts. Please try again in an hour.', 429);
  }

  const parsed = await parseBody(req, schema);
  if (parsed.error) return parsed.error;

  const { token, password } = parsed.data;

  const record = await db.passwordReset.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date() || record.usedAt) {
    return apiError('Token invalid or expired', 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.update({ where: { id: record.userId }, data: { passwordHash } });
  await db.passwordReset.update({ where: { token }, data: { usedAt: new Date() } });

  const { logAuditRequest } = await import('@/lib/audit-logger');
  await logAuditRequest(req, {
    userId: record.userId,
    action: 'PASSWORD_RESET',
    entityType: 'USER',
    entityId: record.userId,
  });

  return apiSuccess({ message: 'Password reset successfully.' });
}
