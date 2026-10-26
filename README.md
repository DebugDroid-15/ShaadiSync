# ShaadiSync

> **Complete Indian Wedding Management and Event Operations SaaS Platform**  
> Engineered by **Team SHATRUJEET** (Amar Khera, Ananya Rout, Lucky Kumar, Omm Prakash Sahoo).

[![Proprietary Software](https://img.shields.io/badge/Licence-Proprietary-red.svg)](./LICENSE_PROPRIETARY.md)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](./tsconfig.json)
[![Zero Cost Budget](https://img.shields.io/badge/MVP%20Cost-%E2%82%B90-green.svg)](./FREE_TIER_BUDGET.md)

---

## 1. Product Overview

ShaadiSync is a dedicated, production-grade SaaS platform built to handle the operational complexities of multi-day Indian weddings. It unifies wedding guest lists, per-function invitations, RSVP tracking, banquet catering guarantees, vendor payments, parking passes, transport dispatch, hotel room allocations, and event-day gate check-in into a single browser-based operating system.

### Key Pillars
- **Zero-Cost Operation (₹0 MVP Budget):** Requires zero paid external APIs (no paid SMS, Twilio, or Google Maps keys).
- **Multi-Tenant & Multi-Wedding:** Organisers can manage multiple independent weddings with absolute data isolation.
- **Selective Function Invitations:** Indian weddings have distinct ceremonies (Roka, Haldi, Mehendi, Sangeet, Shaadi, Reception). Guests are invited selectively without artificial data duplication.
- **Catering Guarantee Engine:** Dynamically calculates guaranteed catering headcounts based on confirmed RSVPs and configurable buffers to eliminate expensive banquet food waste.
- **Offline-Ready Gate Check-in:** Browser-based QR pass scanning and instantaneous manual guest lookup.

---

## 2. Technical Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript (Strict), Tailwind CSS.
- **Icons & Visuals:** Lucide Icons.
- **Analytics:** Recharts.
- **Form Handling:** React Hook Form with Zod validation.
- **Backend & Database:** Supabase PostgreSQL with Row Level Security (RLS).
- **Testing:** Vitest, Testing Library.
- **Design Tokens:** Deep Navy (`#172B4D`), Warm Ivory (`#FAF8F2`), Muted Gold (`#C6A15B`), Slate neutrals.

---

## 3. Project Documentation Directory

- [Product Requirements Document (PRD)](./PRD.md)
- [System Architecture Specification](./ARCHITECTURE.md)
- [Relational Database Schema Specification](./DATABASE_SCHEMA.md)
- [Security Model & RBAC Matrix](./SECURITY_MODEL.md)
- [10-Phase Engineering Roadmap](./ROADMAP.md)
- [Quality Assurance & Test Plan](./TEST_PLAN.md)
- [Zero-Cost Budget & Quotas](./FREE_TIER_BUDGET.md)
- [Deployment Runbook](./DEPLOYMENT.md)
- [Proprietary Licence Draft](./LICENSE_PROPRIETARY.md)
- [Copyright Notice](./COPYRIGHT.md)
- [Notices & Third-Party Licences](./NOTICE.md)
- [IP, Patents & Licensing Strategy](./IP_AND_LICENSING.md)
- [Contributors](./CONTRIBUTORS.md)
- [Living Progress Tracker](./docs/PROGRESS.md)
- [Architecture Decision Records (ADR)](./docs/DECISIONS.md)
- [Known Issues & Technical Debt](./docs/KNOWN_ISSUES.md)

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js v26.7)
- npm 10+

### Local Setup
```bash
# Clone the repository
git clone https://github.com/DebugDroid-15/ShaadiSync.git
cd ShaadiSync

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local

# Run test suite
npm run test

# Run type check
npm run type-check

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 5. Proprietary License Notice
Copyright © November 2026, Team SHATRUJEET. All rights reserved.  
This software is proprietary and closed-source. Unauthorized reproduction, modification, distribution, or commercial exploitation is strictly prohibited. See [LICENSE_PROPRIETARY.md](./LICENSE_PROPRIETARY.md) for full terms.

