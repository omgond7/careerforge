'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary via-primary to-accent flex-col justify-between p-12">
        <div className="text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">C</span>
            </div>
            <span className="text-xl font-bold">Career Copilot</span>
          </div>
        </div>

        <div className="text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Systematic Intelligence for your career trajectory.
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-md">
            Leverage advanced AI to identify skill gaps, optimize your resume, and navigate high-stakes professional advancement with calculated precision.
          </p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10" />
            </div>
          </div>
          <p className="text-sm text-white/70 mt-4">Join 10,000+ professionals advancing their careers.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in to access your Career Twin and intelligence suite.
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-8">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.746 0-9.637h3.554v1.364c.429-.663 1.196-1.602 2.905-1.602 2.121 0 3.71 1.388 3.71 4.373v5.502zM5.337 5.432c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.946-1.715 1.177 0 1.915.762 1.915 1.715 0 .953-.738 1.715-1.946 1.715zm1.582 15.02H3.755V5.815h3.164v14.637zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Professional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In Securely'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Create your account
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
