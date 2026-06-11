import { useState, useEffect } from 'react';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

interface AsyncJobResult<T> {
  jobId: string | null;
  status: JobStatus | null;
  result: T | null;
  error: string | null;
  isLoading: boolean;
  startJob: (apiEndpoint: string, payload: any) => Promise<void>;
  reset: () => void;
}

export function useAsyncJob<T = any>(): AsyncJobResult<T> {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId || status === 'COMPLETED' || status === 'FAILED') {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/status/${jobId}`);
        const json = await res.json();
        
        if (!res.ok) {
          setStatus('FAILED');
          setError(json.error || 'Failed to check status');
          return;
        }

        const data = json.data;
        setStatus(data.status);
        
        if (data.status === 'COMPLETED') {
          setResult(data.result);
        } else if (data.status === 'FAILED') {
          setError(data.error || 'Job failed');
        }
      } catch (err: any) {
        setStatus('FAILED');
        setError(err.message || 'Network error polling status');
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId);
  }, [jobId, status]);

  const startJob = async (apiEndpoint: string, payload: any) => {
    setJobId(null);
    setStatus('PENDING');
    setResult(null);
    setError(null);

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.status === 202 || res.status === 201 || res.status === 200) {
        if (json.data?.jobId) {
          setJobId(json.data.jobId);
        } else {
          // If the endpoint hasn't been migrated yet and returns synchronous result
          setStatus('COMPLETED');
          setResult(json.data);
        }
      } else {
        setStatus('FAILED');
        setError(json.error || 'Failed to start job');
      }
    } catch (err: any) {
      setStatus('FAILED');
      setError(err.message || 'Network error starting job');
    }
  };

  const reset = () => {
    setJobId(null);
    setStatus(null);
    setResult(null);
    setError(null);
  };

  return {
    jobId,
    status,
    result,
    error,
    isLoading: status === 'PENDING' || status === 'PROCESSING',
    startJob,
    reset
  };
}
