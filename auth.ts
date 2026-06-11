import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db as any),
  ...authConfig,
  events: {
    async signIn(message) {
      try {
        if (message.user?.id) {
          const { logAudit } = await import('@/lib/audit-logger');
          await logAudit({
            userId: message.user.id,
            action: 'LOGIN',
            entityType: 'USER',
            entityId: message.user.id,
            metadata: { provider: message.account?.provider || 'credentials' },
          });
        }
      } catch (err) {
        console.error('Sign-in audit log error:', err);
      }
    },
    async signOut(message) {
      try {
        const userId = (message as any).token?.sub || (message as any).token?.id || (message as any).session?.user?.id;
        if (userId) {
          const { logAudit } = await import('@/lib/audit-logger');
          await logAudit({
            userId,
            action: 'LOGOUT',
            entityType: 'USER',
            entityId: userId,
          });
        }
      } catch (err) {
        console.error('Sign-out audit log error:', err);
      }
    },
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        if (!email || !password) return null;
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          onboardingDone: user.onboardingDone,
          emailVerified: user.emailVerified,
        } as any;
      },
    }),
  ],
});
