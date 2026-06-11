'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import { MetricCard } from '@/components/cards';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function ProfileSettings() {
  const { data: profile, error, isLoading, mutate } = useSWR('/api/settings/profile', fetcher);

  // Stats from other endpoints
  const { data: apps } = useSWR('/api/applications', fetcher);
  const { data: jobs } = useSWR('/api/jobs', fetcher);
  const { data: interviews } = useSWR('/api/interview', fetcher);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        headline: profile.headline || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const res = await fetch('/api/settings/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      mutate();
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load profile settings.</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const jobsAnalyzed = jobs?.length || 0;
  const applicationsSubmitted = apps?.length || 0;
  const interviewsPrepared = interviews?.length || 0;
  const skillsGained = profile.skillsCount || 6; // fallback/calculated

  const userAvatar = profile.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(profile.name || 'User')}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link href="/settings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Update your personal information and career profile</p>
        </div>

        {/* Profile Picture & Basic Info */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-8 mb-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={userAvatar}
                alt={profile.name || 'User'}
                className="w-24 h-24 rounded-full border-4 border-border object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="text-lg font-semibold text-foreground">{profile.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="text-lg font-semibold text-foreground">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Title / Headline</p>
                    <p className="text-lg font-semibold text-foreground">{profile.headline || 'Not provided'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Email (Read-only)</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Title / Headline</label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Edit/Save Buttons */}
            <div className="flex sm:flex-col gap-2 justify-end">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: profile.name || '',
                        headline: profile.headline || '',
                        location: profile.location || '',
                        bio: profile.bio || '',
                      });
                    }}
                    variant="outline"
                    className="border-border"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="px-4 py-2 bg-input border border-border rounded-lg text-foreground min-h-[42px]">
                  {profile.location || 'Not specified'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
              <p className="px-4 py-2 bg-muted border border-border rounded-lg text-muted-foreground min-h-[42px]">
                UTC (Auto-detected)
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="px-4 py-2 bg-input border border-border rounded-lg text-foreground min-h-[42px] whitespace-pre-wrap">
                  {profile.bio || 'Not specified'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Jobs Analyzed"
            value={jobsAnalyzed}
            subtitle="Total career moves"
          />
          <MetricCard
            title="Applications"
            value={applicationsSubmitted}
            subtitle="Total submitted"
          />
          <MetricCard
            title="Interview Prep"
            value={interviewsPrepared}
            subtitle="Practice sessions"
          />
          <MetricCard
            title="Skills Gained"
            value={skillsGained}
            subtitle="Identified skills"
          />
        </div>

        {/* Account Info */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Account Created</span>
              <span className="text-sm font-medium text-foreground">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-muted-foreground">Member Status</span>
              <span className="text-sm font-medium text-foreground">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
