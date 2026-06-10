# 🎨 Career Twin Component Library

A comprehensive, reusable component system for the Career Twin application built with TypeScript, React, and Tailwind CSS.

## 📊 Library Overview

This component library consists of **14 core components** organized into 5 categories:

- **9 Card Components** - Display various types of data and information
- **1 Badge Component** - Lightweight skill/tag elements
- **2 Chart Components** - Data visualization
- **1 Resume Component** - Professional resume display
- **1 Table Component** - Structured data presentation

## 🚀 Quick Start

### Import All Components
```tsx
import {
  MetricCard,
  InsightCard,
  MatchScoreCard,
  ATSScoreCard,
  JobCard,
  RoadmapCard,
  ApplicationCard,
  TimelineCard,
  InterviewCard,
  SkillBadge,
  SkillRadar,
  KnowledgeGraph,
  ResumePreview,
  GapTable,
} from '@/components';
```

### Import by Category
```tsx
// Cards
import {
  MetricCard,
  MatchScoreCard,
  InsightCard,
} from '@/components/cards';

// Badges
import { SkillBadge } from '@/components/badges';

// Charts
import { SkillRadar, KnowledgeGraph } from '@/components/charts';

// Resume
import { ResumePreview } from '@/components/resume/resume-preview';

// Table
import { GapTable } from '@/components/table';
```

## 📚 Component Catalog

### Card Components (`/components/cards/`)

#### 1. **MetricCard**
Display a metric with title, value, and optional subtitle/trend.

**Props:**
- `title` (string) - Card title
- `value` (string | number) - Main metric value
- `subtitle?` (string) - Subtitle text
- `trend?` ({ value: number; direction: 'up' | 'down' }) - Trend indicator
- `icon?` (ReactNode) - Icon to display
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<MetricCard
  title="Career Health"
  value="85%"
  subtitle="Profile Completeness"
  trend={{ value: 12, direction: 'up' }}
  icon={<TrendingUp className="h-5 w-5" />}
/>
```

#### 2. **InsightCard**
Display insights, tips, or warnings with contextual styling.

**Props:**
- `title` (string) - Insight title
- `description` (string) - Description text
- `type?` ('insight' | 'warning' | 'tip') - Card type (default: 'insight')
- `actionLabel?` (string) - Action button text
- `onAction?` (() => void) - Action callback
- `icon?` (ReactNode) - Custom icon
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<InsightCard
  type="warning"
  title="Missing Skills"
  description="You need GraphQL expertise to qualify for senior roles."
  actionLabel="Start Learning"
  onAction={() => navigate('/learning')}
/>
```

#### 3. **MatchScoreCard**
Circular progress visualization for match scores.

**Props:**
- `title` (string) - Card title
- `score` (number) - Score value (0-100)
- `description?` (string) - Description text
- `subtitle?` (string) - Subtitle text
- `size?` ('sm' | 'md' | 'lg') - Circle size (default: 'md')
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<MatchScoreCard
  title="Career Twin Match"
  score={75}
  size="lg"
  description="Your alignment with the target role"
/>
```

#### 4. **ATSScoreCard**
ATS resume optimization score with missing keywords.

**Props:**
- `score` (number) - ATS score (0-100)
- `maxScore?` (number) - Maximum score (default: 100)
- `missingKeywords?` (string[]) - List of missing keywords
- `onOptimize?` (() => void) - Optimize button callback
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<ATSScoreCard
  score={72}
  missingKeywords={['GraphQL', 'Docker']}
  onOptimize={() => handleOptimization()}
/>
```

#### 5. **JobCard**
Display job listing with match score and skills.

**Props:**
- `company` (string) - Company name
- `logo?` (string) - Company logo URL
- `title` (string) - Job title
- `location?` (string) - Job location
- `salaryRange?` ({ min: number; max: number }) - Salary range in thousands
- `matchScore?` (number) - Match percentage
- `matchLevel?` (string) - Match level description
- `skills?` (string[]) - Required skills
- `description?` (string) - Job description
- `onAnalyze?` (() => void) - AI analysis callback
- `onViewDetails?` (() => void) - View details callback
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<JobCard
  company="TechCorp"
  title="Senior Engineer"
  location="Remote"
  salaryRange={{ min: 120, max: 160 }}
  matchScore={85}
  skills={['React', 'TypeScript', 'Node.js']}
  onAnalyze={() => analyzeJob()}
/>
```

#### 6. **RoadmapCard**
Learning milestone with status and resources.

**Props:**
- `week` (number) - Week number
- `title` (string) - Milestone title
- `status` ('completed' | 'in-progress' | 'not-started') - Status
- `estimatedHours?` (number) - Estimated hours
- `skills?` (string[]) - Skills to learn
- `gap?` (string) - Gap description
- `tasks?` (RoadmapTaskProps[]) - Tasks list
- `resources?` (string[]) - Learning resources
- `onViewDetails?` (() => void) - View details callback
- `onStartLearning?` (() => void) - Start learning callback
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<RoadmapCard
  week={1}
  title="Master GraphQL"
  status="in-progress"
  estimatedHours={10}
  resources={['Course: Advanced GraphQL', 'Apollo Docs']}
  onStartLearning={() => navigate('/learn/graphql')}
/>
```

#### 7. **ApplicationCard**
Track job application status.

**Props:**
- `company` (string) - Company name
- `position` (string) - Position title
- `logo?` (string) - Company logo URL
- `status` ('applied' | 'screening' | 'interview' | 'offer' | 'rejected') - Application status
- `appliedDate?` (string) - Date applied
- `nextAction?` (string) - Next action description
- `nextActionDate?` (string) - Next action date
- `matchScore?` (number) - Match percentage
- `onUpdateStatus?` (() => void) - Update status callback
- `onViewDetails?` (() => void) - View details callback
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<ApplicationCard
  company="Stripe"
  position="Senior Backend Engineer"
  status="interview"
  appliedDate="Jan 15, 2024"
  nextAction="System Design Interview"
  nextActionDate="Jan 25, 2024"
  matchScore={92}
/>
```

#### 8. **TimelineCard**
Timeline visualization for objectives.

**Props:**
- `objective` (string) - Objective title
- `month?` (number) - Month number
- `tasks` (TimelineTaskProps[]) - Tasks array
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<TimelineCard
  objective="Backend Mastery"
  month={1}
  tasks={[
    { label: 'GraphQL', duration: '2 weeks' },
    { label: 'Database Design', duration: '1 week' },
  ]}
/>
```

#### 9. **InterviewCard**
Interview practice session selector.

**Props:**
- `title` (string) - Interview title
- `company` (string) - Company name
- `type` ('voice' | 'text' | 'live') - Interview type
- `description?` (string) - Description
- `topic?` (string) - Interview topic
- `difficulty?` (string) - Difficulty level
- `estimatedTime?` (number) - Estimated time in minutes
- `onStart?` (() => void) - Start interview callback
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<InterviewCard
  title="System Design Interview"
  company="Google"
  type="live"
  difficulty="hard"
  estimatedTime={60}
  onStart={() => startInterview()}
/>
```

### Badge Component

#### **SkillBadge**
Reusable skill/tag badge with variants.

**Props:**
- `label` (string) - Badge text
- `proficiency?` (number) - Proficiency percentage
- `removable?` (boolean) - Show remove button
- `onRemove?` (() => void) - Remove callback
- `addable?` (boolean) - Show add button
- `onAdd?` (() => void) - Add callback
- `variant?` ('default' | 'outline' | 'secondary' | 'success') - Badge variant
- `size?` ('sm' | 'md' | 'lg') - Badge size
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<SkillBadge
  label="React"
  proficiency={85}
  removable
  onRemove={() => removeSkill('React')}
/>
```

### Chart Components

#### **SkillRadar**
Radar chart for skill proficiency visualization.

**Props:**
- `data` (SkillData[]) - Data array with category, value, fullMark
- `title?` (string) - Chart title
- `height?` (number) - Chart height (default: 300)
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<SkillRadar
  title="Skill Distribution"
  data={[
    { category: 'Frontend', value: 85, fullMark: 100 },
    { category: 'Backend', value: 70, fullMark: 100 },
    { category: 'DevOps', value: 60, fullMark: 100 },
  ]}
/>
```

#### **KnowledgeGraph**
Interactive node-based knowledge graph.

**Props:**
- `nodes` (Node[]) - Graph nodes with position and type
- `title?` (string) - Graph title
- `onNodeClick?` ((node: Node) => void) - Node click callback
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<KnowledgeGraph
  title="Professional Network"
  nodes={[
    { id: 'me', label: 'Me', x: 200, y: 150, type: 'center' },
    { id: 'react', label: 'React', x: 100, y: 50, type: 'skill' },
  ]}
  onNodeClick={(node) => selectNode(node)}
/>
```

### Resume Component

#### **ResumePreview**
Professional resume preview.

**Props:**
- `name` (string) - Full name
- `title?` (string) - Job title
- `email?` (string) - Email address
- `location?` (string) - Location
- `linkedinUrl?` (string) - LinkedIn profile URL
- `summary?` (string) - Professional summary
- `experience?` (ExperienceItem[]) - Experience list
- `skills?` (string[]) - Skills list
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<ResumePreview
  name="John Doe"
  title="Senior Engineer"
  email="john@example.com"
  summary="Experienced full-stack engineer..."
  experience={[
    {
      company: 'TechCorp',
      role: 'Senior Engineer',
      date: '2020-Present',
    },
  ]}
  skills={['React', 'TypeScript', 'Node.js']}
/>
```

### Table Component

#### **GapTable**
Data table with severity indicators.

**Props:**
- `rows` (GapTableRow[]) - Table rows
- `title?` (string) - Table title
- `className?` (string) - Additional CSS classes

**Example:**
```tsx
<GapTable
  title="Skill Gaps"
  rows={[
    {
      type: 'Skill',
      requirement: 'GraphQL',
      yourStatus: 'Beginner',
      severity: 'high',
      actionPlan: 'Complete course',
    },
  ]}
/>
```

## 🎯 Usage Patterns

### Pattern 1: Metric Display
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <MetricCard title="Applications" value={24} />
  <MetricCard title="Interviews" value={3} />
  <MetricCard title="Offers" value={1} />
  <MetricCard title="Conversion" value="42%" />
</div>
```

### Pattern 2: Score Display
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <MatchScoreCard title="Current" score={65} size="lg" />
  <MatchScoreCard title="Potential" score={75} size="lg" />
  <MatchScoreCard title="Target" score={85} size="lg" />
</div>
```

### Pattern 3: List Display
```tsx
<div className="space-y-4">
  {applications.map((app) => (
    <ApplicationCard
      key={app.id}
      company={app.company}
      position={app.position}
      status={app.status}
    />
  ))}
</div>
```

### Pattern 4: Insights
```tsx
<div className="space-y-4">
  <InsightCard
    type="warning"
    title="Missing Skills"
    description="You need GraphQL expertise."
  />
  <InsightCard
    type="tip"
    title="Recommended Action"
    description="Complete the GraphQL course."
  />
</div>
```

## 🎨 Design Tokens

All components use semantic design tokens from `globals.css`:

- **Colors**: `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`
- **Spacing**: Tailwind spacing scale (p-4, m-2, gap-6, etc.)
- **Border Radius**: Rounded corners (rounded-lg, rounded-full)
- **Transitions**: Smooth transitions on hover/active states

## ♿ Accessibility

All components follow accessibility best practices:

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Color contrast compliance
- Focus management

## 📈 Performance

- Lazy-loaded components
- Optimized SVG rendering
- Minimal re-renders
- Efficient event handling
- CSS module scoping

## 🔄 Integration Examples

### With useCareerStore
```tsx
const { targetRole } = useCareerStore();

<MatchScoreCard
  title="Career Twin Match"
  score={targetRole.currentMatch}
  description={`Target: ${targetRole.targetMatch}%`}
/>
```

### With React State
```tsx
const [expanded, setExpanded] = useState(false);

<JobCard
  {...job}
  onViewDetails={() => setExpanded(!expanded)}
/>
```

### With API Calls
```tsx
<ATSScoreCard
  score={atsScore}
  onOptimize={async () => {
    await optimizeResume();
    fetchATSScore();
  }}
/>
```

## 📦 Dependencies

- **React** 19.2+
- **TypeScript** 5.0+
- **Tailwind CSS** v4
- **Lucide React** for icons
- **Recharts** for data visualization

## 🤝 Contributing

When adding new components:

1. Create component file in appropriate directory
2. Add props interface with JSDoc comments
3. Export from category index file
4. Update main components/index.ts
5. Add examples to this documentation

## 📝 License

Part of the Career Twin application.
