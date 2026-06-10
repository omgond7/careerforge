'use client';

import { useResumeStore } from '@/lib/stores/resume';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Zap } from 'lucide-react';
import Link from 'next/link';
import { ATSScoreCard } from '@/components/cards';
import { ResumePreview } from '@/components/resume/resume-preview';

export default function ResumeStudioPage() {
  const { resume, atsScore, missingKeywords } = useResumeStore();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Resume Studio</h1>
          <p className="text-lg text-muted-foreground">
            AI-powered resume optimization and ATS analysis
          </p>
        </div>
        <div className="flex gap-3 mt-6 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* ATS Score Card */}
          <ATSScoreCard
            score={atsScore}
            missingKeywords={missingKeywords}
            onOptimize={() => window.location.reload()}
          />

          {/* Resume Sections */}
          <div className="space-y-4">
            {[
              {
                title: 'Personal Information',
                content: `${resume.personalInfo.fullName}\n${resume.personalInfo.email}`,
              },
              {
                title: 'Professional Summary',
                content: resume.summary,
              },
              {
                title: 'Experience',
                content: resume.experience[0]?.company,
              },
            ].map((section) => (
              <div key={section.title} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground text-lg">{section.title}</h4>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Missing Keywords */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-4">Missing Keywords</h4>
            <div className="space-y-2">
              {missingKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                >
                  <span className="text-sm text-foreground">{keyword}</span>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Templates */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-4">Templates</h4>
            <div className="grid grid-cols-2 gap-2">
              {['Modern', 'Minimal', 'Tech Split'].map((template) => (
                <button
                  key={template}
                  className="p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium text-foreground"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-4">Next Steps</h4>
            <div className="space-y-3">
              <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/interview-prep">Practice Interview</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/gap-analysis">View Gap Analysis</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
