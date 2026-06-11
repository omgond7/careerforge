import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getAuthUser, apiSuccess, apiError, requireAuth, parseBody } from '@/lib/api-helpers';
import * as authModule from '@/auth';

// Mock Next.js NextResponse
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server') as any;
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((body, init) => ({ ...body, status: init?.status })),
    },
  };
});

// Mock the getAuthUser dependency
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('API Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('apiSuccess & apiError', () => {
    it('should format a success response', () => {
      const res = apiSuccess({ foo: 'bar' });
      expect(res).toEqual({ success: true, data: { foo: 'bar' }, status: 200 });
    });

    it('should format an error response', () => {
      const res = apiError('Not found', 404);
      expect(res).toEqual({ success: false, error: 'Not found', details: undefined, status: 404 });
    });
  });

  describe('getAuthUser', () => {
    it('should return null if no session', async () => {
      (authModule.auth as any).mockResolvedValue(null);
      const user = await getAuthUser();
      expect(user).toBeNull();
    });

    it('should return user object if authenticated', async () => {
      (authModule.auth as any).mockResolvedValue({ user: { id: 'u123' } });
      const user = await getAuthUser();
      expect(user).toEqual({ id: 'u123' });
    });
  });

  describe('requireAuth middleware wrapper', () => {
    it('should return 401 if not authenticated', async () => {
      (authModule.auth as any).mockResolvedValue(null);
      
      const mockHandler = vi.fn();
      const wrapped = requireAuth(mockHandler);
      
      const req = new NextRequest('http://localhost');
      const res: any = await wrapped(req);
      
      expect(res.status).toBe(401);
      expect(res.error).toBe('Unauthorized');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should return 403 if email not verified', async () => {
      (authModule.auth as any).mockResolvedValue({ user: { id: 'u123', emailVerified: null } });
      
      const mockHandler = vi.fn();
      const wrapped = requireAuth(mockHandler);
      
      const req = new NextRequest('http://localhost');
      const res: any = await wrapped(req);
      
      expect(res.status).toBe(403);
      expect(res.error).toBe('Email verification required');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should call handler if authenticated and verified', async () => {
      (authModule.auth as any).mockResolvedValue({ user: { id: 'u123', emailVerified: new Date() } });
      
      const mockHandler = vi.fn().mockResolvedValue('success');
      const wrapped = requireAuth(mockHandler);
      
      const req = new NextRequest('http://localhost');
      const res = await wrapped(req);
      
      expect(res).toBe('success');
      expect(mockHandler).toHaveBeenCalledWith(req, expect.objectContaining({ id: 'u123' }), undefined);
    });
  });

  describe('parseBody schema validation', () => {
    const TestSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    it('should successfully parse valid data', async () => {
      const req = {
        json: vi.fn().mockResolvedValue({ name: 'John', age: 30 }),
      } as any as NextRequest;

      const { data, error } = await parseBody(req, TestSchema);
      
      expect(error).toBeNull();
      expect(data).toEqual({ name: 'John', age: 30 });
    });

    it('should return 422 on validation failure', async () => {
      const req = {
        json: vi.fn().mockResolvedValue({ name: 'John', age: '30' }), // age is string, should fail
      } as any as NextRequest;

      const { data, error } = await parseBody(req, TestSchema);
      
      expect(data).toBeNull();
      expect((error as any).status).toBe(422);
      expect((error as any).error).toBe('Validation failed');
    });

    it('should return 400 on invalid JSON', async () => {
      const req = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as any as NextRequest;

      const { data, error } = await parseBody(req, TestSchema);
      
      expect(data).toBeNull();
      expect((error as any).status).toBe(400);
      expect((error as any).error).toBe('Invalid JSON body');
    });
  });
});
