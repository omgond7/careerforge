'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, BrainCircuit, CheckCircle2, Loader2 } from 'lucide-react';

const quizQuestions = [
  {
    id: 1,
    question: 'How would you rate your expertise in large-scale system state management (e.g. Redux Toolkit, Zustand, Context API)?',
    options: [
      { key: 'beginner', label: 'Beginner', desc: 'Can use basic stores, but struggle with optimization or structure.' },
      { key: 'intermediate', label: 'Intermediate', desc: 'Comfortable structuring stores, slices, and optimizing re-renders.' },
      { key: 'expert', label: 'Expert', desc: 'Can design enterprise-grade custom state syncing and offline-first stores.' },
    ],
  },
  {
    id: 2,
    question: 'Which best describes your experience with CSS architectures and modern responsive UI frameworks?',
    options: [
      { key: 'vanilla', label: 'Tailwind / Vanilla CSS', desc: 'Focus mostly on classes and styling simple layouts.' },
      { key: 'frameworks', label: 'CVA / Shadcn / Radix', desc: 'Familiar with headless primitives, custom styling, and layout tokens.' },
      { key: 'advanced', label: 'CSS-in-JS & Framer Motion', desc: 'Deep knowledge of complex micro-animations, physics-based transits, performance.' },
    ],
  },
  {
    id: 3,
    question: 'How comfortable are you designing APIs, server components, and server-side logic in Next.js/Node.js?',
    options: [
      { key: 'client', label: 'Client Focus', desc: 'Mostly handle fetch calls and client components.' },
      { key: 'fullstack', label: 'Fullstack Able', desc: 'Can build route handlers, configure middleware, and query database models.' },
      { key: 'architect', label: 'Architect Level', desc: 'Optimize streaming rendering, design complex caching headers, and scale database schemas.' },
    ],
  },
];

export default function AssessSkillsPage() {
  const router = useRouter();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const question = quizQuestions[currentQuestionIdx];

  const handleSelectOption = (key: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: key }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await fetch('/api/onboarding/step', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'COMPLETE',
        }),
      });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      router.push('/dashboard');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg p-8 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">Skills Assessment</span>
          </div>
          <span className="text-xs text-muted-foreground font-semibold">
            {isFinished ? 'Finished' : `Question ${currentQuestionIdx + 1} of ${quizQuestions.length}`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${isFinished ? 100 : ((currentQuestionIdx + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>

        {!isFinished ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground leading-snug">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => handleSelectOption(option.key)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-muted/10 hover:border-primary/45'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                      isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    }`}>
                      {isSelected && <span className="text-[10px]">✓</span>}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{option.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 pt-4 border-t border-border/60">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestionIdx > 0) {
                    setCurrentQuestionIdx(currentQuestionIdx - 1);
                  } else {
                    router.back();
                  }
                }}
                className="border-border"
              >
                Back
              </Button>
              <Button
                disabled={!answers[question.id]}
                onClick={handleNext}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {currentQuestionIdx === quizQuestions.length - 1 ? 'Analyze Skillset' : 'Next Question'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Twin Assessment Completed</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                We've successfully updated your Career Twin matching criteria based on your state management, UI architecture, and API responses.
              </p>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <Button onClick={handleFinish} disabled={isFinishing} className="w-full flex items-center justify-center gap-2">
                {isFinishing && <Loader2 className="w-4 h-4 animate-spin" />}
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
