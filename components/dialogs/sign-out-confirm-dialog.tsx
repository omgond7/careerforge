import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, X } from 'lucide-react';

interface SignOutConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SignOutConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
}: SignOutConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg max-w-sm w-full mx-4 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <LogOut className="w-5 h-5 text-destructive" />
            Sign Out
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to sign out of Career Copilot? You will need to log in again to access your career twin insights.
          </p>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={onCancel} className="border-border">
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm} className="flex items-center gap-1.5">
              Confirm Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
