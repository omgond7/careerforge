import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiSuccess, apiError, parseBody, rateLimit, RATE_LIMITS, getClientIP } from '@/lib/api-helpers';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { sendPasswordResetEmail } from '@/lib/email';

const schema = z.object({
  email: z.string().email('Valid email address is required'),
});

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const { allowed } = await rateLimit(`forgot:${ip}`, RATE_LIMITS.IP_AUTH);
  if (!allowed) {
    return apiError('Too many password reset requests. Please try again in an hour.', 429);
  }

  const parsed = await parseBody(req, schema);
  if (parsed.error) return parsed.error;

  const { email } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration attacks
  if (!user) {
    return apiSuccess({ message: 'If the email exists, a reset link was sent.' });
  }

  await db.passwordReset.deleteMany({ where: { userId: user.id } });
  const token = randomUUID();
  await db.passwordReset.create({
    data: { userId: user.id, token, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
  });

  // Send password reset email
  try {
    await sendPasswordResetEmail(user.email, token);
  } catch (err) {
    console.error('Failed to send password reset email:', err);
  }

  return apiSuccess({ message: 'If the email exists, a reset link was sent.' });
}
