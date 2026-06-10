# Enterprise Architecture: AI Career Copilot

This document outlines the **Enterprise Architecture** for the AI Career Copilot (CareerTwin AI) platform. It details the service layout, data processing pipelines, event-driven infrastructure, and the scaling roadmap from the initial MVP to a production-grade microservices deployment.

---

## 1. High-Level Architecture Overview

The system is designed with a hybrid architecture:
- **Synchronous Interaction**: Real-time user operations (the interactive resume builder, dashboard metrics, cover letter reviews) run over fast HTTP/WebSockets.
- **Asynchronous Event-Driven Processing**: Compute-intensive pipelines (PDF generation, GitHub sync, LinkedIn parsing, company RAG crawlers, and LLM orchestration) are decoupled via an event bus (Kafka/Redpanda or RabbitMQ) and processed by background worker groups.

```
                          ┌─────────────────────┐
                          │      Frontend       │
                          │ Next.js + TS        │
                          └──────────┬──────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │          API Gateway           │
                    │ Auth + Rate Limit + Routing    │
                    └──────────────┬─────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼

 ┌────────────────┐      ┌─────────────────┐     ┌────────────────┐
 │ Identity       │      │ Candidate       │     │ Opportunity    │
 │ Service        │      │ Service         │     │ Service        │
 └────────────────┘      └─────────────────┘     └────────────────┘

          │                        │                        │
          ▼                        ▼                        ▼

 ┌────────────────┐      ┌─────────────────┐     ┌────────────────┐
 │ Integration    │      │ Knowledge Graph │     │ Research       │
 │ Service        │      │ Service         │     │ Service        │
 └────────────────┘      └─────────────────┘     └────────────────┘

          │                        │                        │
          └──────────────┬─────────┴───────────┬────────────┘
                         │                     │
                         ▼                     ▼

              ┌───────────────────────┐
              │      Event Bus         │
              │ Kafka / Redpanda       │
              └──────────┬─────────────┘
                         │
                         ▼

         ┌─────────────────────────────────────┐
         │          AI Agent Platform          │
         └─────────────────────────────────────┘

         Profile Agent  •  Research Agent  •  Persona Agent
           Gap Agent    •   Resume Agent   •   ATS Agent
                       Interview Agent

                         │
                         ▼

             ┌─────────────────────────┐
             │ Resume Generation Engine│
             └─────────────────────────┘

                         │
                         ▼

              ┌───────────────────────┐
              │ Export Service        │
              │ PDF DOCX LaTeX        │
              └───────────────────────┘
```

---

## 2. Decoupled Service Ecosystem

The target enterprise architecture splits domains into isolated microservices to support independent scaling, custom technology stacks (e.g., Python for LLMs/scraping, Node/Go for high-concurrency APIs), and clean bounded contexts:

### 1. Identity Service
- **Domain Responsibilities**: Authentication, OAuth lifecycle (Google, LinkedIn, GitHub), RBAC (Role-Based Access Control), session security.
- **Core Entities**: Users, Sessions, OAuth accounts.

### 2. Candidate Service
- **Domain Responsibilities**: Manages the core Candidate Profile metadata, professional experiences, structured projects list, and verified skills. Updates the Relational database.
- **Core Entities**: Profiles, Experiences, Projects, Credentials.

### 3. Integration Service
- **Domain Responsibilities**: External data synchronizers for third-party developer portfolios. Handles rate-limits and authentication scopes when syncing.
- **Connectors**: LinkedIn profile scraper, GitHub repository/commit analyzer.

### 4. Resume Parsing Service
- **Domain Responsibilities**: Dedicated text extraction, OCR of scanned documents, and Named Entity Recognition (NER) mapping to parse raw resume PDF/DOCX uploads into standard schemas.

### 5. Knowledge Graph Service
- **Domain Responsibilities**: Translates candidate data into a rich semantic web. Maps how skills connect to specific experiences, projects, and certifications. Queries the graph to traverse connections.
- **Graph Engine**: Neo4j.

### 6. Opportunity Intelligence Service
- **Domain Responsibilities**: Scrapes and parses Job Descriptions, extracts required/preferred skills, categorizes seniority expectations, and runs authenticity checks (scam analysis) on target roles.

### 7. Research Service
- **Domain Responsibilities**: Web scraping, indexing, and vector processing of target companies (engineering blogs, product updates, interview reviews) to feed the context-aware RAG pipeline.

### 8. Ideal Persona Service
- **Domain Responsibilities**: Synthesis of the "perfect candidate" benchmark model for a target job opening by combining extracted job description expectations with general industry standard rules.

### 9. Gap Analysis Service
- **Domain Responsibilities**: Runs high-speed comparative operations between the Candidate Knowledge Graph and the Ideal Candidate Persona to map exact skill, experience, project, and keyword deficiencies.

### 10. Resume Strategy Service
- **Domain Responsibilities**: Decides the layout templates, section ordering rules, keyword weights, and tone parameters for the resume based on the target company profile and job constraints.

### 11. Resume Generation Service
- **Domain Responsibilities**: Invokes the LLM orchestration pipeline to construct three tailormade variations of the resume: Factual Best (V1), Gap-Enhanced (V2), and Ideal Blueprint (V3).

### 12. ATS Intelligence Service
- **Domain Responsibilities**: Validates resume compliance against target parser patterns, calculates compatibility scores (0-100), and flags critical missing keywords.

### 13. Resume Editor Service
- **Domain Responsibilities**: Synchronizes live edits in the browser, manages draft auto-saves, supports version branches, and hosts real-time comments.

### 14. Export Service
- **Domain Responsibilities**: Compiles the validated resume JSON schema into target printable formats (PDF, DOCX, LaTeX, TXT) via server-side rendering pipelines.

### 15. Application Tracker Service
- **Domain Responsibilities**: Manages Kanban board state, stores application submissions history, and builds conversion rate analytics pipelines.

---

## 3. Event-Driven Architecture (EDA)

Services communicate asynchronously using an event log platform (Apache Kafka or Redpanda) to process tasks out-of-band and support fan-out pipelines.

### Core Kafka Topics
- `candidate.created` / `candidate.updated`: Broadcasts profile changes to rebuild the Neo4j Knowledge Graph.
- `linkedin.synced` / `github.synced`: Signals that external sync jobs have completed and raw data is ready for parsing.
- `resume.uploaded`: Triggers the parsing engine on a new document buffer.
- `resume.parsed`: Informs the Candidate Service to update profile records.
- `job.analyzed`: Initiates the company RAG research and ideal candidate generation.
- `persona.generated`: Triggers the Gap Analysis Engine to run comparisons.
- `gap.completed`: Requests the Generation Engine to build target resume options.
- `resume.generated` / `resume.exported`: Signals that generation is complete and files are stored in S3.

### Primary Event Flows

#### A. Resume Ingestion & Profile Synchronization Flow
```
User uploads PDF
   │
   ▼
[API Gateway] ───────► (resume.uploaded event)
                               │
                               ▼
                        [Parser Service]
                               │
                               ▼
                         (resume.parsed)
                               │
                               ▼
                      [Candidate Service]
                               │
                               ▼
                     [Knowledge Graph Sync]
                               │
                               ▼
                      (candidate.updated)
```

#### B. Job Parsing & Multi-Tier Resume Generation Flow
```
User submits Job URL
   │
   ▼
[Opportunity Service] ─► (job.analyzed)
                               │
                               ├────────────────────────┐
                               ▼                        ▼
                       [Research Service]       [Persona Service]
                               │                        │
                               ▼                        ▼
                      (company.data.ready)     (persona.generated)
                               │                        │
                               └───────────┬────────────┘
                                           │
                                           ▼
                                   [Gap Analysis]
                                           │
                                           ▼
                                    (gap.completed)
                                           │
                                           ▼
                                 [Resume Strategy]
                                           │
                                           ▼
                                   [Resume Generator]
                                           │
                                           ▼
                                   (resumes.created)
```

---

## 4. Scaling Strategy & Architectural Phases

To build velocity without over-engineering early, we outline a **three-phased evolutionary roadmap**:

### Phase 1: Modular Monolith (0 → 5,000 Users)
* **Goal**: Minimize infrastructure overhead, validate product-market fit, and maximize implementation speed.
* **Architecture**: 
  - **Frontend & Backend**: Next.js App Router (with API routes or modular server functions in a monorepo).
  - **Primary Database**: PostgreSQL (for users, profiles, resumes, jobs, and application data).
  - **Cache & Message Broker**: Redis (used for quick caches, session data, and simple job queues via BullMQ).
  - **Vector Search**: PostgreSQL extension `pgvector` or a lightweight Qdrant cloud setup.
  - **AI Layer**: Direct, structured integration with OpenAI/Anthropic/Gemini APIs.
  - **Background Jobs**: Next.js async workers or simple Node background processes.

### Phase 2: Hybrid Microservices (5,000 → 50,000 Users)
* **Goal**: Decouple resource-intensive domains, prevent slow LLM calls from blocking API threads, and introduce specialized databases.
* **Architecture**:
  - Extract the **Resume Generation Engine**, **Research Crawler**, and **Opportunity parser** into independent microservices (using FastAPI for Python tasks, and NestJS for PDF engines).
  - Introduce **Neo4j** (managed or clustered) for the Knowledge Graph.
  - Migrate from Redis lists to **Apache Kafka / Redpanda** for event logging.
  - Transition vector embeddings entirely into a dedicated, high-performance **Qdrant** cluster.

### Phase 3: Enterprise Microservices on Kubernetes (50,000+ Users)
* **Goal**: Guarantee 99.9% uptime, handle global request spikes, and implement continuous data synchronization.
* **Architecture**:
  - Full microservices setup deployed across **Kubernetes (EKS/GKE)**.
  - **KEDA** (Kubernetes Event-driven Autoscaling) configured to scale workers dynamically based on queue sizes (e.g., scaling the Puppeteer-based Export Service during spikes).
  - **Read Replicas** for PostgreSQL and Neo4j databases.
  - **CQRS** (Command Query Responsibility Segregation) to separate complex graph queries from basic profile updates.
  - **Multi-Region CDNs** and S3 replication for instant resume downloads globally.
