import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Copy, Check, Share2, Globe, Lock } from 'lucide-react';

interface ShareProfileModalProps {
  isOpen: boolean;
  profileUrl: string;
  onCancel: () => void;
}

export function ShareProfileModal({
  isOpen,
  profileUrl,
  onCancel,
}: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share Career Profile
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Share a read-only link to your Career Twin, resume versions, and skill credentials with recruiters and hiring managers.
          </p>

          {/* Visibility settings */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsPublic(true)}
              className={`flex-1 p-3 border rounded-lg flex flex-col items-center gap-1.5 transition-all text-center ${
                isPublic
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-semibold">Public Link</span>
              <span className="text-[10px] opacity-80">Anyone with link can view</span>
            </button>

            <button
              onClick={() => setIsPublic(false)}
              className={`flex-1 p-3 border rounded-lg flex flex-col items-center gap-1.5 transition-all text-center ${
                !isPublic
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span className="text-xs font-semibold">Private Access</span>
              <span className="text-[10px] opacity-80">Only specific invitees</span>
            </button>
          </div>

          {/* Link display & Copy */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Shareable URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={isPublic ? profileUrl : 'https://career-copilot.ai/p/restricted-token'}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none text-xs select-all"
              />
              <Button onClick={handleCopy} size="sm" className="flex items-center gap-1 px-3">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border mt-6">
            <Button variant="outline" onClick={onCancel} className="border-border">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
