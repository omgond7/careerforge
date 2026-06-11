'use client';

import React, { use } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
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
  ExternalLink,
  Loader2
} from 'lucide-react';
import { MetricCard } from '@/components/cards';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const companyName = decodeURIComponent(id);

  const { data: company, error, isLoading } = useSWR(`/api/company/${encodeURIComponent(companyName)}`, fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Company research failed</h2>
          <p className="text-muted-foreground mb-4">Could not retrieve information for "{companyName}"</p>
          <Button asChild variant="outline">
            <Link href="/job-intelligence/history">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const websiteUrl = company.website || `${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
  const founded = company.founded || 'Not specified';
  const headquarters = company.headquarters || 'Not specified';
  const size = company.size || 'Not specified';
  const rating = company.glassdoorRating || 4.2;

  const salaryRanges = [
    { role: 'Software Engineer', range: company.salaryRange?.engineer || '$120k - $160k' },
    { role: 'Senior Software Engineer', range: company.salaryRange?.senior || '$160k - $210k' },
    { role: 'Staff Software Engineer', range: company.salaryRange?.staff || '$210k - $270k' },
  ];

  const recentNews = (company.recentNews || []).map((news: any) => ({
    title: news.title || news.summary,
    type: 'Update',
    date: news.date || new Date().toISOString(),
  }));

  const openRolesCount = company.interviewProcess?.stages?.length ? `${company.interviewProcess.stages.length + 1} stages` : '3-4 stages';

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
              {companyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">{companyName}</h1>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  Target Company
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 max-w-xl">{company.description}</p>
            </div>
          </div>
          <Button asChild>
            <a href={`https://${websiteUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Visit Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>

        {/* Company Quick Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/60">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm truncate">{headquarters}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm">Founded {founded}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm">{size} Employees</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm">Active hiring</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Culture Rating"
          value={`${rating} / 5`}
          subtitle="Overall glassdoor score"
          icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
        />
        <MetricCard
          title="Interview Stages"
          value={openRolesCount}
          subtitle={`Duration: ${company.interviewProcess?.avgDuration || '3-4 weeks'}`}
          icon={<Award className="w-5 h-5 text-primary" />}
        />
        <MetricCard
          title="Interview Difficulty"
          value={company.interviewProcess?.difficulty || 'Medium'}
          subtitle="Estimated level"
          icon={<Briefcase className="w-5 h-5 text-primary" />}
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Details & Culture */}
        <div className="md:col-span-2 space-y-6">
          {/* Culture and Tech Stack */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Culture & Technology Stack</h2>
            
            {company.culture?.values?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Core Values:</p>
                <div className="flex flex-wrap gap-2">
                  {company.culture.values.map((value: string) => (
                    <Badge key={value} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {company.techStack?.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-2">Key Tech Stack:</p>
                <div className="flex flex-wrap gap-2">
                  {company.techStack.map((tech: string) => (
                    <Badge key={tech} variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {company.culture?.benefits?.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-2">Benefits:</p>
                <div className="flex flex-wrap gap-2">
                  {company.culture.benefits.map((benefit: string) => (
                    <Badge key={benefit} variant="outline" className="border-border">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Salary Ranges */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Salary Benchmarks
            </h2>
            <div className="space-y-4">
              {salaryRanges.map((sal) => (
                <div key={sal.role} className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-lg">
                  <div>
                    <p className="font-semibold text-foreground">{sal.role}</p>
                    <p className="text-xs text-muted-foreground">Estimated annual compensation</p>
                  </div>
                  <Badge variant="outline" className="text-base font-bold text-primary border-primary/20 bg-primary/5 px-3 py-1">
                    {sal.range}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Recent News */}
          {recentNews.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Press & Highlights</h2>
              <div className="space-y-4">
                {recentNews.map((news: any, idx: number) => (
                  <div key={idx} className="p-4 border-l-4 border-primary bg-muted/10 space-y-1">
                    <Badge variant="secondary" className="capitalize">{news.type}</Badge>
                    <h4 className="font-semibold text-foreground text-sm">{news.title}</h4>
                    <p className="text-xs text-muted-foreground">Published {new Date(news.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interview prep & Actions */}
        <div className="space-y-6">
          {/* Interview Stages & Tips */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Interview Process</h3>
            <div className="space-y-3">
              {company.interviewProcess?.stages?.map((stage: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="text-sm text-foreground">{stage}</span>
                </div>
              ))}
            </div>
            {company.interviewProcess?.tips?.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-foreground text-sm mb-2">Preparation Tips:</h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                  {company.interviewProcess.tips.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* AI Advisor Card */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground">Ready to Apply?</h3>
            <p className="text-xs text-muted-foreground">
              Prepare a targeted mock interview session for {companyName} to boost your readiness.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild className="w-full">
                <Link href="/interview-prep">Practice targeted prep</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-border">
                <Link href="/copilot">Ask AI Copilot about {companyName}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
