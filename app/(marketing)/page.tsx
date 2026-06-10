'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Briefcase,
  TrendingUp,
  FileText,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronRight,
  Sparkles,
  Target,
  BarChart3,
  Mic2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const features = [
  {
    icon: Brain,
    title: 'Career Digital Twin',
    description: 'A continuously updated digital representation of your professional DNA — skills, projects, experience, all mapped as a knowledge graph.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Briefcase,
    title: 'Job Intelligence',
    description: 'Paste any job description and get instant analysis: required skills, company research, authenticity scoring, and hiring trends.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Gap Analysis Engine',
    description: 'See exactly what you\'re missing. Skill gaps, experience gaps, project gaps, and ATS keyword gaps — all with actionable remediation plans.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: FileText,
    title: '3-Level Resume Generation',
    description: 'Generate three resume versions: Current Best (factual), Gap-Enhanced (aspirational), and Ideal Candidate (career roadmap blueprint).',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Shield,
    title: 'Job Authenticity Detection',
    description: 'AI-powered scam detection analyzes job postings for red flags — domain reputation, recruiter validation, and posting consistency.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Mic2,
    title: 'AI Mock Interviews',
    description: 'Practice system design, behavioral, and coding interviews with AI. Get scored on communication, problem-solving, and time management.',
    color: 'from-amber-500 to-yellow-500',
  },
];

const stats = [
  { value: '92%', label: 'Average Match Score Improvement' },
  { value: '3x', label: 'Higher Interview Callback Rate' },
  { value: '<10s', label: 'Resume Generation Time' },
  { value: '10K+', label: 'Professionals Advancing' },
];

const steps = [
  {
    step: '01',
    title: 'Build Your Career Twin',
    description: 'Connect LinkedIn, GitHub, and upload your resume. Our AI maps your entire professional identity into a knowledge graph.',
  },
  {
    step: '02',
    title: 'Analyze Opportunities',
    description: 'Paste any job description. Get instant company intelligence, skill matching, and authenticity verification.',
  },
  {
    step: '03',
    title: 'See Your Gaps',
    description: 'Understand exactly what you\'re missing — specific skills, projects, certifications, and ATS keywords.',
  },
  {
    step: '04',
    title: 'Generate & Apply',
    description: 'Get three tailored resume versions optimized for the role. Export as PDF and apply with confidence.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center glow-sm">
              <span className="text-xs font-bold text-primary-foreground">C</span>
            </div>
            <span className="font-bold text-lg text-foreground">Career Copilot</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto px-6 text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            The GitHub Copilot for Careers
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            Stop Guessing.
            <br />
            <span className="text-gradient bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] gradient-animated">
              Start Knowing.
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Build your Career Digital Twin. Analyze any job opportunity. See your exact gaps.
            Generate the perfect resume — all powered by AI.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="text-base px-8 shadow-xl glow-primary">
              <Link href="/signup" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Free forever plan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              AI-powered analysis
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gradient bg-gradient-to-r from-primary to-accent">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <BarChart3 className="w-3.5 h-3.5" />
              Platform Features
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Career Intelligence, Not Just Resume Building
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Go beyond document optimization. Understand opportunities, benchmark yourself, and execute a data-driven career strategy.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="group bg-card border border-border rounded-2xl p-8 card-hover"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Target className="w-3.5 h-3.5" />
              How It Works
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              From Profile to Offer in 4 Steps
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No more guesswork. Our AI handles the heavy lifting so you can focus on what matters — landing your dream role.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="space-y-6"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="flex gap-6 md:gap-8 items-start bg-card border border-border rounded-2xl p-6 md:p-8 card-hover"
              >
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-white shadow-lg">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-10 md:p-16 text-center text-white gradient-animated"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

            <motion.div variants={fadeInUp} className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Transform Your Career?</h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                Join thousands of professionals who stopped guessing and started landing interviews with AI-powered career intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl text-base px-8">
                  <Link href="/signup" className="flex items-center gap-2">
                    Start Free — No Credit Card
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary-foreground">C</span>
                </div>
                <span className="font-bold text-foreground">Career Copilot</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered career intelligence platform. The GitHub Copilot for Careers.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Career Copilot. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
