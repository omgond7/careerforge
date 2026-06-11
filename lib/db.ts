import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// In serverless environments, we must restrict connection pool sizes per container to prevent connection exhaustion.
// For local development or isolated testing, we use a larger pool size.
const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const maxConnections = process.env.DATABASE_MAX_CONNECTIONS
  ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
  : (isDev || isTest ? 10 : 2); // Limit to 2 in production/serverless, default to 10 in dev/test

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: maxConnections,
  idleTimeoutMillis: 15000, // Close idle connections quickly to release database resources
  connectionTimeoutMillis: 5000, // Fail fast if connections cannot be established
});

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  });

// Gracefully close connection pool on termination (SIGTERM)
if (!isDev && !isTest) {
  process.on('SIGTERM', async () => {
    await pool.end();
  });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
