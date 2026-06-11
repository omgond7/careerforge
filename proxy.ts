import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// ⚠️ IMPORTANT: Do NOT import from './auth' here.
// './auth' pulls in PrismaAdapter + lib/db.ts → Prisma client uses node:path and node:url
// which are NOT available in the Edge Runtime where middleware executes.
// Instead we create a lightweight edge-safe auth instance from authConfig alone.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|placeholder).*)'],
};
