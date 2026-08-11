# MCAT Audit

2026-08-10. Every MCAT surface in the platform, read before building the
UWorld-class infrastructure (Phase C). Register style follows
`docs/EUREKA_GAP_REGISTER.md`: numbered gaps, severity, file:line evidence,
direction of fix. Severities: P0 = violates a house rule (invented data, keys
on the client, unverified claims); P1 = blocks the Phase C target; P2 = debt.

## The system as it stands

MCAT today is three disconnected layers. (1) A 580-item multiple-choice bank
compiled into the web bundle, graded in the browser, with history in
localStorage and a best-effort rollup POST to the server. (2) A test-prep
microservice (:8200) that manufactures "predictions" for any exam type.
(3) The Phase B OCTET chemistry pipeline - the one honest, server-graded,
per-response-logged MCAT surface, and the reference for everything below.
Meanwhile api-core already contains a real server-side item-bank engine with
review states, provenance, 2PL IRT and mock-exam models - which MCAT does
not use at all.

## Gap register

**MC-1 (P0). Answer keys and explanations ship in the client bundle.**
`eureka/apps/web/src/lib/mcat-qbank-data.ts:15-16` - every one of 580 items
carries `correct: number` and `explanation: string` in the compiled bundle;
grading is a client-side comparison,
`src/app/dashboard/test-prep/[exam]/page.tsx:2753`
(`selectedAnswer === currentQ.correct_index`, fed from the shipped key at
`:2527`). House rule: "Answer keys never reach the client before submission.
Grading is server-side." Fix: C1 - migrate the bank into the api-core item
infrastructure and serve without keys; the Phase B chemistry endpoints and
the Patent Bar server flow are the reference shapes.

**MC-2 (P0). A fabricated scaled score is shown to learners.**
`page.tsx:4354` and `:4363` -
`Math.round(472 + (results.percentage / 100) * 56)`: a linear percent map
onto the 472-528 scale with no equating data behind it. House rule: no
"predicted score" without a validated model. Fix: C3 - the simulator reports
raw and per-category results only; the scaled-score line is removed, not
recalibrated (there is nothing to calibrate it with).

**MC-3 (P0). The test-prep service manufactures statistics, and runs by
default.** `services/test-prep/app/services/analytics_service.py:567-597`
invents a predicted score (`base_score = metrics.questions_answered * 0.01 +
50 # Simplified`); `:1006-1012` returns `np.random.normal` noise as a "score
distribution" and a clamped raw score as a "percentile";
`app/services/adaptive_engine.py:427-430` hardcodes an MCAT theta table with
no calibration source. The compose header
(`eureka/docker-compose.yml:1`) claims a minimal default set, but `test-prep`
has no `profiles:` key (`:883-921`) - the fabrication endpoints are live on
every plain `docker compose up`. Fix: C7 gates or retires these endpoints
(no percentile before a documented threshold); C8 makes the compose default
honest about what starts.

**MC-4 (P0). The server records whatever score the client claims.**
`api-core/app/api/v1/endpoints/exam_attempts.py:50-83` inserts client-supplied
`score_percent / correct_count / by_topic` verbatim;
`test_prep_billing.py:276-300` (`/me/test-prep/mock-results`) validates only
`0 <= correct <= total`. No raw responses ever reach the server, so nothing
server-side can be recomputed, audited, or calibrated. Fix: C1/C3 - the
server serves items and grades submissions; client-claimed aggregates stop
being the system of record for MCAT.

**MC-5 (P1). No per-question response log for the main bank.**
`app/models/user_progress.py:13-16` is explicit: keyed by
`(user_id, exam_type, topic_id)`, aggregates only. Per-response logging
exists solely for chemistry (`mcat_chem_attempts`,
`app/models/mcat_octet.py:58-82`). Without response-level rows there is no
honest path to IRT (C6) or a review center (C4). Fix: C1 logging via the
existing `attempt_logs` / `mock_attempt_items` models
(`app/models/exam.py:32-126`), which already carry theta and info fields.

**MC-6 (P1). MCAT is absent from the real item-bank engine.**
`app/models/item_bank.py:74-110` already provides `review_status`
(DRAFT/IN_REVIEW/APPROVED/FLAGGED/RETIRED, `:34-39`), reviewer fields,
provenance (`ItemSource.source_kind`: IMPORTED/COMMISSIONED/AI_GENERATED/
COMMUNITY/LICENSED, `:42-47`), IRT parameter columns, and a 2PL calibration
service (`app/services/irt.py`) with mock-attempt scoring models. The seed
script wires USMLE, AP and FE_PE only (`scripts/seed_item_bank.py:462-466`);
`SkillFramework.MCAT` (`app/models/skill.py:49`) has zero rows. Decision
recorded here (trust the code): C1 REUSES these enums and tables rather than
minting the build prompt's parallel vocabulary - the prompt's
`ai_generated/sme_reviewed/validated` maps onto
`DRAFT -> APPROVED (reviewed_by set) -> APPROVED + calibrated`, and its
`authored/template_generated/official` maps onto
`COMMISSIONED / AI_GENERATED / LICENSED` sources. One review system, not two.

**MC-7 (P1). SME review is a comment, not a gate.**
`mcat-qbank-data.ts:5` - "AI-generated. Requires SME review." is a file
header; no per-item review field, no reviewer, no timestamp, and nothing in
the serving path checks it (the client bundle IS the serving path). Contrast
the chemistry mapping table, which does this correctly
(`app/models/mcat_octet.py:30-55`: review/reviewer/version/active columns).
Fix: C5 - serving-layer enforcement of review status; template-generated
chemistry items may skip KEY review (the verifier is the reviewer) but their
phrasing still needs SME; unreviewed bio/psych items stay out of the paid
pool.

**MC-8 (P1). No passage engine exists.** The real MCAT is predominantly
passage-based; all 580 items are discrete
(`mcat-qbank-data.ts:8-17` has no passage field, and no passage model exists
anywhere in api-core). Fix: C2.

**MC-9 (P1). No server-graded full-length simulator.** "Real Exam Mode" is
Patent-Bar-only (`mock/page.tsx:265-268`); the MCAT tab
(`page.tsx:4341-4356`) is a client-side 375-minute run whose history lives in
`localStorage['mcat_exam_history']` (`:4351`). Fix: C3 on top of C1, reusing
`MockAttempt`/`MockAttemptItem` (`app/models/exam.py:78-126`).

**MC-10 (P2). Study-plan score scale mismatch.**
`study-plan/page.tsx:171-186` takes test-prep's fabricated `expected` (a
0-100-flavored number) and renders it (`:424-425`) beside a 472-528 target
built from `exam-config.ts:133`. The honest fallback (`:178,193,228` -
"say 'no data', never invent a midpoint score") already exists and becomes
the only path once MC-3 is closed.

**MC-11 (P2). Stale self-descriptions.** The qbank header claims 500 items;
the file contains 580 (`mcat-qbank-data.ts` header vs. count). The compose
header (`docker-compose.yml:1`) understates the default service set (see
MC-3). Both corrected as part of C1/C8.

**MC-12 (P2). No review center.** Post-exam review is whatever the
localStorage history can render; there is no server-backed "review your
mistakes" surface for MCAT (chemistry's misconception rationale is the only
exception). Fix: C4, fed by C1's response log.

## Worth keeping (the reuse inventory)

- `mcat_chemistry.py` + `octet /mcat/*` - the honest reference: server-side
  keys, per-response log, misconception rationale, no invented statistics.
- `item_bank.py` + `models/item_bank.py` - review states, provenance,
  IRT columns, variant generation, search (MC-6 decision: reuse).
- `services/irt.py` - real 2PL (`estimate_theta_and_se`, calibration
  endpoint); `models/exam.py` - `attempt_logs`, `mock_attempts`,
  `mock_attempt_items`.
- `patent_bar.py` - server-computed rollup analytics shapes (accuracy,
  time-vs-accuracy risk flags, Laplace-smoothed mastery).
- `eureka/apps/web/playwright.config.ts` + `tests/e2e/` (new in Phase B) -
  live-stack e2e harness to extend in C8.

## Status as of 2026-08-11 (end of Phase C)

CLOSED: MC-1, MC-2, MC-3, MC-4, MC-5, MC-6, MC-7, MC-8, MC-9, MC-10,
MC-11 (both halves), MC-12. Every gap in this register has been addressed;
see octet/docs/STATUS.md Phase 9 for what each fix actually was, and
docs/mcat/IRT_CALIBRATION.md for the calibration threshold.

Two defects found during the work that were NOT in this register, recorded
so the count is honest:
- POST /irt/calibrate (platform-wide) was gated on any authenticated user
  with a min_attempts floor of 1. Now admin-only.
- The adaptive engine's theta-to-scale tables silently fell back to the GRE
  table for any exam not among the four listed, so e.g. a Security+ learner
  was scored on a GRE scale. The tables now require a documented equating
  source and the registry is empty.

What remains open is content and data, not code: the bank is entirely
AI-generated pending SME review (so the approved-only paid pool is empty by
design), no item is near the calibration threshold, and scaled scoring
stays absent until equating data exists.

## Order of work

C1 server bank + response log (closes MC-1, MC-4 for new flow, MC-5, MC-6,
MC-11a) -> C2 passages (MC-8) -> C3 simulator, raw + per-category only
(MC-2, MC-9) -> C4 review center (MC-12) -> C5 SME serving-layer enforcement
(MC-7) -> C6 IRT logging + documented calibration threshold (rides on C1/C3
data) -> C7 honest analytics, retire/gate test-prep fabrications (MC-3,
MC-10) -> C8 compose truth + extended Playwright (MC-3-default, MC-11b).
