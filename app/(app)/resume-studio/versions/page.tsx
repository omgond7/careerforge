'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Download, Eye, Copy, MoreVertical, CheckCircle2, ArrowRight } from 'lucide-react';
import { ATSScoreCard, MetricCard } from '@/components/cards';
import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function ResumeVersions() {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const { data: resumes, isLoading } = useSWR('/api/resume', fetcher);
  const activeResume = resumes?.find((r: any) => r.isPrimary) ?? resumes?.[0];
  const dbVersions = activeResume?.versions || [];

  interface ResumeVersionItem {
    id: string;
    name: string;
    version: number;
    createdDate: string;
    updatedDate: string;
    atsScore: number;
    status: 'active' | 'archived';
    changes: string;
  }

  const versions: ResumeVersionItem[] = dbVersions.map((v: any, index: number) => ({
    id: v.id,
    name: `v${v.versionNumber} (${v.versionType})`,
    version: v.versionNumber,
    createdDate: v.createdAt,
    updatedDate: v.createdAt,
    atsScore: v.atsScore || 70,
    status: index === 0 ? 'active' as const : 'archived' as const,
    changes: v.changeSummary || 'Resume update',
  }));

  const activeVersion = versions.find(v => v.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Resume Versions</h1>
            <p className="text-muted-foreground">Manage and compare your resume versions.</p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-fit">
            <Link href="/resume-studio?action=create-version">
              <Plus className="w-4 h-4 mr-2" />
              New Version
            </Link>
          </Button>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading versions...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Total Versions"
                value={versions.length}
                subtitle={`${versions.filter(v => v.status === 'archived').length} archived`}
              />
              <ATSScoreCard
                score={activeVersion?.atsScore || 0}
                missingKeywords={['Leadership', 'Agile']}
                onOptimize={() => window.location.href = '/resume-studio'}
              />
              <MetricCard
                title="Last Updated"
                value={activeVersion ? new Date(activeVersion.updatedDate).toLocaleDateString() : 'N/A'}
                subtitle={activeVersion?.name || 'No active version'}
              />
            </div>

            {/* Versions List */}
            <div className="space-y-4">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className={`bg-card border-2 rounded-lg p-6 transition-all ${
                    version.status === 'active'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{version.name}</h3>
                        {version.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{version.changes}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Created {new Date(version.createdDate).toLocaleDateString()}</span>
                        <span>ATS Score: {version.atsScore}/100</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVersion(version.id)}
                        className="border-border hover:bg-muted"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      {version.status === 'archived' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border hover:bg-muted"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-muted"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compare Versions */}
            {versions.length > 1 && (
              <div className="mt-8 bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Compare Versions</h3>
                <p className="text-muted-foreground mb-4">
                  Select two versions to compare and see what has changed.
                </p>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/resume-studio/compare">
                    Open Comparison Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
