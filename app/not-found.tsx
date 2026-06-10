import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full" />
            <div className="absolute inset-8 flex items-center justify-center">
              <div className="text-6xl font-bold text-primary">404</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-lg text-muted-foreground">
            The page you&apos;re looking for might have been moved or deleted.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2">
            <Link href="/dashboard">
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center justify-center gap-2">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-8">
          Need help? Contact{' '}
          <Link href="#" className="text-primary hover:underline">
            support
          </Link>
        </p>
      </div>
    </div>
  );
}
