'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons';

type Step = 'select' | 'connecting' | 'success';

export default function ImportWizard() {
  const [step, setStep] = useState<Step>('select');
  const [selectedSource, setSelectedSource] = useState<'github' | 'linkedin' | null>(null);

  const handleConnect = async (source: 'github' | 'linkedin') => {
    setSelectedSource(source);
    setStep('connecting');

    try {
      if (source === 'github') {
        const res = await fetch('/api/integrations/github/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: 'mock-github-token', username: 'demo-user' }),
        });
        if (res.ok) {
          setStep('success');
        } else {
          setStep('select');
        }
      } else {
        const res = await fetch('/api/integrations/linkedin/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: 'mock-linkedin-token', linkedinProfileUrl: 'https://linkedin.com/in/demo-user' }),
        });
        if (res.ok) {
          setStep('success');
        } else {
          setStep('select');
        }
      }
    } catch (err) {
      console.error(err);
      setStep('select');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg mb-4">
            <p className="text-sm font-semibold text-primary">Import Career Data</p>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Sync Your Professional Profile</h1>
          <p className="text-lg text-muted-foreground">Connect your GitHub and LinkedIn to get started with Career Copilot.</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 'select' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step === 'select' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Select Source</span>
          </div>
          <div className="flex-1 h-0.5 bg-border" />
          <div className={`flex items-center gap-2 ${step !== 'select' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step !== 'select' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Sync Data</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-lg p-8">
          {step === 'select' && (
            <div className="space-y-6">
              <p className="text-foreground mb-6">Choose which platform to connect first:</p>

              <div className="space-y-4">
                {/* GitHub */}
                <button
                  onClick={() => handleConnect('github')}
                  className="w-full p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-foreground/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Github className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">GitHub</h3>
                      <p className="text-sm text-muted-foreground">Import projects, contributions & languages</p>
                    </div>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-16">
                    <li>✓ Projects & repositories</li>
                    <li>✓ Contribution history</li>
                    <li>✓ Programming languages</li>
                  </ul>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => handleConnect('linkedin')}
                  className="w-full p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-lg flex items-center justify-center group-hover:bg-[#0A66C2]/20 transition-colors">
                      <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">LinkedIn</h3>
                      <p className="text-sm text-muted-foreground">Import experience, skills & endorsements</p>
                    </div>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-16">
                    <li>✓ Work experience</li>
                    <li>✓ Skills & endorsements</li>
                    <li>✓ Recommendations</li>
                  </ul>
                </button>
              </div>

              {/* Or Upload Resume */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">or</span>
                </div>
              </div>

              <button className="w-full p-6 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <p className="font-medium text-foreground">Upload Resume</p>
                </div>
                <p className="text-sm text-muted-foreground">Drag and drop or click to select a PDF</p>
              </button>
            </div>
          )}

          {step === 'connecting' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Connecting to {selectedSource === 'github' ? 'GitHub' : 'LinkedIn'}...</h3>
              <p className="text-muted-foreground text-center">We're securely importing your data. This may take a moment.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">Success!</h3>
              <p className="text-muted-foreground text-center mb-8">
                {selectedSource === 'github'
                  ? 'Projects successfully synced, languages parsed, and portfolio imported!'
                  : 'Work experience loaded, skills synchronized, and connections indexed!'}
              </p>
              <div className="space-y-3 w-full">
                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/onboarding/assess-skills">
                    Assess Your Skills
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button onClick={() => setStep('select')} variant="outline" className="w-full border-border">
                  Connect Another Account
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          We take your privacy seriously. Your data is encrypted and only used to improve your career insights.
        </p>
      </div>
    </div>
  );
}
