'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

import { Suspense } from 'react';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    // Simulate email verification
    const timer = setTimeout(() => {
      setStatus('success');
      setEmail('user@example.com');
    }, 2000);

    return () => clearTimeout(timer);
  }, [token]);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  const handleResendEmail = async () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6">
          {/* Icon */}
          {status === 'loading' && (
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="flex justify-center">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
          )}
          {status === 'error' && (
            <div className="flex justify-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
          )}

          {/* Content */}
          {status === 'loading' && (
            <>
              <h1 className="text-2xl font-bold text-foreground">Verifying email...</h1>
              <p className="text-muted-foreground">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <h1 className="text-2xl font-bold text-foreground">Email verified!</h1>
              <p className="text-muted-foreground">
                Your email address has been successfully verified. You can now access your Career Copilot account.
              </p>
              <Button
                onClick={handleContinue}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue to Dashboard
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <h1 className="text-2xl font-bold text-foreground">Verification failed</h1>
              <p className="text-muted-foreground">
                The verification link is invalid or has expired.
              </p>
              <Button
                onClick={handleResendEmail}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Resend verification email
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
