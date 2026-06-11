# CareerForge AI: Enterprise-Grade Career Development Engine

CareerForge AI is an advanced, production-grade career development software platform built on Next.js 16. It leverages asynchronous distributed task processing, multi-layer AI models, semantic cache architectures, and resilient failover layers to help professionals build targeted resumes, run mock interviews, audit skill gaps, and optimize portfolios.

---

## 🏗️ Architectural Overview

CareerForge AI is built with a decoupled serverless-first layout. Transactional operations run in standard serverless routes, while heavy compute steps (resume parsing, AI interview generation) are delegated to an asynchronous background worker layer driven by Upstash QStash.

```mermaid
graph TD
    Client[Next.js Client App] -->|NextAuth.js v5 JWT| API[API Gateway Router]
    Client -->|Uploads Resumes| S3Bucket[(AWS S3 / R2 Bucket)]
    
    API -->|Validates Role| RBAC[RBAC Middleware]
    API -->|Limits Rate / Caches| Redis[(Upstash Redis)]
    API -->|Read/Write Records| Postgres[(PostgreSQL DB / Prisma)]
    
    API -->|Dispatches Workers| QStash[Upstash QStash Queue]
    QStash -->|At-Least-Once Webhooks| Workers[Async Worker Endpoints]
    
    Workers -->|AI Inference| AI[Google Gemini / DeepSeek]
    Workers -->|Atomically Mutates Status| Postgres
```

---

## ✨ Features

- **Multi-Agent Resume Customization**: Leverages localized micro-agents to generate three distinct versions of a candidate's resume (Factual, Gap-Enhanced, and Target Blueprint).
- **Asynchronous Processing Pipeline**: Long-running operations are completely decoupled from HTTP request cycles using QStash message queues, featuring automated polling states, idempotency, and timeout recovery.
- **Dynamic Interview Simulator**: Simulates high-fidelity coding and behavioral mock interviews with automated metrics evaluations.
- **Resilient Distributed Caching**: Includes SHA-256 semantic caching and rate-limiting using Upstash Redis, with built-in in-memory fallback systems for maximum system availability.
- **Role-Based Access Control (RBAC)**: Distinguishes permissions for `Student`, `Recruiter`, and `Admin` roles.
- **Centralized System Audit Logs**: central logging module recording system actions (security updates, profile deletions, integrations) with cascade-deletion capabilities.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Languages**: TypeScript
- **Styling**: Tailwind CSS 4, Shadcn UI, Framer Motion
- **Database Engine**: PostgreSQL with Prisma ORM
- **Security & Session**: NextAuth.js (v5 Beta), bcryptjs, Web Cryptography API
- **Worker Queues**: Upstash QStash
- **Memory Store**: Upstash Redis
- **Cloud Storage**: AWS S3 / Cloudflare R2
- **Testing Engine**: Vitest, Playwright E2E testing framework
- **AI Models**: Google Gemini 2.5 Flash, OpenRouter DeepSeek

---

## 📸 Screenshots Section

*Placeholder links below. Place screenshot assets into `public/docs/` before publishing.*

| Dashboard | Resume Studio | Interview Prep |
| :---: | :---: | :---: |
| ![Dashboard Overview](public/docs/dashboard.png) | ![Resume Variations Generator](public/docs/resume-studio.png) | ![Simulated Mock Interviews](public/docs/interview-prep.png) |

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- Node.js (v24 or higher)
- pnpm or npm
- Local Docker Engine (for Postgres & Redis)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/careerforge.git
cd careerforge
```

### 3. Start Local Infrastructure (Docker Compose)
```bash
docker compose -f docker-compose.dev.yml up -d
```
*Starts local PostgreSQL on port 5432 and Redis on port 6379.*

### 4. Install Dependencies
```bash
pnpm install
```

### 5. Setup Environment Variables
Copy the template variables file:
```bash
cp .env.example .env
```
Fill in `.env` with your active developer credentials.

### 6. Run Database Migrations
```bash
pnpm db:migrate
pnpm db:seed
```
*Applies schemas to PostgreSQL and populates default skills & demo user.*

### 7. Run the Application
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Refer to [`.env.example`](.env.example) for documentation. Below are the key environment configurations:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/careerforge"
DATABASE_MAX_CONNECTIONS=10

# NextAuth Configuration
AUTH_SECRET="your-nextauth-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Application Cryptography
ENCRYPTION_KEY="your-32-byte-hexadecimal-key"

# Upstash QStash (Background Workers)
QSTASH_TOKEN="qstash-token"
QSTASH_CURRENT_SIGNING_KEY="current-signing-key"

# Upstash Redis (Caching & Rate Limiting)
REDIS_URL="redis://localhost:6379"

# Object Storage (S3 / R2)
S3_ACCESS_KEY_ID="s3-access-key"
S3_SECRET_ACCESS_KEY="s3-secret-key"
S3_REGION="us-east-1"
S3_BUCKET="careerforge-resumes"
S3_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
S3_PUBLIC_URL="https://your-bucket-public-url"

# AI Inference Keys
GEMINI_API_KEY="gemini-key"
OPENROUTER_API_KEY="openrouter-key"
```

---

## 📁 Repository Structure

```
├── .github/              # GitHub CI/CD workflow configurations
├── __tests__/            # Comprehensive unit and integration test suites
├── app/                  # Next.js App Router (Pages, APIs, Workers)
│   ├── api/              # System APIs and background webhooks
│   └── (app)/            # User portal dashboard views
├── components/           # Reusable UI component libraries
├── e2e/                  # Playwright E2E browser tests
├── lib/                  # Central business logic layer
│   ├── services/         # Async AI agents modules
│   └── generated/        # Prisma client models
├── prisma/               # Schema configuration, migrations, and seeds
└── public/               # Static icons, animations, and documentation images
```

---

## 🧪 Testing Suite

We maintain a strict code coverage threshold of **84%+** across transactional packages.

```bash
# Run all unit and integration tests
pnpm test

# Run tests with HTML coverage reports
pnpm test:coverage

# Run End-to-End tests
pnpm test:e2e
```

---

## 🚀 Deployment Guide

### Vercel Serverless
1. Link your GitHub repository to **Vercel**.
2. Configure environment variables in Vercel settings (match variable names in `.env.example`).
3. Ensure PostgreSQL, Redis, and QStash endpoints are configured on serverless-friendly hosts (e.g., Supabase/Neon for PostgreSQL, Upstash for Redis/QStash).
4. Run `pnpm db:migrate` in a postinstall script or via your DB console.

### Database Connection Warning
When deploying to serverless platforms, ensure `DATABASE_MAX_CONNECTIONS` is capped to `2` per container to prevent horizontal container spawns from overwhelming database connection limits.

---

## 🔒 Security Safeguards

- **Graceful Rate Limiting**: Features Redis-backed sliding-window rate limiters. If Redis goes offline, the serverless route automatically degrades to local memory maps to prevent API starvation.
- **Cryptographic PII Shielding**: User tokens are encrypted at-rest in the database using AES-256-GCM.
- **Optimistic Locking**: Background workers transition task states using database conditional updates (compare-and-swap) to block concurrent execution threads.
- **Audit Logs Cascadable**: Tracks profile actions with full GDPR cascading purge options.

---

## 🔮 Future Improvements

- **First-Class LinkedIn Sync**: Fully implement the LinkedIn sync handler utilizing the LinkedIn OAuth flow to replace simulated profiles.
- **Vector Embeddings Retrieval**: Fully configure semantic search indexes in Qdrant for granular resume section mapping.
- **Distributed Telemetry**: Integrate open-source tracing libraries (OpenTelemetry) for database query metrics tracking.
