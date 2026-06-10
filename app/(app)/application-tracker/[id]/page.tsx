'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTrackerStore, ApplicationStatus } from '@/lib/stores/tracker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmDialog } from '@/components/dialogs/delete-confirm-dialog';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Trash2, 
  Save, 
  Edit3,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { applications, updateApplication, removeApplication } = useTrackerStore();
  const application = applications.find(app => app.id === id);

  const [notes, setNotes] = useState(application?.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!application) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Application Not Found</h1>
        <p className="text-muted-foreground">The job application you are trying to view does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/application-tracker">Back to Tracker</Link>
        </Button>
      </div>
    );
  }

  const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
    applied: { label: 'Applied', color: 'bg-blue-900/40 text-blue-300 border-blue-800' },
    screen: { label: 'Screening', color: 'bg-purple-900/40 text-purple-300 border-purple-800' },
    interview: { label: 'Interview', color: 'bg-amber-900/40 text-amber-300 border-amber-800' },
    offer: { label: 'Offer', color: 'bg-green-900/40 text-green-300 border-green-800' },
    rejected: { label: 'Rejected', color: 'bg-red-900/40 text-red-300 border-red-800' },
  };

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    updateApplication(id, { status: newStatus });
  };

  const handleSaveNotes = () => {
    updateApplication(id, { notes });
    setIsEditingNotes(false);
  };

  const handleDelete = () => {
    removeApplication(id);
    router.push('/application-tracker');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Back Button and Delete Action */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/application-tracker">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tracker
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Delete Application
        </Button>
      </div>

      {/* Main Card Header */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">{application.company}</p>
            <h1 className="text-3xl font-bold text-foreground mt-1">{application.jobTitle}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                Applied on {application.appliedDate}
              </div>
              {application.matchScore && (
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {application.matchScore}% Twin Match
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground font-medium mb-1 block">Current Stage</span>
            <Badge className={`${statusConfig[application.status].color} px-3 py-1 border text-sm`}>
              {statusConfig[application.status].label}
            </Badge>
          </div>
        </div>

        {/* Change Status Action */}
        <div className="pt-4 border-t border-border/60">
          <p className="text-sm font-semibold text-foreground mb-3">Update Application Stage:</p>
          <div className="flex flex-wrap gap-2">
            {(['applied', 'screen', 'interview', 'offer', 'rejected'] as ApplicationStatus[]).map((stage) => (
              <button
                key={stage}
                onClick={() => handleStatusChange(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  application.status === stage
                    ? 'bg-primary border-primary text-primary-foreground shadow'
                    : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {statusConfig[stage].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left/Middle Column: Notes & Timeline */}
        <div className="md:col-span-2 space-y-6">
          {/* Notes section */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Notes & Timeline
              </h2>
              {!isEditingNotes ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(true)} className="flex items-center gap-1 text-primary">
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(false)}>
                    Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSaveNotes} className="flex items-center gap-1">
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste interview questions, details on recruiters, salary offers, etc."
                className="w-full min-h-[180px] p-4 bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted-foreground text-sm"
              />
            ) : (
              <div className="p-4 bg-muted/20 border border-border rounded-lg min-h-[120px] whitespace-pre-wrap text-sm text-foreground">
                {application.notes || 'No notes added yet. Click edit to write down contact information, mock question links, or interview outcomes.'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Action items */}
        <div className="space-y-6">
          {/* Timeline Milestones */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recruiting Steps
            </h3>
            
            <div className="space-y-4 relative pl-4 border-l-2 border-border/80">
              <div className="relative">
                <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-primary border-4 border-background" />
                <h4 className="font-semibold text-foreground text-sm">Resume Sent</h4>
                <p className="text-xs text-muted-foreground">Sent on {application.appliedDate}</p>
              </div>
              <div className="relative">
                <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-4 border-background ${
                  ['screen', 'interview', 'offer'].includes(application.status) ? 'bg-primary' : 'bg-muted-foreground'
                }`} />
                <h4 className="font-semibold text-foreground text-sm">Initial Call</h4>
                <p className="text-xs text-muted-foreground">Screening evaluation</p>
              </div>
              <div className="relative">
                <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-4 border-background ${
                  ['interview', 'offer'].includes(application.status) ? 'bg-primary' : 'bg-muted-foreground'
                }`} />
                <h4 className="font-semibold text-foreground text-sm">Technical Loop</h4>
                <p className="text-xs text-muted-foreground">Live coding & system design</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        title="Delete Job Application"
        description={`Are you sure you want to remove your application for ${application.jobTitle} at ${application.company}? This cannot be undone.`}
        itemName={`${application.jobTitle} - ${application.company}`}
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
