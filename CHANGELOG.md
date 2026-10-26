# Changelog

All notable changes to ShaadiSync will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [0.8.0] - Phase 8 QR Passes, Check-in, Gate Operations and Event-Day Attendance - 2026-10-27
### Added
- Schema migration `20261026000007_qr_passes_and_checkin.sql` introducing `checkin_gates`, `qr_passes`, `attendance_records`, and `checkin_audit_logs` tables with atomic concurrency protections, unique check-in constraints, and multi-tenant RLS policies.
- Event-specific QR pass lifecycle management: issuance, revocation with required audit reason, pass codes, and token hashes without exposing raw guest secrets.
- Concurrency-safe check-in engine (`scanCheckinAction` & `manualCheckinAction`) guaranteeing zero duplicate admissions through database unique constraints (`UNIQUE(event_id, guest_id)`) and instant duplicate scan alert reporting with prior timestamp and gate name.
- Supervisor manual check-in override workflow requiring an explicit recorded reason in `checkin_audit_logs`.
- Interactive Check-in Desk UI at `/dashboard/check-in` with live camera scanner simulator, manual token input, eligible guest roster search with 1-click admission/override, gate manifest stream, and CSV export.
- Real-time gate operations dashboard tracking eligible attendees, confirmed RSVPs, total admitted count, pending arrivals, and attendance rate.
- Automated test suite `tests/checkin.test.ts` (8 tests) verifying positive attendee pass constraints, revocation reasons, duplicate scan detection, supervisor override requirements, and ceremony scoping, expanding total test suite to 76 passed tests.
### Added
- Schema migration `20261026000006_parking_transport_accommodation.sql` introducing `parking_areas`, `parking_allocations`, `transport_vehicles`, `transport_trips`, `transport_passengers`, `accommodation_properties`, `rooms`, and `room_allocations` tables with multi-tenant RLS policies and constraints.
- Parking facility capacity management with valet, accessibility tags, vehicle type registration, slot numbers, and over-allocation guards.
- Shuttle route & transfer manifests managing origin, destination, meeting points, scheduled pickup timestamps, fleet vehicle capacities, and passenger assignments.
- Hotel & resort room inventory system tracking room types (standard, deluxe, suite, villa, dormitory), max occupancy limits, and conflict-free date-range allocations preventing double-booking race conditions.
- Interactive `/dashboard/logistics` module with Parking, Shuttle Transfers, and Hotel Room tabs, modal allocation dialogs, utilization KPIs, and client-side CSV manifest export.
- Automated test suite `tests/logistics.test.ts` (9 tests) verifying parking capacity limits, trip seat availability, check-in/check-out date ordering, max occupancy enforcement, and date-range conflict detection, expanding total test suite to 68 passed tests.
### Added
- Schema migration `20261026000005_budget_expenses_payments.sql` introducing `budget_allocations`, `expenses`, `payments`, and `financial_audit_logs` tables with constraints and Row Level Security (RLS) policies.
- Non-duplicative financial reconciliation engine (`getBudgetSummaryAction`) preventing double-counting between vendor contracts and linked expense records.
- Comprehensive payment voucher records supporting advance tokens, milestone payments, final settlements, refunds, and adjustments.
- Audit history logging for financial creations, updates, and balance adjustments via `financial_audit_logs`.
- Interactive `/dashboard/budget` view with planned-vs-actual variance tracking, category allocation tables, individual expense/contract rosters, payment voucher ledger, and client-side CSV ledger export.
- Standard Indian Rupee (₹ INR) precision calculations with lakh/crore delimiters and variance alerts (surplus/deficit).
- Automated test suite `tests/budget-expenses.test.ts` (8 tests) validating monetary formatting, budget variance, expense validation, refund handling, and vendor reconciliation, expanding total suite to 59 passed tests.
### Added
- Schema migration `20261026000004_catering_and_vendors.sql` introducing `vendors`, `vendor_assignments`, and `meal_plans` tables with database-generated `balance_due` column and Row Level Security (RLS) policies.
- Dynamic Catering Headcount Engine distinguishing confirmed attendees (adults + children), pending RSVPs, organiser-approved safety buffer (+5% to +20%), proposed catering quantities, and locked caterer guarantees.
- Explicit caterer guarantee sign-off workflow (`approveCateringGuaranteeAction`) preventing unapproved headcount commitments from being communicated to caterers or converted to actual orders.
- Comprehensive Vendor Directory with standard Indian wedding categories (caterer, decorator, photographer, videographer, makeup, dj, priest, florist, transport, venue, other).
- Multi-ceremony vendor assignments with service descriptions and scheduled arrival times.
- Contract financial tracking per vendor: quoted price, agreed price, advance paid, and calculated balance due in standard Indian Rupee (₹ INR) precision.
- Interactive Dashboard Views:
  - `/dashboard/catering`: Interactive banquet planner with ceremony meal cards, live headcount engine, buffer slider (+5% to +20%), caterer guarantee lock button, and printable caterer sheet.
  - `/dashboard/vendors`: Complete vendor directory table, filter by category/booking status, payment summary cards (Total Contracted, Advance Paid, Balance Due), and Add Vendor modal.
- Automated test suite `tests/catering-vendors.test.ts` (9 tests), verifying headcount isolation, zero attendance handling, ceiling buffer rounding, advance payment validation invariants, and guarantee approvals, expanding test suite to 51 passed tests.
### Added
- Schema migration `20261026000003_rsvps_and_tokens.sql` introducing `rsvps` table, token revocation, expiration timestamps, and RLS policies.
- Secure, zero-login public guest portal `/invite/[token]` providing function-by-function RSVP confirmations (Attending, Declined, Tentative).
- Minimal public disclosure enforcement: exposes only the guest's household and their specific invited ceremonies.
- Accompanying family member attendance count (adults/children) and dietary preference capture (Jain, Pure Veg, Non-Veg, Vegan, Allergies).
- Idempotent RSVP submission handling preventing duplicate rows while recording updated headcounts and timestamps.
- Zero-cost copyable WhatsApp invitation and reminder message generators (`src/lib/whatsapp.ts`) with direct `wa.me` intent links.
- Printable invitation card layout with browser print styles.
- Automated RSVP test suite `tests/rsvp.test.ts` (7 tests), expanding total test suite to 42 passed tests.

## [0.3.0] - Phase 3 Wedding, Event & Guest Management - 2026-10-26
### Added
- Schema migration `20261026000002_functions_households_guests.sql` for venues, events/functions, households, guests, and event_invitations.
- Row Level Security (RLS) policies for venues, ceremonies, households, guests, and per-function invitations.
- Server Actions for functions/events (`createEventAction`, `getEventsAction`, `deleteEventAction`) and guests (`createGuestAction`, `getGuestsAction`, `bulkImportGuestsAction`, `deleteGuestAction`).
- Zod validation schemas for wedding functions, households, guests, and CSV import rows with row-level error reporting.
- Robust CSV parser & validator (`src/lib/csv.ts`) handling quoted commas, multiline cells, missing columns, and VIP flag variants.
- CSV export capability for guests with per-function invitation counts.
- Interactive modal UI for creating ceremonies, adding individual guests, and bulk importing CSV with live error feedback.
- Automated test suites: `tests/csv.test.ts` (8 tests) and `tests/crud.test.ts` (5 tests), bringing total test suite to 35 passed tests.

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

