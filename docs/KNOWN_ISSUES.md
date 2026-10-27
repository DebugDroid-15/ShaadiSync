# ShaadiSync — Known Issues & Technical Debt Tracker

## Active Issues & Pending Items (Phase 1 Baseline)

| Issue ID | Severity | Phase Identified | Component | Description | Mitigation / Planned Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISSUE-001** | Low | Phase 1 | Backend | Supabase live backend not yet provisioned; app displays graceful unconfigured banner. | Will be provisioned in Phase 2 with full migration and RLS scripts. |
| **ISSUE-002** | Informational | Phase 1 | Dependencies | Recharts v2 emits deprecation warning on npm install recommending migration to v3. | Monitor Recharts v3 stability; current v2 is stable for Phase 1 charts. |
| **ISSUE-003** | Low | Phase 1 | Legal | Proprietary contributor assignment deeds are in draft state pending legal execution. | Documented in `IP_AND_LICENSING.md` and `LICENSE_PROPRIETARY.md`. |
| **ISSUE-004** | Low | Phase 8 | Gate Check-in | Browser native camera scanning requires user permission and secure HTTPS/localhost context. | Built-in fallback to manual 8-character token entry, scanner simulation injection, and attendee search roster. |
| **ISSUE-005** | Low | Phase 9 | Catering Headcount | Caterer legal guarantees are legally binding and do not automatically mutate upon on-day check-in variations. | Enforced by design: Caterer Guarantee sign-off is an immutable signed audit record; actual physical check-ins are tracked separately to verify vendor SLA fulfillment without modifying agreed bills. |


