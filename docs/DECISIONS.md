# ShaadiSync — Architecture Decision Records (ADR)

## ADR 001: Next.js App Router with TypeScript Strict Mode
- **Date:** 2026-10-26
- **Status:** Accepted
- **Context:** ShaadiSync requires high-performance server-side rendering, fast routing, and strict type safety for mission-critical wedding event operations.
- **Decision:** Use Next.js 15+ with React 19, TypeScript in strict mode, and App Router architecture.
- **Consequences:** Enables React Server Components for zero-bundle data fetching, strong type inference, and optimal SEO for marketing pages.

## ADR 002: Zero-Cost External Communication Pattern
- **Date:** 2026-10-26
- **Status:** Accepted
- **Context:** Commercial SMS and WhatsApp Business APIs introduce ongoing monthly fees and per-message costs, violating the ₹0 MVP budget.
- **Decision:** Implement zero-cost copyable WhatsApp Web intent URIs (`https://wa.me/?text=...`), downloadable calendar `.ics` files, and printable cards.
- **Consequences:** Provides instant utility to planners and families with zero infrastructure bills. Commercial API integrations can be added as optional paid enterprise tiers later.

## ADR 003: Compound Multi-Tenant Isolation with Supabase RLS
- **Date:** 2026-10-26
- **Status:** Accepted
- **Context:** A wedding planner organization manages multiple independent weddings, each with sensitive guest, accommodation, and financial data.
- **Decision:** Enforce compound scoping (`organisation_id` + `wedding_id`) on all relational tables, backed by Row Level Security (RLS) policies in PostgreSQL.
- **Consequences:** Eliminates accidental cross-tenant data leaks at the database level even if application code contains defects.

## ADR 004: Proprietary Closed-Source Intellectual Property Policy
- **Date:** 2026-10-26
- **Status:** Accepted
- **Context:** ShaadiSync is developed by Team SHATRUJEET as proprietary commercial software.
- **Decision:** Protect all original code, schemas, and assets under proprietary licensing drafts (`LICENSE_PROPRIETARY.md`). No copyleft or open-source licenses will be applied to original project code.
- **Consequences:** Preserves full intellectual property rights for the founding team while respecting third-party open-source library licenses.

