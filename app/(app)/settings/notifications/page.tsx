'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, Mail, Smartphone, Save, ShieldAlert } from 'lucide-react';

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState({
    jobMatches: true,
    interviewReminders: true,
    weeklyInsights: false,
    securityAlerts: true,
    billingInvoices: true,
    pushMatches: true,
    pushMessages: false,
  });

  const [frequency, setFrequency] = useState('daily');
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/settings">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Settings
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Notification Preferences</h1>
          <p className="text-lg text-muted-foreground mt-1">
            Choose what alerts you receive and where they are delivered.
          </p>
        </div>
        {isSaved && (
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1">
            Saved Successfully
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {/* Email Notifications Section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Email Notifications
          </h2>
          <p className="text-sm text-muted-foreground">Receive updates directly to your registered email inbox.</p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Target Role Matches</h4>
                <p className="text-xs text-muted-foreground">Alerts when new matching job listings are analyzed</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.jobMatches}
                onChange={() => handleToggle('jobMatches')}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Interview Reminders</h4>
                <p className="text-xs text-muted-foreground">Alerts for scheduled mock interview loops</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.interviewReminders}
                onChange={() => handleToggle('interviewReminders')}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Weekly Twin Report</h4>
                <p className="text-xs text-muted-foreground">Weekly breakdown of skill gaps resolved and roadmap progress</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.weeklyInsights}
                onChange={() => handleToggle('weeklyInsights')}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Billing Receipts</h4>
                <p className="text-xs text-muted-foreground">Monthly invoices and tier billing updates</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.billingInvoices}
                onChange={() => handleToggle('billingInvoices')}
                className="w-4 h-4 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Push Notifications Section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Push Notifications
          </h2>
          <p className="text-sm text-muted-foreground">Deliver desktop/browser instant announcements.</p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Browser Job Alerts</h4>
                <p className="text-xs text-muted-foreground">{"Show instant banner for high score (>90%) jobs"}</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.pushMatches}
                onChange={() => handleToggle('pushMatches')}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Copilot Chat Events</h4>
                <p className="text-xs text-muted-foreground">Announce when AI assistant completes heavy parsings</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.pushMessages}
                onChange={() => handleToggle('pushMessages')}
                className="w-4 h-4 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Frequency & Digest */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Digest Frequency
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {['immediately', 'daily', 'weekly'].map((freq) => (
              <button
                key={freq}
                onClick={() => setFrequency(freq)}
                className={`py-3 border rounded-lg text-sm font-semibold capitalize transition-all ${
                  frequency === freq
                    ? 'bg-primary border-primary text-primary-foreground shadow'
                    : 'bg-muted/20 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" asChild className="border-border">
            <Link href="/settings">Cancel</Link>
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
