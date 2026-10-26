# ShaadiSync — Comprehensive Test Strategy and Quality Assurance Plan

## 1. Quality Assurance Philosophy
ShaadiSync prioritizes production reliability, especially for event-day operations where system failure directly impacts wedding celebrations. The test plan combines automated unit testing, database security testing, integration testing, and mobile end-to-end verification.

## 2. Test Pyramid & Automation Levels

```
                     / \
                    /   \
                   / E2E \       Playwright / Browser tests for critical paths:
                  /-------\      (Guest RSVP -> Catering update -> Gate Check-in)
                 /  Integ  \     Vitest Integration tests:
                /-----------\    (Multi-tenant RLS isolation, CSV import parser)
               /  Unit Tests \   Vitest Unit tests:
              /---------------\  (Zod schemas, headcount math, currency formatting)
```

## 3. Test Suites by Phase

### Phase 1 Tests (Foundation)
- **Unit: Formatting & Currency Utilities:** Verify Indian numbering format (e.g., ₹1,50,000.00) and currency arithmetic precision.
- **Unit: Validation Schemas:** Validate Zod schemas for guest records, phone validation (+91 format), and wedding dates.
- **UI Component Smoke Tests:** Verify Button, Card, Badge, Table, and Nav components render without syntax or hydration errors.

### Phase 2 Tests (Auth & Multi-Tenancy Security)
- **RLS Boundary Tests:** Verify that user from Organisation A receives 0 rows when attempting to select records from Organisation B.
- **Wedding Coordinator Scoping:** Ensure coordinators cannot access financial expense tables.
- **Graceful Unconfigured Fallback:** Confirm application presents a helpful setup banner when Supabase keys are absent, rather than crashing with unhandled runtime errors.

### Phase 3 Tests (Weddings & Guests)
- **CSV Import Stress & Error Handling:** Test importing 1,000 guest records with malformed emails, missing phone numbers, and duplicate entries. Verify error report returns exact line numbers.
- **Selective Function Tagging:** Ensure guests tagged for Event 1 are not returned in queries for Event 2.

### Phase 4 Tests (RSVP Engine)
- **Token Security:** Verify invitation tokens cannot be forged or enumerated sequentially.
- **Idempotency & Concurrent Submissions:** Ensure submitting an RSVP multiple times updates the existing record without generating duplicate rows.
- **Accompanying Headcount Integrity:** Ensure child and adult counts adhere to positive integer constraints.

### Phase 5 Tests (Catering & Vendors)
- **Headcount Calculation Engine:**
  - Formula: `Guaranteed Headcount = ceil(Confirmed RSVP + (Confirmed RSVP * Buffer%))`
  - Verify pending RSVPs are strictly omitted from confirmed catering figures.
- **Vendor Balance Invariant:** Ensure `total_contract_amount = advance_paid + balance_due`.

### Phase 6 Tests (Budget & Expenses)
- **Monetary Arithmetic:** Zero floating-point rounding errors across 10,000 ledger calculations.
- **Role Restriction:** Check-in staff query against `/api/expenses` returns HTTP 403 Forbidden.

### Phase 7 & 8 Tests (Logistics & Check-in Desk)
- **Capacity Constraint Checks:** Prevent assigning 3 adults to a standard 2-person hotel room.
- **QR Code Check-in Idempotency:** First scan records valid check-in; second scan immediately triggers duplicate alert with original timestamp.
- **Offline / Degraded Mode:** Gate search functions with cached guest index when camera is unavailable.

## 4. Test Execution Commands
- Unit & Component Tests: `npm run test`
- Type Verification: `npm run type-check`
- Code Quality & Linting: `npm run lint`
- End-to-End Suite: `npx playwright test` (Phases 9 & 10)

