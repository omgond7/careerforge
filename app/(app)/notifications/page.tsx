'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bell, Archive, Trash2, CheckCircle2, AlertCircle, Target, Briefcase, Zap, Mic2, Brain, Filter } from 'lucide-react';
import { notificationData } from '@/lib/mock-data';

const iconMap = {
  Target: Target,
  Briefcase: Briefcase,
  Zap: Zap,
  Mic2: Mic2,
  Brain: Brain,
};

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState(notificationData);
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'applications'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'achievements') return n.type === 'achievement' || n.type === 'skill';
    if (filter === 'applications') return n.type === 'application' || n.type === 'interview';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
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
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No notifications yet</p>
              <p className="text-sm text-muted-foreground">Check back later for updates</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const IconComponent = iconMap[notification.icon as keyof typeof iconMap];

              return (
                <div
                  key={notification.id}
                  className={`flex gap-4 p-4 rounded-lg border transition-all ${
                    notification.read
                      ? 'bg-muted/20 border-border hover:border-primary/30'
                      : 'bg-primary/5 border-primary/30 hover:border-primary'
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    notification.read
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${
                        notification.read ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
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
              { label: 'Job matches', description: 'Get notified about matching job opportunities' },
              { label: 'Application updates', description: 'Receive updates on your applications' },
              { label: 'Learning milestones', description: 'Celebrate your skill achievement' },
              { label: 'Interview invites', description: 'Get notified about interview opportunities' },
              { label: 'Weekly digest', description: 'Receive a weekly summary of updates' },
            ].map((pref, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{pref.label}</p>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-background transition-transform translate-x-6" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
