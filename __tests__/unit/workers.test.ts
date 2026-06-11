import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/workers/route';
import { db } from '@/lib/db';

// Mock DB
vi.mock('@/lib/db', () => ({
  db: {
    backgroundJob: {
      updateMany: vi.fn(),
      findUnique: vi.fn(),
    },
    notification: {
      create: vi.fn(),
    },
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock queues
vi.mock('@/lib/queues', () => ({
  checkAndCleanStaleJobs: vi.fn().mockResolvedValue(undefined),
}));

// Mock dynamic services
vi.mock('@/lib/services/job-analyzer', () => ({
  performJobAnalysis: vi.fn().mockResolvedValue({ score: 95 }),
}));

describe('Background Workers Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully lock and process a PENDING job', async () => {
    // 1. Mock status transition from PENDING -> PROCESSING
    (db.backgroundJob.updateMany as any)
      .mockResolvedValueOnce({ count: 1 }) // First updateMany (PENDING -> PROCESSING)
      .mockResolvedValueOnce({ count: 1 }); // Second updateMany (PROCESSING -> COMPLETED)

    // 2. Mock finding the job details
    (db.backgroundJob.findUnique as any).mockResolvedValue({
      id: 'job-1',
      status: 'PENDING',
      jobType: 'JOB_ANALYZE',
      payload: { jobId: 'job-1', description: 'React Developer' },
      retryCount: 0,
      maxRetries: 3,
    });

    const req = new NextRequest('http://localhost/api/workers', {
      method: 'POST',
      body: JSON.stringify({
        type: 'BACKGROUND_JOB',
        payload: { jobId: 'job-1', jobType: 'JOB_ANALYZE' },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify atomic lock was checked
    expect(db.backgroundJob.updateMany).toHaveBeenNthCalledWith(1, {
      where: {
        id: 'job-1',
        status: { in: ['PENDING', 'FAILED'] },
      },
      data: {
        status: 'PROCESSING',
        error: null,
      },
    });

    // Verify dynamic handler completed and set job to COMPLETED
    expect(db.backgroundJob.updateMany).toHaveBeenNthCalledWith(2, {
      where: {
        id: 'job-1',
        status: 'PROCESSING',
      },
      data: {
        status: 'COMPLETED',
        result: { score: 95 } as any,
        completedAt: expect.any(Date),
      },
    });
  });

  it('should return 202 if another worker is already processing the job', async () => {
    // 1. Mock lock failure (updateMany returns count: 0)
    (db.backgroundJob.updateMany as any).mockResolvedValueOnce({ count: 0 });

    // 2. Mock finding that the job is currently PROCESSING
    (db.backgroundJob.findUnique as any).mockResolvedValue({
      id: 'job-2',
      status: 'PROCESSING',
    });

    const req = new NextRequest('http://localhost/api/workers', {
      method: 'POST',
      body: JSON.stringify({
        type: 'BACKGROUND_JOB',
        payload: { jobId: 'job-2', jobType: 'JOB_ANALYZE' },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(202);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe('Job is currently being processed by another worker.');
  });

  it('should return 200 (skipping) if the job is already completed', async () => {
    // 1. Mock lock failure
    (db.backgroundJob.updateMany as any).mockResolvedValueOnce({ count: 0 });

    // 2. Mock finding that the job is already COMPLETED
    (db.backgroundJob.findUnique as any).mockResolvedValue({
      id: 'job-3',
      status: 'COMPLETED',
    });

    const req = new NextRequest('http://localhost/api/workers', {
      method: 'POST',
      body: JSON.stringify({
        type: 'BACKGROUND_JOB',
        payload: { jobId: 'job-3', jobType: 'JOB_ANALYZE' },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe('Job already completed, skipping.');
  });

  it('should retry a failed job if retry count is within max limits', async () => {
    // 1. Lock transitions successfully
    (db.backgroundJob.updateMany as any)
      .mockResolvedValueOnce({ count: 1 }) // Lock transition
      .mockResolvedValueOnce({ count: 1 }); // Retry state update

    // 2. Mock finding job details
    (db.backgroundJob.findUnique as any).mockResolvedValue({
      id: 'job-4',
      status: 'PENDING',
      jobType: 'JOB_ANALYZE',
      payload: { jobId: 'job-4' },
      retryCount: 0,
      maxRetries: 3,
    });

    // Mock the dynamic import service to throw an error
    const { performJobAnalysis } = await import('@/lib/services/job-analyzer');
    (performJobAnalysis as any).mockRejectedValueOnce(new Error('AI Service Timeout'));

    const req = new NextRequest('http://localhost/api/workers', {
      method: 'POST',
      body: JSON.stringify({
        type: 'BACKGROUND_JOB',
        payload: { jobId: 'job-4', jobType: 'JOB_ANALYZE' },
      }),
    });

    const res = await POST(req);
    // Should return 500 to trigger QStash retry
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toBe('Job execution failed, scheduling retry');

    // Verify status reverted to PENDING and retryCount incremented
    expect(db.backgroundJob.updateMany).toHaveBeenNthCalledWith(2, {
      where: {
        id: 'job-4',
        status: 'PROCESSING',
      },
      data: {
        status: 'PENDING',
        retryCount: 1,
        error: 'AI Service Timeout',
      },
    });
  });

  it('should mark job as FAILED and return 200 once retry limits are exhausted', async () => {
    // 1. Lock transitions successfully
    (db.backgroundJob.updateMany as any)
      .mockResolvedValueOnce({ count: 1 }) // Lock transition
      .mockResolvedValueOnce({ count: 1 }); // Final fail update

    // 2. Mock finding job details (already at retryCount: 2 of maxRetries: 3)
    (db.backgroundJob.findUnique as any).mockResolvedValue({
      id: 'job-5',
      status: 'PENDING',
      jobType: 'JOB_ANALYZE',
      payload: { jobId: 'job-5' },
      retryCount: 2,
      maxRetries: 3,
    });

    const { performJobAnalysis } = await import('@/lib/services/job-analyzer');
    (performJobAnalysis as any).mockRejectedValueOnce(new Error('Persistent Failure'));

    const req = new NextRequest('http://localhost/api/workers', {
      method: 'POST',
      body: JSON.stringify({
        type: 'BACKGROUND_JOB',
        payload: { jobId: 'job-5', jobType: 'JOB_ANALYZE' },
      }),
    });

    const res = await POST(req);
    // Should return 200 (Success) to tell QStash not to retry anymore
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Job execution failed and max retries exhausted');

    // Verify status set to FAILED
    expect(db.backgroundJob.updateMany).toHaveBeenNthCalledWith(2, {
      where: {
        id: 'job-5',
        status: 'PROCESSING',
      },
      data: {
        status: 'FAILED',
        retryCount: 3,
        error: 'Persistent Failure',
      },
    });
  });
});
