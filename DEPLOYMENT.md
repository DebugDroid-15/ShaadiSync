# ShaadiSync — Deployment Runbook & Environment Guide

## 1. Zero-Cost Hosting Strategy
ShaadiSync is built to run entirely on zero-cost tiers during development and initial production operation:
- **Frontend / Application Server:** Vercel (Hobby Tier) or Netlify (Starter Tier).
- **Database & Auth:** Supabase (Free Tier - 500MB PostgreSQL, 50k MAU).
- **Production Subdomain:** Provided standard provider subdomain (e.g., `shaadisync.vercel.app`), requiring zero custom domain expenditure for MVP.

## 2. Environment Variables Checklist

| Variable Name | Required Phase | Description | Example / Format |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Phase 1+ | Canonical base URL for app links & QR codes | `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Phase 2+ | Supabase project API endpoint URL | `https://xyzproject.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Phase 2+ | Supabase anonymous public API key | `eyJhbGciOiJIUz...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Phase 2+ | Supabase service role secret (Server only!) | `eyJhbGciOiJIUz...` |

> [!CAUTION]
> Never commit actual Supabase keys, database passwords, or secrets into source control. Always populate local values in `.env.local` which is strictly ignored in `.gitignore`.

## 3. Local Development Deployment Steps
```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript checks
npm run type-check

# 3. Run unit tests
npm run test

# 4. Start local development server
npm run dev
```

## 4. Production Release Checklist (Phase 10 Target)
1. Verify all migrations applied cleanly on production Supabase database.
2. Confirm Row Level Security (RLS) is enabled on all tables.
3. Configure environment variables in deployment dashboard (Vercel / Netlify).
4. Run production build test: `npm run build`.
5. Execute end-to-end smoke verification on live deployment URL.

