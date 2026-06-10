'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  BookOpen, 
  ExternalLink, 
  Briefcase, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  CheckCircle 
} from 'lucide-react';
import { skillDetailData } from '@/lib/mock-data';
import { MetricCard } from '@/components/cards';

export default function TechnologyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const tech = skillDetailData; // Load GraphQL mock skill detail data

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/career-twin">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Career Twin
        </Link>
      </Button>

      {/* Header Profile */}
      <div className="bg-card border border-border rounded-lg p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground capitalize">{tech.name}</h1>
              <Badge className="bg-primary/10 text-primary border border-primary/20">
                {tech.category}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              Deep dive into your alignment, training status, and professional opportunities with {tech.name}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1 font-semibold border-primary/30 bg-primary/5 text-primary">
              Proficiency: {tech.proficiency}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Years of Experience"
          value={`${tech.yearsOfExperience} Yrs`}
          subtitle="Direct application usage"
          icon={<Award className="w-5 h-5 text-primary" />}
        />
        <MetricCard
          title="LinkedIn Endorsements"
          value={tech.endorsements}
          subtitle="Verified by your network"
          icon={<CheckCircle className="w-5 h-5 text-primary" />}
        />
        <MetricCard
          title="Matching Opportunities"
          value={tech.jobMatches}
          subtitle="Active local & remote jobs"
          icon={<Briefcase className="w-5 h-5 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course recommendations & Learning milestones */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Recommended Courses & Training
            </h2>

            <div className="divide-y divide-border">
              {tech.courses.map((course, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{course.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{course.platform}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={course.status === 'Completed' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild className="p-2 h-8 w-8 rounded-full border border-border">
                      <a href="#" className="flex items-center justify-center">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Opportunities */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Active Opportunities</h2>
            <div className="space-y-4">
              {tech.relevantJobs.map((job) => (
                <div key={job.company} className="p-4 border border-border bg-muted/10 rounded-lg flex items-center justify-between hover:bg-muted/20 transition-all">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{job.title}</h3>
                    <p className="text-xs text-muted-foreground">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {job.match}% Match
                    </Badge>
                    <Button asChild size="sm" variant="outline" className="border-border">
                      <Link href="/job-intelligence/1">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Relational details */}
        <div className="space-y-6">
          {/* Related Skills */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Related Skills</h3>
            <div className="space-y-3">
              {tech.relatedSkills.map((skill) => (
                <div key={skill.name} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-xs text-muted-foreground block">Proficiency: {skill.proficiency}</span>
                  </div>
                  <Badge variant="outline" className="capitalize text-xs">
                    {skill.relevance} Relevance
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* AI Roadmap block */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground">Gap Target Identified</h3>
            <p className="text-xs text-muted-foreground">
              This skill was identified as a critical gap in 3 target job applications. Let's add GraphQL learning milestones to your career twin roadmap.
            </p>
            <Button asChild className="w-full">
              <Link href="/career-twin/roadmap/graphql-mastery">Open Roadmap</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
