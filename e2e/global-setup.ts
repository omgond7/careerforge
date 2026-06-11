import { test as setup } from '@playwright/test';
import { db as prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

setup('seed test database', async () => {
  console.log('Seeding test database...');
  
  // Clean up existing test data to ensure deterministic runs
  await prisma.user.deleteMany({
    where: { email: { in: ['test@example.com', 'newuser@example.com'] } }
  });

  // Hash a predictable password
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Create the standard verified test user used by roadmap/auth specs
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'E2E Test User',
      passwordHash,
      emailVerified: new Date(),
      role: 'STUDENT',
      subscriptionTier: 'FREE',
      onboardingDone: true,
      profile: {
        create: {
          headline: 'Senior Software Engineer',
          bio: 'Test bio',
          experienceYears: 5,
        }
      }
    }
  });
  
  console.log('Database seeded successfully.');
  await prisma.$disconnect();
});
