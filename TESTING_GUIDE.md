# CareerForge AI — Feature Testing & Verification Guide

This guide provides step-by-step instructions to run your local environment and test every feature of the CareerForge AI platform manually in the browser or via API calls.

---

## 1. Running the Local Infrastructure

The application requires a PostgreSQL database and a Redis instance (for sliding-window rate limiting).

### Option A: Native Setup (macOS with Homebrew) - *Recommended*
Since Docker Desktop may be offline or local databases are already installed on your macOS, you can run them natively:

1. **Start PostgreSQL**:
   ```bash
   brew services start postgresql@18
   ```
2. **Start Redis**:
   ```bash
   brew services start redis
   ```

### Option B: Docker Setup
If you prefer to run PostgreSQL and Redis in containerized isolation (Docker Desktop must be running):
```bash
# Start background containers for DB and Redis
pnpm docker:dev
```

---

## 2. Database Migration & Seeding

Ensure your local PostgreSQL schema is up-to-date and populated with the default test data:

1. **Push Database Schema**:
   ```bash
   npx prisma db push
   ```
2. **Seed Default User & Data**:
   ```bash
   pnpm db:seed
   ```
   *Note: This creates a pre-populated user profile with custom experience history, skills, and mock notifications.*
   - **Demo Credentials**:
     - **Email**: `demo@careerforge.ai`
     - **Password**: `password123`

---

## 3. Starting the Development Server

Start the Next.js development server:
```bash
pnpm dev
```
The app will compile and become accessible at [http://localhost:3000](http://localhost:3000).

---

## 4. Environment Keys & AI Features

To test features that utilize OpenAI models (Resume parsing, Resume Generation, Job Analysis, Interview Prep, and Copilot Chat), you must supply a real OpenAI API Key.

1. Open the `.env` file in the project root.
2. Replace the placeholder for `OPENAI_API_KEY`:
   ```env
   OPENAI_API_KEY="your-actual-openai-api-key"
   ```
3. Save and restart the development server.

> [!NOTE]
> If you do not provide an OpenAI API key:
> - **Resume Upload/Parse**: Will catch the API error and fall back to displaying the raw resume text instead of structured fields.
> - **Other AI endpoints**: (e.g. `/api/jobs/analyze`, `/api/interview/[id]/submit`) will return a `503 Service Unavailable` error indicating the AI service is offline.

---

## 5. UI Features Walkthrough

Log in at [http://localhost:3000/login](http://localhost:3000/login) using:
- **Email**: `demo@careerforge.ai`
- **Password**: `password123`

### 1. Dashboard Overview
- **Path**: `/dashboard`
- **What to try**: View your profile completeness score, active applications count, aggregate match statistics, latest notifications, and links to different hubs.

### 2. Onboarding Flow
- **Path**: `/onboarding`
- **What to try**: Reset your onboarding step status or sign up as a new user at `/signup` to run the step-by-step wizard. You select a target role, set up integrations, and build the initial profile.

### 3. Resume Studio
- **Path**: `/resume-studio`
- **What to try**:
  - **Upload**: Upload a PDF or DOCX resume. The platform will store the file (simulated S3 upload) and parse it.
  - **Versions**: Go to `/resume-studio/versions` to manage different copies of your resumes.
  - **Compare**: Go to `/resume-studio/compare` to see side-by-side differences between manually uploaded files and AI-generated versions.

### 4. Job Intelligence & Gap Analysis
- **Path**: `/job-intelligence`
- **What to try**:
  - Paste a company name, job title, and a job description.
  - Submit to trigger the AI analysis. The system compares the description to your profile, computes an ATS/Match score, categorizes required skills, and flags gaps.
  - Navigate to `/gap-analysis` to view all identified skills, projects, and credentials gaps prioritized by critical levels (High/Medium/Low).
  - Check the analysis history at `/job-intelligence/history`.

### 5. Application Tracker
- **Path**: `/application-tracker`
- **What to try**:
  - Create a new application card.
  - Drag and drop or select status updates (e.g., Applied, Screening, Interviewing, Offer, Rejected).
  - Click on an application to update its notes, salary range, or timeline events.

### 6. Career Twin & Roadmap
- **Path**: `/career-twin`
- **What to try**:
  - View details about specific skill proficiency graphs at `/career-twin/skills/[id]`.
  - View the step-by-step AI-generated career milestones and actions at `/career-twin/roadmap/[id]`.

### 7. Interview Prep
- **Path**: `/interview-prep`
- **What to try**:
  - Click to generate interview prep questions based on your profile or a target job.
  - Type answers to the questions.
  - Submit the session to receive score ratings, individual question feedback, and recommended "ideal" answers.
  - Review your previous attempts at `/interview-prep/history`.

### 8. AI Copilot
- **Path**: `/copilot`
- **What to try**:
  - Send messages in the chat interface. The response streams dynamically and incorporates your resume, target role, and career history context.

### 9. Settings & Customizations
- **Paths**: `/settings/profile`, `/settings/security`, `/settings/integrations`
- **What to try**:
  - Update profile details (headline, location, bio).
  - Update notifications toggles.
  - Toggle MFA/security settings.
  - Trigger mock integrations sync for GitHub/LinkedIn.

---

## 6. Testing the APIs (Via curl / Bruno / Postman)

Most API endpoints are authenticated. To test them programmatically:

1. Log in via your web browser.
2. Open the Browser Developer Tools (F12) -> **Application** -> **Cookies** -> `http://localhost:3000`.
3. Copy the value of the authentication session cookie (typically named `__Secure-authjs.session-token` or `authjs.session-token`).
4. Include this cookie in your request headers:
   ```http
   Cookie: authjs.session-token=your_copied_token_here
   ```

### Quick Check (Public)
```bash
curl -i http://localhost:3000/api/health
```

### 1. Auth & Profiles
- **Register User**:
  ```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name": "John Doe", "email": "john.doe@example.com", "password": "SecurePassword123"}'
  ```
- **Get Current User Data** (Requires Cookie):
  ```bash
  curl -H "Cookie: authjs.session-token=YOUR_TOKEN" http://localhost:3000/api/user/me
  ```
- **Update Profile** (Requires Cookie):
  ```bash
  curl -X PATCH http://localhost:3000/api/user/profile \
    -H "Cookie: authjs.session-token=YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"headline": "Staff Developer", "experienceYears": 10}'
  ```

### 2. Resume Features (Requires Cookie)
- **Upload Resume**:
  *Use a multipart/form-data request containing a physical `.pdf` or `.docx` file.*
  ```bash
  curl -X POST http://localhost:3000/api/resume/upload \
    -H "Cookie: authjs.session-token=YOUR_TOKEN" \
    -F "file=@/path/to/your/resume.pdf"
  ```
- **Generate AI Tailored Versions**:
  ```bash
  curl -X POST http://localhost:3000/api/resume/generate \
    -H "Cookie: authjs.session-token=YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"jobId": "REPLACE_WITH_JOB_ANALYSIS_ID", "resumeId": "REPLACE_WITH_RESUME_ID"}'
  ```

### 3. Job Analysis & Tracking (Requires Cookie)
- **Analyze Job**:
  ```bash
  curl -X POST http://localhost:3000/api/jobs/analyze \
    -H "Cookie: authjs.session-token=YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "company": "Stripe",
      "jobTitle": "Senior frontend developer",
      "jobDescription": "We are seeking a React developer proficient in TypeScript and GraphQL. Minimum 5 years of experience."
    }'
  ```
- **Add Tracking Application**:
  ```bash
  curl -X POST http://localhost:3000/api/applications \
    -H "Cookie: authjs.session-token=YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "company": "Apple",
      "position": "Software Engineer",
      "status": "applied",
      "appliedDate": "2026-06-10T00:00:00.000Z"
    }'
  ```

### 4. Notifications & Search (Requires Cookie)
- **Mark All Notifications Read**:
  ```bash
  curl -X POST http://localhost:3000/api/notifications/mark-all-read \
    -H "Cookie: authjs.session-token=YOUR_TOKEN"
  ```
- **Search Profile / Jobs**:
  ```bash
  curl -H "Cookie: authjs.session-token=YOUR_TOKEN" "http://localhost:3000/api/search?q=React"
  ```
