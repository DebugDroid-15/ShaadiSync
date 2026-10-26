# ShaadiSync — Product Requirements Document (PRD)

## 1. Product Summary
- **Product Name:** ShaadiSync
- **Category:** Indian Wedding Management and Event Operations SaaS Platform
- **Founding Team:** Team SHATRUJEET (Amar Khera, Ananya Rout, Lucky Kumar, Omm Prakash Sahoo)
- **Primary Audience:** Wedding planners, event management agencies, self-organising families, coordinators, catering/logistics managers, venue check-in staff.

## 2. Core Problem & Product Vision
Indian weddings are uniquely complex:
- Multiple multi-day sequential and overlapping functions (Roka, Haldi, Mehendi, Sangeet, Shaadi, Reception).
- Dynamic guest lists where guests are invited to selective functions (e.g., intimate Haldi vs grand Reception).
- Complex family/household groupings with bride-side vs groom-side relations.
- Interdependent logistics: room allocations, transportation pickups/drops, parking zones, and catering headcount guarantees that depend on real RSVP attendance.
- Operational chaos on event day: unverified walk-ins, food waste, gate bottlenecks, and disorganized communication.

**ShaadiSync** resolves this through a unified, mobile-first, zero-operational-cost SaaS platform providing a single source of truth across all 10 core operational pillars.

## 3. Product Scope & Functional Modules

### A. Public Marketing Website
- High-converting, responsive landing page showcasing the 10 core pillars.
- Live interactive feature highlights, how it works, planner & family value propositions, FAQ, responsive footer.
- Authentication navigation (Sign Up, Sign In).
- Privacy policy and terms placeholders adhering to the Digital Personal Data Protection Act (DPDPA 2023) guidelines.

### B. Authentication & Account Management
- Email/password authentication with Supabase Auth.
- Session handling, profile management, and role-based access.
- Protected application routes with graceful fallback when unconfigured.

### C. Multi-Organisation & Multi-Wedding Tenancy
- Planners manage multiple organisations.
- Organisations can run multiple independent weddings concurrently.
- Strict data isolation enforcing wedding-specific and tenant-specific boundaries.

### D. Wedding Functions (Events)
- Configurable sub-events per wedding (e.g., Roka, Mehendi, Haldi, Sangeet, Baarat, Pheras, Reception).
- Individual function scheduling (date, time, venue, Google Maps URL, capacity, notes).
- Per-function guest invitation tagging (a guest invited to Mehendi is NOT automatically invited to Pheras).

### E. Guest & Household Management
- Individual guest profiling (full name, phone, email, side: bride/groom/mutual, age group: adult/child).
- Household grouping (families managed together for invites and rooms).
- VIP tagging, dietary flags (Vegetarian, Jain, Non-Veg, Vegan, Allergies).
- Search, filter, bulk status updates, CSV import with validation, CSV export.

### F. Invitations & RSVP Engine
- Secure token-based public RSVP portal without requiring guest account creation.
- Function-by-function RSVP confirmation (Attending, Declined, Tentative).
- Accompanying family member confirmation with dietary selections.
- WhatsApp message generator (copyable personalized text with unique RSVP URL).

### G. Catering & Meal Operations
- Per-function meal plan management (Breakfast, Lunch, High Tea, Dinner).
- Dynamic headcount engine calculating:
  - Total Invited
  - Confirmed RSVP Attendees
  - Expected (Buffer-adjusted)
  - Actual Checked-in
- Caterer guarantee report minimizing costly food waste.

### H. Vendor Management
- Directory of vendors (Caterers, Decorators, Photographers, DJs, Pandits, Florists, Transport).
- Contracts, agreed budgets, advance paid, outstanding balance, arrival schedules.

### I. Budget & Financial Operations
- Wedding-level and category-level budget tracking in Indian Rupees (₹ INR).
- Planned vs Actual expenditure, advance vouchers, due dates, cost-per-confirmed-guest metrics.

### J. Logistics: Parking, Transport & Accommodation
- **Parking:** Zone capacities, vehicle registration tracking, conflict-free pass allocations.
- **Transport:** Fleet management, driver contact cards, flight/train arrival pickup groups, shuttle dispatch schedules.
- **Accommodation:** Hotel inventory, room type capacity (Double/Triple), family room assignments, unallocated guest alerts.

### K. Tasks & Event-Day Check-in
- Task boards with deadlines, assignees, and function linkages.
- Event-day mobile check-in desk:
  - Camera-based QR pass scanner.
  - Ultra-fast manual search fallback (by name, phone, or household).
  - Function-specific check-in with duplicate prevention and audit timestamps.

### L. Audit & Operational Analytics
- Real-time dashboard showing unique guests, per-function attendance rates, catering headcount, and budget variance.
- Immutable audit log for sensitive check-in overrides and financial edits.

## 4. Technical Constraints & Zero-Cost Mandate
- Frontend: Next.js (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons, Recharts.
- Backend: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS).
- ₹0 API budget: Zero paid SMS/WhatsApp gateways, zero paid maps APIs (use standard URLs), zero paid analytics.

