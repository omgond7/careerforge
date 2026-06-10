import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  itemName?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export function DeleteConfirmDialog({
  title,
  description,
  itemName,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
  variant = 'danger',
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            variant === 'danger' 
              ? 'bg-destructive/10' 
              : 'bg-amber-500/10'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${
              variant === 'danger' 
                ? 'text-destructive' 
                : 'text-amber-600'
            }`} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            {itemName && (
              <p className="text-sm font-medium text-foreground mt-2">
                <span className="text-muted-foreground">Item: </span>{itemName}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {variant === 'danger' ? 'Delete' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
