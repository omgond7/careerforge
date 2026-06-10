'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { useTheme } from '@/components/providers/theme-provider';
import {
  Search,
  Bell,
  ChevronRight,
  Command,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Monitor,
  X,
  Grid3X3,
  Brain,
  Briefcase,
  TrendingUp,
  FileText,
  Mic2,
  Inbox,
  MapPin,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const routes: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/copilot': 'AI Copilot',
  '/career-twin': 'Career Twin',
  '/job-intelligence': 'Job Intelligence',
  '/gap-analysis': 'Gap Analysis',
  '/resume-studio': 'Resume Studio',
  '/interview-prep': 'Interview Prep',
  '/application-tracker': 'Application Tracker',
  '/search': 'Global Search',
  '/notifications': 'Notifications',
  '/roadmap': 'Roadmap',
  '/settings': 'Settings',
  '/settings/profile': 'Profile',
  '/settings/security': 'Security',
  '/settings/integrations': 'Integrations',
  '/settings/notifications': 'Notification Preferences',
  '/settings/subscription': 'Subscription',
  '/help': 'Help Center',
  '/onboarding': 'Onboarding',
};

const commandItems = [
  { label: 'Dashboard', icon: Grid3X3, href: '/dashboard' },
  { label: 'AI Copilot', icon: MessageSquare, href: '/copilot' },
  { label: 'Career Twin', icon: Brain, href: '/career-twin' },
  { label: 'Job Intelligence', icon: Briefcase, href: '/job-intelligence' },
  { label: 'Gap Analysis', icon: TrendingUp, href: '/gap-analysis' },
  { label: 'Resume Studio', icon: FileText, href: '/resume-studio' },
  { label: 'Interview Prep', icon: Mic2, href: '/interview-prep' },
  { label: 'Application Tracker', icon: Inbox, href: '/application-tracker' },
  { label: 'Roadmap', icon: MapPin, href: '/roadmap' },
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Help Center', icon: HelpCircle, href: '/help' },
];

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; href: string }> = [];
  let path = '';

  for (const segment of segments) {
    path += `/${segment}`;
    const label = routes[path] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href: path });
  }

  return crumbs;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const breadcrumbs = getBreadcrumbs(pathname);

  // Command palette shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
        setCommandQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus command input when opened
  useEffect(() => {
    if (commandOpen) {
      setTimeout(() => commandInputRef.current?.focus(), 50);
    }
  }, [commandOpen]);

  // Close user menu on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredCommands = commandItems.filter((item) =>
    item.label.toLowerCase().includes(commandQuery.toLowerCase())
  );

  const handleCommandSelect = useCallback((href: string) => {
    setCommandOpen(false);
    setCommandQuery('');
    router.push(href);
  }, [router]);

  // Keyboard navigation in command palette
  useEffect(() => {
    if (!commandOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        handleCommandSelect(filteredCommands[selectedIndex].href);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandOpen, filteredCommands, selectedIndex, handleCommandSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [commandQuery]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <header className="h-14 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
        {/* Left: Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm min-w-0 ml-12 md:ml-0">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground truncate">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={() => {
              setCommandOpen(true);
              setCommandQuery('');
              setSelectedIndex(0);
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <kbd className="ml-4 text-[10px] font-mono bg-background border border-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Link>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors"
            >
              {user ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full ring-2 ring-border"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
                >
                  {user && (
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  )}
                  <div className="p-1">
                    <Link
                      href="/settings/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile Settings
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    {/* Theme Submenu */}
                    <div className="border-t border-border my-1" />
                    <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Theme</p>
                    {([
                      { value: 'light' as const, label: 'Light', icon: Sun },
                      { value: 'dark' as const, label: 'Dark', icon: Moon },
                      { value: 'system' as const, label: 'System', icon: Monitor },
                    ]).map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setTheme(value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          theme === value
                            ? 'text-primary bg-primary/10'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                        {theme === value && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}

                    <div className="border-t border-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <AnimatePresence>
        {commandOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setCommandOpen(false)}
            />

            {/* Command Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-[20%] -translate-x-1/2 z-50 w-full max-w-lg"
            >
              <div className="bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input
                    ref={commandInputRef}
                    type="text"
                    value={commandQuery}
                    onChange={(e) => setCommandQuery(e.target.value)}
                    placeholder="Search pages, actions..."
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm"
                  />
                  <button
                    onClick={() => setCommandOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-72 overflow-y-auto p-2">
                  {filteredCommands.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No results found.
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Pages
                      </p>
                      {filteredCommands.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.href}
                            onClick={() => handleCommandSelect(item.href)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                              idx === selectedIndex
                                ? 'bg-primary/10 text-primary'
                                : 'text-foreground hover:bg-muted'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                            {idx === selectedIndex && (
                              <kbd className="ml-auto text-[10px] font-mono text-muted-foreground">↵</kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono bg-muted rounded px-1 py-0.5">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono bg-muted rounded px-1 py-0.5">↵</kbd> Open
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="font-mono bg-muted rounded px-1 py-0.5">Esc</kbd> Close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
