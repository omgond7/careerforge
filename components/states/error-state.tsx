import { Button } from '@/components/ui/button';
import { AlertCircle, Wifi, Lock, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ErrorStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function ErrorStateBase({ title, description, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function ErrorAlert({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3 mb-4">
      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-destructive/60 hover:text-destructive transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export function NetworkError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorStateBase
      title="No internet connection"
      description="Check your connection and try again."
      action={{
        label: 'Retry',
        onClick: onRetry,
      }}
    />
  );
}

export function NotFoundError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-6xl font-bold text-primary">404</div>
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

export function PermissionError() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-amber-600" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Access Denied</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        You don't have permission to access this resource.
      </p>
      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href="/dashboard">Go Home</Link>
      </Button>
    </div>
  );
}

export function ServerError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorStateBase
      title="Something went wrong"
      description="We encountered an error processing your request. Please try again."
      action={{
        label: 'Try Again',
        onClick: onRetry,
      }}
    />
  );
}

export function LoadingError({
  message = 'Failed to load data',
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 text-center space-y-4">
      <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
      <div>
        <h3 className="font-semibold text-foreground">{message}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please try refreshing the page or contact support if the problem persists.
        </p>
      </div>
      <Button
        onClick={onRetry}
        variant="outline"
        className="border-border"
      >
        Retry
      </Button>
    </div>
  );
}
