# Backlog

Items captured during cleanup / reconciliation that we don't want to lose but aren't doing right now. Promoted into Phase 3+ sessions when prioritised.

---

## From the deletion of `services/ai-tutor` (TS, deleted 2026-05)

The TypeScript ai-tutor was orphaned (not in docker-compose) and superseded by the Python `eureka/services/tutor-llm`. We deleted it, but it had a few features worth porting eventually. The original code lives at git SHA before deletion if anyone wants to reference it.

**Port targets** (into `eureka/services/tutor-llm`, mapped to Phase 6):
- [ ] Server-Sent Events streaming endpoint (`POST /api/v1/tutor/ask-stream`). The `stream_anthropic_response()` and `stream_openai_response()` already exist in `app/ai/ai_integration.py:269+` — they just need a FastAPI `StreamingResponse` wrapper. Phase 6.1.
- [ ] Symbolic equation solver as a tool the tutor can call (was a separate endpoint in ai-tutor; better as a tool in the Phase 6.2 tool-use loop). Reference: SymPy.
- [ ] Sandboxed code execution as a tool (Python + JS, 5s timeout). Phase 6.2 tool. Be careful: this is a serious sandbox-escape risk — use a real runner like `pyodide` (browser-side) or `judge0` (server-side) rather than rolling our own.
- [ ] Subject-specific expert system prompts (Math, Physics, Chemistry, Biology, CS). The ai-tutor seed-knowledge script (345 LOC) is a good source. Phase 6.2.
- [ ] Knowledge seeding script — port the seed-knowledge.ts logic into a Python migration that pre-populates pgvector with curriculum chunks. Phase 5.1.

**Already done as part of deletion:**
- [x] `services/platform-orchestrator/src/middleware/serviceProxy.ts` repointed `/api/ai-tutor` → `tutor-llm:8000/api/v1/tutor`.
- [x] Compose entry removed (there wasn't one — service was orphaned).
- [x] References in `apps/web` and `helm/Chart.yaml` rechecked and updated.

---

## From the deletion of `eureka/services/pro-med` (deleted 2026-05)

`pro-med` was a 25-line FastAPI stub. The real medical-school logic (USMLE, OSCE, clinical cases, AI tutor, 30+ endpoints, 10 DB tables, 4,700 LOC) lives in `eureka/services/medical-school/` (NestJS).

**Stack consistency** (future, post Phase 7 — not blocking):
- [ ] Port medical-school from NestJS to FastAPI to match the rest of the Python stack. Estimated 3–4 weeks. Only worth doing if Python homogeneity becomes a hard requirement (e.g., shared FastAPI auth middleware, common observability tooling, single requirements footprint). For now, NestJS is fine — it works and it's mature.

---

## From the deletion of `eureka/apps/web-{hs,ug,grad}` (deleted 2026-05)

These were three Next.js scaffolds with only README + package.json. Real tier UI lives at `eureka/apps/web/src/app/tiers/[tier]/` with dynamic routing. Nothing to port.

---

## Items from Session 3.6 (frontend cleanup — deferred)

- [ ] **Pre-existing TS errors** outside the ai-tutor/test-prep pages: Three.js imports (`three/examples/jsm/...`) and several tier pages have type issues. `next.config.js` sets `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` so the build ships; the errors don't block CI. Fix incrementally and flip the flag back to false.
- [ ] **Storybook** for the ~30 most-used components. Roadmap Session 3.6 called for it; deferred to keep the session bounded — the build-gate work was the immediate blocker for everything downstream.
- [ ] **Lighthouse CI** with score ≥ 90 on home + dashboard. Same reason as Storybook.
- [ ] **Design tokens file** (`src/styles/tokens.css`) — the dirs are already shadcn'd; consolidating the colour/spacing/type scale into tokens is a separate small task.

## Items from Session 3.3 (auth + tenancy hardening)

- [ ] **Move tenancy enforcement INTO middleware**: today the middleware injects `org_id` and every endpoint manually compares it. A developer who forgets the check can leak data. Use SQLAlchemy `with_loader_criteria` to filter every query session-wide on `org_id == request.state.org_id`. Endpoint checks become defence-in-depth, not the primary gate. Tracked: SECURITY.md "Follow-up needed".
- [ ] **Force-enrol MFA for required roles**: settings flag `MFA_REQUIRED_ROLES = ["org_admin", "super_admin", "instructor"]` is defined but not yet enforced. Today, an admin who hasn't enrolled can still log in. Need a "MFA setup required" wedge on first login for those roles.
- [ ] **Multi-key JWT verification** for zero-downtime rotation. Today rotating `JWT_SECRET` invalidates all access tokens. Phase 3.3 follow-up: try the current secret first, fall back to the previous one for a grace window.
- [ ] **CORS allow_origins=["*"] in dev**: fine for now, but add a CI check that production deployments cannot ship with the wildcard. Phase 3.5.
- [ ] **TenancyMiddleware excluded_paths list**: hardcoded in `app/middleware/tenancy.py`. Several `resume_*` endpoints bypass tenancy entirely. Audit each one in Phase 3.3b to make sure they apply their own org_id check.

## Items found while running the stack end-to-end

- [x] **Schema drift detection**: shipped in Session 3.2 as the `schema-drift` CI job + `scripts/check_schema_drift.py`. Currently non-gating; flip to gating in Phase 3.6 once the known drift is fully cleaned. Session 3.3 cleared `organizations.email/phone/website/address_*`, `courses.tier/is_published/is_archived/settings/syllabus/learning_objectives/standards/subject`, and `users.mfa_*`.
- [x] **The two `api-core` copies**: deleted the dead `eureka/api-core/` 2026-05; compose builds from `eureka/services/api-core/` which is canonical.
- [ ] **Seed hashes**: bcrypt hashes for demo users in SQL should be generated at first boot, not hardcoded, so they can't drift from the password the README documents. Migrate to a runtime seed script.
- [ ] **Empty `mobile/` app**: `eureka/apps/mobile/` has only a README. Decide: delete now (Phase 8 will add React Native fresh) or keep as a placeholder.
