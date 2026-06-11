import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { enqueueBackgroundJob, enqueueNotification, enqueueGithubSync, enqueueResumeParse } from '@/lib/queues';

// Note: Because the client is instantiated at module scope, we mock the publishJSON directly on the instance via module mock.
const mockPublishJSON = vi.fn().mockResolvedValue({ messageId: 'msg_123' });

vi.mock('@upstash/qstash', () => {
  return {
    Client: class {
      publishJSON(opts: any) {
        return mockPublishJSON(opts);
      }
    }
  };
});

describe('Queue Utilities', () => {
  let warnSpy: any;
  const originalToken = process.env.QSTASH_TOKEN;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.QSTASH_TOKEN = 'test-token';
    process.env.NEXT_PUBLIC_APP_URL = 'http://test-app.com';
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    process.env.QSTASH_TOKEN = originalToken;
  });

  describe('enqueueBackgroundJob', () => {
    it('should publish JSON to webhook with retries', async () => {
      await enqueueBackgroundJob('job-123', 'JOB_ANALYZE');
      expect(mockPublishJSON).toHaveBeenCalledWith({
        url: 'http://test-app.com/api/workers',
        body: { type: 'BACKGROUND_JOB', payload: { jobId: 'job-123', jobType: 'JOB_ANALYZE' } },
        retries: 3,
      });
    });

    it('should warn and skip if QSTASH_TOKEN is missing', async () => {
      delete process.env.QSTASH_TOKEN;
      await enqueueBackgroundJob('job-123', 'JOB_ANALYZE');
      expect(warnSpy).toHaveBeenCalledWith('QSTASH_TOKEN missing, job not queued');
      expect(mockPublishJSON).not.toHaveBeenCalled();
    });
  });

  describe('enqueueResumeParse', () => {
    it('should publish JSON to webhook', async () => {
      await enqueueResumeParse('user-1', 'resume-1');
      expect(mockPublishJSON).toHaveBeenCalledWith({
        url: 'http://test-app.com/api/workers',
        body: { type: 'resume-parse', payload: { userId: 'user-1', resumeId: 'resume-1' } },
      });
    });

    it('should warn and skip if QSTASH_TOKEN is missing', async () => {
      delete process.env.QSTASH_TOKEN;
      await enqueueResumeParse('user-1', 'resume-1');
      expect(warnSpy).toHaveBeenCalledWith('QSTASH_TOKEN missing, job not queued');
      expect(mockPublishJSON).not.toHaveBeenCalled();
    });
  });

  describe('enqueueGithubSync', () => {
    it('should publish JSON to webhook', async () => {
      await enqueueGithubSync('user-1');
      expect(mockPublishJSON).toHaveBeenCalledWith({
        url: 'http://test-app.com/api/workers',
        body: { type: 'github-sync', payload: { userId: 'user-1' } },
      });
    });

    it('should warn and skip if QSTASH_TOKEN is missing', async () => {
      delete process.env.QSTASH_TOKEN;
      await enqueueGithubSync('user-1');
      expect(warnSpy).toHaveBeenCalledWith('QSTASH_TOKEN missing, job not queued');
      expect(mockPublishJSON).not.toHaveBeenCalled();
    });
  });

  describe('enqueueNotification', () => {
    it('should publish JSON to webhook', async () => {
      await enqueueNotification('user-1', 'ALERT', 'Alert Title', 'Alert Body');
      expect(mockPublishJSON).toHaveBeenCalledWith({
        url: 'http://test-app.com/api/workers',
        body: { type: 'notifications', payload: { userId: 'user-1', type: 'ALERT', title: 'Alert Title', body: 'Alert Body' } },
      });
    });

    it('should warn and skip if QSTASH_TOKEN is missing', async () => {
      delete process.env.QSTASH_TOKEN;
      await enqueueNotification('user-1', 'ALERT', 'Alert Title', 'Alert Body');
      expect(warnSpy).toHaveBeenCalledWith('QSTASH_TOKEN missing, job not queued');
      expect(mockPublishJSON).not.toHaveBeenCalled();
    });
  });
});
