'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Globe, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  Star, 
  Award,
  ExternalLink
} from 'lucide-react';
import { companyIntelligenceDetail } from '@/lib/mock-data';
import { MetricCard } from '@/components/cards';

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const company = companyIntelligenceDetail; // Rely on mock data for details

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/job-intelligence/history">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Analyses
        </Link>
      </Button>

      {/* Header Banner */}
      <div className="bg-card border border-border rounded-lg p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 text-3xl font-bold text-primary">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  Target Company
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">{company.description}</p>
            </div>
          </div>
          <Button asChild>
            <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Visit Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>

        {/* Company Quick Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/60">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">{company.headquarters}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm">Founded {company.founded}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm">{company.employeeCount} Employees</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm">{company.funding}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Culture Rating"
          value={`${company.culture.rating} / 5`}
          subtitle="Overall Employee Review"
          icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
        />
        <MetricCard
          title="Growth & Opportunities"
          value={`${company.culture.growthOpportunities} / 5`}
          subtitle="Career Progression Path"
          icon={<Award className="w-5 h-5 text-primary" />}
        />
        <MetricCard
          title="Open Roles"
          value={company.hiring.openRoles}
          subtitle={`Average hire: ${company.hiring.averageHiringTime}`}
          icon={<Briefcase className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Details & Culture */}
        <div className="md:col-span-2 space-y-6">
          {/* Culture and Benefits */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Culture & Benefits</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Work-Life Balance</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(company.culture.workLifeBalance / 5) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{company.culture.workLifeBalance}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Growth Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(company.culture.growthOpportunities / 5) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{company.culture.growthOpportunities}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-semibold text-foreground mb-3">Core Perks & Benefits:</p>
              <div className="flex flex-wrap gap-2">
                {company.culture.benefits.map((benefit) => (
                  <Badge key={benefit} variant="secondary">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Salary Ranges */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Salary Benchmarks
            </h2>
            <div className="space-y-4">
              {company.salaryRanges.map((sal) => (
                <div key={sal.role} className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{sal.role}</p>
                    <p className="text-xs text-muted-foreground">Estimated base compensation</p>
                  </div>
                  <Badge variant="outline" className="text-base font-bold text-primary border-primary/20 bg-primary/5 px-3 py-1">
                    {sal.range}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent News */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Press & Highlights</h2>
            <div className="space-y-4">
              {company.recentNews.map((news) => (
                <div key={news.title} className="p-4 border-l-4 border-primary bg-muted/10 space-y-1">
                  <Badge variant="secondary" className="capitalize">{news.type}</Badge>
                  <h4 className="font-semibold text-foreground text-sm">{news.title}</h4>
                  <p className="text-xs text-muted-foreground">Published {new Date(news.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Employees & Actions */}
        <div className="space-y-6">
          {/* Key People */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Leadership Team</h3>
            <div className="space-y-4">
              {company.employees.map((emp) => (
                <div key={emp.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{emp.name}</h4>
                    <p className="text-xs text-muted-foreground">{emp.role} • {emp.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Advisor Card */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground">Ready to Apply?</h3>
            <p className="text-xs text-muted-foreground">
              Your profile match score for Stripe is currently 85%. Start interview prep targeted at Stripe to boost your readiness.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild className="w-full">
                <Link href="/interview-prep">Practice targeted prep</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-border">
                <Link href="/copilot">Ask AI Copilot about Stripe</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
