import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Save } from 'lucide-react';

interface EditJobDialogProps {
  isOpen: boolean;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  onSave: (data: { title: string; company: string; location: string; salary: string }) => void;
  onCancel: () => void;
}

export function EditJobDialog({
  isOpen,
  jobTitle,
  company,
  location,
  salary,
  onSave,
  onCancel,
}: EditJobDialogProps) {
  const [title, setTitle] = useState(jobTitle);
  const [comp, setComp] = useState(company);
  const [loc, setLoc] = useState(location);
  const [sal, setSal] = useState(salary);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, company: comp, location: loc, salary: sal });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg max-w-lg w-full mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <h2 className="text-xl font-bold text-foreground">Edit Job Listing Details</h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Company Name</label>
            <input
              type="text"
              value={comp}
              onChange={(e) => setComp(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Location</label>
              <input
                type="text"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Salary Range</label>
              <input
                type="text"
                value={sal}
                onChange={(e) => setSal(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
            <Button variant="outline" type="button" onClick={onCancel} className="border-border">
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Save Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
