'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, Loader2, Clock } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">C</span>
          </div>
        </div>

        {!isSubmitted ? (
          <>
            <div className="mb-8 text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">Reset your password</h1>
              <p className="text-muted-foreground">
                Enter your professional email address and we&apos;ll send you a link to securely reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">Check your email</h1>
              <p className="text-muted-foreground mb-2">
                We&apos;ve sent a password reset link to
              </p>
              <p className="font-medium text-foreground mb-6">{email}</p>
              <p className="text-sm text-muted-foreground mb-6">
                Click the link in the email to create a new password. The link expires in 24 hours.
              </p>

              <div className="bg-muted/30 border border-muted rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Didn&apos;t receive?</span> Check your spam folder or try another email address.
                </p>
              </div>

              <Button
                onClick={() => {
                  setEmail('');
                  setIsSubmitted(false);
                }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg font-semibold"
              >
                Try Another Email
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </>
        )}

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>Secure System Access © 2024 Career Copilot</p>
          <div className="flex gap-4 justify-center mt-2">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Support</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
