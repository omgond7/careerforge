'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Code2, Zap, Loader2 } from 'lucide-react';

const roles = [
  {
    id: 'frontend',
    title: 'Senior Frontend Engineer',
    company: 'Tech Company',
    description: 'Build scalable web applications with React, TypeScript, and modern tooling',
    salary: '$150k - $220k',
    icon: Code2,
  },
  {
    id: 'backend',
    title: 'Senior Backend Engineer',
    company: 'Tech Company',
    description: 'Design and implement robust server-side systems and APIs',
    salary: '$160k - $240k',
    icon: Briefcase,
  },
  {
    id: 'fullstack',
    title: 'Senior Fullstack Engineer',
    company: 'Tech Company',
    description: 'Work across the entire stack, from frontend to backend and infrastructure',
    salary: '$170k - $260k',
    icon: Zap,
  },
  {
    id: 'product',
    title: 'Product Manager',
    company: 'Tech Company',
    description: 'Lead product strategy, roadmap, and cross-functional collaboration',
    salary: '$140k - $200k',
    icon: Briefcase,
  },
];

export default function SelectRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      const selectedObj = roles.find(r => r.id === selectedRole);
      const targetRoleTitle = selectedObj ? selectedObj.title : 'Senior Frontend Engineer';
      
      const res = await fetch('/api/onboarding/select-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetRole: targetRoleTitle,
          experienceLevel: 5,
        }),
      });

      if (res.ok) {
        router.push('/onboarding/import-wizard');
      }
    } catch (err) {
      console.error('Failed to select target onboarding role:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          What's your target role?
        </h1>
        <p className="text-lg text-muted-foreground">
          Select the role you're aiming for. We'll tailor your learning path accordingly.
        </p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`text-left p-6 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1">
                {role.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {role.company}
              </p>
              <p className="text-sm text-foreground mb-3">
                {role.description}
              </p>
              <p className="text-sm font-medium text-primary">
                {role.salary}
              </p>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="border-border"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button
          disabled={!selectedRole || isLoading}
          onClick={handleContinue}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
