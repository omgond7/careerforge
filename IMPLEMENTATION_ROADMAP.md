# CareerForge SaaS - Implementation Roadmap

**Generated:** 2025-01-10
**Status:** Ready for Implementation

---

## EXECUTIVE SUMMARY

This roadmap transforms CareerForge from a development prototype to a production-ready SaaS. The primary focus is removing OpenAI dependency, migrating to Gemini 2.5 Flash with OpenRouter DeepSeek fallback, and implementing production-grade security and performance optimizations.

**Estimated Timeline:** 3-4 days of focused work
**Critical Path:** AI Migration → Security → Rate Limiting → Database

---

## PHASE 1: AUDIT ✅ COMPLETE

**Status:** Completed
**Deliverable:** Comprehensive audit document
**Findings:** See HANDOFF_DOCUMENT.md

---

## PHASE 2: AI MIGRATION (CRITICAL - DO FIRST)

**Priority:** CRITICAL
**Estimated Time:** 4-6 hours
**Dependencies:** None

### Tasks

#### 2.1 Install Dependencies
- Install `@google/generative-ai`
- Install `openrouter` SDK
- Remove `openai` from package.json

#### 2.2 Create AI Provider Abstraction
**File:** `lib/ai-provider.ts` (NEW)
```typescript
- Interface: AIProvider
- Classes: GeminiProvider, OpenRouterProvider
- Retry logic with exponential backoff
- Timeout handling (30s)
- Structured error handling
- Usage tracking
- Automatic fallback mechanism
```

#### 2.3 Update Environment Variables
**File:** `.env.example`
- Add: GEMINI_API_KEY, GEMINI_MODEL
- Add: OPENROUTER_API_KEY, OPENROUTER_MODEL
- Remove: OPENAI_API_KEY, OPENAI_MODEL

#### 2.4 Replace OpenAI in API Routes (10 files)
1. `lib/openai.ts` → DELETE
2. `app/api/copilot/route.ts` → Use new AI provider
3. `app/api/jobs/analyze/route.ts` → Use new AI provider
4. `app/api/resume/generate/route.ts` → Use new AI provider
5. `app/api/resume/upload/route.ts` → Use new AI provider
6. `app/api/interview/route.ts` → Use new AI provider
7. `app/api/interview/[id]/submit/route.ts` → Use new AI provider
8. `app/api/company/[name]/route.ts` → Use new AI provider
9. `app/api/resume/[id]/ats-score/route.ts` → Use new AI provider
10. `app/api/roadmap/route.ts` → Use new AI provider

#### 2.5 Testing
- Test all AI endpoints with Gemini
- Test fallback to DeepSeek
- Verify streaming works
- Check usage tracking

**Success Criteria:**
- All AI endpoints work with Gemini
- Fallback to DeepSeek works when Gemini fails
- No OpenAI references remain
- Usage tracking functional

---

## PHASE 3: SECURITY (CRITICAL)

**Priority:** CRITICAL
**Estimated Time:** 4-5 hours
**Dependencies:** Phase 2 complete

### Tasks

#### 3.1 Enhance Rate Limiting
**File:** `lib/rate-limiter.ts` (NEW)
- Sliding window algorithm
- Per-IP limits
- Per-user limits
- Daily generation limits
- Tier-based limits (FREE vs PRO)
- Abuse detection heuristics

#### 3.2 Add Rate Limiting to All Endpoints
- Auth endpoints: register, login, forgot-password, reset-password
- AI endpoints: all 10 AI routes
- API endpoints: all mutations

#### 3.3 Input Validation
**File:** `lib/validation.ts` (NEW)
- Zod schemas for all API routes
- Request size limits
- File type validation
- SQL injection prevention
- XSS prevention

#### 3.4 Security Headers
**File:** `next.config.mjs`
- Content-Security-Policy
- X-Frame-Options (already present)
- X-Content-Type-Options (already present)
- Strict-Transport-Security
- Permissions-Policy (already present)

#### 3.5 CSRF Protection
- Implement CSRF tokens for state-changing requests
- Validate CSRF tokens on mutations

#### 3.6 Remove Mock Redis
**File:** `lib/redis.ts`
- Remove fallback mock client
- Fail fast if Redis unavailable
- Add proper error handling

#### 3.7 Audit Logging
**File:** `lib/audit-logger.ts` (NEW)
- Log sensitive actions
- Log authentication events
- Log AI usage
- Log rate limit violations

**Success Criteria:**
- All endpoints have rate limiting
- Input validation on all routes
- Security headers present
- CSRF protection active
- No mock Redis in production
- Audit logging functional

---

## PHASE 4: RATE LIMITING (CRITICAL)

**Priority:** CRITICAL
**Estimated Time:** 2-3 hours
**Dependencies:** Phase 3 complete

### Tasks

#### 4.1 Implement Sliding Window Rate Limiter
**File:** `lib/rate-limiter.ts`
- Redis-based sliding window
- Configurable limits per endpoint
- Rate limit headers in responses

#### 4.2 Configure Limits
- Per-IP: 100 req/min
- Per-user: 50 req/min
- Auth: 5 req/hour per IP
- AI (FREE): 50/day
- AI (PRO): 500/day

#### 4.3 Add Abuse Detection
- Detect patterns of abuse
- Auto-block suspicious IPs
- Alert on abuse attempts

**Success Criteria:**
- Sliding window implemented
- All limits configured
- Abuse detection active
- Rate limit headers in responses

---

## PHASE 5: DATABASE OPTIMIZATION (HIGH)

**Priority:** HIGH
**Estimated Time:** 2-3 hours
**Dependencies:** None (can parallel with Phase 2-4)

### Tasks

#### 5.1 Add Indexes
**File:** `prisma/schema.prisma`
```prisma
// Users
@@index([email])
@@index([createdAt])

// Resumes
@@index([userId])
@@index([userId, createdAt])

// Job Analyses
@@index([userId])
@@index([userId, createdAt])

// Applications
@@index([userId])
@@index([userId, lastUpdated])

// API Usage
@@index([userId])
@@index([userId, createdAt])
@@index([feature])
```

#### 5.2 Optimize Queries
- Review all queries for N+1 issues
- Add select/include optimization
- Use cursor-based pagination where appropriate

#### 5.3 Connection Pooling
**File:** `lib/db.ts`
- Configure Pg pool size
- Add connection timeout
- Add idle timeout

#### 5.4 Query Timeouts
- Add 10-second timeout to all queries
- Log slow queries

#### 5.5 Migration
- Run `prisma migrate dev`
- Test in development
- Prepare for production migration

**Success Criteria:**
- All indexes added
- Queries optimized
- Connection pooling configured
- Query timeouts active
- Migration tested

---

## PHASE 6: BACKEND ARCHITECTURE (HIGH)

**Priority:** HIGH
**Estimated Time:** 3-4 hours
**Dependencies:** Phase 2 complete

### Tasks

#### 6.1 Centralized Error Handler
**File:** `lib/error-handler.ts` (NEW)
- Standardized error responses
- Error classification
- Error logging
- User-friendly error messages

#### 6.2 Structured Logging
**File:** `lib/logger.ts` (UPDATE)
- Use Winston or Pino
- Log levels
- Request ID tracking
- Correlation IDs

#### 6.3 Service Layer
**Directory:** `lib/services/` (NEW)
- `ai.service.ts` - AI operations
- `resume.service.ts` - Resume operations
- `job.service.ts` - Job operations
- `user.service.ts` - User operations

#### 6.4 Health Check Endpoint
**File:** `app/api/health/route.ts` (UPDATE)
- Check database connection
- Check Redis connection
- Check AI provider availability
- Return detailed status

#### 6.5 Graceful Shutdown
- Handle SIGTERM
- Close connections
- Flush logs

**Success Criteria:**
- Centralized error handling
- Structured logging
- Service layer created
- Health check functional
- Graceful shutdown working

---

## PHASE 7: FRONTEND IMPROVEMENTS (MEDIUM)

**Priority:** MEDIUM
**Estimated Time:** 2-3 hours
**Dependencies:** Phase 6 complete

### Tasks

#### 7.1 Loading States
- Add skeletons for all data loading
- Add loading spinners for mutations
- Optimistic UI updates where appropriate

#### 7.2 Error Boundaries
- Add React error boundaries
- User-friendly error pages
- Error recovery mechanisms

#### 7.3 Accessibility
- Add ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

#### 7.4 Form Validation
- Client-side validation
- Real-time feedback
- Clear error messages

#### 7.5 Responsive Design
- Test on mobile
- Test on tablet
- Fix layout issues

**Success Criteria:**
- Loading states everywhere
- Error boundaries active
- Accessibility improved
- Forms validated
- Responsive on all devices

---

## PHASE 8: PERFORMANCE OPTIMIZATION (MEDIUM)

**Priority:** MEDIUM
**Estimated Time:** 2-3 hours
**Dependencies:** Phase 5 complete

### Tasks

#### 8.1 Response Caching
- Cache API responses where appropriate
- Cache static data
- Invalidate cache on updates

#### 8.2 Database Query Caching
- Cache frequent queries
- Use Redis for caching
- Implement cache invalidation

#### 8.3 Server Actions Optimization
- Optimize revalidation
- Reduce unnecessary fetches
- Use proper caching strategies

#### 8.4 Image Optimization
- Use Next.js Image component
- Configure image domains
- Add placeholder blur

#### 8.5 Code Splitting
- Dynamic imports for heavy components
- Route-based splitting
- Lazy loading

#### 8.6 Performance Monitoring
- Add Web Vitals tracking
- Monitor API response times
- Monitor database query times

**Success Criteria:**
- Caching implemented
- Queries optimized
- Server actions optimized
- Images optimized
- Code split
- Monitoring active

---

## PHASE 9: DEPLOYMENT (MEDIUM)

**Priority:** MEDIUM
**Estimated Time:** 2-3 hours
**Dependencies:** Phase 8 complete

### Tasks

#### 9.1 Vercel Configuration
**File:** `vercel.json` (NEW)
- Configure build settings
- Configure headers
- Configure redirects
- Configure rewrites

#### 9.2 Environment Variable Validation
**File:** `lib/env-validation.ts` (NEW)
- Validate all required env vars
- Validate env var formats
- Fail fast on missing vars

#### 9.3 Production Build
- Test production build locally
- Fix build errors
- Optimize bundle size

#### 9.4 Monitoring Setup
- Configure Vercel Analytics
- Configure Sentry (optional)
- Configure uptime monitoring

#### 9.5 Deployment Test
- Deploy to preview environment
- Test all features
- Test AI endpoints
- Test auth flow
- Test rate limiting

**Success Criteria:**
- Vercel configured
- Env vars validated
- Production builds successfully
- Monitoring configured
- Preview deployment tested

---

## PHASE 10: DOCUMENTATION (LOW)

**Priority:** LOW
**Estimated Time:** 1-2 hours
**Dependencies:** Phase 9 complete

### Tasks

#### 10.1 Setup Guide
**File:** `docs/SETUP_GUIDE.md` (NEW)
- Prerequisites
- Installation steps
- Configuration
- Running locally

#### 10.2 Environment Variables Guide
**File:** `docs/ENV_VARIABLES.md` (NEW)
- All variables documented
- Examples provided
- Security notes

#### 10.3 Deployment Guide
**File:** `docs/DEPLOYMENT_GUIDE.md` (NEW)
- Vercel deployment
- Environment setup
- Post-deployment checks
- Troubleshooting

#### 10.4 Architecture Summary
**File:** `docs/ARCHITECTURE_SUMMARY.md` (NEW)
- System overview
- Tech stack
- Data flow
- Key decisions

#### 10.5 Update README
**File:** `README.md` (UPDATE)
- Add quick start
- Add features
- Add deployment links
- Add documentation links

**Success Criteria:**
- All documentation created
- README updated
- Docs are accurate and helpful

---

## PHASE 11: HANDOFF DOCUMENT MAINTENANCE (ONGOING)

**Priority:** ONGOING
**Frequency:** After each completed task

### Tasks
- Update COMPLETED TASKS section
- Update REMAINING TASKS section
- Update MODIFIED FILES section
- Update ARCHITECTURAL DECISIONS if needed
- Update NEXT STEPS

---

## RISK MITIGATION

### High Risks
1. **AI Migration Failure**
   - Mitigation: Keep OpenAI code commented out initially
   - Rollback: Revert to OpenAI if Gemini fails

2. **Rate Limiting Breaking Production**
   - Mitigation: Test thoroughly in staging
   - Rollback: Disable rate limiting via env var

3. **Database Migration Issues**
   - Mitigation: Backup database before migration
   - Rollback: Revert migration if needed

### Medium Risks
1. **Performance Regression**
   - Mitigation: Benchmark before and after
   - Rollback: Revert optimizations if slower

2. **Deployment Issues**
   - Mitigation: Deploy to preview first
   - Rollback: Vercel has instant rollback

---

## SUCCESS METRICS

### Technical
- All OpenAI references removed
- AI endpoints working with Gemini
- Fallback to DeepSeek functional
- Rate limiting on all endpoints
- Database indexes added
- Security headers present
- Production build successful

### Business
- Free tier abuse prevented
- API costs reduced (Gemini cheaper)
- System reliability improved
- Security posture enhanced
- Performance improved

---

## CONTINGENCY PLAN

If context limits are reached:
1. Current state is in HANDOFF_DOCUMENT.md
2. Next steps are clearly defined
3. All architectural decisions documented
4. Modified files tracked
5. Environment variables listed
6. Any AI model can continue from this document

---

## SIGN-OFF

**Phase 1:** ✅ Complete
**Phase 2:** ⏳ Ready to start
**Phase 3-11:** ⏸️ Pending

**Recommended Next Action:** Begin Phase 2 - AI Migration
