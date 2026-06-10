'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Search, Plus, MessageSquare, Book, Shield } from 'lucide-react';

const categories = [
  {
    title: 'Getting Started',
    icon: Plus,
    articles: [
      'Welcome to Career Copilot',
      'Complete Your Profile',
      'Set Your Target Role',
      'Import Your Resume',
    ],
  },
  {
    title: 'Features & Tools',
    icon: Book,
    articles: [
      'Using Career Twin',
      'Job Intelligence Guide',
      'Resume Analysis',
      'Interview Prep Guide',
    ],
  },
  {
    title: 'Account & Settings',
    icon: Shield,
    articles: [
      'Account Security',
      'Privacy Settings',
      'Notification Preferences',
      'Billing & Subscription',
    ],
  },
  {
    title: 'Troubleshooting',
    icon: MessageSquare,
    articles: [
      'Data Not Syncing',
      'Sync Issues',
      'Performance Issues',
      'Bug Report',
    ],
  },
];

const faqs = [
  {
    question: 'How do I update my resume?',
    answer: 'Go to Resume Studio and click "Upload New Version" to update your resume. We\'ll analyze it and provide optimization suggestions.',
  },
  {
    question: 'Can I connect multiple GitHub accounts?',
    answer: 'Currently, you can connect one GitHub account per Career Copilot profile. You can disconnect and reconnect at any time in Settings > Integrations.',
  },
  {
    question: 'How is my ATS score calculated?',
    answer: 'We analyze your resume against industry standards, keyword matching, and formatting best practices. Higher scores indicate better optimization for applicant tracking systems.',
  },
  {
    question: 'What data is shared with integrations?',
    answer: 'We only access publicly available information from GitHub and LinkedIn. Your password is never stored, and you can revoke access anytime.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Help & Support</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers, learn how to use Career Copilot, and get support.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.title} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  {category.title}
                </h2>
              </div>
              <ul className="space-y-2">
                {category.articles.map((article) => (
                  <li key={article}>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium text-foreground">
                  {faq.question}
                </span>
                <span className={`text-primary transition-transform ${
                  expandedFaq === index ? 'rotate-180' : ''
                }`}>
                  ↓
                </span>
              </button>
              {expandedFaq === index && (
                <div className="px-6 py-4 border-t border-border bg-muted/30">
                  <p className="text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-white text-center space-y-4">
        <MessageSquare className="w-8 h-8 mx-auto" />
        <h2 className="text-2xl font-bold">Still need help?</h2>
        <p className="text-white/80">
          Our support team is ready to assist you. Contact us anytime.
        </p>
        <Button
          variant="outline"
          className="bg-white text-primary hover:bg-white/90 border-white"
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
}
