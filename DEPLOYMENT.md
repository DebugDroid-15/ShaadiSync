# ShaadiSync — Production Deployment Guide & Operations Runbook

> **Proprietary Software**  
> Copyright © 2026 Team SHATRUJEET (Amar Khera, Ananya Rout, Lucky Kumar, Omm Prakash Sahoo). All Rights Reserved.  
> Confidential and Closed-Source.

---

## 1. Hosting Architecture & Target Selection

ShaadiSync is engineered with Next.js 15 App Router, React 19, Server Actions, and Edge Middleware.

### Recommended Provider: Vercel (Hobby / Pro)
- **Compatibility:** Native Next.js 15 execution, automatic Edge Middleware routing, zero-config Server Actions support, instant preview deployments on Git branch pushes.
- **Pricing:**
  - *Hobby Tier ($0/month):* 100 GB bandwidth, unlimited serverless function execution within fair-use limits, ideal for MVP trials and initial weddings.
  - *Pro Tier ($20/seat/month):* Enhanced concurrency, custom team access, and enterprise SLA if scaling across hundreds of concurrent concurrent weddings.
- **Trade-offs:** Serverless architecture means functions have cold starts (typically < 300ms) and execution time limits (15s on Hobby, 60s on Pro). This is optimal for wedding SaaS web traffic patterns.

### Alternative Target: Node.js Docker Container (AWS ECS / DigitalOcean / Render)
- For self-hosted on-premise deployments where client data residency laws demand local Indian server locations (e.g., AWS Mumbai `ap-south-1`).
- Standalone build enabled via `next build` with Node.js 20+ runtime.

---

## 2. Environment Variables & Secret Management

All environment variables must be configured in the deployment target dashboard (Vercel Project Settings > Environment Variables). **Never commit production credentials to Git.**

| Variable Name | Environment | Server/Client | Description | Source / Rotation Guide |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Staging / Prod | Browser Public | Canonical base URL used for QR pass generation, WhatsApp invite links, and redirects. | Production domain (e.g. `https://shaadisync.vercel.app` or custom domain). Update upon domain transition. |
| `NEXT_PUBLIC_SUPABASE_URL` | Staging / Prod | Browser Public | HTTPS endpoint for Supabase PostgreSQL REST & Auth API. | Supabase Dashboard > Project Settings > API. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Staging / Prod | Browser Public | Client JWT API key with Row Level Security enforced. Safe for browser usage. | Supabase Dashboard > Project Settings > API. Rotate via Supabase console if compromised. |
| `SUPABASE_SERVICE_ROLE_KEY` | Staging / Prod | **Server-Only (Secret)** | Elevated administrative key bypassing RLS. Must **never** be exposed in browser bundles or client code. | Supabase Dashboard > Project Settings > API (Service Role Key). Immediate revocation in Supabase console if leaked. |

### Secret Leakage Prevention Checklist
- [x] `.env`, `.env.local`, `.env.production` are strictly listed in `.gitignore`.
- [x] Zero hardcoded keys or database passwords exist in the Git tree (`git log -S` audited).
- [x] Middleware and Server Actions only access `SUPABASE_SERVICE_ROLE_KEY` on server runtimes.

---

## 3. Supabase Production Database Setup

### Migration Execution
All migrations located in `supabase/migrations/` are deterministic and ordered chronologically:

1. `20261026000001_initial_schema.sql` — Profiles, Organisations, Weddings, Roles, RLS foundations.
2. `20261026000002_functions_households_guests.sql` — Events, Households, Guests, Per-event invitations.
3. `20261026000003_rsvps_and_tokens.sql` — Tokenized RSVP submissions, dietary needs, revocation.
4. `20261026000004_catering_and_vendors.sql` — Vendor directory, meal plans, headcount buffers, guarantees.
5. `20261026000005_budget_expenses_payments.sql` — Rupee budgets, vendor advances, balance reconciliation.
6. `20261026000006_parking_transport_accommodation.sql` — Valet slots, transport manifests, hotel rooms.
7. `20261026000007_qr_passes_and_checkin.sql` — High-entropy QR passes, gate scan locks, duplicate alert logs.

To apply migrations to a staging or production Supabase instance:

```bash
# Link local CLI to your Supabase cloud project
npx supabase link --project-ref <your-project-ref>

# Push migrations sequentially
npx supabase db push

# Verify migration status
npx supabase migration list
```

> [!CAUTION]
> **NEVER run `npx supabase db reset` on production.** That command wipes all tables and applies `seed.sql`. Seeding is strictly for local development and non-production testing.

### Backup & Disaster Recovery Strategy
1. **Daily Automated Backups:** Supabase Pro plans include automated daily backups with 7-day retention. Free tier users must configure scheduled schema and table dumps via `pg_dump`:
   ```bash
   pg_dump "postgres://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" > backup_$(date +%Y%m%d).sql
   ```
2. **Point-in-Time Recovery (PITR):** Recommended for live event days with > 1,000 attendees to prevent accidental gate record loss.
3. **Rollback Plan:**
   - In case of critical migration failure, write an explicit compensating migration (`2026102..._rollback_*.sql`) rather than running raw destructive `DROP TABLE` statements on live data.

---

## 4. Operational Release Checklist

Before marking a deployment live:

### 4.1 Automated Validation
- [x] `npm test` passes 100% (84 tests across 12 suites).
- [x] `npm run type-check` passes with 0 errors.
- [x] `npm run lint` reports 0 errors and 0 warnings.
- [x] `npm run build` compiles 19 static routes, dynamic routes, and Edge Middleware without warnings.

### 4.2 Security Boundaries
- [x] HTTP security headers active: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- [x] CSP active with strict script and frame restriction (`frame-ancestors 'none'`).
- [x] CSV export formula injection defense active (`=`, `+`, `-`, `@`, `\t`, `\r` escaped).
- [x] Row Level Security (RLS) active on all relational tables.
- [x] Public token endpoints (`/invite/[token]`) expose only household & event details, never sensitive organizer financial records.

### 4.3 Gate Check-in Operational Verification
- [x] Real-time gate scan rejects duplicate scans with instant alert notices.
- [x] Manual pass token fallback operational for offline/poor connectivity scenarios.
- [x] Supervisor override actions require recorded reason logged to `checkin_audit_logs`.

---

## 5. Live Production Deployment Procedure

When deployment access is authorized by the project owners:

1. **Push Changes to GitHub:**
   ```bash
   git push origin main
   ```
2. **Deploy to Vercel:**
   - If connected via Vercel GitHub integration: Vercel triggers build automatically upon push.
   - If using Vercel CLI:
     ```bash
     # Preview deployment
     vercel

     # Production deployment (Requires explicit authorization)
     vercel --prod
     ```
3. **Post-Deployment Smoke Verification:**
   - Verify HTTPS certificate is active.
   - Test `/` (Marketing Landing Page).
   - Test `/login` and authentication redirection.
   - Test sample `/invite/[token]` public RSVP load.
   - Test `/dashboard/check-in` scanner simulator & manual pass input.
   - Check browser DevTools console for CSP violations or asset 404s.

---

## 6. Incident Handling & Rollback Runbook

| Scenario | Severity | Action |
| :--- | :--- | :--- |
| **Edge Middleware Failure / 500 Errors** | P0 | Revert deployment immediately in Vercel dashboard: **Deployments > [Previous Good Deployment] > Promote to Production**. Rollback takes < 5 seconds. |
| **Database Connection Exhaustion** | P1 | Enable Supabase Connection Pooling (Transaction Mode via Supavisor port 6543) in `DATABASE_URL`. |
| **Compromised Service Role Key** | P0 | 1. Go to Supabase Console > Project Settings > API.<br>2. Generate a new Service Role Key.<br>3. Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel.<br>4. Trigger a production redeploy.<br>5. Revoke the old key. |
| **Gate Device Camera Access Blocked** | P2 | Inform gate staff to switch to the **Manual Token Entry** tab or use the **Attendee Roster** 1-click admission button on `/dashboard/check-in`. |
