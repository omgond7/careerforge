import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Check, Loader2 } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onUpload: (imageUrl: string) => void;
  onCancel: () => void;
}

export function ImageUploadModal({
  isOpen,
  onUpload,
  onCancel,
}: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    // Simulate image uploading
    setTimeout(() => {
      setLoading(false);
      onUpload(preview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=uploaded');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg max-w-sm w-full mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/20">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Profile Image
          </h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="avatar-image-upload"
              className="hidden"
            />
            {preview ? (
              <img
                src={preview}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full border-2 border-primary object-cover mb-2"
              />
            ) : (
              <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
            )}
            <label htmlFor="avatar-image-upload" className="cursor-pointer font-semibold text-xs text-primary hover:underline">
              {preview ? 'Select Another Image' : 'Select Photo File'}
            </label>
            <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG or SVG (max. 2MB)</p>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border mt-4">
            <Button variant="outline" type="button" onClick={onCancel} disabled={loading} className="border-border">
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || loading} className="flex items-center gap-1.5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {loading ? 'Uploading...' : 'Save Avatar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
