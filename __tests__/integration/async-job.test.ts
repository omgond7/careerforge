import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsyncJob } from '@/components/hooks/use-async-job';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useAsyncJob Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock global fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('should start a job, transition to PENDING, poll until COMPLETED, and clear interval', async () => {
    // 1. Mock the initial POST request returning a 202 Accepted with jobId
    (global.fetch as any).mockResolvedValueOnce({
      status: 202,
      ok: true,
      json: async () => ({ data: { jobId: 'job-123' } }),
    });

    // 2. Mock the polling GET request returning PROCESSING
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ data: { status: 'PROCESSING' } }),
    });

    // 3. Mock the polling GET request returning COMPLETED
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ data: { status: 'COMPLETED', result: { success: true } } }),
    });

    const { result } = renderHook(() => useAsyncJob());

    expect(result.current.status).toBeNull();
    expect(result.current.isLoading).toBe(false);

    // Start the job
    await act(async () => {
      await result.current.startJob('/api/test', { data: 'test' });
    });

    expect(result.current.status).toBe('PENDING');
    expect(result.current.jobId).toBe('job-123');
    expect(result.current.isLoading).toBe(true);

    // Fast-forward 2 seconds to trigger first poll
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.status).toBe('PROCESSING');
    expect(result.current.isLoading).toBe(true);

    // Fast-forward 2 seconds to trigger second poll
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.status).toBe('COMPLETED');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.result).toEqual({ success: true });
  });

  it('should handle API failure during polling gracefully', async () => {
    // Initial POST success
    (global.fetch as any).mockResolvedValueOnce({
      status: 202,
      ok: true,
      json: async () => ({ data: { jobId: 'job-fail' } }),
    });

    // Polling failure (500 Error)
    (global.fetch as any).mockResolvedValueOnce({
      status: 500,
      ok: false,
      json: async () => ({ error: 'Internal Server Error' }),
    });

    const { result } = renderHook(() => useAsyncJob());

    await act(async () => {
      await result.current.startJob('/api/test', { data: 'test' });
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.status).toBe('FAILED');
    expect(result.current.error).toBe('Internal Server Error');
    expect(result.current.isLoading).toBe(false);
  });
});
