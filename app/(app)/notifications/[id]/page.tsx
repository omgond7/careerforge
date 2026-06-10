'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, Calendar, Eye, Trash2 } from 'lucide-react';
import { notificationData } from '@/lib/mock-data';

export default function NotificationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const notification = notificationData.find(item => item.id === id) || notificationData[0];

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
            Type: {notification.type}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(notification.timestamp).toLocaleString()}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{notification.title}</h1>
            <p className="text-foreground text-sm leading-relaxed">{notification.message}</p>
          </div>
        </div>

        {/* Actions section */}
        <div className="pt-6 border-t border-border flex justify-end gap-3">
          <Button variant="outline" size="sm" asChild className="border-border">
            <Link href="/notifications">Mark Read</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard">
              <Eye className="w-4 h-4 mr-1.5" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
