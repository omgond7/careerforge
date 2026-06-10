# Product Requirements Document (PRD): AI Career Copilot

## 1. Product Overview

### Product Name
**CareerTwin AI** (working title)

### Vision
Create a continuously evolving digital twin of every candidate and transform job applications from guesswork into data-driven career optimization.

### Mission
Help candidates answer three questions instantly:
1. Am I qualified for this role?
2. What am I missing?
3. What should my resume look like for this company?

---

## 2. Problem Statement

Current job search process is broken:
- Generic resumes are sent everywhere.
- Candidates don't know whether they match a role.
- Resume customization is time-consuming.
- Career gaps are invisible.
- Job scams are increasing.
- Most ATS optimization tools only analyze resumes, not careers.

The result:
- Low interview rates
- Poor career planning
- Wasted applications
- Missed opportunities

---

## 3. Target Users

### Primary Users

#### Students
**Need:**
- Resume guidance
- Skill roadmap
- Internship readiness

#### Freshers
**Need:**
- Gap analysis
- Resume optimization
- Interview preparation

#### Experienced Professionals
**Need:**
- Career progression planning
- Company-specific positioning
- Promotion readiness

### Secondary Users
- **Career Coaches:** Monitor multiple candidates.
- **Placement Cells:** Track student readiness.
- **Bootcamps:** Measure student employability.

---

## 4. Core Value Proposition

*Traditional Resume Builders:*
> "Create a resume."

*Career Copilot:*
> "Understand the opportunity, understand the candidate, calculate the gap, and generate the best possible application strategy."

---

## 5. Product Architecture

```
                     ┌─────────────────┐
                     │ Candidate Inputs │
                     └────────┬────────┘
                              │
                              ▼
               ┌───────────────────────────┐
               │ Career Digital Twin Engine│
               └────────┬──────────────────┘
                        │
                        ▼
          ┌───────────────────────────────┐
          │ Candidate Knowledge Graph     │
          └────────┬──────────────────────┘
                   │
                   ▼
      ┌─────────────────────────────────────┐
      │ Opportunity Intelligence Engine     │
      └──────────────┬──────────────────────┘
                     │
                     ▼
      ┌─────────────────────────────────────┐
      │ Ideal Candidate Persona Generator   │
      └──────────────┬──────────────────────┘
                     │
                     ▼
      ┌─────────────────────────────────────┐
      │ Gap Analysis Engine                 │
      └──────────────┬──────────────────────┘
                     │
                     ▼
      ┌─────────────────────────────────────┐
      │ Resume Strategy Generator           │
      └──────────────┬──────────────────────┘
                     │
                     ▼
      ┌─────────────────────────────────────┐
      │ Resume Editor + Export System       │
      └─────────────────────────────────────┘
```

---

## 6. MVP Scope (Version 1)

### Module 1: Candidate Profile Creation
- **Inputs:** Resume Upload (PDF/DOCX), LinkedIn URL, GitHub URL
- **Outputs:** Unified candidate profile.
- **Features:** Resume Parsing, GitHub Analysis, LinkedIn Extraction, Skill Detection, Project Extraction.

### Module 2: Job Analysis
- **Input:** Job Description, Company Name
- **Output:** Skills Required, Experience Expectations, ATS Keywords.

### Module 3: Gap Analysis
- **Compare:** Candidate Profile VS Job Requirements
- **Output:** Match %, Missing Skills, Missing Projects, Missing Experience.

### Module 4: Resume Generation
- **Generate:**
  - **Resume A:** Current Best Resume (100% factual)
  - **Resume B:** Improved Resume Suggestions (Gap-enhanced)

### Module 5: Resume Export
- **Formats:** PDF, DOCX, JSON

---

## 7. Version 2 Features

### Company Intelligence
- **Research:** Tech Stack, Products, Hiring Trends, Interview Experiences.

### Job Authenticity Detection
- **Signals:** Domain Reputation, Recruiter Validation, Company Verification, Posting Consistency.
- **Output:** E.g., `Legitimate: 92%`, `Confidence: High`.

### Career Roadmap Generator
- **Example:**
  - *Current:* Junior Developer
  - *Target:* Backend Engineer at Stripe
  - *Missing:* System Design, AWS, Kafka
  - *Estimated Timeline:* 6 Months

### Cover Letter Generator
- Role-specific cover letters.

### Application Tracker
- **Track stages:** Wishlist, Applied, OA Received, Interview Scheduled, Offer, Rejected.

---

## 8. Version 3 Features

### Career Digital Twin
- Continuously updated profile.
- **Automatic syncing:** GitHub, LinkedIn, Portfolio, Resume.

### Multi-Agent Career Coach
- **Resume Agent:** Resume optimization.
- **Research Agent:** Company analysis.
- **Interview Agent:** Interview preparation.
- **Skill Agent:** Learning roadmap.
- **Career Strategist Agent:** Long-term planning.

### AI Mock Interviews
- Voice, Video, Coding, and Behavioral mock sessions.

### Market Intelligence
- **Insights:** Salary Range, Hiring Demand, Competition Level.

---

## 9. Functional Requirements

- **FR-1 User Authentication:** Support Google Login, LinkedIn Login, Email Login.
- **FR-2 Resume Parsing:** Extract Skills, Projects, Experience, Education with an accuracy target of 95%+.
- **FR-3 GitHub Intelligence:** Analyze Languages, Commits, Repo Activity, Project Complexity.
- **FR-4 Job Parsing:** Extract Skills, Technologies, Responsibilities.
- **FR-5 Gap Analysis:** Generate Missing Skills, Weak Areas, ATS Keywords.
- **FR-6 Resume Generation:** Generate ATS Optimized Resume, Company-Specific Resume.
- **FR-7 Resume Editor:** Features: Drag Sections, Edit Content, Live Preview.
- **FR-8 Export Engine:** Formats: PDF, DOCX, JSON.

---

## 10. Non-Functional Requirements

- **Performance:** Resume generation time < 10 seconds.
- **Availability:** 99.9% uptime.
- **Security:** Encrypted storage of candidate profile and PII.
- **Scalability:** Support 100K+ users.

---

## 11. Database Design (Suggested Key Entities)

```sql
-- Users and Profile Module
users (id, email, name, password_hash, created_at, updated_at)
user_profiles (id, user_id, headline, bio, location, experience_years, onboarding_completed, updated_at)

-- Skills & Competencies
skills (id, name, category)
user_skills (user_id, skill_id, proficiency_level, is_verified, source)

-- Resumes & Versions
resumes (id, user_id, name, content_json, ats_score, is_primary, created_at, updated_at)
resume_versions (id, resume_id, version_number, version_type, content_json, ats_score, change_summary, created_at)

-- Job Intelligence & Gaps
jobs_analyzed (id, user_id, job_title, company, location, job_description, match_score, match_level, match_breakdown, is_saved, job_url, remote, posted_date, analysis_date)
job_gaps (id, job_id, gap_type, skill_name, required_detail, current_detail, priority)

-- Career Roadmaps
career_roadmaps (id, user_id, target_role_title, target_company, target_match_pct, current_match_pct, estimated_time_months, created_at, updated_at)
roadmap_steps (id, roadmap_id, step_number, title, description, status, target_date, completed_at)

-- Application Tracker
applications (id, user_id, job_id, resume_version_id, job_title, company, status, applied_date, salary_offered, notes, created_at, updated_at)
```

---

## 12. AI Architecture

- **Agent 1 (Profile Builder Agent):** Creates candidate career graph.
- **Agent 2 (Company Research Agent):** Researches company context.
- **Agent 3 (Job Intelligence Agent):** Parses JDs.
- **Agent 4 (Ideal Candidate Agent):** Creates benchmark profiles.
- **Agent 5 (Gap Analysis Agent):** Calculates differences.
- **Agent 6 (Resume Strategy Agent):** Creates optimization plans.
- **Agent 7 (Resume Generation Agent):** Creates tailored resumes.

---

## 13. Suggested Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js / Next.js API Routes (or NestJS), PostgreSQL, Redis
- **Search & Knowledge Graph:** Neo4j, Qdrant (or vector/graph structures)
- **AI Layer:** Gemini API, OpenAI API, Anthropic API
- **Infrastructure:** Vercel, Railway, Cloudflare

---

## Founder Feedback

> "This idea is stronger than a typical resume builder because it moves from **document optimization** to **career intelligence**."
> 
> "The biggest strategic moat is not resume generation. Almost everyone can generate resumes now. The moat is: **Career Digital Twin + Opportunity Intelligence + Gap Analysis + Continuous Career Tracking**."
> 
> "If executed well, this can become the 'GitHub Copilot for Careers' rather than just another ATS checker."
> 
> **MVP Focus:**
> 1. Career Graph (Unified candidate profile)
> 2. Job Analysis
> 3. Gap Analysis
> 4. Tailored Resume Generation
> *(Postpone company deep research, mock interviews, and tracker until after product-market fit is validated.)*

---

## Appendix A: Example Resume 1 vs Resume 2 Comparison

| Section | Resume 1 (Best Current) | Resume 2 (Gap-Enhanced) |
| --- | --- | --- |
| **Skills** | React, Node, MongoDB | React, Node, **GraphQL** *(in progress)*, MongoDB |
| **Experience** | Built e-commerce frontend | Built e-commerce frontend; *currently adding real-time inventory* |
| **Projects** | Task manager app | Task manager app; *In-progress: GraphQL wrapper for REST API* |
| **Certifications** | None | *AWS Cloud Practitioner (scheduled for next month)* |
| **Footnote** | (none) | *Italicized items represent candidate's active upskilling – completion within 4 weeks.* |
