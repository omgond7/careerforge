'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Save, Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function NotificationSettingsPage() {
  const { data: prefs, error, isLoading, mutate } = useSWR('/api/settings/notifications', fetcher);
  
  const [localPrefs, setLocalPrefs] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (prefs) {
      setLocalPrefs(prefs);
    }
  }, [prefs]);

  const handleToggle = (key: string) => {
    if (!localPrefs) return;
    setLocalPrefs((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!localPrefs) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localPrefs),
      });

      if (res.ok) {
        mutate(localPrefs, false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save notification settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-8 flex justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !localPrefs) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">Failed to load preferences</h2>
        <Button asChild variant="outline">
          <Link href="/settings">Back to Settings</Link>
        </Button>
      </div>
    );
  }

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
        {/* Email & App Notifications Section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Alert Preferences
          </h2>
          <p className="text-sm text-muted-foreground">Enable or disable various notification streams for your account.</p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Target Role Matches (Job Alerts)</h4>
                <p className="text-xs text-muted-foreground">Alerts when new matching job listings are analyzed</p>
              </div>
              <input
                type="checkbox"
                checked={!!localPrefs.jobAlerts}
                onChange={() => handleToggle('jobAlerts')}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Resume Prepared & Interview Loop Invites</h4>
                <p className="text-xs text-muted-foreground">Alerts when resumes are generated or mock interviews are ready</p>
              </div>
              <input
                type="checkbox"
                checked={!!localPrefs.resumeReady}
                onChange={() => handleToggle('resumeReady')}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Application Updates</h4>
                <p className="text-xs text-muted-foreground">Announce status changes in your tracked applications</p>
              </div>
              <input
                type="checkbox"
                checked={!!localPrefs.applicationUpdates}
                onChange={() => handleToggle('applicationUpdates')}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Skill suggestions</h4>
                <p className="text-xs text-muted-foreground">Recommendations on filling critical target role gaps</p>
              </div>
              <input
                type="checkbox"
                checked={!!localPrefs.skillSuggestions}
                onChange={() => handleToggle('skillSuggestions')}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Weekly Digest</h4>
                <p className="text-xs text-muted-foreground">Weekly email summaries of career roadmaps progress</p>
              </div>
              <input
                type="checkbox"
                checked={!!localPrefs.weeklyDigest}
                onChange={() => handleToggle('weeklyDigest')}
                className="w-4 h-4 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" asChild className="border-border">
            <Link href="/settings">Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
