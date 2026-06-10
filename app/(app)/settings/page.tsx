'use client';

import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';
import { User, Lock, CreditCard, Bell, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      items: [
        { label: 'Personal Information', description: 'Update your name and contact details' },
        { label: 'Professional Details', description: 'Your title, company, and experience' },
        { label: 'Avatar', description: 'Change your profile picture' },
      ],
    },
    {
      title: 'Account',
      icon: Lock,
      items: [
        { label: 'Password', description: 'Change your password' },
        { label: 'Email', description: 'Update your email address' },
        { label: 'Two-Factor Authentication', description: 'Enable 2FA for security' },
      ],
    },
    {
      title: 'Billing & Subscription',
      icon: CreditCard,
      items: [
        { label: 'Current Plan', description: 'Pro Tier - $29.00 / month' },
        { label: 'Payment Method', description: 'Manage your billing information' },
        { label: 'Billing History', description: 'View past invoices and receipts' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', description: 'Job alerts, interview reminders' },
        { label: 'Push Notifications', description: 'On-app notifications' },
        { label: 'Notification Frequency', description: 'Manage notification preferences' },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Privacy Settings', description: 'Control your data and visibility' },
        { label: 'Connected Apps', description: 'Manage third-party integrations' },
        { label: 'Data Download', description: 'Download your data in JSON format' },
      ],
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                </div>
              </div>
              <div className="divide-y divide-border">
                {section.items.map((item) => (
                  <div key={item.label} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Danger Zone */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Irreversible actions that will affect your account
            </p>
          </div>
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-white"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
        <p>Career Copilot © 2024</p>
        <div className="flex gap-4 justify-center mt-3">
          <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
