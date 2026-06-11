'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Bell, Trash2, CheckCircle2, Target, Briefcase, Zap, Brain, Filter, Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

const getIcon = (type: string) => {
  switch (type) {
    case 'JOB_ALERT':
      return Target;
    case 'RESUME_READY':
      return Zap;
    case 'APPLICATION_UPDATE':
      return Briefcase;
    case 'SKILL_SUGGESTION':
      return Brain;
    default:
      return Bell;
  }
};

export default function NotificationsCenter() {
  const { data, error, isLoading, mutate } = useSWR('/api/notifications', fetcher);
  const { data: prefs, mutate: mutatePrefs } = useSWR('/api/settings/notifications', fetcher);
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'applications'>('all');

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const filteredNotifications = notifications.filter((n: any) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'achievements') return n.type === 'SKILL_SUGGESTION' || n.type === 'RESUME_READY';
    if (filter === 'applications') return n.type === 'APPLICATION_UPDATE' || n.type === 'JOB_ALERT';
    return true;
  });

  const markAsRead = async (id: string) => {
    if (!data) return;
    // Optimistic update
    mutate(
      {
        notifications: notifications.map((n: any) => (n.id === id ? { ...n, isRead: true } : n)),
        unreadCount: Math.max(0, unreadCount - 1),
      },
      false
    );
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    mutate();
  };

  const markAllAsRead = async () => {
    if (!data) return;
    // Optimistic update
    mutate(
      {
        notifications: notifications.map((n: any) => ({ ...n, isRead: true })),
        unreadCount: 0,
      },
      false
    );
    await fetch('/api/notifications', { method: 'POST' });
    mutate();
  };

  const deleteNotification = async (id: string) => {
    if (!data) return;
    const isUnread = !notifications.find((n: any) => n.id === id)?.isRead;
    // Optimistic update
    mutate(
      {
        notifications: notifications.filter((n: any) => n.id !== id),
        unreadCount: isUnread ? Math.max(0, unreadCount - 1) : unreadCount,
      },
      false
    );
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    mutate();
  };

  const togglePreference = async (key: string, currentVal: boolean) => {
    if (!prefs) return;
    // Optimistic update
    mutatePrefs({ ...prefs, [key]: !currentVal }, false);
    await fetch('/api/settings/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: !currentVal }),
    });
    mutatePrefs();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Loading...' : `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
            </p>
          </div>
          {!isLoading && unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="border-border">
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'unread', 'achievements', 'applications'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? 'bg-primary text-primary-foreground' : 'border-border'}
            >
              <Filter className="w-4 h-4 mr-2" />
              {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Failed to load notifications. Please try again later.
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No notifications yet</p>
              <p className="text-sm text-muted-foreground">Check back later for updates</p>
            </div>
          ) : (
            filteredNotifications.map((notification: any) => {
              const IconComponent = getIcon(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`flex gap-4 p-4 rounded-lg border transition-all ${
                    notification.isRead
                      ? 'bg-muted/20 border-border hover:border-primary/30'
                      : 'bg-primary/5 border-primary/30 hover:border-primary'
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    notification.isRead
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary/20 text-primary'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <Link href={`/notifications/${notification.id}`} className="hover:underline flex-1">
                        <h3 className={`font-semibold text-sm ${
                          notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {notification.title}
                        </h3>
                      </Link>
                      {!notification.isRead && (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {notification.body}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Notification Preferences */}
        <div className="mt-12 bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { key: 'jobAlerts', label: 'Job matches', description: 'Get notified about matching job opportunities' },
              { key: 'applicationUpdates', label: 'Application updates', description: 'Receive updates on your applications' },
              { key: 'skillSuggestions', label: 'Learning milestones', description: 'Celebrate your skill achievement' },
              { key: 'resumeReady', label: 'Interview invites', description: 'Get notified about interview opportunities' },
              { key: 'weeklyDigest', label: 'Weekly digest', description: 'Receive a weekly summary of updates' },
            ].map((prefItem) => {
              const checked = prefs ? !!prefs[prefItem.key] : false;
              return (
                <div key={prefItem.key} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{prefItem.label}</p>
                    <p className="text-sm text-muted-foreground">{prefItem.description}</p>
                  </div>
                  <button
                    onClick={() => togglePreference(prefItem.key, checked)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      checked ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
