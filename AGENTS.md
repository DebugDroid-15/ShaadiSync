# ShaadiSync — Agent Operations & Autonomous Engineering Directives

## 1. Operating Rules for AI Agents
When contributing code or executing development phases on ShaadiSync, agents must adhere to the following strict principles:

1. **Phase Discipline:** Execute only the currently authorized phase. Never jump ahead to unapproved phases or generate premature stub modules without verification.
2. **Persistence First:** Never substitute mock static arrays for real database persistence once a phase calls for database integration.
3. **Evidence-Based Verification:** Never report that tests or builds passed without running the relevant commands and inspecting exit codes and logs.
4. **Zero Secrets in Git:** Never commit secrets, service-role keys, passwords, or personal guest data to Git.
5. **Preserve Documentation & Code:** Update living documents (`docs/PROGRESS.md`, `docs/DECISIONS.md`, `docs/KNOWN_ISSUES.md`, `CHANGELOG.md`) after completing each phase.
6. **Proprietary Software Policy:** Treat ShaadiSync as closed-source proprietary software belonging to Team SHATRUJEET. Never apply copyleft or open-source licenses to original code.
7. **Monetary Safety:** Always use explicit decimal precision and standard INR (₹) formatting. Never misrepresent planned budgets as completed payments.

