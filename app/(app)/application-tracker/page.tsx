'use client';

import { useTrackerStore } from '@/lib/stores/tracker';
import { Button } from '@/components/ui/button';
import { Plus, Search, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { ApplicationCard, MetricCard } from '@/components/cards';

export default function ApplicationTrackerPage() {
  const { applications, getApplicationsByStatus } = useTrackerStore();

  const statuses = ['applied', 'screen', 'interview', 'offer'] as const;
  const statusLabels = {
    applied: 'Applied',
    screen: 'Screen',
    interview: 'Interview',
    offer: 'Offer',
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Application Tracker</h1>
          <p className="text-lg text-muted-foreground">
            Manage and track your job application pipeline.
          </p>
        </div>
        <div className="flex gap-3 mt-6 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            View Analytics
          </Button>
          <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add Application
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statuses.map((status) => {
          const count = getApplicationsByStatus(status).length;
          return (
            <MetricCard
              key={status}
              title={statusLabels[status]}
              value={count}
            />
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full pl-12 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statuses.map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-lg">
                  {statusLabels[status]}
                </h3>
                <span className="text-sm font-bold text-primary">
                  {getApplicationsByStatus(status).length}
                </span>
              </div>

              <div className="space-y-3">
                {getApplicationsByStatus(status).map((app) => (
                  <ApplicationCard
                    key={app.id}
                    company={app.company}
                    position={app.jobTitle}
                    status={status as 'applied' | 'screening' | 'interview' | 'offer' | 'rejected'}
                    appliedDate={new Date(app.appliedDate).toLocaleDateString()}
                    matchScore={app.matchScore}
                  />
                ))}

                {getApplicationsByStatus(status).length === 0 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground">No applications yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Pipeline Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Conversion Rate"
            value="33%"
            subtitle="3 interviews from 9 applications"
          />
          <MetricCard
            title="Avg Response Time"
            value="5.2 days"
            subtitle="From application to first contact"
          />
          <MetricCard
            title="Success Rate"
            value="11%"
            subtitle="1 offer from 9 applications"
          />
        </div>
      </div>
    </div>
  );
}
