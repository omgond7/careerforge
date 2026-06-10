'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ResetPasswordSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-foreground">Password reset successful</h1>
          <p className="text-muted-foreground">
            Your password has been successfully reset. You can now log in with your new password.
          </p>

          <Button
            onClick={() => router.push('/login')}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
