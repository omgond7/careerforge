import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 }, // 7 days
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.subscriptionTier = (user as any).subscriptionTier;
        token.onboardingDone = (user as any).onboardingDone;
        token.emailVerified = (user as any).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).subscriptionTier = token.subscriptionTier as string;
        (session.user as any).onboardingDone = token.onboardingDone as boolean;
        (session.user as any).emailVerified = token.emailVerified;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role;

      // Protect /admin routes
      if (nextUrl.pathname.startsWith('/admin')) {
        if (!isLoggedIn) return Response.redirect(new URL('/login', nextUrl));
        if (role !== 'ADMIN') return Response.redirect(new URL('/dashboard', nextUrl));
        return true;
      }

      const isAppRoute = nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/career-twin') ||
        nextUrl.pathname.startsWith('/resume-studio') ||
        nextUrl.pathname.startsWith('/job-intelligence') ||
        nextUrl.pathname.startsWith('/application-tracker') ||
        nextUrl.pathname.startsWith('/copilot') ||
        nextUrl.pathname.startsWith('/interview-prep') ||
        nextUrl.pathname.startsWith('/roadmap') ||
        nextUrl.pathname.startsWith('/gap-analysis') ||
        nextUrl.pathname.startsWith('/settings') ||
        nextUrl.pathname.startsWith('/notifications') ||
        nextUrl.pathname.startsWith('/search') ||
        nextUrl.pathname.startsWith('/onboarding') ||
        nextUrl.pathname.startsWith('/company') ||
        nextUrl.pathname.startsWith('/technology');

      if (isAppRoute && !isLoggedIn) return Response.redirect(new URL('/login', nextUrl));
      return true;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
};
