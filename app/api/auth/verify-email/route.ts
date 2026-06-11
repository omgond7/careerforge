import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiSuccess, apiError, parseBody } from '@/lib/api-helpers';
import { z } from 'zod';

const schema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export async function POST(req: NextRequest) {
  const parsed = await parseBody(req, schema);
  if (parsed.error) return parsed.error;

  const { token } = parsed.data;

  const record = await db.emailVerification.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    return apiError('Token invalid or expired', 400);
  }

  await db.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } });
  await db.emailVerification.delete({ where: { token } });

  const { logAuditRequest } = await import('@/lib/audit-logger');
  await logAuditRequest(req, {
    userId: record.userId,
    action: 'EMAIL_VERIFICATION',
    entityType: 'USER',
    entityId: record.userId,
  });

  return apiSuccess({ message: 'Email verified successfully.' });
}
