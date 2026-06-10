'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Zap, Award, Crown } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      'Job analysis (5/month)',
      'Resume optimization',
      'Basic job matching',
      'Community support',
    ],
    cta: 'Current Plan',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Best for serious job seekers',
    features: [
      'Unlimited job analysis',
      'Advanced resume optimization',
      'AI-powered matching',
      'Interview prep sessions (20/month)',
      'Priority support',
      'Career twin analysis',
      'Custom learning paths',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
    icon: Zap,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$24.99',
    period: '/month',
    description: 'For career professionals',
    features: [
      'Everything in Pro',
      'Unlimited interview prep',
      'Personal career coach (1 call/week)',
      'Salary negotiation guide',
      'Company intelligence deep dives',
      '1-on-1 mock interviews',
      'Priority feature access',
    ],
    cta: 'Upgrade to Elite',
    highlighted: false,
    icon: Crown,
  },
];

export default function SubscriptionUpgrade() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link href="/settings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Upgrade Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose the perfect plan to accelerate your career growth
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-foreground transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
              <span className="ml-2 inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon || Award;
            const price = isAnnual && plan.price !== '$0' ? (parseFloat(plan.price) * 12 * 0.8).toFixed(2) : plan.price;
            const period = isAnnual && plan.price !== '$0' ? '/year' : plan.period;

            return (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-primary bg-primary/5'
                    : plan.highlighted
                    ? 'border-primary/50 hover:border-primary'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon and Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-foreground">
                      {price}
                      {plan.price !== '$0' && <span className="text-sm font-normal text-muted-foreground">{period}</span>}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full mb-8 ${
                      selectedPlan === plan.id
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted text-foreground hover:bg-muted-foreground/20'
                    }`}
                  >
                    {plan.cta}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: 'Can I change my plan anytime?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes! Pro and Elite plans come with a 7-day free trial. No credit card required.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and Apple Pay for seamless payments.',
              },
              {
                question: 'Do you offer refunds?',
                answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund you fully.',
              },
            ].map((item, idx) => (
              <details key={idx} className="bg-card border border-border rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-foreground flex items-center justify-between">
                  {item.question}
                  <span className="ml-2">›</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Questions about pricing?</p>
          <Button asChild variant="outline" className="border-border">
            <Link href="/support">Contact our team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
