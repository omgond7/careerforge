'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

import { Suspense } from 'react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/reset-password-success');
    }, 1500);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Invalid link</h1>
            <p className="text-muted-foreground mb-6">
              The password reset link is invalid or has expired.
            </p>
            <Button
              onClick={() => router.push('/forgot-password')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Request new link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
