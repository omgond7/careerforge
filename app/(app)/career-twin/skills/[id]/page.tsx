'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Users, Award, Loader2 } from 'lucide-react';
import { MetricCard, MatchScoreCard } from '@/components/cards';

import { use } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function SkillDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { data: userSkills, isLoading } = useSWR('/api/user/skills', fetcher);

  const userSkill = userSkills?.find((us: any) => 
    us.id === id || 
    us.skillId === id || 
    us.skill?.name?.toLowerCase() === id?.toLowerCase()
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const skill = userSkill ? {
    name: userSkill.skill.name,
    category: userSkill.skill.category || 'Backend',
    proficiency: userSkill.level === 'BEGINNER' ? 'Beginner' : userSkill.level === 'INTERMEDIATE' ? 'Intermediate' : userSkill.level === 'ADVANCED' ? 'Advanced' : 'Expert',
    endorsements: 12,
    yearsOfExperience: userSkill.yearsUsed || 1.5,
    projects: ['career-copilot', 'react-ecommerce'],
    courses: [
      { name: `Advanced ${userSkill.skill.name} Course`, platform: 'Frontend Masters', status: 'In Progress' },
      { name: `${userSkill.skill.name} The Complete Guide`, platform: 'Udemy', status: 'Completed' },
    ],
    jobMatches: 24,
    relevantJobs: [
      { title: 'Senior Frontend Engineer', company: 'Stripe', match: 92 },
      { title: 'Lead Full Stack Engineer', company: 'GitHub', match: 88 },
    ],
    relatedSkills: [
      { name: 'REST APIs', proficiency: 'Advanced', relevance: 'high' },
      { name: 'Apollo Client', proficiency: 'Advanced', relevance: 'high' },
      { name: 'Node.js', proficiency: 'Intermediate', relevance: 'medium' },
    ],
  } : {
    name: id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Technology',
    category: 'Development',
    proficiency: 'Intermediate',
    endorsements: 5,
    yearsOfExperience: 2.0,
    projects: ['Personal Portfolio'],
    courses: [
      { name: `Complete Guide to ${id}`, platform: 'Udemy', status: 'Completed' },
    ],
    jobMatches: 10,
    relevantJobs: [
      { title: 'Software Engineer', company: 'Tech Corp', match: 85 },
    ],
    relatedSkills: [
      { name: 'Software Design', proficiency: 'Advanced', relevance: 'high' },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/career-twin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{skill.name}</h1>
          <p className="text-lg text-muted-foreground">{skill.category} • {skill.yearsOfExperience} years experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MatchScoreCard
            title="Proficiency"
            score={
              skill.proficiency === 'Beginner'
                ? 33
                : skill.proficiency === 'Intermediate'
                ? 66
                : 100
            }
            subtitle={skill.proficiency}
            size="sm"
          />
          <MetricCard
            title="Endorsements"
            value={skill.endorsements}
            subtitle="From connections"
            icon={<Award className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Job Matches"
            value={skill.jobMatches}
            subtitle="Open positions"
            icon={<Briefcase className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Related Skills"
            value={skill.relatedSkills.length}
            subtitle="Complement this skill"
            icon={<Users className="h-5 w-5 text-primary" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Courses</h3>
            <div className="space-y-3">
              {skill.courses.map((course) => (
                <div key={course.name} className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-medium text-foreground text-sm">{course.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{course.platform}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Projects</h3>
            <ul className="space-y-2">
              {skill.projects.map((project) => (
                <li key={project} className="flex gap-2 items-center text-sm text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {project}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Matching Roles</h3>
          <div className="space-y-3">
            {skill.relevantJobs.map((job) => (
              <div key={job.title} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground text-sm">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                </div>
                <span className="font-bold text-primary">{job.match}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={`/career-twin/roadmap`}>
              Build Learning Path
            </Link>
          </Button>
          <Button variant="outline" className="border-border">
            Find Courses
          </Button>
        </div>
      </div>
    </div>
  );
}
