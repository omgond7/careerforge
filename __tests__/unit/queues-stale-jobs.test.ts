import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkAndCleanStaleJobs } from '@/lib/queues';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

// Mock DB and Logger
vi.mock('@/lib/db', () => {
  return {
    db: {
      backgroundJob: {
        findMany: vi.fn(),
        updateMany: vi.fn(),
      },
    },
  };
});

vi.mock('@/lib/logger', () => {
  return {
    logger: {
      warn: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe('Stale Jobs Cleanup Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-11T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should transition stale PENDING and PROCESSING jobs to FAILED and log them', async () => {
    // 1. Mock stale PENDING jobs found
    const mockPendingJobs = [{ id: 'job-p1', jobType: 'JOB_ANALYZE', userId: 'user-p1' }];
    // 2. Mock stale PROCESSING jobs found
    const mockProcessingJobs = [{ id: 'job-pr1', jobType: 'ATS_SCORE', userId: 'user-pr1' }];

    // Mock findMany responses sequentially:
    // First call (PENDING query) -> mockPendingJobs
    // Second call (PROCESSING query) -> mockProcessingJobs
    (db.backgroundJob.findMany as any)
      .mockResolvedValueOnce(mockPendingJobs)
      .mockResolvedValueOnce(mockProcessingJobs);

    (db.backgroundJob.updateMany as any).mockResolvedValue({ count: 1 });

    await checkAndCleanStaleJobs();

    // Verify correct queries were made with correct time limits
    // PENDING limit: now (12:00) - 15 minutes = 11:45
    expect(db.backgroundJob.findMany).toHaveBeenNthCalledWith(1, {
      where: {
        status: 'PENDING',
        createdAt: { lt: new Date('2026-06-11T11:45:00.000Z') },
      },
      select: { id: true, jobType: true, userId: true },
    });

    // PROCESSING limit: now (12:00) - 30 minutes = 11:30
    expect(db.backgroundJob.findMany).toHaveBeenNthCalledWith(2, {
      where: {
        status: 'PROCESSING',
        updatedAt: { lt: new Date('2026-06-11T11:30:00.000Z') },
      },
      select: { id: true, jobType: true, userId: true },
    });

    // Verify updates were run
    expect(db.backgroundJob.updateMany).toHaveBeenCalledTimes(2);
    expect(db.backgroundJob.updateMany).toHaveBeenNthCalledWith(1, {
      where: { id: { in: ['job-p1'] } },
      data: {
        status: 'FAILED',
        error: 'Job timed out in PENDING status (>15 minutes)',
      },
    });
    expect(db.backgroundJob.updateMany).toHaveBeenNthCalledWith(2, {
      where: { id: { in: ['job-pr1'] } },
      data: {
        status: 'FAILED',
        error: 'Job timed out in PROCESSING status (>30 minutes)',
      },
    });

    // Verify warnings logged
    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenNthCalledWith(1, 'Stale job detected and marked as FAILED (PENDING timeout)', {
      jobId: 'job-p1',
      jobType: 'JOB_ANALYZE',
      userId: 'user-p1',
    });
    expect(logger.warn).toHaveBeenNthCalledWith(2, 'Stale job detected and marked as FAILED (PROCESSING timeout)', {
      jobId: 'job-pr1',
      jobType: 'ATS_SCORE',
      userId: 'user-pr1',
    });
  });

  it('should not update if no stale jobs are found', async () => {
    (db.backgroundJob.findMany as any).mockResolvedValue([]);

    await checkAndCleanStaleJobs();

    expect(db.backgroundJob.findMany).toHaveBeenCalledTimes(2);
    expect(db.backgroundJob.updateMany).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully and log them', async () => {
    (db.backgroundJob.findMany as any).mockRejectedValue(new Error('Database query failure'));

    await expect(checkAndCleanStaleJobs()).resolves.not.toThrow();
    expect(logger.error).toHaveBeenCalledWith('Failed to run stale job detection', {
      error: 'Database query failure',
    });
  });
});
