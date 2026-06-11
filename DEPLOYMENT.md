# Production Deployment Guide: AI Career Copilot

This guide provides step-by-step instructions for deploying the AI Career Copilot platform from scratch to a production environment. It assumes a fresh machine, a clean deployment environment, and zero prior cloud resource setup.

---

## 1. Account Creation

Before starting, register accounts with the following providers (free-tier options are available for all of them):

1. **GitHub**: Used for repository hosting, OAuth provider configuration, and CI/CD pipelines. [Sign Up](https://github.com/join)
2. **Vercel**: The hosting platform for our Next.js frontend and serverless API endpoints. [Sign Up](https://vercel.com/signup)
3. **Supabase**: Serves as our hosted PostgreSQL relational database. [Sign Up](https://supabase.com)
4. **Upstash**: Provides serverless Redis (for caching/rate limiting) and QStash (for async task dispatching). [Sign Up](https://upstash.com)
5. **Google AI Studio / Google Cloud Console**: Used to generate Google Gemini API keys and set up Google OAuth. [Sign Up](https://aistudio.google.com/)
6. **Cloudflare**: Used for Cloudflare R2 object storage to store resume uploads. [Sign Up](https://dash.cloudflare.com/sign-up)
7. **SMTP Provider (e.g., SendGrid, Resend, or Gmail)**: For sending email verifications and password reset links.

---

## 2. Environment Variables Reference

Below is the complete list of environment variables required in production.

| Variable Name | Description | Example / Recommended Format |
| :--- | :--- | :--- |
| `DATABASE_URL` | Supabase Transactional Connection String | `postgresql://postgres.[id]:[pass]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `AUTH_SECRET` | Secret key for JWT signing (NextAuth) | Run `openssl rand -base64 32` to generate |
| `NEXT_PUBLIC_APP_URL` | The public production URL of your application | `https://your-app.vercel.app` |
| `ENCRYPTION_KEY` | AES-256-GCM token encryption key (32 bytes) | Run `openssl rand -hex 16` (32 hex characters) |
| `QSTASH_TOKEN` | Upstash QStash REST API token | Obtain from Upstash Console |
| `QSTASH_CURRENT_SIGNING_KEY`| QStash verification current key | Obtain from Upstash Console |
| `QSTASH_NEXT_SIGNING_KEY` | QStash verification next key | Obtain from Upstash Console |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Obtain from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Obtain from Google Cloud Console |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Obtain from GitHub Developer Settings |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Obtain from GitHub Developer Settings |
| `GEMINI_API_KEY` | Google Gemini API key | Obtain from Google AI Studio |
| `GEMINI_MODEL` | The LLM model identifier | `gemini-2.5-flash` |
| `OPENROUTER_API_KEY` | Fallback DeepSeek API key (Optional) | Obtain from OpenRouter Settings |
| `OPENROUTER_MODEL` | Fallback LLM model identifier (Optional) | `deepseek/deepseek-chat` |
| `REDIS_URL` | Upstash Redis connection string | `rediss://default:[token]@...upstash.io:6379` |
| `S3_ACCESS_KEY_ID` | Cloudflare R2 API token Access Key | Obtain from Cloudflare R2 Token screen |
| `S3_SECRET_ACCESS_KEY` | Cloudflare R2 API token Secret Key | Obtain from Cloudflare R2 Token screen |
| `S3_REGION` | R2 Region configuration | `auto` |
| `S3_BUCKET` | Cloudflare R2 Bucket name | `careerforge-resumes` |
| `S3_ENDPOINT` | R2 endpoint containing Account ID | `https://[account-id].r2.cloudflarestorage.com` |
| `S3_PUBLIC_URL` | Public file distribution endpoint | Custom Domain or R2 Public Subdomain URL |
| `SMTP_HOST` | Outgoing SMTP server address | `smtp.resend.com` or `smtp.gmail.com` |
| `SMTP_PORT` | Outgoing SMTP port | `587` |
| `SMTP_USER` | SMTP Username | e.g. API key or email address |
| `SMTP_PASSWORD` | SMTP password or App Password | SMTP credential secret |
| `SMTP_FROM` | Default sender email header | `CareerForge <no-reply@yourdomain.com>` |

---

## 3. Database Setup (Supabase)

Supabase provides the transactional Postgres database. Follow these steps to provision and configure:

1. **Create a Database Project**:
   - Log in to the [Supabase Console](https://supabase.com).
   - Click **New Project** and select your Organization.
   - Choose a project name (e.g., `CareerForge Production`), set a strong database password, and pick the region closest to your Vercel deployment (typically `us-east-1` or similar Vercel default).
   - Click **Create new project** and wait for provisioning (takes ~2 minutes).

2. **Retrieve Connection Strings**:
   - Go to **Project Settings** > **Database**.
   - Under **Connection string**, select the **URI** format.
   - Select **Transaction** mode (port `6543`) which is recommended for serverless execution. *Ensure `?pgbouncer=true` is appended to the connection string if pgBouncer is enabled.*
   - Copy this connection string. You will replace `[YOUR-PASSWORD]` with the database password set in step 1.

---

## 4. Database Schema Migration

Run migrations from your terminal to establish table configurations in Supabase.

1. **Install Dependencies**:
   Ensure you have dependencies installed on your build machine:
   ```bash
   pnpm install
   ```

2. **Run Migrations**:
   Using Prisma CLI, apply the local migration folder to your remote Supabase database:
   ```bash
   # Use the TRANSACTION DATABASE_URL obtained from Supabase Settings
   export DATABASE_URL="postgresql://postgres.[your-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   
   # Apply existing migrations
   pnpm prisma migrate deploy
   ```

3. **Verify Table Schema**:
   Return to the Supabase Console, navigate to the **Table Editor** on the left menu, and verify that tables such as `users`, `user_profiles`, `resumes`, and `background_jobs` have been created.

---

## 5. OAuth Setup

### A. GitHub OAuth Configuration
1. Go to your GitHub profile settings > **Developer Settings** > **OAuth Apps** > **New OAuth App**.
2. **Application Name**: `CareerForge Production`
3. **Homepage URL**: `https://your-app.vercel.app` (update this after Vercel deployment)
4. **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
5. Click **Register application**.
6. Generate and save a new **Client Secret**. Record both the **Client ID** and **Client Secret**.

### B. Google OAuth Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named `CareerForge`.
3. Go to **APIs & Services** > **OAuth consent screen**. Set user type to **External** and complete the mandatory app details.
4. Go to **APIs & Services** > **Credentials** > **Create Credentials** > **OAuth client ID**.
5. **Application Type**: Web Application.
6. **Authorized Javascript Origins**: `https://your-app.vercel.app`
7. **Authorized Redirect URIs**: `https://your-app.vercel.app/api/auth/callback/google`
8. Click **Create** and record the **Client ID** and **Client Secret**.

---

## 6. Redis Setup (Upstash Redis)

Upstash Redis is required for prompt caching and rate limiting.

1. Log in to the [Upstash Console](https://console.upstash.com).
2. Click **Create Database**.
3. **Name**: `careerforge-redis-prod`
4. **Type**: **Global** (or regional matching your primary database region to avoid network latency).
5. Click **Create**.
6. Under **REST API**, copy the `UPSTASH_REDIS_REST_URL` and the connection string (under the **RediS URL** tab).
7. Save the URL under the `REDIS_URL` environment variable.

---

## 7. Queue Setup (Upstash QStash)

Upstash QStash coordinates exactly-once background jobs asynchronously.

1. In the [Upstash Console](https://console.upstash.com), navigate to the **QStash** tab at the top.
2. Under **Request Signing keys**, find:
   - **Current Signing Key** (maps to `QSTASH_CURRENT_SIGNING_KEY`)
   - **Next Signing Key** (maps to `QSTASH_NEXT_SIGNING_KEY`)
3. Under the **REST API** section, copy the `QStash Token` (maps to `QSTASH_TOKEN`).
4. Note that QStash will publish events to your webhook URL:
   `https://your-app.vercel.app/api/workers`
5. You do not need to register destinations statically in the QStash console; the application invokes QStash dynamically using the SDK.

---

## 8. Storage Setup (Cloudflare R2)

Cloudflare R2 is utilized as a cost-efficient, S3-compatible blob storage solution for PDF and docx resume files.

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Select your Account, navigate to **R2 Storage**, and click **Create Bucket**.
3. **Bucket Name**: `careerforge-resumes` (or custom name, map to `S3_BUCKET`).
4. Click **Create Bucket**.
5. Go to **R2** homepage, select **Manage R2 API Tokens** on the right side.
6. Click **Create API Token**:
   - **Token name**: `careerforge-token`
   - **Permissions**: **Edit** (Read & Write permissions required)
   - Click **Create Token**.
7. Copy the generated credentials:
   - **Access Key ID** (maps to `S3_ACCESS_KEY_ID`)
   - **Secret Access Key** (maps to `S3_SECRET_ACCESS_KEY`)
8. Identify your **S3 Endpoint** in the Cloudflare R2 page under bucket settings. It will have the format:
   `https://[account-id].r2.cloudflarestorage.com`
9. Under the Bucket's **Settings** tab, configure **Public Access**:
   - You can connect a custom domain (e.g., `resumes.yourdomain.com`) or enable the Cloudflare R2 Managed subdomain.
   - Copy this URL and save it as `S3_PUBLIC_URL` (no trailing slash).

---

## 9. Production Deployment (Vercel)

Now that you have all infrastructure variables, deploy the code on Vercel:

1. **Prepare GitHub Repository**:
   - Push your code to a private or public GitHub repository.

2. **Create Vercel Project**:
   - Log in to the [Vercel Console](https://vercel.com).
   - Click **Add New** > **Project**.
   - Import your GitHub repository.

3. **Configure Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`

4. **Environment Variables**:
   - Under **Environment Variables**, expand the inputs and add all 20+ variables documented in Section 2.
   - Double-check that `NEXT_PUBLIC_APP_URL` is set to the final production domain name (e.g., `https://your-app.vercel.app`).

5. **Deploy**:
   - Click **Deploy**. Vercel will build the Next.js production bundle and spin up serverless routes.
   - Once completed, copy the production URL generated.

6. **Update Callback URIs**:
   - Go back to Google Developer Console, GitHub Developer Settings, and Cloudflare R2 to ensure the redirect callback URLs explicitly use the newly assigned Vercel URL instead of local addresses.

---

## 10. Post-Deployment Verification Checklist

Verify all services are interacting correctly in production:

- [ ] **Sign-in Flow**: Open your live URL. Attempt to register a user via Email/Password or OAuth. Check that the user profile details are populated in Supabase.
- [ ] **Email Verification**: Confirm that you receive SMTP verification links when creating credentials-based accounts.
- [ ] **Resume Upload**: Upload a test PDF resume in the dashboard.
  - Verify that the PDF is uploaded to Cloudflare R2 (check the R2 bucket file list).
  - Verify that the URL returns a readable document on the frontend.
- [ ] **QStash & Worker Queue**: Initiate a Resume parsing or Job Analysis action.
  - Confirm the API responds instantly with a job tracking ID.
  - Check Vercel function execution logs for POST `/api/workers`.
  - Confirm the job status updates to `COMPLETED` on the dashboard.
- [ ] **Gemini LLM Call**: Confirm that the Job Analysis page returns real skill breakdown keywords instead of placeholders.
- [ ] **Redis Cache**: Run a second duplicate job analysis. It should load near-instantly, indicating cache hits on Upstash Redis.
- [ ] **Audit Logs**: Query the database or view admin dashboards to confirm `AuditLog` rows are registered during logins and uploads.

---

## 11. Troubleshooting Guide

### A. prisma: "Timed out fetching connection from pool"
- **Cause**: Serverless functions spinning up concurrently exhaust Supabase connection limits.
- **Solution**:
  - Verify that `DATABASE_URL` connects via the Supabase pgBouncer pool port (`6543`) with `?pgbouncer=true` rather than the direct port (`5432`).
  - Make sure the Prisma Client instantiation follows the serverless configuration with a limited pool connection size.

### B. QStash: "Signature verification failed"
- **Cause**: The `QSTASH_CURRENT_SIGNING_KEY` does not match the key on Upstash console, or the headers are missing.
- **Solution**:
  - Re-copy keys from the Upstash Console.
  - Ensure Vercel environment variables do not contain accidental spaces or missing characters.
  - If developing locally and testing webhook loops, you can temporarily disable validation by clearing `QSTASH_CURRENT_SIGNING_KEY` from the target server env.

### C. Cloudflare R2: "Access Denied" or "Invalid Key"
- **Cause**: R2 token permissions were not set to Edit (Write), or S3 client configuration lacks custom Endpoint definitions.
- **Solution**:
  - Ensure `S3_ENDPOINT` points to `https://[account-id].r2.cloudflarestorage.com`.
  - Re-generate the Cloudflare R2 token and select "Edit" scope during token creation.

### D. SMTP/Email: "Authentication failed" / "Connection Timeout"
- **Cause**: Incompatible port configurations or Gmail accounts lacking App Passwords.
- **Solution**:
  - For standard STARTTLS, use port `587`.
  - If using Gmail SMTP, generate an **App Password** from your Google Account settings; raw account passwords will be blocked.

### E. NextAuth: "Invalid Redirect URL"
- **Cause**: Host mismatch or trailing slash issues.
- **Solution**:
  - Ensure `NEXT_PUBLIC_APP_URL` is identical to the Vercel project domain.
  - Confirm authorized callback URLs in Google Console and GitHub match the dynamic path `/api/auth/callback/[provider]` exactly.
