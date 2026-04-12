# Domain 1 — Animation Storyboards

> **AI-generated production briefs** for the 12 animations in Domain 1
> (Security and Risk Management). Each brief is self-contained: a
> motion designer should be able to build from it without additional
> context.
>
> Narration timing assumes ~150 words per minute, with ±10% wiggle.
> Tool recommendations favor open or widely-available stacks so the
> course can be produced by a small team.

---

## Storyboard index

| # | Concept | Duration | Tool | Sub-obj |
|---|---|---|---|---|
| D1-01 | Governance vs Management (the EDM/APO split) | 120 s | After Effects + Figma | 1.3 |
| D1-02 | The Canons of Ethics, in priority order | 90 s | Lottie + After Effects | 1.1 |
| D1-03 | CIA Triad → Parkerian Hexad, live-expanded | 75 s | Excalidraw + After Effects | 1.2 |
| D1-04 | Authenticity vs Non-repudiation (the MAC/signature split) | 135 s | Manim + After Effects | 1.2 |
| D1-05 | Risk math machine: AV → EF → SLE → ARO → ALE | 150 s | Manim | 1.9 |
| D1-06 | The Risk Treatment Compass (Avoid/Mitigate/Transfer/Accept) | 105 s | After Effects | 1.9 |
| D1-07 | The BIA Clock: MTD, RTO, RPO, WRT in time | 120 s | After Effects | 1.7 |
| D1-08 | DR site ladder: cold → warm → hot → mirror | 90 s | Excalidraw + After Effects | 1.7 |
| D1-09 | STRIDE walkthrough on a sample DFD | 165 s | After Effects | 1.10 |
| D1-10 | GDPR vs CCPA overlay map | 110 s | After Effects + Mapbox | 1.4 |
| D1-11 | Due Care vs Due Diligence (side-by-side scenarios) | 95 s | Lottie + After Effects | 1.3 |
| D1-12 | SCRM visibility: the SBOM iceberg | 100 s | After Effects | 1.11 |

**Total runtime:** ~24 minutes across 12 videos. Each is short enough
to watch in one sitting and specific enough to anchor a single testable
idea.

---

## D1-01 · Governance vs Management (120 s)

### Learning objective

By the end, the learner can correctly classify any CISSP scenario
action as governance or management and name the actor who should own
it.

### Why animation beats static text

The critical insight is **flow**: authority flows top-down from the
board while information flows bottom-up from operations. A static
org chart shows the structure; animation shows the **direction of
causation**, which is what the exam tests.

### Tool

**Adobe After Effects** for camera moves and timed callouts; **Figma**
for the base org-chart vectors. Font: Inter. Palette: deep navy
#0B1F3A (governance), teal #14B8A6 (management), amber #F59E0B
(active tier glow).

### Scene breakdown

| # | Duration | On-screen | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Blank stage. A single horizontal line labeled "Business objectives" fades in. | "Before we talk about security, let's start where every CISSP question starts: business objectives." |
| 2 | 0:10–0:22 | A board-of-directors icon (four seated figures) appears above the line. A downward arrow labeled "Strategy, risk appetite, policy" draws itself. | "The board sets strategy, defines how much risk the organization is willing to accept, and approves policy. This is governance." |
| 3 | 0:22–0:35 | Below the board, an executive tier appears (CEO, CFO, COO, CIO icons). Arrows continue downward. | "Executives translate board direction into programs." |
| 4 | 0:35–0:48 | Steering committee tier appears. Amber glow pulses around it. | "A cross-functional steering committee prioritizes, deconflicts, and approves exceptions." |
| 5 | 0:48–1:02 | CISO tier appears. The CISO icon gets a "Management" badge. | "The CISO and security team operate controls, monitor, and report up. This is management — execution of governance decisions." |
| 6 | 1:02–1:18 | Reverse arrow animation: "Metrics, incidents, exceptions" flows upward from operations to board. | "Information flows up: metrics, incidents, and exceptions travel back to governance for review." |
| 7 | 1:18–1:35 | The diagram splits in half horizontally. Left side labeled "GOVERNANCE — Evaluate · Direct · Monitor" in navy. Right side labeled "MANAGEMENT — Plan · Build · Run · Assess" in teal. | "COBIT 2019 names this split EDM for governance and APO-BAI-DSS-MEA for management. Remember the verbs." |
| 8 | 1:35–1:55 | An exam-style question appears: "A CISO wants to buy a SIEM. What should the CISO do FIRST?" Options fade in; wrong answers dim; the correct answer — "Present the business case to the steering committee" — highlights. | "On the exam, when in doubt, route strategic decisions to governance. A CISO who acts without that authority is the wrong answer, even when the technology choice is right." |
| 9 | 1:55–2:00 | Title card: "Governance decides. Management delivers." | "Governance decides. Management delivers." |

### On-screen text cues

- "Governance = Evaluate, Direct, Monitor"
- "Management = Plan, Build, Run, Assess"
- "COBIT EDM vs APO-BAI-DSS-MEA"

### Assessment hook

> After watching this animation: **Which of the following is a
> governance activity, not a management activity?**
>
> A. Approving the enterprise risk appetite statement
> B. Configuring the SIEM correlation rules
> C. Executing the annual vulnerability scan schedule
> D. Onboarding a new junior analyst
>
> **Correct: A** — risk appetite is set at the governance tier.

---

## D1-02 · The Canons of Ethics (90 s)

### Learning objective

Learner can recite the four (ISC)² canons in priority order and apply
them to a scenario involving conflicting obligations.

### Why animation

The **ordering** is the point. Showing the canons stack in priority
with higher ones physically dominating lower ones drives the mental
model that Canon I outranks Canon III, always.

### Tool

**Lottie** for the icon animations (small file sizes, easy to reuse
in the LMS); **After Effects** for the full render.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:08 | Blank stage. (ISC)² logo in corner. Title: "The Four Canons". | "The CISSP ethics rules are short and strictly ordered. Here they are." |
| 2 | 0:08–0:20 | Four cards slide in horizontally: Society, Honorable/Honest/Legal, Service, Profession. | "Protect society. Act honorably, honestly, legally. Serve principals. Advance the profession." |
| 3 | 0:20–0:32 | Cards re-stack vertically with numbered badges. Canon I at top, Canon IV at bottom. | "But they're not a list — they're a priority order. Canon I outranks Canon II, which outranks Canon III, which outranks Canon IV." |
| 4 | 0:32–0:48 | A scenario card flies in: "Your employer asks you to conceal a data breach that affects 100,000 customers." The Canon III card (Service) dims; Canon I (Society) pulses. | "Your employer is asking you to violate Canon I — protect the public — in service of Canon III. Canon I wins." |
| 5 | 0:48–1:02 | The correct response fades in: "Escalate internally, then to authorities if internal channels fail to act." | "The right move is internal escalation — and if that fails, external disclosure through appropriate channels. That satisfies Canon I without abandoning Canon II." |
| 6 | 1:02–1:18 | Standing table fades in: Canon I (Anyone), II (First-hand), III (Principal only), IV (Licensed only). | "One more exam point: who can file a complaint. Anyone can complain about Canon I. Only the principal can complain about Canon III. Only licensed professionals about Canon IV." |
| 7 | 1:18–1:30 | Title card: "Society > Honor > Service > Profession". | "Society before self, service, and profession. Every time." |

### On-screen text cues

- "SPSP: Society, Probity, Service, Profession"
- "Higher canon always wins"
- "Standing: A-A-P-L (Anyone, Anyone-first-hand, Principal, Licensed)"

### Assessment hook

> **A CISSP discovers her employer is falsifying security audit
> reports to a regulator. Her direct manager instructs her to remain
> silent. What should she do FIRST?**
>
> A. Comply — Canon III requires service to the principal.
> B. Escalate internally through formal compliance channels.
> C. Resign quietly to avoid the conflict.
> D. Publish the discovery publicly on social media.
>
> **Correct: B** — internal escalation satisfies Canon II (legality)
> and Canon I (public trust) before resorting to external disclosure.

---

## D1-03 · CIA Triad → Parkerian Hexad (75 s)

### Learning objective

Learner can identify the three Parkerian-only attributes (Authenticity,
Utility, Possession) and recognize a scenario that cannot be
described by the classic CIA model.

### Why animation

The "expand" action — triangle grows into a hexagon — embeds the
mental model that the hexad **extends** rather than replaces the
triad.

### Tool

**Excalidraw** for the geometric shapes (works well for
hand-drawn-looking diagrams that land casually); **After Effects**
for the morph animation.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:08 | An equilateral triangle draws itself. Vertices label: Confidentiality (blue), Integrity (green), Availability (amber). | "The CIA triad — confidentiality, integrity, availability — is security's foundational model." |
| 2 | 0:08–0:20 | A scenario card: "A laptop is stolen. Full-disk encryption is in place and the key is not compromised." | "But consider this. A laptop is stolen. Full-disk encryption is in place." |
| 3 | 0:20–0:32 | The triangle dims: Confidentiality node stays bright; Integrity and Availability dim as "intact for the organization". | "Confidentiality? Intact, because the data can't be read. Integrity? The data hasn't been modified. Availability? The organization still has it — from backup." |
| 4 | 0:32–0:48 | New label fades in above the triangle: "But the organization lost POSSESSION." The triangle grows three new vertices, morphing into a hexagon. | "The organization still lost something: control. Donn Parker called it possession. And it's one of three attributes the triad can't describe." |
| 5 | 0:48–1:00 | Hexagon now shows: Confidentiality, Integrity, Availability, Authenticity, Utility, Possession. | "The Parkerian Hexad adds authenticity — did it come from the real source — utility — is it still usable — and possession — is it still under our control." |
| 6 | 1:00–1:15 | Three split-screen examples pop in: (a) phishing email (Authenticity), (b) encrypted data with lost key (Utility), (c) stolen encrypted laptop (Possession). | "Each hexad extra solves a case the triad can't. A phishing email keeps integrity but fails authenticity. Encrypted data with a lost key keeps confidentiality but loses utility. A stolen encrypted laptop keeps confidentiality but loses possession." |

### Assessment hook

> **An encrypted backup tape is stolen during transport. The
> encryption key is not compromised. Which Parkerian Hexad attribute
> best captures the loss?**
>
> A. Confidentiality
> B. Availability
> C. Possession
> D. Integrity
>
> **Correct: C**

---

## D1-04 · Authenticity vs Non-repudiation (135 s)

### Learning objective

Learner can distinguish when a MAC is sufficient and when a digital
signature is required.

### Why animation

This is one of Domain 1's most error-prone distinctions. An
animation showing **two parties sharing a key vs one party holding a
private key** makes the repudiation scenario visual in a way no
paragraph can.

### Tool

**Manim** for the cryptographic flow (precise, reusable primitives);
composited in After Effects.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:12 | Two figures, Alice and Bob. A single shared key floats between them. A message with an HMAC tag passes from Alice to Bob. | "Alice and Bob share a secret key. Alice sends a message with an HMAC — a keyed hash. Bob recomputes the HMAC and verifies it. Integrity confirmed. Authenticity confirmed." |
| 2 | 0:12–0:28 | Bob "disputes" the message by gesturing to the shared key. "Maybe Bob sent it himself." | "But wait. Both Alice and Bob hold the key. Bob could have created the HMAC himself. So Bob cannot prove to a third party that Alice, and only Alice, sent the message." |
| 3 | 0:28–0:40 | Screen splits. "Authenticity: ✓. Non-repudiation: ✗." | "HMAC provides authenticity. It does not provide non-repudiation." |
| 4 | 0:40–0:58 | Scene resets. Alice now holds a **private key** alone; Bob holds only her **public key**. A signature is attached instead of an HMAC. | "Now Alice holds a private key nobody else has. She signs the message. Bob uses Alice's public key to verify the signature." |
| 5 | 0:58–1:16 | A judge gavel drops into frame. "Alice cannot deny." | "Only Alice could have produced that signature. Bob — or a judge — can now prove Alice sent it. That's non-repudiation." |
| 6 | 1:16–1:35 | A comparison table renders in place: HMAC row (Confidentiality: -, Integrity: ✓, Authn: ✓, Non-rep: ✗); Digital Signature row (Confidentiality: -, Integrity: ✓, Authn: ✓, Non-rep: ✓); AEAD row (all four except non-rep). | "Three primitives, three trade-offs. HMAC is fast and simple, but only for two parties who already trust each other. Digital signatures are slower but give you non-repudiation. AEAD ciphers like AES-GCM give you confidentiality and authenticity in one step." |
| 7 | 1:35–1:55 | Exam-style callout: "Non-repudiation requires a **private** key bound to a **single** identity." | "On the exam, non-repudiation always means digital signatures with a private key bound to one identity. If two parties share the key, you do not have non-repudiation." |
| 8 | 1:55–2:15 | Final frame: animated flowchart "Need non-repudiation? → Yes → Digital signature. No → HMAC or AEAD." | "So if your scenario involves a dispute — legal, contractual, financial — and a third party needs to judge who sent what, you need a signature. Not an HMAC." |

### Assessment hook

> **A fintech platform uses HMAC-SHA-256 to protect API requests
> between its mobile app and backend, both of which share a symmetric
> key issued at app install. A customer disputes a $10,000 transfer
> and the platform wants to prove the customer's device initiated
> the request. Is the current design sufficient?**
>
> A. Yes — HMAC provides authenticity and integrity.
> B. Yes — HMAC is non-repudiable because the key is per-device.
> C. No — HMAC does not provide non-repudiation; the platform could
>    have created the same HMAC.
> D. No — HMAC is broken for financial transactions.
>
> **Correct: C** — the platform and the customer's device both
> hold the HMAC key, so the platform cannot prove to a third party
> that the customer originated the request.

---

## D1-05 · The Risk Math Machine (150 s)

### Learning objective

Learner can compute SLE, ALE, and ROSI from scenario inputs and
recognize when a control is not financially justified.

### Why animation

Watching the numbers flow through the pipeline — AV × EF → SLE × ARO
→ ALE — physically encodes the formula sequence better than staring
at it on paper.

### Tool

**Manim**. Manim is built for exactly this: labeled values flowing
through boxes with arrows, numbers updating live.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Title: "Risk Math Machine". Four empty boxes in a row: AV, EF, ARO, ALE. | "Four variables. Two multiplications. One decision. Here's the CISSP risk math in two minutes." |
| 2 | 0:10–0:28 | Scenario card: "1,000 laptops × $1,500 each. 2% lost or stolen per year. Full loss per incident." Values stream into the boxes: AV = $1,500, EF = 100%, ARO = 0.02. | "A fleet of 1,000 laptops, each worth $1,500. Two percent go missing per year. When one is lost, we lose 100% of its value." |
| 3 | 0:28–0:42 | First box computes: SLE = AV × EF = $1,500 × 1.0 = **$1,500**. | "Single loss expectancy — SLE — is asset value times exposure factor. $1,500 times 100% equals $1,500. That's what one incident costs us." |
| 4 | 0:42–0:56 | Second box: ALE = SLE × ARO = $1,500 × 0.02 = **$30** per laptop. Fleet multiplier: × 1,000 = **$30,000**. | "Annualized loss expectancy is SLE times annualized rate of occurrence. Thirty dollars per laptop. Times a fleet of 1,000: $30,000 per year." |
| 5 | 0:56–1:15 | New panel: "Control: full-disk encryption at $50/laptop/year". New EF = 10%. New SLE = $150. New ALE = $3/laptop = $3,000/year. | "Now we evaluate a control: full-disk encryption at $50 per laptop per year. It doesn't stop laptops from being lost, but it cuts the exposure factor to 10% because the data is protected." |
| 6 | 1:15–1:35 | ROSI formula renders and computes: ($30,000 − $3,000 − $50,000) / $50,000 = **−0.46**. A red X appears. | "Return on security investment. Old ALE minus new ALE minus control cost, divided by control cost. Negative 0.46. The control is not financially justified on these numbers alone." |
| 7 | 1:35–1:55 | Callout: "But wait — regulatory, reputational, ethical factors may override pure ROSI." Three badges fade in: GDPR, Breach cost, Public trust. | "But CISSP candidates should know: ROSI is not the only input. Regulatory requirements, reputational damage, and ethical obligations can justify a control that looks unjustifiable on a spreadsheet." |
| 8 | 1:55–2:15 | Decision flowchart: "ALE before / ALE after / Control cost / ROSI → Treatment choice (Mitigate/Transfer/Accept)". | "The exam wants you to run the math, then remember the math is a decision input, not a decision." |
| 9 | 2:15–2:30 | Summary card: "SLE = AV × EF. ALE = SLE × ARO. ROSI = (ΔALE − cost) / cost." | "Memorize three formulas and every quantitative risk question becomes mechanical." |

### Assessment hook

> **Given: AV = $200,000, EF = 25%, ARO = 0.5. What is the ALE?**
>
> A. $25,000
> B. $50,000
> C. $100,000
> D. $200,000
>
> **Correct: A** — SLE = $200,000 × 0.25 = $50,000; ALE = $50,000 ×
> 0.5 = $25,000.

---

## D1-06 · The Risk Treatment Compass (105 s)

### Learning objective

Learner can select the appropriate risk treatment (avoid/mitigate/
transfer/accept) given a scenario and recognize why "ignore" is not
a valid treatment.

### Why animation

A **compass rose** metaphor makes the four options spatial — and
showing the **decision flow** from assessment to treatment makes the
sequential nature clear.

### Tool

**After Effects** with a custom compass asset.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:12 | A compass rose draws itself. Four cardinals labeled Avoid, Mitigate, Transfer, Accept. Center labeled "Risk". | "Four treatments. One risk. Which direction do you point?" |
| 2 | 0:12–0:28 | Scenario: "A new feature would let users upload videos containing faces, processed by ML — creating GDPR Article 9 risk above risk capacity." Needle swings to Avoid. | "First case: a risk so large it exceeds your organization's capacity. You don't negotiate with that risk. You avoid it — the feature doesn't ship." |
| 3 | 0:28–0:44 | Scenario: "Phishing is the top threat. Invest in MFA + user training." Needle swings to Mitigate. | "Second case: the most common. Apply controls to reduce likelihood or impact. Most of what security teams do is mitigation." |
| 4 | 0:44–1:00 | Scenario: "Cyber insurance for tail risk of a massive breach." Needle swings to Transfer. | "Third: transfer. Insurance, contracts, outsourcing. You shift the financial consequence to someone else — but accountability and reputation stay with you." |
| 5 | 1:00–1:18 | Scenario: "A $50 risk is known and documented. Senior management signs off." Needle swings to Accept. | "Fourth: accept. For risks within appetite, after other treatments, with formal sign-off. Acceptance is a documented decision, not an unexamined default." |
| 6 | 1:18–1:35 | Off-compass area dims. A small gray arrow labeled "Ignore" has a red X over it. | "One more: ignore. Ignore is not a treatment. Undocumented, unassessed risks are governance failures, not choices." |
| 7 | 1:35–1:45 | Summary: priority order. "Mitigate to appetite → Transfer residual → Accept what remains → Avoid if above capacity." | "The order matters. Mitigate down to appetite, transfer the residual if you can, accept what's left, and avoid entirely if the risk exceeds your capacity." |

### Assessment hook

> **A company discovers that a legacy billing system processes credit
> cards without tokenization, exceeding the organization's documented
> risk appetite. Management invests in a tokenization gateway and a
> cyber insurance policy for residual exposure. What risk treatment
> strategy is the company using?**
>
> A. Avoid only
> B. Mitigate and transfer
> C. Transfer only
> D. Accept only
>
> **Correct: B**

---

## D1-07 · The BIA Clock (120 s)

### Learning objective

Learner can position MTD, RTO, RPO, and WRT on a timeline and apply
the `MTD ≥ RTO + WRT` inequality.

### Why animation

Time-based concepts belong on a time axis. A ticking clock with
color-coded regions lets the learner see why WRT is often forgotten
and why RPO looks backward while RTO looks forward.

### Tool

**After Effects** with a large analog clock face as the primary asset.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | A horizontal time axis. A vertical line at t=0 labeled "DISASTER". | "At time zero, something breaks. Business continuity is what happens next on this axis." |
| 2 | 0:10–0:25 | A point appears to the **left** of t=0, labeled "Last good backup". Arrow labeled "RPO" spans from the point to t=0. | "Your last good backup sits before the disaster. The distance between that backup and the disaster is your recovery point objective — how much data you can afford to lose." |
| 3 | 0:25–0:42 | To the **right** of t=0, a point appears: "Service restored". Arrow "RTO" spans from t=0 to the service-restored marker. | "After the disaster, the clock runs. Your recovery time objective is how long it takes to bring the service back." |
| 4 | 0:42–1:00 | A second point further right: "Operations verified and users re-enabled". Arrow "WRT" spans from restored-to-operations. | "But restored isn't the same as operational. Data has to be verified. Users re-enabled. Tests run. That gap is work recovery time." |
| 5 | 1:00–1:20 | A bracket above the combined region from t=0 to verified: "MTD ≥ RTO + WRT". | "Your maximum tolerable downtime must be greater than or equal to RTO plus WRT. If it isn't, your plan is mathematically infeasible." |
| 6 | 1:20–1:45 | Worked example: RTO = 4h, WRT = 2h, MTD stated as 8h. Green check. Second example: RTO = 6h, WRT = 4h, MTD = 8h. Red X. | "Example. Four hours to restore, two hours to verify, eight hours tolerable — that works. But six plus four is ten, and the business said eight. That plan is broken on paper before anyone touches it." |
| 7 | 1:45–2:00 | Final frame: "RPO looks backward. RTO looks forward. WRT is the gap after." | "Remember: RPO looks backward to the last good backup. RTO looks forward to service restored. WRT is the gap most plans forget." |

### Assessment hook

> **A process has MTD = 12 hours and an RTO of 10 hours. What is
> the maximum allowable WRT?**
>
> A. 2 hours
> B. 10 hours
> C. 12 hours
> D. 22 hours
>
> **Correct: A** — WRT ≤ MTD − RTO = 12 − 10 = 2 hours.

---

## D1-08 · DR Site Ladder (90 s)

### Learning objective

Learner can order the recovery site options from lowest to highest
cost and from slowest to fastest recovery, and recognize why cloud
DR is not a single point on the ladder.

### Why animation

The ladder metaphor makes trade-offs physical: you climb and the
recovery speeds up but the cost also climbs.

### Tool

**Excalidraw** vectors + **After Effects** for the climb animation.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | A tall ladder on the left, cost axis climbing with it. Bottom rung: Reciprocal. | "Start at the bottom. A reciprocal agreement is cheap and usually theoretical — if you need it, your partner probably needs it too." |
| 2 | 0:10–0:22 | Next rung: Cold site. | "Cold site: four walls, power, HVAC, and a lot of empty racks. Cheap, but recovery measured in days to weeks." |
| 3 | 0:22–0:36 | Next rung: Warm site. | "Warm site: hardware installed, data backed up but not current. Recovery in hours to days." |
| 4 | 0:36–0:50 | Next rung: Hot site. | "Hot site: fully equipped and current, ready to take over. Recovery in minutes to hours — and the cost climbs proportionally." |
| 5 | 0:50–1:02 | Top rung: Mirror / active-active. | "At the top: mirrored site, active-active. Near-zero recovery time. Most expensive option." |
| 6 | 1:02–1:20 | A cloud icon floats to the side of the ladder, touching multiple rungs. | "Cloud DR isn't a single rung. It can be cold — restore from snapshots. Warm — a scaled-down replica. Hot — active-active across regions. The service you pay for determines which rung you land on." |
| 7 | 1:20–1:30 | Decision card: "Match the rung to the RTO and RPO from your BIA." | "Don't pick a rung by cost alone. Match it to the RTO and RPO your BIA says the business actually needs." |

### Assessment hook

> **A critical business process has an RTO of 30 minutes and an RPO
> of 5 minutes. Which DR strategy is MOST appropriate?**
>
> A. Cold site with daily tape restores
> B. Warm site with weekly replication
> C. Hot site with synchronous replication
> D. Reciprocal agreement with a partner organization
>
> **Correct: C**

---

## D1-09 · STRIDE Walkthrough (165 s)

### Learning objective

Learner can apply STRIDE to a simple data flow diagram and name the
security property each letter violates.

### Why animation

STRIDE is most useful as a **tour**: walk each element, ask each
question, see which threats apply. Animation mimics the walk.

### Tool

**After Effects** with a pre-drawn DFD of a simple web-app +
database + auth service.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:12 | A DFD appears: User → Web App → Database; Web App → Auth Service. Trust boundary drawn between User and Web App. | "Here's a simple system: a user, a web app, a database, and an auth service. Our job is to walk it with STRIDE and find the threats before an attacker does." |
| 2 | 0:12–0:30 | "S" letter glows. An attacker icon impersonates the User. | "S is spoofing. Can an attacker impersonate the user — or the auth service? Spoofing violates authentication." |
| 3 | 0:30–0:48 | "T" letter glows. An arrow between Web App and Database flashes red with a "modified" label. | "T is tampering. Can someone modify data in transit or at rest? Tampering violates integrity." |
| 4 | 0:48–1:05 | "R" letter glows. A user icon throws up hands: "I didn't do that." | "R is repudiation. Can a user deny taking an action? Repudiation violates non-repudiation. Audit logs and digital signatures help." |
| 5 | 1:05–1:22 | "I" letter glows. The database leaks a stream of records. | "I is information disclosure. Can confidential data leak? This violates confidentiality." |
| 6 | 1:22–1:40 | "D" letter glows. A flood of requests smashes the Web App. | "D is denial of service. Can the system be made unavailable to legitimate users? This violates availability." |
| 7 | 1:40–2:00 | "E" letter glows. An attacker climbs a ladder of permission levels from guest to admin. | "E is elevation of privilege. Can an attacker gain more access than they should? This violates authorization." |
| 8 | 2:00–2:20 | STRIDE table renders. Each letter mapped to a security property. | "Spoofing authentication. Tampering integrity. Repudiation non-repudiation. Information disclosure confidentiality. DoS availability. EoP authorization. If you remember the mapping, you can reason about any DFD." |
| 9 | 2:20–2:45 | Final frame with a call-out to threat-model every system at design time. | "STRIDE is a taxonomy. It tells you what to look for. Ranking the threats is a separate step — use DREAD, PASTA, or simple risk math for that." |

### Assessment hook

> **During a threat-modeling session, the team identifies that an
> attacker could submit specially crafted input to a logging
> function, causing the logger to execute attacker-controlled code
> in a privileged process. Which STRIDE category BEST fits this
> threat?**
>
> A. Tampering
> B. Repudiation
> C. Elevation of privilege
> D. Information disclosure
>
> **Correct: C** — the attack grants higher privilege than the
> attacker should have (the classic Log4Shell pattern).

---

## D1-10 · GDPR vs CCPA Overlay Map (110 s)

### Learning objective

Learner can identify which regulation governs which data, and
recognize when both apply simultaneously.

### Why animation

A literal **map overlay** — Europe in blue, California in red,
overlap regions highlighted — makes the "extraterritorial reach" of
GDPR and the "California resident" scope of CCPA visually obvious.

### Tool

**Mapbox** for base maps; **After Effects** for overlays and
callouts.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:12 | World map with Europe highlighted in blue. | "GDPR covers EU residents' personal data — wherever it's processed." |
| 2 | 0:12–0:24 | California highlighted in red. | "CCPA, extended by CPRA, covers California residents' personal information — if the business meets certain thresholds." |
| 3 | 0:24–0:40 | A cartoon e-commerce company based in Texas is tagged. Lines extend from Texas to both Europe and California. | "Now consider a Texas-based e-commerce company. It has EU customers. And California customers. Both regulations apply." |
| 4 | 0:40–1:00 | Split-screen comparison of key concepts: lawful basis (GDPR) vs notice-and-opt-out (CCPA); 72-hour breach notification (GDPR) vs "without unreasonable delay" (CCPA). | "GDPR needs a lawful basis for every processing. CCPA uses a notice-and-opt-out model. GDPR breach notification is 72 hours. CCPA is 'without unreasonable delay'." |
| 5 | 1:00–1:20 | A Venn diagram: GDPR circle, CCPA circle, overlap highlighted with "apply the most protective rule". | "When both apply, the most protective rule usually wins. That's almost always GDPR for data subject rights and breach timing." |
| 6 | 1:20–1:45 | A fintech scenario: company in Singapore, customers in France, California, and Japan. Three flags pop up: GDPR, CCPA, APPI. | "Real-world companies often operate under three or more regimes at once. A good compliance program maps each data element to every regulation that touches it." |
| 7 | 1:45–1:50 | Summary: "GDPR: extraterritorial. CCPA: threshold-based. Overlap: most protective wins." | "Three words to remember: extraterritorial, threshold, most-protective." |

### Assessment hook

> **A US-based SaaS vendor stores personal data of EU citizens in a
> Singapore data center. Which of the following is TRUE?**
>
> A. GDPR does not apply because data is not stored in the EU.
> B. GDPR applies because the data subjects are EU residents.
> C. GDPR applies only if the vendor has an EU office.
> D. GDPR applies only if a data transfer agreement is missing.
>
> **Correct: B** — GDPR is extraterritorial; scope is based on data
> subjects, not processing location.

---

## D1-11 · Due Care vs Due Diligence (95 s)

### Learning objective

Learner can classify an action as due care or due diligence and use
the distinction to choose the best answer on a third-party scenario.

### Why animation

Two parallel tracks on screen — **Do** on one side, **Verify** on
the other — make the split visual and memorable.

### Tool

**Lottie** icons for the action pictograms; **After Effects** for
the dual-track animation.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Split screen. Left: "DUE CARE — do". Right: "DUE DILIGENCE — verify". | "Two phrases the CISSP exam loves to confuse. Due care means doing the right things. Due diligence means verifying the right things are being done." |
| 2 | 0:10–0:25 | Left side: a hammer icon builds a wall (policies, controls, training). | "Due care is action. Your organization writes policy. It deploys controls. It trains staff." |
| 3 | 0:25–0:40 | Right side: a magnifying glass examines a report (audits, vendor reviews, metrics). | "Due diligence is verification. Your organization audits. Reviews vendors. Monitors metrics." |
| 4 | 0:40–1:00 | A vendor onboarding scenario. Left: company implements its own controls. Right: company reviews vendor's SOC 2 before signing. | "A vendor onboarding is the classic case. Your own controls are due care. Reviewing the vendor's SOC 2 report before you sign is due diligence." |
| 5 | 1:00–1:20 | Exam-style question: "What should a company do FIRST before engaging a cloud provider to process regulated data?" | "On the exam, when the scenario asks what to do BEFORE engaging a third party, it usually wants the due diligence answer. Verify before you trust." |
| 6 | 1:20–1:35 | Memory hook: "Care = Do. Diligence = Verify." | "Two words. Care does. Diligence verifies. That's the whole test." |

### Assessment hook

> **A company's CISO reviews the SOC 2 Type II report and ISO 27001
> certificate of a candidate cloud provider before signing the master
> services agreement. This activity BEST represents:**
>
> A. Due care
> B. Due diligence
> C. Risk acceptance
> D. Risk avoidance
>
> **Correct: B**

---

## D1-12 · SCRM Visibility — The SBOM Iceberg (100 s)

### Learning objective

Learner can explain why a Software Bill of Materials is a
governance-level artifact, not just a developer tool, and connect it
to supply chain risk management.

### Why animation

The **iceberg** metaphor — visible application above the waterline,
hidden dependencies below — is the exact mental model security
leaders need. Animation lets it expand.

### Tool

**After Effects** with an iceberg asset.

### Scene breakdown

| # | Duration | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | A simple app box above a waterline. "Your application". | "Here's what your customers see. Your application." |
| 2 | 0:10–0:25 | The camera pans down below the waterline. The iceberg is enormous: dozens of open-source packages, transitive dependencies, build tooling. | "Here's what actually ships. Every direct dependency, every transitive dependency, every build tool, every container layer. Most of it is someone else's code." |
| 3 | 0:25–0:40 | A red marker pulses deep in the iceberg, labeled "Log4j 2.14". | "In December 2021, one library buried in that iceberg — Log4j — turned out to contain a remote code execution vulnerability. Organizations asked a simple question. Do we use Log4j? And most couldn't answer quickly." |
| 4 | 0:40–1:00 | A document icon labeled "SBOM" lights up and starts illuminating every node in the iceberg. | "An SBOM — Software Bill of Materials — is a machine-readable inventory of every component in a piece of software. SPDX and CycloneDX are the leading formats. Executive Order 14028 made SBOMs a US federal procurement requirement in 2021." |
| 5 | 1:00–1:18 | A governance-level dashboard shows the same SBOM at a portfolio level across dozens of applications, with vulnerability counts and vendor badges. | "The power isn't at the developer level. It's at the governance level. Now a CISO can answer: across every application we ship, how many use this component? Which vendors? Which of our customers inherited the risk?" |
| 6 | 1:18–1:40 | Summary card with the SCRM pillars: Visibility (SBOM), Tiering, Assurance, Flow-down, Monitoring, Exit planning. | "SBOM is pillar one: visibility. You can't manage what you can't see. Tiering, assurance, flow-down, monitoring, and exit planning are the other pillars of supply chain risk management." |

### Assessment hook

> **After a zero-day is announced in a widely-used logging library,
> a CISO needs to answer 'do we use this component?' across 400
> applications in under 24 hours. Which governance artifact most
> directly enables this?**
>
> A. A vulnerability management SLA
> B. A software bill of materials (SBOM) program
> C. A third-party risk register
> D. A security incident response plan
>
> **Correct: B**

---

## Production notes

### Accessibility requirements

Every animation must ship with:

- Closed captions (WebVTT).
- A text transcript alongside the video.
- Color palette that passes WCAG AA for all text overlays.
- Descriptive alt text for any still frames used as review cards.

### Reuse across domains

Several assets from Domain 1 will be reused in later domains:

- The DFD in D1-09 (STRIDE) is the base asset for threat modeling
  animations in Domain 8.
- The risk math machine (D1-05) will be referenced in Domain 6 when
  risk assessment outputs feed vulnerability management decisions.
- The compass in D1-06 is referenced again in Domain 2 for data
  classification treatment choices.

### Naming convention for deliverables

```
D{domain}-{ordinal}-{slug}.mp4
D{domain}-{ordinal}-{slug}-captions.vtt
D{domain}-{ordinal}-{slug}-transcript.md
D{domain}-{ordinal}-{slug}-thumb.png
```

Example: `D1-05-risk-math-machine.mp4`.
