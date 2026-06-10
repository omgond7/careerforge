'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle2, AlertCircle, LogOut, Trash2 } from 'lucide-react';
import { securitySettingsData } from '@/lib/mock-data';

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(securitySettingsData.twoFactor.enabled);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
          <p className="text-muted-foreground">Manage your account security and privacy</p>
        </div>

        {/* Password */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Password</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Last changed {new Date(securitySettingsData.password.lastChanged).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{securitySettingsData.password.strength}</span>
              </div>
            </div>
            <Button
              onClick={() => setShowPasswordModal(true)}
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
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {twoFactorEnabled && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-foreground mb-2 font-medium">
                <CheckCircle2 className="w-4 h-4 inline mr-2 text-primary" />
                Two-factor authentication enabled
              </p>
              <p className="text-sm text-muted-foreground">
                Using {securitySettingsData.twoFactor.method} as your authentication method
              </p>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Active Sessions</h3>
          <div className="space-y-4">
            {securitySettingsData.sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{session.device}</p>
                  <p className="text-sm text-muted-foreground">{session.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last active: {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {session.current && (
                    <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Current
                    </span>
                  )}
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 border-border text-destructive hover:text-destructive">
            Sign Out from All Sessions
          </Button>
        </div>

        {/* Connected Apps */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Connected Apps</h3>
          <div className="space-y-4">
            {securitySettingsData.connectedApps.map((app) => (
              <div key={app.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{app.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Connected on {new Date(app.connectedDate).toLocaleDateString()}
                  </p>
                </div>
                {app.connected && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <Button variant="outline" size="sm" className="border-border text-destructive hover:text-destructive">
                      Disconnect
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-destructive/5 border-2 border-destructive/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            These actions cannot be undone. Please be careful.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
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
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Update Password
              </Button>
              <Button
                onClick={() => setShowPasswordModal(false)}
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
