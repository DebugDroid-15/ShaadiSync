# Changelog

All notable changes to ShaadiSync will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [0.2.0] - Phase 2 Backend, Authentication & Multi-Tenant Security - 2026-10-26
### Added
- Complete PostgreSQL schema migration `20261026000001_initial_schema.sql` covering profiles, organisations, organisation_members, weddings, and wedding_members.
- Database-enforced Row Level Security (RLS) policies with security-definer functions: `is_org_member`, `is_org_admin`, and `can_access_wedding`.
- Reproducible multi-tenant seed script `supabase/seed.sql` with deterministic testing fixtures.
- Supabase SSR and Client architecture (`src/lib/supabase/client.ts`, `server.ts`, `admin.ts`, `middleware.ts`).
- Server Actions for authentication (`signInAction`, `signUpAction`, `signOutAction`) and multi-tenant wedding scoping (`getWeddingsAction`, `createWeddingAction`).
- Interactive registration and login forms with error handling and validation.
- Automated security test suite `tests/security.test.ts` validating cross-organisation boundary isolation, cross-wedding access barriers, unauthenticated blocks, and role privileges (9/9 security tests passed).

## [0.1.0] - Phase 1 Foundation - 2026-10-26
### Added
- Canonical repository initialization and connection to `https://github.com/DebugDroid-15/ShaadiSync`.
- Complete proprietary licensing suite: `LICENSE_PROPRIETARY.md`, `COPYRIGHT.md`, `NOTICE.md`, `IP_AND_LICENSING.md`, `CONTRIBUTORS.md`.
- Complete architectural specifications: `PRD.md`, `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `SECURITY_MODEL.md`, `ROADMAP.md`, `TEST_PLAN.md`, `FREE_TIER_BUDGET.md`.
- Environment variable configuration template (`.env.example`).
- Next.js App Router project setup with React 19, TypeScript strict mode, and Tailwind CSS.
- ShaadiSync design token system (Deep Navy `#172B4D`, Warm Ivory `#FAF8F2`, Muted Gold `#C6A15B`, Slate neutrals).
- Reusable UI component library: Button, Card, Badge, Table, Input, Dialog, StatusIndicators, Skeletons.
- Responsive public marketing landing page (Hero, 10-Pillar Feature Matrix, How It Works, Planner vs Family Benefits, Interactive FAQ, Accessible Footer).
- Responsive Organiser Dashboard shell with wedding context switcher, side navigation, mobile drawer, operational metric cards, and representative empty states.
- Vitest unit testing configuration and initial utility test suite.
- Verification and progress tracking documentation (`docs/PROGRESS.md`, `docs/DECISIONS.md`, `docs/KNOWN_ISSUES.md`).

