export const jobAnalysisHistory = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Stripe',
    appliedDate: '2024-06-05',
    analysisDate: '2024-06-05',
    matchScore: 92,
    keyGaps: ['GraphQL', 'AWS'],
    salary: '$170k - $220k',
    location: 'San Francisco, CA',
    status: 'analyzed' as const,
  },
  {
    id: '2',
    jobTitle: 'Lead Product Engineer',
    company: 'Meta',
    appliedDate: '2024-06-01',
    analysisDate: '2024-06-01',
    matchScore: 78,
    keyGaps: ['Python', 'System Design'],
    salary: '$200k - $280k',
    location: 'Remote',
    status: 'analyzed' as const,
  },
  {
    id: '3',
    jobTitle: 'Frontend Software Engineer',
    company: 'Vercel',
    appliedDate: '2024-05-28',
    analysisDate: '2024-05-28',
    matchScore: 88,
    keyGaps: ['Edge Computing'],
    salary: '$150k - $190k',
    location: 'Remote',
    status: 'analyzed' as const,
  },
  {
    id: '4',
    jobTitle: 'Principal Engineer',
    company: 'Google',
    appliedDate: '2024-05-20',
    analysisDate: '2024-05-20',
    matchScore: 65,
    keyGaps: ['Kubernetes', 'C++', 'Distributed Systems'],
    salary: '$220k - $350k',
    location: 'Mountain View, CA',
    status: 'analyzed' as const,
  },
];

export const resumeVersions = [
  {
    id: '1',
    name: 'v4 (Current)',
    version: 4,
    createdDate: '2024-06-08',
    updatedDate: '2024-06-08',
    atsScore: 78,
    status: 'active' as const,
    changes: 'Added AWS experience, updated skills section',
  },
  {
    id: '2',
    name: 'v3 - Tech Focused',
    version: 3,
    createdDate: '2024-05-15',
    updatedDate: '2024-05-15',
    atsScore: 72,
    status: 'archived' as const,
    changes: 'Emphasized technical achievements',
  },
  {
    id: '3',
    name: 'v2 - Leadership Focus',
    version: 2,
    createdDate: '2024-04-20',
    updatedDate: '2024-04-20',
    atsScore: 65,
    status: 'archived' as const,
    changes: 'Highlighted leadership and mentoring',
  },
  {
    id: '4',
    name: 'v1 - Original',
    version: 1,
    createdDate: '2024-03-01',
    updatedDate: '2024-03-01',
    atsScore: 58,
    status: 'archived' as const,
    changes: 'Initial resume creation',
  },
];

export const resumeComparisonData = {
  v4: {
    summary: 'Experienced Frontend Engineer specializing in React and modern web architecture. Proven track record of delivering scalable applications at top tech companies.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'GraphQL', 'AWS', 'PostgreSQL'],
    experience: [
      { company: 'TechNova Solutions', role: 'Frontend Developer', duration: '2020 - Present' },
      { company: 'StartupXYZ', role: 'Junior Developer', duration: '2019 - 2020' },
    ],
  },
  v3: {
    summary: 'Frontend Engineer with expertise in React, building high-performance web applications.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'GraphQL'],
    experience: [
      { company: 'TechNova Solutions', role: 'Frontend Developer', duration: '2020 - Present' },
    ],
  },
};

export const jobAnalysisDetail = {
  jobId: 'stripe-001',
  jobTitle: 'Senior Frontend Engineer',
  company: 'Stripe',
  postedDate: '2024-05-20',
  appliedDate: '2024-06-05',
  analysisDate: '2024-06-05',
  matchScore: 92,
  matchLevel: 'Highly Aligned' as const,
  salary: '$170k - $220k',
  location: 'San Francisco, CA',
  remote: false,
  description: 'We are looking for a Senior Frontend Engineer to join our growing team...',
  requirements: [
    'Strong React and TypeScript experience',
    '5+ years of frontend development',
    'Experience with payment systems',
    'System design knowledge',
    'AWS or similar cloud platform experience',
  ],
  skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'AWS'],
  matchBreakdown: {
    technicalSkills: 95,
    experience: 85,
    softSkills: 88,
    compensation: 92,
  },
  gaps: [
    { skill: 'GraphQL', required: 'Advanced', current: 'Intermediate', priority: 'high' },
    { skill: 'AWS', required: 'Advanced', current: 'Basic', priority: 'high' },
    { skill: 'System Design', required: 'Intermediate', current: 'Beginner', priority: 'medium' },
  ],
  similarRoles: [
    { title: 'Lead Frontend Engineer', company: 'Vercel', match: 88 },
    { title: 'Senior UI Engineer', company: 'Figma', match: 85 },
  ],
};

export const syncResultsData = {
  github: {
    status: 'success' as const,
    timestamp: '2024-06-08T10:30:00Z',
    projectsImported: 12,
    projectsUpdated: 3,
    totalStars: 245,
    contributions: {
      total: 1245,
      thisYear: 450,
      thisMonth: 120,
    },
    topLanguages: [
      { name: 'TypeScript', percentage: 45, projects: 8 },
      { name: 'JavaScript', percentage: 30, projects: 6 },
      { name: 'Python', percentage: 15, projects: 3 },
      { name: 'Go', percentage: 10, projects: 2 },
    ],
    projects: [
      {
        name: 'career-copilot',
        description: 'AI-powered career advisor platform',
        language: 'TypeScript',
        stars: 120,
        forks: 45,
        updated: '2024-06-05',
      },
      {
        name: 'react-components',
        description: 'Reusable React component library',
        language: 'TypeScript',
        stars: 80,
        forks: 23,
        updated: '2024-05-30',
      },
    ],
  },
  linkedin: {
    status: 'success' as const,
    timestamp: '2024-06-08T10:25:00Z',
    profileUpdated: true,
    connectionsCount: 850,
    endorsements: 156,
    recommendations: 12,
    experiences: [
      {
        company: 'TechNova Solutions',
        title: 'Senior Frontend Engineer',
        duration: '2 years 3 months',
        current: true,
      },
      {
        company: 'StartupXYZ',
        title: 'Junior Developer',
        duration: '1 year 2 months',
        current: false,
      },
    ],
    skills: [
      { name: 'React', endorsed: true, count: 45 },
      { name: 'TypeScript', endorsed: true, count: 38 },
      { name: 'Leadership', endorsed: true, count: 28 },
    ],
    recentActivity: [
      { type: 'post', date: '2024-06-05', engagement: 245 },
      { type: 'article', date: '2024-05-28', engagement: 189 },
    ],
  },
};

export const notificationData = [
  {
    id: '1',
    type: 'achievement' as const,
    title: 'New Target Role Analysis',
    message: 'Your Senior Frontend Engineer analysis at Stripe is ready',
    timestamp: '2024-06-08T10:30:00Z',
    read: false,
    icon: 'Target',
  },
  {
    id: '2',
    type: 'application' as const,
    title: 'Application Status Update',
    message: 'Meta moved your application to screening round',
    timestamp: '2024-06-07T14:22:00Z',
    read: false,
    icon: 'Briefcase',
  },
  {
    id: '3',
    type: 'skill' as const,
    title: 'GraphQL Course Recommended',
    message: 'Complete this course to increase your match score by 8%',
    timestamp: '2024-06-07T09:15:00Z',
    read: true,
    icon: 'Zap',
  },
  {
    id: '4',
    type: 'interview' as const,
    title: 'Interview Prep Session Available',
    message: 'New mock interview scheduled for tomorrow at 2 PM',
    timestamp: '2024-06-06T16:45:00Z',
    read: true,
    icon: 'Mic2',
  },
  {
    id: '5',
    type: 'insight' as const,
    title: 'Weekly Career Insights',
    message: '5 new relevant job opportunities matching your profile',
    timestamp: '2024-06-05T12:00:00Z',
    read: true,
    icon: 'Brain',
  },
];

export const userProfileData = {
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  title: 'Senior Frontend Engineer',
  location: 'San Francisco, CA',
  timezone: 'PST (UTC-7)',
  bio: 'Passionate about building beautiful, scalable web applications.',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  joinDate: '2024-03-01',
  targetRole: 'Senior Frontend Engineer @ Stripe',
  recentActivity: 'Analyzed job at Stripe',
  stats: {
    jobsAnalyzed: 24,
    applicationsSubmitted: 9,
    interviewsPrepared: 15,
    skillsGained: 8,
  },
};

export const securitySettingsData = {
  password: {
    lastChanged: '2024-04-15',
    strength: 'Strong',
  },
  twoFactor: {
    enabled: true,
    method: 'Authenticator App',
    verified: true,
  },
  sessions: [
    {
      id: '1',
      device: 'Chrome on MacOS',
      location: 'San Francisco, CA',
      lastActive: '2024-06-08T10:30:00Z',
      current: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      lastActive: '2024-06-08T08:15:00Z',
      current: false,
    },
  ],
  connectedApps: [
    { name: 'GitHub', connected: true, connectedDate: '2024-05-20' },
    { name: 'LinkedIn', connected: true, connectedDate: '2024-06-01' },
  ],
};

export const interviewSessionData = [
  {
    id: '1',
    company: 'Stripe',
    type: 'System Design',
    difficulty: 'Hard',
    date: '2024-06-10',
    duration: 45,
    score: 78,
    feedback: 'Good architectural thinking, need to improve API design',
    topics: ['Microservices', 'Database Design', 'Caching'],
  },
  {
    id: '2',
    company: 'Meta',
    type: 'Behavioral',
    difficulty: 'Medium',
    date: '2024-06-05',
    duration: 30,
    score: 85,
    feedback: 'Excellent STAR method usage, strong communication',
    topics: ['Leadership', 'Conflict Resolution', 'Project Management'],
  },
];

export const mockInterviewResult = {
  sessionId: 'mock-001',
  date: '2024-06-08',
  type: 'System Design',
  difficulty: 'Hard',
  duration: 45,
  question: 'Design a real-time notification system for a social media platform',
  score: 78,
  percentile: 72,
  breakdown: {
    problemUnderstanding: 85,
    solutionDesign: 78,
    codeQuality: 72,
    communication: 80,
    timeManagement: 75,
  },
  feedback: [
    'Strong understanding of the problem space',
    'Good architectural choices for real-time systems',
    'Could optimize database queries further',
    'Excellent communication throughout',
  ],
  improvements: [
    'Study more about message queue systems (RabbitMQ, Kafka)',
    'Practice estimating system capacity and scalability',
    'Work on database optimization techniques',
  ],
};

export const skillDetailData = {
  skillId: 'graphql',
  name: 'GraphQL',
  category: 'Backend',
  proficiency: 'Intermediate',
  endorsements: 12,
  yearsOfExperience: 1.5,
  projects: ['career-copilot', 'react-ecommerce'],
  courses: [
    { name: 'Advanced GraphQL Course', platform: 'Frontend Masters', status: 'In Progress' },
    { name: 'GraphQL The Complete Guide', platform: 'Udemy', status: 'Completed' },
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
};

export const roadmapMilestoneDetail = {
  milestoneId: 'graphql-mastery',
  week: 1,
  title: 'Master GraphQL',
  status: 'in-progress' as const,
  progress: 45,
  startDate: '2024-06-03',
  estimatedEndDate: '2024-06-10',
  estimatedHours: 10,
  actualHours: 4.5,
  description: 'Address primary skill gap identified in job description parsing.',
  learningObjectives: [
    'Understand GraphQL schema design and best practices',
    'Master Apollo Client and server-side implementation',
    'Learn about subscriptions and real-time updates',
    'Implement error handling and authentication',
  ],
  resources: [
    {
      type: 'course',
      title: 'Advanced GraphQL Course',
      platform: 'Frontend Masters',
      duration: '6 hours',
      link: '#',
    },
    {
      type: 'documentation',
      title: 'Apollo Client Documentation',
      platform: 'Official Docs',
      duration: 'Self-paced',
      link: '#',
    },
    {
      type: 'project',
      title: 'GraphQL Data Dashboard',
      description: 'Build a dashboard using GraphQL subscriptions',
      duration: '4 hours',
      link: '#',
    },
  ],
  completedTasks: [
    { title: 'Watch GraphQL fundamentals videos', completed: true, date: '2024-06-04' },
    { title: 'Read Apollo Client docs', completed: true, date: '2024-06-05' },
  ],
  remainingTasks: [
    { title: 'Build a GraphQL API project', completed: false },
    { title: 'Practice complex queries and mutations', completed: false },
    { title: 'Learn about caching strategies', completed: false },
  ],
};

export const companyIntelligenceDetail = {
  companyId: 'stripe',
  name: 'Stripe',
  website: 'stripe.com',
  founded: 2010,
  headquarters: 'San Francisco, CA',
  employeeCount: '14,000+',
  funding: '$36B Series H',
  description: 'Stripe is the global payments and financial infrastructure platform.',
  culture: {
    rating: 4.7,
    benefits: ['Competitive salary', 'Remote work', 'Professional development', 'Health insurance'],
    workLifeBalance: 4.5,
    growthOpportunities: 4.8,
  },
  hiring: {
    openRoles: 45,
    topRoles: ['Frontend Engineer', 'Backend Engineer', 'Product Manager'],
    averageHiringTime: '30 days',
  },
  employees: [
    { name: 'Patrick Collison', role: 'CEO & Co-founder', department: 'Executive' },
    { name: 'John Collison', role: 'President & Co-founder', department: 'Executive' },
  ],
  recentNews: [
    { title: 'Stripe launches new payments API', date: '2024-06-01', type: 'feature' },
    { title: 'Stripe raises $36B in Series H', date: '2024-05-15', type: 'funding' },
  ],
  salaryRanges: [
    { role: 'Frontend Engineer', range: '$150k - $220k' },
    { role: 'Senior Engineer', range: '$220k - $300k' },
  ],
};

export const searchEmptyState = {
  query: 'solidity programming',
  suggestions: [
    'Web3 Development',
    'Blockchain Engineering',
    'Smart Contracts',
    'Cryptocurrency',
  ],
  recentSearches: ['React', 'TypeScript', 'GraphQL'],
  popularSearches: ['Frontend Engineer', 'System Design', 'Leadership'],
};
