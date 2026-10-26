# ShaadiSync — System Architecture Specification

## 1. High-Level Architectural Overview

ShaadiSync is engineered as a modern, high-performance, mobile-first web application deployed on serverless infrastructure. It utilizes Next.js App Router for frontend presentation and server-side orchestration, paired with Supabase PostgreSQL as the system of record.

```
                    +------------------------------------------+
                    |                Client Layer              |
                    |  (Next.js App Router, React 19, Tailwind) |
                    +--------------------+---------------------+
                                         |
                       HTTPS / JSON      |
                                         v
                    +------------------------------------------+
                    |           Next.js Server Layer           |
                    |  (Server Components, Actions, Routes)    |
                    |  - Session Verification                  |
                    |  - Input Validation (Zod)                |
                    |  - Tenant & Wedding Scoping              |
                    +--------------------+---------------------+
                                         |
                                         | Supabase SSR Client
                                         | (PostgREST / Auth)
                                         v
                    +------------------------------------------+
                    |          Persistence & Security          |
                    |           Supabase PostgreSQL           |
                    |  - Row Level Security (RLS)              |
                    |  - Relational Foreign Keys & Checks      |
                    |  - Audit Log Triggers                    |
                    +------------------------------------------+
```

## 2. Directory Layout
```
ShaadiSync/
├── src/
│   ├── app/
│   │   ├── (auth)/                  # Auth routes (login, register, forgot-password)
│   │   ├── (marketing)/             # Public landing, features, pricing/zero-cost, terms, privacy
│   │   ├── (rsvp)/                  # Public guest RSVP portal (/invite/[token])
│   │   ├── dashboard/               # Authenticated multi-tenant organiser portal
│   │   │   ├── page.tsx             # Primary operational overview
│   │   │   ├── weddings/            # Wedding selector & creator
│   │   │   ├── [weddingId]/         # Wedding-specific workspace
│   │   │   │   ├── functions/       # Multi-event management
│   │   │   │   ├── guests/          # Guest & household directory, CSV import/export
│   │   │   │   ├── invitations/     # RSVP & shareable link generator
│   │   │   │   ├── catering/        # Meal planning & guaranteed headcounts
│   │   │   │   ├── vendors/         # Vendor contracts & balances
│   │   │   │   ├── budget/          # Expense tracking & variance
│   │   │   │   ├── logistics/       # Parking, transport, accommodation
│   │   │   │   ├── check-in/        # QR pass & manual search check-in desk
│   │   │   │   └── tasks/           # Timeline & operations checklists
│   │   ├── api/                     # Server Route Handlers (health, exports, webhooks)
│   │   ├── layout.tsx               # Root layout with providers & fonts
│   │   └── globals.css              # Tailwind & theme variables
│   ├── components/
│   │   ├── ui/                      # Reusable atom components (button, input, card, dialog, badge, table)
│   │   ├── layout/                  # Shell, header, sidebar, mobile nav, user menu
│   │   ├── marketing/               # Landing page hero, features, FAQ, footer
│   │   └── dashboard/               # Wedding switcher, operational stats cards, empty states
│   ├── lib/
│   │   ├── supabase/                # Browser, server, and admin Supabase clients
│   │   ├── utils.ts                 # Class merger (cn), INR currency formatter, date utilities
│   │   ├── validations/             # Zod validation schemas
│   │   └── mock-data.ts             # Fictional seed data for Phase 1 development
│   └── types/
│       ├── database.ts              # Generated Supabase database TypeScript definitions
│       └── models.ts                # Application domain models & view types
├── docs/                            # Living project tracking & decisions
├── public/                          # Static assets and icons
└── tests/                           # Vitest unit & integration tests
```

## 3. Core Architectural Decisions
1. **Server-First Data Fetching:** Data fetching occurs primarily in React Server Components to minimize client bundle size and latency.
2. **Strict Multi-Tenancy:** All operational queries enforce compound scoping (`organisation_id` + `wedding_id`). Supabase RLS enforces these boundaries in the database layer.
3. **Optimistic Zero-Cost External Integrations:**
   - WhatsApp messaging relies on standard URI schemes (`https://wa.me/?text=...`) without requiring Twilio or WhatsApp Cloud API.
   - Map directions utilize standard Google Maps and OpenStreetMap URLs.
   - Reporting uses client-generated CSV and printable CSS layouts.
4. **Resilient Offline-Ready Gate Check-in:** Check-in desk incorporates client-side fuzzy search caching and queueing so event-day operations continue seamlessly even under spotty venue connectivity.

