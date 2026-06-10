# Screens Navigation Guide

## Quick Access Routes

### Analytics & History
- **/job-intelligence/history** - View all job analyses
- **/interview-prep/history** - Interview session history
- **/resume-studio/versions** - Resume version management
- **/resume-studio/compare** - Compare resume versions

### Detail Pages
- **/job-intelligence/[id]** - Single job analysis details
- **/interview-prep/results/[id]** - Interview result details
- **/career-twin/skills/[id]** - Skill proficiency details
- **/career-twin/roadmap/[id]** - Milestone details

### Onboarding & Integration
- **/onboarding/import-wizard** - Connect GitHub/LinkedIn
- **/settings/integrations/github-sync-results** - GitHub sync details
- **/settings/integrations/linkedin-sync-results** - LinkedIn sync details

### User Settings
- **/settings/profile** - Edit profile information
- **/settings/security** - Security & privacy settings
- **/settings/subscription/upgrade** - Upgrade plan

### Communication & Discovery
- **/notifications** - Notification center
- **/search** - Global search
- **/copilot** - AI career assistant

## Component Usage Examples

### MetricCard
```tsx
<MetricCard
  title="Total Analyses"
  value={12}
  subtitle="This month"
  icon={<Award className="h-5 w-5 text-primary" />}
/>
```

### MatchScoreCard
```tsx
<MatchScoreCard
  title="Match Score"
  score={85}
  subtitle="Senior Engineer Role"
  size="lg"
/>
```

### ATSScoreCard
```tsx
<ATSScoreCard
  score={78}
  missingKeywords={['Leadership', 'Agile']}
  onOptimize={() => {}}
/>
```

### JobCard
```tsx
<JobCard
  title="Senior Frontend Engineer"
  company="Stripe"
  location="San Francisco, CA"
  salaryRange={{ min: 170, max: 220 }}
  matchScore={92}
  matchLevel="Highly Aligned"
  skills={['React', 'TypeScript', 'GraphQL']}
  onAnalyze={() => {}}
  onViewDetails={() => {}}
/>
```

### ApplicationCard
```tsx
<ApplicationCard
  company="Meta"
  position="Senior Engineer"
  status="screening"
  appliedDate="2024-06-01"
  matchScore={78}
/>
```

### RoadmapCard
```tsx
<RoadmapCard
  week={1}
  title="Master GraphQL"
  status="in-progress"
  estimatedHours={10}
  gap="Skill gap in modern APIs"
  resources={['Course URL', 'Documentation']}
  onStartLearning={() => {}}
/>
```

### InsightCard
```tsx
<InsightCard
  type="insight"
  title="Skill Recommendation"
  description="GraphQL expertise will increase your match score by 8%"
  actionLabel="Start Learning"
  onAction={() => {}}
  icon={<Zap className="h-5 w-5" />}
/>
```

## Mock Data Access

All mock data is available from `@/lib/mock-data.ts`:

```tsx
import {
  jobAnalysisHistory,
  resumeVersions,
  jobAnalysisDetail,
  syncResultsData,
  notificationData,
  userProfileData,
  securitySettingsData,
  interviewSessionData,
  mockInterviewResult,
  skillDetailData,
  roadmapMilestoneDetail,
  searchEmptyState
} from '@/lib/mock-data';
```

## Design Token Reference

### Colors
```css
--primary: #6B5BCC /* Purple */
--primary-foreground: #FFFFFF
--background: #0A0A0A /* Dark */
--foreground: #FFFFFF
--card: #1A1A1A
--border: #2A2A2A
--muted: #404040
--muted-foreground: #9CA3AF
--destructive: #EF4444
--input: #262626
```

### Spacing Scale
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- base: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### Border Radius
- Default: `rounded-lg` (0.625rem)
- Small: `rounded` (0.25rem)
- Full: `rounded-full`

## Styling Patterns

### Cards
```tsx
<div className="bg-card border border-border rounded-lg p-6">
  {/* Content */}
</div>
```

### Buttons
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Action
</Button>

<Button variant="outline" className="border-border">
  Secondary
</Button>
```

### Forms
```tsx
<input
  type="text"
  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
/>
```

### Grids
```tsx
{/* 4 column on large screens, 2 on tablet, 1 on mobile */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Grid items */}
</div>
```

### Flex Layouts
```tsx
{/* Space between items */}
<div className="flex items-center justify-between gap-4">
  {/* Items */}
</div>
```

## Performance Tips

1. Use dynamic imports for heavy components:
```tsx
const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <LoadingState />
});
```

2. Memoize expensive calculations:
```tsx
const memoizedValue = useMemo(() => expensiveCalc(data), [data]);
```

3. Use SWR for data fetching:
```tsx
const { data } = useSWR('/api/endpoint', fetcher);
```

## Common Patterns

### Loading States
```tsx
{isLoading && (
  <div className="flex items-center justify-center py-12">
    <Loader className="animate-spin w-6 h-6 text-primary" />
  </div>
)}
```

### Empty States
```tsx
{items.length === 0 && (
  <div className="text-center py-12">
    <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
    <p className="text-muted-foreground">No items found</p>
  </div>
)}
```

### Status Badges
```tsx
<span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
  status === 'success' ? 'bg-primary/10 text-primary' :
  status === 'error' ? 'bg-destructive/10 text-destructive' :
  'bg-muted text-muted-foreground'
}`}>
  {status}
</span>
```

### Hover Effects
```tsx
<div className="hover:shadow-lg hover:border-primary/50 transition-all">
  {/* Content */}
</div>
```

## Testing Routes

Visit these routes to see all screens in action:
1. `/job-intelligence/history` - Job analysis list
2. `/resume-studio/versions` - Resume versions
3. `/notifications` - Notification center
4. `/settings/profile` - Profile settings
5. `/interview-prep/history` - Interview history
6. `/search` - Global search
7. `/copilot` - AI chat assistant
8. `/onboarding/import-wizard` - Integration setup

## Customization Guide

### Changing Colors
Edit `/app/globals.css` and update the CSS custom properties in the `:root` selector.

### Adjusting Typography
Modify font sizes in `layout.tsx` and update Tailwind `@theme` in `globals.css`.

### Adding New Screens
1. Create route directory: `app/(app)/feature/page.tsx`
2. Import reusable components from `@/components/`
3. Use mock data from `@/lib/mock-data.ts`
4. Follow existing styling patterns
5. Test responsive design on mobile

## API Integration Checklist

When connecting to real APIs:
- [ ] Replace mock data with API calls using SWR
- [ ] Add loading and error states
- [ ] Implement proper error handling
- [ ] Add form validation
- [ ] Test with various data sizes
- [ ] Optimize queries for performance
- [ ] Add pagination where needed
- [ ] Cache frequently accessed data
