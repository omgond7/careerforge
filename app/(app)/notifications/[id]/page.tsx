'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, Calendar, Eye, Trash2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function NotificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { data: notification, error, isLoading } = useSWR(`/api/notifications/${id}`, fetcher);

  React.useEffect(() => {
    if (notification && !notification.isRead) {
      fetch(`/api/notifications/${id}/read`, { method: 'POST' }).catch(console.error);
    }
  }, [notification, id]);

  const handleDelete = async () => {
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    router.push('/notifications');
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-2xl mx-auto space-y-8 animate-pulse">
        <div className="h-9 w-36 bg-muted rounded-md"></div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="h-6 w-24 bg-muted rounded-md"></div>
          <div className="h-12 w-full bg-muted rounded-md"></div>
          <div className="h-10 w-full bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Notification not found</h2>
        <Button asChild variant="outline">
          <Link href="/notifications">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notifications
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/notifications">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notifications
        </Link>
      </Button>

      {/* Main Details Panel */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize bg-primary/5 text-primary border-primary/20">
            Type: {notification.type?.toLowerCase().replace('_', ' ')}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(notification.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <h1 className="text-2xl font-bold text-foreground">{notification.title}</h1>
            <p className="text-foreground text-sm leading-relaxed">{notification.body}</p>
          </div>
        </div>

        {/* Actions section */}
        <div className="pt-6 border-t border-border flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={handleDelete} className="border-border hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
          <Button size="sm" asChild>
            <Link href={notification.actionUrl || '/dashboard'}>
              <Eye className="w-4 h-4 mr-1.5" />
              {notification.actionUrl ? 'View Action' : 'Go to Dashboard'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
