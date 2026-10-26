# ShaadiSync — Security Architecture and Permission Model

## 1. Security Overview
ShaadiSync enforces a defense-in-depth security architecture protecting multi-tenant wedding data. Security controls operate across three distinct tiers:
1. **Network & Application Edge:** Strict HTTPS, input validation with Zod, CSRF mitigation, Content Security Policy headers, and rate-limiting.
2. **Server Execution Boundary:** Server Actions and Route Handlers validating user authentication via Supabase Auth and verifying tenant membership before executing business logic.
3. **Database Layer (Supabase RLS):** Row Level Security (RLS) active on all production tables ensuring multi-tenant isolation even in case of application-level bugs.

## 2. Role-Based Access Control (RBAC) Matrix

| Resource / Action | Org Owner | Org Admin | Wedding Lead | Coordinator | Check-in Staff | Guest (Public Token) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Manage Organisation & Billing** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Invite Org Members** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Create / Archive Weddings** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Manage Wedding Details & Venues**| ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **View Guests & RSVPs** | ✅ | ✅ | ✅ | ✅ | Read Only | ❌ |
| **Import / Edit / Delete Guests** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Public RSVP Portal** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Self Token Only) |
| **Catering Headcounts & Menu** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Budget & Expense Management** | ✅ | ✅ | ✅ | Read Only | ❌ | ❌ |
| **Vendor Contracts & Balances** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Logistics (Rooms/Vehicles)** | ✅ | ✅ | ✅ | ✅ | Read Only | ❌ |
| **Event-Day Check-in Desk** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Manual Check-in Override** | ✅ | ✅ | ✅ | ✅ | Audit-Logged | ❌ |
| **View Audit Logs** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

## 3. Data Isolation Guarantees
- **No Cross-Organisation Leakage:** Every wedding record strictly references `organisation_id`. Users can only query weddings associated with their active organisation memberships.
- **Wedding Staff Scoping:** `wedding_members` controls access at the wedding level. A coordinator assigned to Wedding A cannot read or modify data in Wedding B even within the same organisation.
- **Check-in Staff Confinement:** Check-in staff accounts are strictly prohibited from viewing financial balances, vendor contract prices, or sensitive family accommodation notes.
- **Public Guest Token Minimization:** Public guest invitation links (`/invite/[token]`) reveal only the specific guest's name, their household members, and the specific events to which they are explicitly invited. No global wedding guest list, other guest phone numbers, or vendor data is exposed.

## 4. Audit Trail Policy
All critical actions—specifically manual check-in status overrides, guest record deletions, vendor payment status changes, and role reassignments—record an immutable row in the `audit_logs` table containing user ID, timestamp, prior state, and new state. Ordinary users cannot modify or truncate the audit table.

