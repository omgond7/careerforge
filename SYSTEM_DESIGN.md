# System Design: AI Career Copilot

This document outlines the detailed **System Design** for the AI Career Copilot. It defines the database schemas, API specifications, AI agent orchestration patterns, caching layers, and security controls required to build the platform.

---

## 1. Database Architecture & Schema Strategy

The platform uses a polyglot storage approach to handle transactional, relational, graph-based, and semantic vector data efficiently.

```
                          ┌──────────────────────────┐
                          │    Data Ingestion        │
                          └────────────┬─────────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
       ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
       │   PostgreSQL    │    │      Neo4j      │    │     Qdrant      │
       │ (Transactional) │    │ (Career Twin)   │    │ (Vector Search) │
       └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### A. Transactional Storage: PostgreSQL
Responsible for handling user accounts, session metadata, integration configurations, parsed resume logs, job tracking status, and templates.

*(For detailed table structures, refer to the [PRD.md](PRD.md) and [schema.prisma](prisma/schema.prisma) files).*

### B. Graph Storage: Neo4j (Career Digital Twin)
Maps the deep relational web of a candidate's career. It facilitates traversals like finding what skills are missing by checking overlapping pathways from project requirements to certifications.

#### Nodes:
- `(:Candidate {id: UUID, name: String, email: String, headline: String})`
- `(:Experience {id: UUID, company: String, role: String, startDate: Date, endDate: Date, description: String})`
- `(:Skill {name: String, category: String})`
- `(:Project {id: UUID, name: String, description: String, githubUrl: String})`
- `(:Certification {name: String, provider: String, issueDate: Date})`
- `(:Job {id: UUID, company: String, title: String})`

#### Relationships (Edges):
- `(Candidate)-[:HAS_EXPERIENCE]->(Experience)`
- `(Experience)-[:USED_SKILL {proficiency: Int}]->(Skill)`
- `(Candidate)-[:HAS_SKILL {source: String, confidence: Float}]->(Skill)`
- `(Candidate)-[:CREATED]->(Project)`
- `(Project)-[:USES_TECH]->(Skill)`
- `(Candidate)-[:EARNED]->(Certification)`
- `(Job)-[:REQUIRES_SKILL]->(Skill)`

### C. Vector Database: Qdrant
Used for semantic matching and Retrieval-Augmented Generation (RAG).
- **Collection `job_descriptions`**: Stores job descriptions indexed by embeddings for similarity matching and semantic role search.
- **Collection `company_knowledge`**: Stores chunked engineering blog posts, interview reviews, and wiki entries.
- **Collection `resume_achievements`**: Stores candidate resume bullet points for fast contextual search.

### D. In-Memory Store: Redis
Optimizes the platform's response latency and handles temporary operational states:
- **Session Cache**: Validates user JWT tokens.
- **LLM Prompt Cache**: Maps the hash of a `Job Description + Profile State` to cached analysis results to avoid redundant, expensive LLM calls.
- **Rate-Limiting**: Enforces API access windows (e.g., maximum 5 resume parses per hour per user).

---

## 2. API Specifications

All endpoints are versioned and expect a JSON payload format.

### A. Candidate Integration APIs

#### Ingest Resume
- **Endpoint**: `POST /v1/integrations/resume/upload`
- **Content-Type**: `multipart/form-data`
- **Response**:
  ```json
  {
    "status": "processing",
    "resumeId": "a90dfb9b-cb8e-4a6f-ae98-32a2491a92e1",
    "message": "Resume parsing initiated asynchronously."
  }
  ```

#### Sync GitHub Profile
- **Endpoint**: `POST /v1/integrations/github/sync`
- **Request Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "status": "syncing",
    "provider": "github",
    "lastSyncedAt": "2026-06-10T09:15:30Z"
  }
  ```

---

### B. Job Analysis & Gaps APIs

#### Analyze Job Description
- **Endpoint**: `POST /v1/opportunity/analyze`
- **Body**:
  ```json
  {
    "company": "Stripe",
    "jobTitle": "Backend Engineer - Payments API",
    "jobDescription": "Looking for a backend engineer proficient in Ruby and Go. Experience with distributed transactions and payment security is required...",
    "jobUrl": "https://stripe.com/jobs/12345"
  }
  ```
- **Response**:
  ```json
  {
    "jobId": "f7d739e4-c5a4-4a41-b1e1-11d4e0e5a9c2",
    "company": "Stripe",
    "jobTitle": "Backend Engineer - Payments API",
    "parsedDetails": {
      "requiredSkills": ["Ruby", "Go", "Distributed Systems"],
      "preferredSkills": ["Payment Processing", "PCI-DSS"],
      "experienceYears": 4
    },
    "authenticityScore": {
      "legitimate": true,
      "confidence": 96,
      "details": "Verified recruiter domain matches posting url."
    }
  }
  ```

#### Get Gap Analysis
- **Endpoint**: `GET /v1/gap-analysis`
- **Params**: `?jobId=f7d739e4-c5a4-4a41-b1e1-11d4e0e5a9c2`
- **Response**:
  ```json
  {
    "matchScore": 72,
    "gaps": {
      "skills": [
        { "name": "Ruby", "priority": "high", "type": "missing" }
      ],
      "projects": [
        { "description": "Needs a project showing payment gateway design or distributed ledger experience.", "priority": "medium" }
      ],
      "atsKeywords": ["idempotency", "PCI compliance", "eventual consistency"]
    }
  }
  ```

---

### C. Resume Generation & Editor APIs

#### Generate Tailored Resumes
- **Endpoint**: `POST /v1/resume/generate`
- **Body**:
  ```json
  {
    "jobId": "f7d739e4-c5a4-4a41-b1e1-11d4e0e5a9c2",
    "templateId": "modern-ats-v1"
  }
  ```
- **Response**:
  ```json
  {
    "generationId": "e2c3b4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
    "status": "processing",
    "estimatedTimeSeconds": 8
  }
  ```

#### Poll Resume Status / Fetch Versions
- **Endpoint**: `GET /v1/resume/generation/status/{generationId}`
- **Response (when complete)**:
  ```json
  {
    "generationId": "e2c3b4d5-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
    "status": "completed",
    "versions": {
      "resume1": {
        "title": "Best Possible Current",
        "description": "Strictly factual resume optimized for Stripe Backend Engineer role.",
        "contentJson": { /* Structured Resume Payload */ }
      },
      "resume2": {
        "title": "Gap-Enhanced",
        "description": "Includes near-term project roadmap and learning objectives.",
        "contentJson": { /* Gap Enhanced Payload */ }
      },
      "resume3": {
        "title": "Ideal Candidate",
        "description": "Benchmark target configuration for long-term career planning.",
        "contentJson": { /* Ideal Benchmark Payload */ }
      }
    }
  }
  ```

---

## 3. AI Agent Architecture & Orchestration

Rather than relying on a single monolith prompt, the AI Orchestration layer coordinates a team of specialized **Micro-Agents**:

```
                       ┌─────────────────┐
                       │   Orchestrator  │
                       └────────┬────────┘
                                │
       ┌──────────────┬─────────┴────────┬──────────────┐
       ▼              ▼                  ▼              ▼
 ┌──────────┐   ┌──────────┐       ┌──────────┐   ┌──────────┐
 │ Profile  │   │ Research │       │ Persona  │   │   ATS    │
 │  Agent   │   │  Agent   │       │  Agent   │   │  Agent   │
 └──────────┘   └──────────┘       └──────────┘   └──────────┘
```

### Agent Roster
1. **Profile Builder Agent**: Ingests raw parsed text outputs from resumes and repositories, normalizes skills keywords, and formats entries.
2. **Research Agent**: Scrapes public pages, ingests news chunks, and runs RAG queries to build context.
3. **Ideal Persona Agent**: Reviews job metadata to define required competencies.
4. **Gap Analysis Agent**: Traverses the user profile graph and maps the distance to the target persona.
5. **Resume Strategy Agent**: Formulates a plan for resume templates, section ordering, and keyword positioning rules.
6. **Resume Generation Agent**: Builds the tailormade JSON resumes. Enforces the strict rule that **Resume 1** can only include factual items verified on the candidate's graph.
7. **ATS Scoring Agent**: Scores the resume against the job description using parser simulation.

---

## 4. Multi-Tier Resume Structure Definition

The output of the generation engine contains three distinct, structured resumes:

### A. Resume 1 (Best Possible Current)
- **Rules**: 100% factual. Zero hallucination.
- **Mechanics**: Re-organizes current skills to position the most relevant tools at the top. Re-writes accomplishments to highlight metrics that align with the job description keywords.

### B. Resume 2 (Gap-Enhanced)
- **Rules**: Highlights future pathing (up to 4 weeks out).
- **Mechanics**: Places in-progress courses, certifications, and project updates in italics or with explicit footnotes (e.g., *"AWS Developer Certification - Scheduled for July 2026"*).

### C. Resume 3 (Ideal Candidate Blueprint)
- **Rules**: Used only as a blueprint for long-term development.
- **Mechanics**: Maps the target state a candidate needs to reach (e.g., adding 2 more years of system design experience and a portfolio project on distributed transaction systems) to land high-level roles. Includes a prominent watermark warning.

---

## 5. Security, Compliance & Data Safeguards

Since the service processes highly sensitive PII (Personally Identifiable Information), the system implements these strict security standards:

- **PII Sanitation**: Strips government IDs, photos, and birth dates during initial document ingestion before sending text payloads to LLM APIs.
- **Secure Storage**: Encrypts raw uploaded files at rest in S3 using AES-256 and encrypts database values in transit via TLS 1.3.
- **Data Retention Policies**: Supports full GDPR data deletion ("Right to be Forgotten") by executing cascading deletes across PostgreSQL, Neo4j, Qdrant, and Redis.
- **Factual Integrity Filter**: Runs a post-generation checker to compare the generated Resume 1 against the candidate's verified graph database record. Any injected skills or experiences not found in the source profile are rejected and flagged.
