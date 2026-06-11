'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { useTheme } from '@/components/providers/theme-provider';
import {
  Grid3X3,
  Brain,
  Briefcase,
  TrendingUp,
  FileText,
  Mic2,
  Inbox,
  MapPin,
  Settings,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  Monitor,
  MessageSquare,
  Search as SearchIcon,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', icon: Grid3X3, href: '/dashboard' },
  { label: 'AI Copilot', icon: MessageSquare, href: '/copilot' },
  { label: 'Career Twin', icon: Brain, href: '/career-twin' },
  { label: 'Job Intelligence', icon: Briefcase, href: '/job-intelligence' },
  { label: 'Gap Analysis', icon: TrendingUp, href: '/gap-analysis' },
  { label: 'Resume Studio', icon: FileText, href: '/resume-studio' },
  { label: 'Interview Prep', icon: Mic2, href: '/interview-prep' },
  { label: 'Application Tracker', icon: Inbox, href: '/application-tracker' },
  { label: 'Global Search', icon: SearchIcon, href: '/search' },
  { label: 'Notifications', icon: Bell, href: '/notifications', badge: 3 },
];

const bottomItems = [
  { label: 'Roadmap', icon: MapPin, href: '/roadmap' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const visibleNavItems = [...navItems];
  if (user?.role === 'ADMIN') {
    visibleNavItems.push({ label: 'Admin Panel', icon: Shield, href: '/admin/users' });
  }
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const cycleTheme = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIdx = order.indexOf(theme);
    const next = order[(currentIdx + 1) % order.length];
    setTheme(next);
  };

  const themeIcon = theme === 'system' 
    ? Monitor 
    : resolvedTheme === 'dark' 
      ? Moon 
      : Sun;

  const themeLabel = theme === 'system' 
    ? 'System Theme' 
    : resolvedTheme === 'dark' 
      ? 'Dark Mode' 
      : 'Light Mode';

  const ThemeIcon = themeIcon;

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-xl flex items-center justify-center shrink-0 glow-sm">
            <span className="text-sm font-bold text-sidebar-primary-foreground">C</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="font-bold text-sidebar-foreground text-sm whitespace-nowrap">Career Copilot</h1>
                <p className="text-[11px] text-sidebar-accent-foreground whitespace-nowrap">AI Career Intelligence</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-primary/15 text-sidebar-primary font-medium shadow-sm'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/15 hover:text-sidebar-foreground'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sidebar-primary rounded-r-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? 'text-sidebar-primary' : ''}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Badge */}
              {item.badge && !collapsed && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-primary text-[10px] font-bold text-sidebar-primary-foreground"
                >
                  {item.badge}
                </motion.span>
              )}
              {item.badge && collapsed && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sidebar-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-primary/15 text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/15 hover:text-sidebar-foreground'
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}

        {/* Theme Toggle */}
        <button
          onClick={cycleTheme}
          title={collapsed ? themeLabel : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/15 hover:text-sidebar-foreground transition-all duration-200"
        >
          <ThemeIcon className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">{themeLabel}</span>}
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
            pathname === '/settings' || pathname.startsWith('/settings/')
              ? 'bg-sidebar-primary/15 text-sidebar-primary font-medium'
              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/15 hover:text-sidebar-foreground'
          }`}
        >
          <Settings className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Help */}
        <Link
          href="/help"
          title={collapsed ? 'Help Center' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
            pathname === '/help'
              ? 'bg-sidebar-primary/15 text-sidebar-primary font-medium'
              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/15 hover:text-sidebar-foreground'
          }`}
        >
          <HelpCircle className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Help Center</span>}
        </Link>
      </div>

      {/* User Profile & Collapse Toggle */}
      <div className="border-t border-sidebar-border p-3">
        {user && !collapsed && (
          <div className="mb-3">
            <div className="flex items-center gap-3 px-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full ring-2 ring-sidebar-border shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-[11px] text-sidebar-accent-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Log Out' : undefined}
            className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/80 hover:bg-destructive/15 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>

          {/* Collapse toggle - Desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent/15 hover:text-sidebar-foreground transition-all duration-200"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border shadow-lg text-foreground"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen md:hidden"
          >
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-sidebar-foreground/60 hover:bg-sidebar-accent/15 hover:text-sidebar-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 224 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="hidden md:flex bg-sidebar border-r border-sidebar-border flex-col h-screen sticky top-0 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
