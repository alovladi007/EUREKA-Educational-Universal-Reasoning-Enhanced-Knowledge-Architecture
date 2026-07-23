# Test-Prep — Fix, Verify & Complete: Build Prompt

> Paste as the opening prompt of a build session. Goal: take EUREKA's 11 test-prep exams from "unverified
> AI content with a systemic answer-key defect" to **blueprint-complete, verified, pass-confident** products,
> fully wired. Evidence: `TEST_PREP_CONTENT_AUDIT.md`. **Read the honesty statement there** — "90% pass" is
> the engineering target (complete + verified + realistic mocks + readiness prediction), not a guarantee.

Data lives in `apps/web/src/lib/<exam>-qbank-data.ts | -flashcard-data.ts | -course-data.ts`.
QBank shape (most exams): `{ question, options: string[], correct: number, explanation, topic?, difficulty? }`.
CISSP differs: `{ question_text, options: {index,text}[], correct_index, ... }`. Blueprints: `exam-config.ts`.

---

> **STATUS UPDATE 12 (2026-07-23): WS3 PCT gap-fill tranche SHIPPED — PCT floor cleared (3 of 6
> sections now at terminal size).** New bank `src/lib/patent-bar-gapfill-pct-data.ts`: 40 original
> questions (`pb_gf4_001`–`040`, topicId 4) taking PCT from 58 to its terminal 98. Grounded in PCT
> Articles 11/19/21/22/34 & Rules 26bis/46/54bis/90bis/91 (filing-date elements, claims-required,
> Article 19 vs 34 amendments, demand deadline, 18-month publication + early publication +
> withdrawal, priority restoration, incorporation by reference, obvious mistakes), 35 U.S.C.
> 351–376 (363 pendency effect, 365(c) benefit/bypass, 371 national stage: 30-month hard fee
> requirement vs curable translation/oath, unintentional revival), 37 CFR 1.401–1.499 (RO/US
> competence, English-only, three filing fees, unity of invention in the national stage vs
> restriction in bypass), AIA 102(a)(2)/(d) prior-art effect of WIPO publications ([Pre-AIA]
> contrast noted), 154(d) provisional rights w/ English translation, term-from-international-
> filing-date, small-entity fees national-stage-only. Keys balanced exactly 8 per letter; balance
> test extended with per-bank minimum counts (tuple third element) since blueprint-sized tranches
> can be <50 items (36/36 pass). All 40 unverified → SME queue (707). **Coverage at bank 881:**
> PCT 98 = 11.1% ✓, Design/Plant 11.1% ✓, Prosecution 33.3% ✓; gaps: Patentability 19.5% (NEW
> regression, predicted — needs its +24 top-up), Ethics 13.3%, Post-Issuance 11.7%. Live-verified:
> PCT-filtered session served pb_gf4_001 (amber Unverified, 5 options) graded green on its key (C);
> queue lists all 40 pb_gf4 items; card/matrix/script agree at 881. NOTE for SME queue: legacy
> authored item with subtopic `pct_national_371` conflates priority restoration with the 30-month
> deadline — flagged candidate. **Remaining to bank 980:** post-issuance +44, ethics +30,
> patentability +24, prosecution +1 (99 questions).

> **STATUS UPDATE 11 (2026-07-23): WS3 design/plant gap-fill tranche SHIPPED — design floor cleared,
> and the WS3 endgame is now exactly specified.** New bank
> `src/lib/patent-bar-gapfill-design-data.ts`: 66 original questions (`pb_gf6_001`–`066`, topicId 6)
> grounded in 35 U.S.C. 171–173 & 37 CFR 1.152–1.155 (designs: single claim, 15-yr-from-grant term,
> 6-month priority, no provisionals/publication, CPA-not-RCE, rocket docket, broken lines,
> ordinary-observer/ordinary-designer tests, Webb/Zahn/icons/functionality, § 289), 35 U.S.C. 161–164
> & 37 CFR 1.161–1.167 (plants: asexual reproduction, tuber/uncultivated exclusions, § 162, Latin
> name, Imazio, sports), 35 U.S.C. 382–390 (Hague), and PVPA/utility boundaries (J.E.M.). Keys
> balanced A:14/B–E:13 (33/33 balance tests). All unverified → SME queue (now 667). **STRUCTURAL
> FINDING:** because shares and weights both sum to 100%, ALL six floors can hold simultaneously
> only at exact proportion — with prosecution fixed at 293, that is a bank of ~980
> (294/196/147/147/98/98). Terminal additions from the 775 base: design +66 (DONE this tranche),
> PCT +40, post-issuance +44, ethics +30, patentability +24, prosecution +1. Mid-program the matrix
> will honestly show regressions (ethics dropped back to 13.9% this tranche, as predicted).
> **Coverage at bank 841:** Design/Plant 98 = 11.7% vs 10% ✓ (was 4.1%); Prosecution 34.8% ✓,
> Patentability 20.5% ✓; gaps: Ethics 13.9%, Post-Issuance 12.2%, PCT 6.9%. Live-verified:
> section-filtered session served an official Oct 2003 design item (green badge) then pb_gf6_004
> (amber Unverified) graded green on its key (B); queue lists all 66 pb_gf6 items; card/matrix/
> script agree at 841. **Next tranches:** PCT +40, post-issuance +44, then the ethics/patentability/
> prosecution top-up (+55) to land the exact-proportion bank of 980.

> **STATUS UPDATE 10 (2026-07-23): WS3 ethics gap-fill tranche SHIPPED — ethics floor cleared.**
> New bank `src/lib/patent-bar-gapfill-ethics-data.ts`: 65 original questions (`pb_gf7_001`–`065`,
> topicId 7) grounded in 37 CFR Part 11 (USPTO Rules of Professional Conduct 11.101–11.804, plus
> 11.5–11.14 registration/limited recognition, 11.18 signature certifications, 11.19–11.24
> discipline, 11.58 suspended-practitioner limits) and 37 CFR 1.56 duty of disclosure. Keys
> balanced exactly 13 per letter (balance test extended to the new bank — 30/30 pass). ALL 65 are
> `unverified` and flow into the SME review queue (now 601 = 536 authored + 65 gap-fill); none may
> appear in a scored mock until SME-stamped. Wired everywhere: session pool (slider 775), coverage
> card + regenerated matrix, review queue, coverage generator. **Coverage after tranche (bank 775):**
> Ethics 117 = 15.1% vs 15% ✓ (floor CLEARED); Prosecution 37.8% ✓, Patentability 22.2% ✓;
> remaining gaps (dilution deepened them as predicted): Design/Plant 4.1% vs 10%, PCT 7.5% vs 10%,
> Post-Issuance 13.3% vs 15%. Live-verified: pb_gf7_041 served in an ethics-filtered session with
> the amber Unverified badge and graded green on its key (B); queue lists pb_gf7 items; matrix,
> card, and script all agree at 775. **Next tranches:** design/plant (~50), PCT (~25),
> post-issuance (~15) — recompute the matrix after each; then WS4 mock.

> **STATUS UPDATE 9 (2026-07-23): WS3 coverage matrix PUBLISHED.** New shared module
> `src/lib/patent-bar-coverage.ts` (blueprint section ↔ topicId mapping + computePatentBarCoverage),
> generator `scripts/generate-coverage-matrix.mjs` → `docs/monetization/PATENT_BAR_COVERAGE_MATRIX.md`
> (regenerate + commit after bank changes), and a live "Blueprint coverage" card on the QBank setup
> (Patent Bar) — both views computed from the same module and verified to agree. **Findings (bank 710):**
> Prosecution 41.3% vs 30% ✓, Patentability 24.2% vs 20% ✓; GAPS: Post-Issuance 14.5% vs 15%
> (marginal), Ethics 7.3% vs 15%, Design/Plant 4.5% vs 10%, PCT 8.2% vs 10%. Official items also skew
> heavily to prosecution/patentability (79+70 of 174; ethics 2, design 2, PCT 4) — a real-exam-mode
> mock drawn purely from official items cannot yet be blueprint-weighted in the thin sections.
> **WS3 authoring backlog:** ~55 ethics, ~40 design/plant, ~15 PCT, ~5 post-issuance questions
> (AI-authored → unverified label → SME queue). Then WS4 mock + WS5 entitlement.

> **STATUS UPDATE 8 (2026-07-23): WS2 SME review queue SHIPPED — WS2 pipeline complete.**
> New page `/dashboard/test-prep/patent_bar/review-queue` (linked from the Patent Bar command
> center): lists all 536 unverified questions with stem/options (keyed answer highlighted)/
> explanation/topic filters + Pending/Approved/Flagged tabs. An expert Approves or Flags (with
> note); decisions persist in localStorage (`pb_sme_reviews_v1`) and export as JSON. The
> DELIBERATE human-in-the-loop bridge: `apps/web/scripts/apply-sme-reviews.mjs <export.json>`
> stamps `verified: 'sme',` onto approved ids in `patent-bar-qbank-data.ts` (idempotent,
> `--dry-run`, flagged items printed and untouched) — so promotion to "SME-verified" only lands
> via a reviewed git commit, keeping the provenance trail. Verified end-to-end: queue loads
> 536/0/0, approve+flag persisted (1/1/534), export shape correct, apply script tested against a
> TEMP COPY (stamp placed after multi-line explanations before the closing brace — a first-cut
> insertion bug was caught and fixed by the syntax check), stamped copy transpiles and the
> resolver returns 'sme', idempotent rerun stamps 0, REAL data file untouched (zero sme stamps
> committed — no expert has reviewed anything yet, honestly). **WS2 is now complete.** Next:
> WS3 coverage matrix, WS4 real-exam-mode mock (174 official questions = the seed; enforce
> "no unverified item in any scored mock"), WS5 entitlement.

> **STATUS UPDATE 7 (2026-07-23): WS2 verified-status model + honest labeling SHIPPED.**
> `PatentBarQuestion` now carries `verified?: 'official' | 'sme' | 'unverified'` with the canonical
> resolver `getPatentBarVerification()` (`uspto-*` ids are always 'official'; omitted = 'unverified'
> until an SME stamps 'sme'). Every Patent Bar QBank session question shows a provenance badge:
> green "Official USPTO" (tooltip: graded against the USPTO's published model answer), amber
> "Unverified" (tooltip: AI-authored, not yet SME-reviewed), blue "SME-verified" (reserved — zero
> items carry it yet, honestly). Live-verified: official question → green badge, authored question →
> amber badge, correct in every sampled case. **Remaining WS2 tail:** the SME review-queue UI
> (surface unverified items for an expert to approve → stamp `verified: 'sme'` in the data file) and
> the mock-exclusion rule ("no unverified item in any scored mock") to be enforced when WS4 builds
> the Patent Bar mock. Then WS3 coverage matrix / WS4 real-exam-mode mock / WS5 entitlement.

> **STATUS UPDATE 6 (2026-07-23): USPTO April 2003 PM session INGESTED — released-exam ingestion
> COMPLETE for both 2003 exams.** 39 new official questions in `patent-bar-uspto-apr2003-pm-data.ts`
> (Q43 discarded; **10 verbatim cross-exam duplicates excluded**: Q9/11/16/20/26/28/29/33/49/50; Q7 and
> Q46 retained as reworded official variants). Official pool now **174** (Oct 47 AM + 48 PM; Apr 40 AM +
> 39 PM); Patent Bar total 710; official-only toggle max updated 135→174. All 174 keys machine-verified
> vs the model-answer PDFs incl. the stem+options duplicate check. Live-verified: official-only session
> Q 1/170, 4/4 sampled official, Apr PM Q13 answered (D) → green + official explanation. **WS2
> released-exam anchor is DONE.** Next: the `verified: official|sme|unverified` flag + SME review-queue
> pipeline (WS2 tail), then WS3 coverage matrix / WS4 mocks (the official set is the natural seed for a
> timed "real exam mode") / WS5 entitlement.

> **STATUS UPDATE 5 (2026-07-23): USPTO April 2003 AM session INGESTED + shuffle-bias fix.** 40 new
> official questions in `patent-bar-uspto-apr2003-data.ts` (Q28 discarded; Q2/Q33 dual-keyed excluded;
> **7 verbatim cross-exam duplicates of Oct 2003 excluded**: Apr Q16/21/22/26/29/34/50 — the USPTO reused
> them; keys match Oct in every case). Official pool now **135** (Oct 47 AM + 48 PM + Apr 40 AM); Patent
> Bar total 671. Keys machine-verified vs the model-answer PDFs incl. a full-stem+options duplicate check
> (`verify-uspto.js`). **Also fixed:** all 16 `sort(() => Math.random() - 0.5)` biased shuffles in
> `[exam]/page.tsx` replaced with Fisher-Yates `shuffle()` — the biased idiom left late-appended pool items
> (the official banks) clustered at the END of sessions (measured: 0 April sightings in 143 draws before,
> April at draw 4 after). Live-verified: Apr Q30 served, official answer (B) → green + official explanation.
> **Next in WS2:** April 2003 PM session (`15apr03pq/pa.txt` already extracted in scratchpad; 49 usable —
> Q43 discarded, no dual-keys; check for Oct duplicates before ingesting), then the `verified` flag + SME
> review-queue pipeline.

> **STATUS UPDATE 4 (2026-07-23): USPTO Oct 2003 PM session FULLY INGESTED — Oct 2003 exam complete.**
> All 48 usable PM questions (Q1–Q8, Q10–Q22, Q24–Q50) live in `patent-bar-uspto-oct2003-pm-data.ts`
> (Q9 officially discarded; **Q23 excluded — dual-keyed** "(A) or (D)", same policy as AM Q30). Total
> official pool now **95 questions (47 AM + 48 PM)**, every key machine-verified against the model-answer
> PDFs (`verify-uspto.js` covers both sessions), wired into the QBank pool, QBANK_SIZES bumped 536→631
> (also fixes the AM undercount). Live-verified: PM Q47 served in a 630-question session, answered (B)
> → green + official explanation. NOTE: the test-prep service's `questions` table is EMPTY (all exams) —
> `POST /qbank/sessions` 404s and Patent Bar sessions come from the client-side static pool, which is
> where the officials live. If the server bank is ever seeded (WS5), seed the officials there too.
> **Next in WS2:** April 2003 set (`15apr03{aq,aa,pq,pa}.pdf`, same Wayback path), then the
> `verified` flag + SME review-queue pipeline.

> **STATUS UPDATE 3 (2026-07-23): USPTO Oct 2003 AM session FULLY INGESTED.** All 47 usable
> questions (Q1, Q3–Q29, Q31–Q38, Q40–Q50) now live in `patent-bar-uspto-oct2003-data.ts`, verbatim
> stems/options with the official Model Answer explanations. **Q30 excluded** in addition to the
> discarded Q2/Q39: the USPTO's model answer accepts TWO keys ("(B) or (D) is accepted") and the
> single-key QBank format cannot represent dual credit without mis-grading one officially-correct
> choice. Every key machine-verified against the model-answer PDF (scratchpad `verify-uspto.js`);
> served + graded live in the browser (Q21 answered (D) → green, official explanation rendered);
> Patent Bar pool now 536. **Next in WS2:** PM session (`15oct03pq.pdf` / `15oct03pa.pdf`, same
> Wayback path `web.archive.org/web/2004id_/http://www.uspto.gov/web/offices/dcom/olia/oed/…`),
> then April 2003 (`15apr03*.pdf`), then the `verified` flag + SME review-queue pipeline.

> **STATUS UPDATE 2 (2026-07-20): WS1 COMPLETE (all 9 skewed banks).** LSAT (88%→17-23%/5 slots) and
> CISSP (83%→24-27%) de-biased with letter-remapped explanations (v2 tool); invariants machine-verified on
> all 660 questions; balance test now covers 9 banks (27 assertions). **WS2 STARTED — official USPTO
> ingestion:** located the original USPTO released-exam PDFs (Oct 15 2003 AM: `15oct03aq.pdf` questions +
> `15oct03aa.pdf` official Model Answers, via Internet Archive copy of uspto.gov; public domain). Full
> official answer key extracted for all 48 scoreable questions (Q2 & Q39 officially discarded — "CREDIT
> GIVEN FOR ALL ANSWERS"). First tranche ingested: **Q1, Q3–Q12 (11 questions) in
> `src/lib/patent-bar-uspto-oct2003-data.ts`**, verbatim stems/options in official order (never shuffle —
> options cross-reference letters), official model-answer explanations (abridged, citations kept), pre-AIA
> era tags on 102/103-timing items, wired into the Patent Bar QBank pool and verified live. **Next:**
> transcribe AM Q13–Q50 + PM session (same pipeline; key already extracted:
> 13:D 14:A 15:A 16:A 17:A 18:A 19:E 20:D 21:D 22:E 23:C 24:D 25:D 26:D 27:C 28:A 29:B 30:B 31:C 32:B
> 33:D 34:A 35:E 36:D 37:E 38:D 40:E 41:E 42:E 43:C 44:A 45:E 46:C 47:B 48:C 49:D 50:D), then April 2003
> set (`15apr03*.pdf`, same Wayback path).

> **STATUS (2026-07-20): WS1 DONE for 7 banks** (commit `2410f33d`): FME, PE-EE, FE-EE, SAT, Security+,
> Patent Bar, MCAT — 3,290 questions de-biased to ~20–31%/slot, invariants machine-verified (keyed answer
> text unchanged on every question), regression test added (`src/lib/__tests__/qbank-key-balance.test.ts`),
> live grading verified in the browser. **Remaining for WS1:** LSAT (multiline template-literal options;
> explanations may reference "(B)"-style letters — needs a smarter letter-ref guard) and CISSP (different
> schema: `options: {index,text}[]` + `correct_index` — tool needs a second mode). GRE/GMAT already
> near-balanced. Next session: extend the de-bias tool for those two, then proceed to WS2.

## WS1 — Answer-key de-bias (do FIRST; mostly automatable; safe)

**Problem:** correct answers cluster at one index (FE-ME 99.5% A, PE-EE 98.7% A, FE-EE 73% A, Security+ 80% B,
Patent Bar 76% B, MCAT 66% B, SAT 65% A). Spot-checks show keyed answers are *correct* — only mis-positioned.

**Fix:** a script that, per question, randomly permutes `options` and rewrites `correct` to the new index of
the same (unchanged) correct option. **Guards (do not shuffle blindly):**
- Pin "All of the above" / "None of the above" / "Both A and B"-style options to their original last slots.
- Detect naturally-ordered numeric/sequential option sets (e.g. `2, 4, 6, 8`, ascending Ω/values) and either
  keep order or shuffle then re-sort — never present numeric answers out of order.
- Skip CISSP-shape and re-index `correct_index` analogously.
- Deterministic seed (record it) so runs are reproducible; the harness disallows `Math.random()` — seed from
  a fixed value + question id.
**Acceptance:** every bank's key distribution within ~±5% of uniform (25/25/25/25); a unit test asserts it;
diff shows only option order + `correct` index changed, never option text; render check on 2–3 exams.

## WS2 — Correctness verification (the hard part; SME/authoritative required)

I cannot certify accuracy. Build the *pipeline* and do what's automatable; flag the rest for SME sign-off.
- **Ground-truth ingestion where official items exist** (highest trust): USPTO released exams (Patent Bar),
  NCEES sample questions (FE/PE), officially released SAT/PSAT (College Board), LSAT PrepTests (LSAC),
  released AAMC/USMLE sample items. Parse into the bank shape, `source: "official"`, and treat as the
  verification anchor for each topic.
- **Automated checks:** math/units auto-verify where possible (SymPy for quantitative items — FE/PE/GRE/GMAT
  quant/SAT math); dead/duplicate detection; every explanation must name *why the answer is right* AND *why
  each distractor is wrong* + a citation.
- **SME workflow:** add a `verified: 'official' | 'sme' | 'unverified'` field per question; a review queue UI
  (reuse Content Studio) for an expert to accept/edit/reject; the product only counts `verified` items toward
  "readiness". Unverified items are clearly labeled and excluded from mocks.
**Acceptance:** ≥90% of each live bank is `official` or `sme`-verified; unverified items excluded from scored
mocks; every verified item has a citation.

## WS3 — Coverage to blueprint + pass-confident volume

Per exam, using `exam-config.ts` section weights:
- **Map every question to an official section/topic**; add topic tags to the untagged banks
  (FE-EE/FE-ME/PE-EE/SAT/GRE/GMAT). Produce a coverage matrix (section × verified-count × exam weight).
- **Fill thin sections** to at least the exam's per-section weight × a safety multiple.
- **Grow under-volume banks** (GRE, GMAT, SAT, and thin-for-size MCAT/CISSP/LSAT) toward a pass-confident
  size (rule of thumb ~10× the exam form of *verified* items, or the official pool).
**Acceptance:** no section below its blueprint weight; per-exam coverage matrix published; volume targets met.

## WS4 — Realistic timed mocks + readiness/pass-prediction

- Format-accurate **timed full mock** per exam (Patent Bar 100Q AM/PM/MPEP-open; Security+ 90Q/90min w/ PBQs;
  FE/PE 110Q/80Q handbook-open; MCAT sectioned; CISSP CAT-style; SAT/GRE/GMAT adaptive/sectioned per
  `exam-config`). Draw only from **verified** items, weighted to blueprint.
- **Readiness score → pass probability** vs each exam's cut (Patent Bar 70%, Security+ 750/900, CISSP 700/1000,
  FE/PE ~50–65%). Show "you are at X%, pass threshold Y%". Wrong answers → per-topic **review queue** (endpoint
  exists for Patent Bar; generalize).
**Acceptance:** a subscriber can take a format-accurate mock, get a scaled score + pass-likelihood + per-topic
breakdown, and one-click into a targeted review set.

## WS5 — Wiring, entitlement & the study loop

- **Entitlement/paywall** (shared; see `PATENT_BAR_BUILD_PROMPT.md` WS1): gate full QBank/mocks behind a
  subscription in api-core; free diagnostic + preview.
- **Diagnostic → adaptive study plan → practice → mock → readiness**, all persisting to `/me/progress` and
  surfaced in the exam Command Center/Analytics.
- Confirm every exam's QBank/flashcards/course loader renders, records attempts, and feeds analytics.
**Acceptance:** end-to-end loop works for a subscribed user on ≥2 exams; entitlement enforced server-side.

## Priority order

1. **WS1 de-bias** — all exams (fast, high-integrity win). Fix the two broken banks first: FE-ME, PE-EE, FE-EE.
2. **Patent Bar** end-to-end to the 90% bar (already best + cited) as the reference implementation.
3. **Security+ / MCAT** (topic-tagged, decent) — de-bias, cite, verify, mock.
4. **CISSP / FE / PE** — verify + tag + fill.
5. **LSAT** — fix shape/key, grow LR bank.
6. **GRE / GMAT / SAT** — biggest volume gap; grow last (also weakest paid case — SAT undercut by free Khan).

## Definition of done (per exam = "pass-confident")
- [ ] Answer-key distribution ≈ uniform (WS1), asserted by test
- [ ] ≥90% of live items `official`/`sme`-verified, each cited (WS2)
- [ ] Every section ≥ blueprint weight; coverage matrix published; volume target met (WS3)
- [ ] Format-accurate timed mock + readiness/pass-prediction + review queue (WS4)
- [ ] Behind entitlement; diagnostic→plan→practice→mock loop persists & renders (WS5)
- [ ] tsc + lint-gated build pass; browser-verified; **no unverified item in any scored mock**

## Guardrails (the user cares)
- **No fabricated content, no fake numbers, no answer changes during de-bias.** Real/official or clearly-
  labeled unverified.
- **Never market a pass guarantee** without SME sign-off — it's a claims/legal decision.
- Show significant UI before committing; verify in the browser; report honestly what's verified vs not.
