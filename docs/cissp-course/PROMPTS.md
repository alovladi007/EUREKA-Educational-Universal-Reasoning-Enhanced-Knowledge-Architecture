# CISSP Course Build — Master Prompt Library

> Reusable prompt system for generating CISSP course content module-by-module
> against the current (ISC)² CISSP Exam Outline (effective April 15, 2024).
>
> **Status:** Authoritative. All generated artifacts in `docs/cissp-course/`
> were produced from these prompts. Update this file if the prompts change.

---

## Foundation — Master System Prompt

Use this as the system/context prompt for every generation task:

```
You are a CISSP subject matter expert with 15+ years in information
security, an active CISSP credential, and instructional design experience.
You are building content aligned to the current (ISC)² CISSP Exam Outline
(effective April 2024). All content must:
- Map explicitly to official domain weightings
- Reflect manager/risk-based thinking (not pure technician mindset)
- Use "think like a manager" framing for scenario questions
- Cite NIST, ISO 27001/27002, COBIT, OWASP, RFCs where relevant
- Distinguish between US and international legal/privacy frameworks
- Include real-world breach case studies
- Target Bloom's taxonomy levels: Analyze, Evaluate (not just Recall)
```

### Generation integrity rules (EUREKA-specific)

When Claude executes these prompts inside EUREKA's content pipeline:

1. Content is labeled AI-generated study material; no fabricated credentials,
   page numbers, or direct quotes.
2. Standard names/numbers (NIST SP 800-30, ISO/IEC 27005, RFC 5280, etc.) may
   be cited when the model is confident. Uncertain citations are flagged
   `// verify` rather than invented.
3. Every lesson and question is tagged to a `cissp_*` topic ID from
   `eureka/apps/web/src/lib/exam-curriculum.ts` so integration into the
   existing CISSP dashboard is mechanical.
4. Human SME review is required before any content ships to learners.

---

## The 8 Domains & Weightings (2024 Outline)

| # | Domain | Weight |
|---|---|---|
| 1 | Security and Risk Management | 16% |
| 2 | Asset Security | 10% |
| 3 | Security Architecture and Engineering | 13% |
| 4 | Communication and Network Security | 13% |
| 5 | Identity and Access Management (IAM) | 13% |
| 6 | Security Assessment and Testing | 12% |
| 7 | Security Operations | 13% |
| 8 | Software Development Security | 10% |

---

## Prompt 1 — Detailed Notes Generator (Per Domain)

```
Generate comprehensive study notes for CISSP Domain [N]: [Domain Name].

Structure:
1. Domain Overview (exam weight, key themes, manager mindset traps)
2. Full sub-topic breakdown matching the official (ISC)² outline —
   list every sub-objective verbatim
3. For EACH sub-objective provide:
   a. Conceptual explanation (300–500 words)
   b. Technical deep-dive with protocols/standards/algorithms
   c. Relevant frameworks (NIST SP 800-XX, ISO, etc.)
   d. Common misconceptions
   e. Exam-relevant nuance ("CISSP wants you to pick X because...")
   f. 3 real-world examples or breach case studies
   g. Memory aids / mnemonics
   h. Cross-references to other domains
4. Domain summary cheat sheet (1 page)
5. Glossary of 30+ key terms with precise definitions
6. Further reading: official sources only

Length target: 15,000–25,000 words per domain.
Format: Markdown with H2/H3 hierarchy, tables, and code blocks for
technical artifacts (e.g., ACL syntax, crypto pseudocode).
```

---

## Prompt 2 — Animation / Visual Storyboard Generator

```
For CISSP Domain [N], identify the 12–15 concepts that are best taught
through animation rather than text. For each, produce a storyboard:

- Concept name and learning objective
- Why animation beats static explanation
- Scene-by-scene breakdown (6–10 scenes)
- On-screen text, narration script (timed, ~150 wpm)
- Visual elements (actors, icons, data flows, color coding)
- Suggested duration (60–180 seconds)
- Tool recommendation (Manim for math/crypto, After Effects for
  network flows, Lottie for UI micro-animations, Excalidraw for
  architecture)
- Assessment hook: 1 question to ask after the animation

Priority concepts to animate include: TCP/IP handshake & attacks,
Kerberos authentication flow, OAuth/OIDC/SAML differences, PKI
certificate chains, symmetric vs asymmetric crypto, Bell-LaPadula
vs Biba vs Clark-Wilson, ring architecture, TPM/HSM operation,
DNSSEC, IPsec tunnel vs transport, zero trust architecture,
SDLC integration of security gates.
```

---

## Prompt 3 — QBank Generator (The Critical One)

```
Generate [50] CISSP practice questions for Domain [N]: [Domain Name].

Quality requirements — match or exceed Boson ExSim and (ISC)²
official practice tests:

DIFFICULTY MIX (revised, standing instruction for Domains 1–8):
- 10% recall/definition        (5 of 50)
- 40% application/scenario     (20 of 50)
- 50% analysis/"best answer among plausible options"  (25 of 50)

Rationale for the revision: analysis questions with plausible
distractors are the hardest to write and the most exam-valuable;
they drive the learner toward manager-mindset reasoning that
recall and simple application cannot.

QUESTION RULES:
- Scenario stems of 3–6 sentences for analysis questions
- Four options, all plausible to a non-expert
- Test the manager mindset: BEST/FIRST/MOST/PRIMARY qualifiers
- No "all of the above" or "none of the above"
- Distractors must be technically correct but contextually wrong
- Avoid US-centric assumptions unless the scenario specifies

FOR EACH QUESTION PROVIDE:
1. Question stem
2. Four options (A–D)
3. Correct answer
4. Detailed rationale (150+ words) explaining:
   - Why the correct answer is BEST
   - Why each distractor is wrong or sub-optimal
   - The underlying principle being tested
   - Relevant framework/standard reference
5. Bloom's level
6. Sub-objective mapping
7. Difficulty rating (1–5)
8. Tags for adaptive learning (e.g., "cryptography", "key-management")

Output as JSON for direct DB ingestion.
```

---

## Prompt 4 — Adaptive Testing Engine Spec

```
Design the assessment system for the CISSP course:

1. Diagnostic test (125 questions, all domains, weighted)
2. Per-domain quizzes (25 questions, randomized from QBank)
3. Per-sub-objective micro-quizzes (10 questions)
4. Two full-length CAT-style mock exams (125–175 questions,
   adaptive difficulty, 4-hour timer)
5. "Weakness drill" mode: pulls from lowest-scoring tags
6. Spaced repetition: missed questions resurface at 1d/3d/7d/21d
7. Performance analytics: domain heatmap, Bloom-level breakdown,
   time-per-question vs accuracy, predicted pass probability

Specify the algorithm for predicted pass probability using IRT
(Item Response Theory) — provide pseudocode.
```

---

## Prompt 5 — Per-Module Lesson Plan

```
For Domain [N], produce a lesson plan with:
- Learning objectives (Bloom-aligned, measurable)
- Estimated study hours
- Sequence: pre-read → animation → deep-dive notes → worked
  examples → practice questions → mini-mock → review
- Knowledge checkpoints between sections
- Lab exercises where applicable (e.g., Wireshark capture analysis
  for Domain 4, threat modeling for Domain 8)
- Discussion prompts for cohort/community feature
```

---

## Build Sequence (Authoritative)

Run the prompts in this order for each of the 8 domains:

1. Lesson plan (Prompt 5)
2. Detailed notes (Prompt 1)
3. Animation storyboards (Prompt 2)
4. QBank (Prompt 3)
5. Integrate into the assessment engine (Prompt 4 — built once, reused)

**Build Domain 1 end-to-end first as the reference quality bar before
scaling to Domains 2–8.** Do not start Domain 2 until Domain 1 has been
reviewed and the quality bar is locked in.

---

## Differentiators vs Existing Platforms

To beat Destination Certification, Boson, LearnZapp, and Thor Teaches,
layer in:

1. **Manager Mindset Translator** — rewrites technical thinking into
   CISSP-appropriate reasoning. Every question rationale should name the
   manager-mindset shift explicitly.
2. **Breach-of-the-Week** case studies tied to specific sub-objectives,
   rotated in from a curated incident library.
3. **AI Tutor** (Anthropic API) that explains *why* a student missed a
   specific question in their own words, using their prior performance
   and the rationale as context.
