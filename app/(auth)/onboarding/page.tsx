'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Upload, ChevronRight, Check } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons';

const steps = [
  { id: 1, label: 'Data Import', subLabel: 'Resume & Profiles' },
  { id: 2, label: 'Goal Setting', subLabel: 'Target Roles' },
  { id: 3, label: 'Preferences', subLabel: 'Salary & Remote' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    resume: null as File | null,
    linkedinConnected: false,
    githubConnected: false,
    targetRole: '',
    targetCompany: '',
    minSalary: '',
    remotePreference: 'hybrid',
  });

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">C</span>
            </div>
            <span className="font-bold">Career Copilot</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Setting up your Copilot
          </h1>
          <p className="text-muted-foreground">
            We need a few details to tailor the AI to your career trajectory.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold mb-2 transition-colors ${
                      step.id <= currentStep
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border text-foreground'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground text-sm">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.subLabel}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 ${
                      step.id < currentStep
                        ? 'bg-primary'
                        : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border rounded-lg p-8 max-w-2xl mx-auto">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Import your professional data
                </h2>
                <p className="text-muted-foreground">
                  Upload your latest resume or connect external platforms. This gives Career Copilot the context it needs to assist you effectively.
                </p>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Upload Resume
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleResumeUpload}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer block">
                    <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, or TXT (max. 5MB)
                    </p>
                  </label>
                </div>
                {formData.resume && (
                  <p className="text-sm text-primary mt-2">✓ {formData.resume.name} selected</p>
                )}
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-card text-muted-foreground text-sm">
                    OR CONNECT
                  </span>
                </div>
              </div>

              {/* Social Connections */}
              <div className="grid grid-cols-2 gap-4">
                <button className="border-2 border-border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
                  <Linkedin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">LinkedIn Profile</p>
                  <p className="text-xs text-muted-foreground">Import experience</p>
                </button>
                <button className="border-2 border-border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
                  <Github className="w-6 h-6 text-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">GitHub Account</p>
                  <p className="text-xs text-muted-foreground">Import projects</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Set your target role
                </h2>
                <p className="text-muted-foreground">
                  What position are you aiming for? Career Copilot will analyze gaps and create a roadmap to get you there.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.targetRole}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, targetRole: e.target.value }))
                    }
                    placeholder="e.g., Senior Frontend Engineer"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Target Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.targetCompany}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, targetCompany: e.target.value }))
                    }
                    placeholder="e.g., Stripe, Google, Vercel"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Your preferences
                </h2>
                <p className="text-muted-foreground">
                  Help us find the best opportunities aligned with your career goals and lifestyle.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Minimum Salary (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.minSalary}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, minSalary: e.target.value }))
                    }
                    placeholder="e.g., $150,000"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Work Style Preference
                  </label>
                  <div className="space-y-2">
                    {['remote', 'hybrid', 'in-office'].map((option) => (
                      <label
                        key={option}
                        className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      >
                        <input
                          type="radio"
                          name="remote"
                          value={option}
                          checked={formData.remotePreference === option}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              remotePreference: e.target.value,
                            }))
                          }
                          className="w-4 h-4"
                        />
                        <span className="ml-3 font-medium text-foreground capitalize">
                          {option === 'in-office' ? 'In-Office' : option.charAt(0).toUpperCase() + option.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 1}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {currentStep === 3 ? 'Start Using Career Copilot' : 'Continue to Goals'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="text-sm text-primary hover:underline"
          >
            Skip Setup
          </Link>
        </div>
      </div>
    </div>
  );
}
