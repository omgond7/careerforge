'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Save, X } from 'lucide-react';
import { userProfileData } from '@/lib/mock-data';
import { MetricCard } from '@/components/cards';

export default function ProfileSettings() {
  const [profile, setProfile] = useState(userProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfileData);

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

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
          <p className="text-muted-foreground">Update your personal information and preferences</p>
        </div>

        {/* Profile Picture & Basic Info */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-8 mb-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-border"
              />
              {isEditing && (
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium">
                  <Upload className="w-4 h-4" />
                  Change Picture
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="text-lg font-semibold text-foreground">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="text-lg font-semibold text-foreground">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Title</p>
                    <p className="text-lg font-semibold text-foreground">{profile.title}</p>
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
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <Save className="w-4 h-4 mr-2" />
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
                      setFormData(profile);
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
              <p className="px-4 py-2 bg-input border border-border rounded-lg text-foreground">
                {profile.location}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
              <p className="px-4 py-2 bg-input border border-border rounded-lg text-foreground">
                {profile.timezone}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <p className="px-4 py-2 bg-input border border-border rounded-lg text-foreground">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Jobs Analyzed"
            value={profile.stats.jobsAnalyzed}
            subtitle="Total career moves"
          />
          <MetricCard
            title="Applications"
            value={profile.stats.applicationsSubmitted}
            subtitle="Total submitted"
          />
          <MetricCard
            title="Interview Prep"
            value={profile.stats.interviewsPrepared}
            subtitle="Practice sessions"
          />
          <MetricCard
            title="Skills Gained"
            value={profile.stats.skillsGained}
            subtitle="This year"
          />
        </div>

        {/* Account Info */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Account Created</span>
              <span className="text-sm font-medium text-foreground">
                {new Date(profile.joinDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <span className="text-sm font-medium text-foreground">3 months</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-muted-foreground">Last Login</span>
              <span className="text-sm font-medium text-foreground">Today at 10:30 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
