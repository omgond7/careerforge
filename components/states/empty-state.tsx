import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Inbox, AlertCircle, Heart } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'notification' | 'bookmark';
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search':
        return <Search className="w-12 h-12 text-muted-foreground" />;
      case 'notification':
        return <Inbox className="w-12 h-12 text-muted-foreground" />;
      case 'bookmark':
        return <Heart className="w-12 h-12 text-muted-foreground" />;
      default:
        return <AlertCircle className="w-12 h-12 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">
        {icon || getDefaultIcon()}
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

export function EmptySearchResults({ onReset }: { onReset: () => void }) {
  return (
    <EmptyState
      title="No results found"
      description="Try adjusting your search terms or filters to find what you're looking for."
      variant="search"
      action={{
        label: 'Clear Search',
        onClick: onReset,
      }}
    />
  );
}

export function EmptyApplications({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      title="No applications yet"
      description="Start tracking your job applications to see them here."
      variant="bookmark"
      action={{
        label: 'Add Application',
        onClick: onAdd,
      }}
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      title="No notifications"
      description="You're all caught up! Check back later for updates."
      variant="notification"
    />
  );
}

export function EmptyHistory({ type }: { type: string }) {
  return (
    <EmptyState
      title={`No ${type} history`}
      description={`Start by creating your first ${type} to see it here.`}
      variant="default"
    />
  );
}
