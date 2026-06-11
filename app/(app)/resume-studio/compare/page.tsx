'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

const defaultResume = {
  summary: 'Experienced Frontend Engineer specializing in React and modern web architecture. Proven track record of delivering scalable enterprise applications and improving performance metrics.',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Node.js', 'GraphQL', 'PostgreSQL'],
  experience: [
    {
      company: 'TechNova Solutions',
      role: 'Frontend Developer',
      startDate: '2020',
      endDate: 'Present',
    },
  ],
};

export default function ResumeComparison() {
  const [versionA, setVersionA] = useState('');
  const [versionB, setVersionB] = useState('');

  const { data: resumes, isLoading } = useSWR('/api/resume', fetcher);
  const activeResume = resumes?.find((r: any) => r.isPrimary) ?? resumes?.[0];
  const dbVersions = activeResume?.versions || [];

  interface ResumeVersionItem {
    id: string;
    name: string;
    version: string;
    createdDate: string;
    updatedDate: string;
    atsScore: number;
    status: 'active' | 'archived';
    changes: string;
    contentJson: any;
  }

  const versions: ResumeVersionItem[] = dbVersions.map((v: any, index: number) => ({
    id: v.id,
    name: `v${v.versionNumber} (${v.versionType})`,
    version: String(v.versionNumber),
    createdDate: v.createdAt,
    updatedDate: v.createdAt,
    atsScore: v.atsScore || 70,
    status: index === 0 ? 'active' as const : 'archived' as const,
    changes: v.changeSummary || 'Resume update',
    contentJson: v.contentJson as any,
  }));

  const defaultVersionA = versions[0]?.version || '';
  const defaultVersionB = versions[1]?.version || versions[0]?.version || '';
  const currentVersionA = versionA || defaultVersionA;
  const currentVersionB = versionB || defaultVersionB;

  const selectedVDataA = versions.find((v: any) => v.version === currentVersionA)?.contentJson || defaultResume;
  const selectedVDataB = versions.find((v: any) => v.version === currentVersionB)?.contentJson || defaultResume;

  const mapCompareData = (data: any): {
    summary: string;
    skills: string[];
    experience: { role: string; company: string; duration: string }[];
  } => {
    return {
      summary: data?.summary || '',
      skills: Array.isArray(data?.skills)
        ? data.skills.flatMap((s: any) => (typeof s === 'string' ? [s] : (s?.items || [])))
        : [],
      experience: Array.isArray(data?.experience)
        ? data.experience.map((exp: any) => ({
            role: exp.role || 'Software Engineer',
            company: exp.company || 'Company',
            duration: exp.duration || `${exp.startDate || ''} - ${exp.endDate || 'Present'}`,
          }))
        : [],
    };
  };

  const vAData = mapCompareData(selectedVDataA);
  const vBData = mapCompareData(selectedVDataB);

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

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading versions for comparison...</div>
        ) : versions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No versions found to compare.</div>
        ) : (
          <>
            {/* Version Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Version A</label>
                <select
                  value={currentVersionA}
                  onChange={(e) => setVersionA(e.target.value)}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.version}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Version B</label>
                <select
                  value={currentVersionB}
                  onChange={(e) => setVersionB(e.target.value)}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {versions.map((v) => (
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
                  <h3 className="text-lg font-semibold text-foreground mb-4">v{currentVersionA}</h3>

                  {/* Summary */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Professional Summary</h4>
                    <p className="text-sm text-muted-foreground">{vAData.summary}</p>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {vAData.skills.map((skill) => (
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
                      {vAData.experience.map((exp, idx) => (
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
                  <h3 className="text-lg font-semibold text-foreground mb-4">v{currentVersionB}</h3>

                  {/* Summary */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Professional Summary</h4>
                    <p className="text-sm text-muted-foreground">{vBData.summary}</p>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {vBData.skills.map((skill) => (
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
                      {vBData.experience.map((exp, idx) => (
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
                    <p className="text-sm font-medium text-foreground">Optimized skills alignment</p>
                    <p className="text-xs text-muted-foreground">Adjusted keywords to match target job descriptions</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Updated professional summary</p>
                    <p className="text-xs text-muted-foreground">Tailored summary to highlight core backend/frontend competencies</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Copy v{currentVersionB} to New Version
              </Button>
              <Button variant="outline" className="border-border">
                Download Both
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
