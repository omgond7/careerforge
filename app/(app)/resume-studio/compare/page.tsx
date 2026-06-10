'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { resumeVersions, resumeComparisonData } from '@/lib/mock-data';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function ResumeComparison() {
  const [versionA, setVersionA] = useState('4');
  const [versionB, setVersionB] = useState('3');

  const v4Data = resumeComparisonData.v4;
  const v3Data = resumeComparisonData.v3;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/resume-studio/versions">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Compare Resumes</h1>
            <p className="text-muted-foreground">See what changed between versions</p>
          </div>
        </div>

        {/* Version Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Version A</label>
            <select
              value={versionA}
              onChange={(e) => setVersionA(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {resumeVersions.map((v) => (
                <option key={v.id} value={v.version}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Version B</label>
            <select
              value={versionB}
              onChange={(e) => setVersionB(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {resumeVersions.map((v) => (
                <option key={v.id} value={v.version}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column A */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">v{versionA} - Current</h3>

              {/* Summary */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-2">Professional Summary</h4>
                <p className="text-sm text-muted-foreground">{v4Data.summary}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {v4Data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Experience</h4>
                <div className="space-y-3">
                  {v4Data.experience.map((exp, idx) => (
                    <div key={idx} className="pb-3 border-b border-border last:border-0">
                      <p className="font-medium text-foreground">{exp.role}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column B */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">v{versionB} - Tech Focused</h3>

              {/* Summary */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-2">Professional Summary</h4>
                <p className="text-sm text-muted-foreground">{v3Data.summary}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {v3Data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Experience</h4>
                <div className="space-y-3">
                  {v3Data.experience.map((exp, idx) => (
                    <div key={idx} className="pb-3 border-b border-border last:border-0">
                      <p className="font-medium text-foreground">{exp.role}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Differences Summary */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Changes</h3>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Added AWS to skills</p>
                <p className="text-xs text-muted-foreground">Reflects recent cloud infrastructure work</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Expanded experience section</p>
                <p className="text-xs text-muted-foreground">Added more details about achievements</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Updated professional summary</p>
                <p className="text-xs text-muted-foreground">More focused on technical expertise</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Copy v{versionB} to New Version
          </Button>
          <Button variant="outline" className="border-border">
            Download Both
          </Button>
        </div>
      </div>
    </div>
  );
}
