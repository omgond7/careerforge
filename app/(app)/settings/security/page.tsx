'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, AlertCircle, LogOut, Trash2, Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function SecuritySettings() {
  const { data, error, isLoading, mutate } = useSWR('/api/settings/security', fetcher);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const toggle2FA = async () => {
    if (!data) return;
    const nextVal = !data.twoFactorEnabled;
    mutate({ ...data, twoFactorEnabled: nextVal }, false);
    await fetch('/api/settings/security', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ twoFactorEnabled: nextVal }),
    });
    mutate();
  };

  const handlePasswordUpdate = async () => {
    setPassError('');
    setPassSuccess('');

    if (!currentPassword) {
      setPassError('Current password is required');
      return;
    }
    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }

    setIsUpdatingPass(true);
    try {
      const res = await fetch('/api/settings/security', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const body = await res.json();
      if (!res.ok) {
        setPassError(body.error || 'Failed to update password');
      } else {
        setPassSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowPasswordModal(false), 1500);
      }
    } catch (err) {
      setPassError('Network error, please try again.');
    } finally {
      setIsUpdatingPass(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load security settings.</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Security Settings</h1>
          <p className="text-muted-foreground">Manage your account security and authentication methods</p>
        </div>

        {/* Password */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Password</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Update your login credentials regularly to maintain account security.
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Managed internally</span>
              </div>
            </div>
            <Button
              onClick={() => {
                setPassError('');
                setPassSuccess('');
                setShowPasswordModal(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
            </div>
            <button
              onClick={toggle2FA}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                data.twoFactorEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  data.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {data.twoFactorEnabled && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-foreground mb-1 font-medium">
                <CheckCircle2 className="w-4 h-4 inline mr-2 text-primary" />
                Two-factor authentication is active
              </p>
              <p className="text-sm text-muted-foreground">
                Verification codes will be required on new login attempts.
              </p>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Active Sessions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Current Web Browser</p>
                <p className="text-sm text-muted-foreground">Mac OS X • Active Session</p>
              </div>
              <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                Current
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-destructive/5 border-2 border-destructive/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently remove your account, profile, and all resumes</p>
              </div>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold text-foreground mb-6">Change Password</h3>

            {passError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="bg-primary/10 border border-primary/20 text-primary text-sm p-3 rounded-md mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handlePasswordUpdate}
                disabled={isUpdatingPass}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isUpdatingPass ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Update Password
              </Button>
              <Button
                onClick={() => setShowPasswordModal(false)}
                disabled={isUpdatingPass}
                variant="outline"
                className="flex-1 border-border"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
