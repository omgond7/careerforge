'use client';

import Link from 'next/link';
import { useCareerStore } from '@/lib/stores/career';
import { useTrackerStore } from '@/lib/stores/tracker';
import { useResumeStore } from '@/lib/stores/resume';
import { useAuthStore } from '@/lib/stores/auth';
import { Zap, ArrowRight, Briefcase, Sparkles, Target, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  MetricCard,
  ATSScoreCard,
  InsightCard,
  MatchScoreCard,
} from '@/components/cards';
import { AnimatedCounter } from '@/components/animations/counter';
import { ProgressRing } from '@/components/animations/progress-ring';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function DashboardPage() {
  const { targetRole, careerTwin } = useCareerStore();
  const { getApplicationsByStatus } = useTrackerStore();
  const { atsScore, missingKeywords } = useResumeStore();
  const { user } = useAuthStore();

  const appliedCount = getApplicationsByStatus('applied').length;
  const screenCount = getApplicationsByStatus('screen').length;
  const interviewCount = getApplicationsByStatus('interview').length;
  const totalApps = appliedCount + screenCount + interviewCount;

  return (
    <motion.div
      className="p-6 md:p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Your AI-powered career command center
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button asChild variant="outline" size="sm">
            <Link href="/job-intelligence" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Analyze Job
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/resume-studio" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Build Resume
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Target Role Card */}
      {targetRole && (
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent rounded-2xl p-6 md:p-8 text-white gradient-animated"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-white/70" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/70">Target Role</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{targetRole.title}</h2>
              <p className="text-base text-white/80">{targetRole.company}</p>
              <p className="text-sm text-white/60 mt-1">Estimated: {targetRole.estimatedTime} to target</p>
            </div>
            <div className="flex items-center gap-6">
              <ProgressRing
                value={targetRole.currentMatch}
                size={100}
                strokeWidth={7}
                color="rgba(255,255,255,0.9)"
                trackColor="rgba(255,255,255,0.15)"
                label={`${targetRole.currentMatch}%`}
                sublabel="Match"
              />
              <div className="hidden md:block text-right">
                <p className="text-xs text-white/60 mb-1">Target</p>
                <p className="text-xl font-bold">{targetRole.targetMatch}%</p>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex gap-3">
            <Button
              asChild
              className="bg-white/95 text-primary hover:bg-white shadow-lg"
              size="sm"
            >
              <Link href="/gap-analysis">View Gap Analysis</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              size="sm"
            >
              <Link href="/career-twin">View Career Twin</Link>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Career Health */}
        {careerTwin && (
          <div className="rounded-2xl border border-border bg-card p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Career Health</h3>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-end gap-3">
              <ProgressRing
                value={careerTwin.profileCompleteness}
                size={64}
                strokeWidth={5}
                label={`${careerTwin.profileCompleteness}%`}
              />
              <div className="pb-1">
                <p className="text-xs text-muted-foreground">Profile Completeness</p>
                <p className="text-xs text-primary font-medium mt-0.5">+12% from last month</p>
              </div>
            </div>
          </div>
        )}

        {/* ATS Score */}
        <ATSScoreCard
          score={atsScore}
          missingKeywords={missingKeywords.slice(0, 2)}
          onOptimize={() => window.location.href = '/resume-studio'}
        />

        {/* Applications */}
        <div className="rounded-2xl border border-border bg-card p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Applications</h3>
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            <AnimatedCounter target={totalApps} />
          </p>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>{appliedCount} applied</span>
            <span>·</span>
            <span>{screenCount} screening</span>
            <span>·</span>
            <span>{interviewCount} interviewing</span>
          </div>
          <Button asChild size="sm" variant="outline" className="w-full mt-4">
            <Link href="/application-tracker">View Tracker</Link>
          </Button>
        </div>

        {/* Learning Path */}
        <div className="rounded-2xl border border-border bg-card p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Learning Path</h3>
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground mb-1">Next Milestone</p>
            <p className="text-lg font-bold text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text">GraphQL Mastery</p>
            <p className="text-xs text-muted-foreground mt-1">Estimated: 10 hours</p>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '45%' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            />
          </div>
          <Button asChild size="sm" className="w-full">
            <Link href="/career-twin">Continue Learning</Link>
          </Button>
        </div>
      </motion.div>

      {/* Recent Activity & Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-1.5">
            {[
              { label: 'Analyze New Job', href: '/job-intelligence', icon: Briefcase },
              { label: 'Optimize Resume', href: '/resume-studio', icon: Target },
              { label: 'Practice Interview', href: '/interview-prep', icon: Zap },
              { label: 'Track Applications', href: '/application-tracker', icon: Sparkles },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/80 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Next Best Action</h3>
              <p className="text-xs text-muted-foreground">Based on your career twin analysis</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            We recommend improving your <span className="text-foreground font-medium">GraphQL mastery</span>. 
            This will increase your match score by <span className="text-primary font-semibold">+8%</span> and 
            open doors to senior roles at top tech companies like Stripe, Vercel, and GitHub.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Start Course', desc: 'Frontend Masters', time: '6 hrs' },
              { label: 'Build Project', desc: 'GraphQL Dashboard', time: '4 hrs' },
              { label: 'Get Certified', desc: 'Apollo GraphQL', time: '2 hrs' },
            ].map((action, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
                <p className="text-xs text-primary font-medium mt-2">{action.time}</p>
              </div>
            ))}
          </div>
          <Button asChild className="mt-4" size="sm">
            <Link href="/career-twin" className="flex items-center gap-2">
              View Learning Path
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
