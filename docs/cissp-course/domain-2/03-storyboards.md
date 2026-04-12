# Domain 2 — Asset Security: Animation Storyboards

> **AI-generated production briefs** for Domain 2 animations.
> 10 concepts. Narration at ~150 wpm. Tool mix favors Excalidraw,
> After Effects, and Lottie.

---

## Storyboard index

| # | Concept | Duration | Tool | Sub-obj |
|---|---|---|---|---|
| D2-01 | Data owner vs data custodian vs data steward | 90 s | Lottie + AE | 2.1 |
| D2-02 | High-water mark (mixing classifications) | 75 s | Excalidraw + AE | 2.1 |
| D2-03 | Data lifecycle conveyor: create → destroy | 140 s | After Effects | 2.4 |
| D2-04 | Three data states and state-specific controls | 120 s | Manim + AE | 2.4 |
| D2-05 | NIST SP 800-88 Clear / Purge / Destroy | 105 s | After Effects | 2.5 |
| D2-06 | Retention conflict resolver | 110 s | After Effects | 2.5 |
| D2-07 | GDPR roles: subject / controller / processor | 100 s | Lottie + AE | 2.6 |
| D2-08 | HIPAA roles: individual / covered entity / BA | 90 s | Lottie + AE | 2.6 |
| D2-09 | Anonymization vs pseudonymization (reversibility demo) | 115 s | Manim + AE | 2.6 |
| D2-10 | Cloud provisioning gates (the six-gate checklist) | 100 s | After Effects | 2.3 |

Total runtime: ~18 minutes across 10 videos.

---

## D2-01 · Data Owner vs Data Custodian vs Data Steward (90 s)

### Learning objective

Learner can name the correct role for classification, implementation,
and day-to-day management decisions in any Domain 2 scenario.

### Why animation

The three roles sit at different levels of the same decision tree;
an org-chart-style animation with speech bubbles anchors "who
decides what" better than any paragraph.

### Tool

Lottie characters + After Effects camera.

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Three characters fade in: owner (business exec), custodian (sysadmin), steward (data analyst). | "Three roles, three different jobs. Let's get them straight." |
| 2 | 0:10–0:25 | Owner holds a clipboard labeled "Classification, Retention, Access decisions". | "The data owner is a business role. They decide how sensitive the data is, how long to keep it, who can see it. They're accountable to the business and the board." |
| 3 | 0:25–0:40 | Custodian holds a wrench labeled "Controls, Backups, Encryption, Access Lists". | "The data custodian is a technical role. They implement and operate the controls the owner specifies. They don't decide what the data is — they decide how to protect it." |
| 4 | 0:40–0:55 | Steward holds a magnifying glass labeled "Data quality, documentation, glossary". | "The data steward handles day-to-day data use and quality. Definitions, lineage, how fields are interpreted, catching duplicates." |
| 5 | 0:55–1:15 | Exam scenario appears: "Who decides if this dataset is Confidential?" The owner glows. | "On the exam, questions about classification, retention, or access decisions always point to the data owner. The security team may advise, but the decision belongs to the business owner." |
| 6 | 1:15–1:30 | Memory card: "Owner decides. Custodian implements. Steward maintains." | "Remember: owner decides, custodian implements, steward maintains. That one sentence answers half the Domain 2 questions." |

### Assessment hook

> **A new dataset is being stood up. Who is responsible for assigning
> its classification level?**
>
> A. The data custodian
> B. The data owner
> C. The security team
> D. The compliance officer
>
> **Correct: B**

---

## D2-02 · High-Water Mark (75 s)

### Learning objective

Learner can apply the high-water mark rule to any mixed-classification
scenario.

### Why animation

Rising water level visually encodes the concept better than text.

### Tool

Excalidraw vectors + After Effects water animation.

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Three buckets: Public (short), Internal (medium), Confidential (tall). | "Three buckets, three water levels. The level is the classification." |
| 2 | 0:10–0:25 | Pour contents of all three into a single new bucket. | "Now we combine them. What's the classification of the mix?" |
| 3 | 0:25–0:40 | The combined bucket fills to the tallest of the three — Confidential. | "High-water mark. The collection inherits the highest classification of any element. A Public report combined with Confidential pricing data is Confidential, full stop." |
| 4 | 0:40–0:55 | Real-world example: a marketing dashboard that pulls from both public market data and internal revenue data. | "A marketing dashboard that mixes public market data with internal revenue numbers becomes Internal. A spreadsheet that joins HR records with regulated health data becomes Restricted." |
| 5 | 0:55–1:15 | Summary: "Mix in, highest wins." | "Aggregation is its own risk. The sum can be more sensitive than any part, and the classification policy must keep up." |

### Assessment hook

> **A quarterly dashboard displays public SEC filings, internal
> payroll summaries, and Confidential competitive analysis side by
> side. What is the dashboard's classification?**
>
> A. Public
> B. Internal
> C. Confidential
> D. Mixed (no single classification)
>
> **Correct: C**

---

## D2-03 · Data Lifecycle Conveyor (140 s)

### Learning objective

Learner can name the six lifecycle stages and pick the right control
for each.

### Why animation

Physical conveyor-belt metaphor makes the sequence visible.

### Tool

After Effects with a factory-conveyor asset.

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | A conveyor belt with six stations labeled Create, Store, Use, Share, Archive, Destroy. | "Every piece of data rides this belt. Six stations. Six control sets." |
| 2 | 0:10–0:25 | A document drops onto station 1 (Create). Badges appear: classification, legal basis, owner assigned. | "Station one: create. The data is classified the moment it exists. A legal basis is established. An owner is named. Miss this and everything downstream breaks." |
| 3 | 0:25–0:40 | Conveyor advances to Store. Locks, shields, and keys appear. | "Station two: store. At-rest encryption, access control, region restrictions, physical security. The data is quiet but vulnerable." |
| 4 | 0:40–0:55 | Advance to Use. Magnifying glass, session recording, DLP badge. | "Station three: use. The hardest state to protect. Memory, enclaves, application controls, DLP on endpoints. Encryption does not help here — the data is in RAM, unencrypted, for the CPU to read." |
| 5 | 0:55–1:10 | Advance to Share. Two parties, contract icon, TLS badge. | "Station four: share. Data crosses a boundary. TLS, authentication of both ends, contract terms, DLP, logging." |
| 6 | 1:10–1:25 | Advance to Archive. Cold-storage icon, key-escrow badge. | "Station five: archive. Long-term, infrequently-accessed, still protected. Key escrow matters because the people who created the data may not be there to unlock it." |
| 7 | 1:25–1:45 | Advance to Destroy. NIST 800-88 banner, certificate of destruction. | "Station six: destroy. NIST SP 800-88 — Clear, Purge, or Destroy depending on media and classification. Produce evidence. Retain the evidence, not the data." |
| 8 | 1:45–2:05 | Full conveyor visible with all six stations glowing. | "Security obligations run the full length of this belt. A control that works at station two may not work at station three. Build for the full lifecycle, not the moment." |
| 9 | 2:05–2:20 | Title: "Create, Store, Use, Share, Archive, Destroy." | "Six stations. Memorize them. Every Domain 2 question lives on one of them." |

### Assessment hook

> **Which data lifecycle stage is LEAST protected by traditional
> encryption?**
>
> A. Store (at rest)
> B. Share (in transit)
> C. Use (in memory)
> D. Archive (long-term store)
>
> **Correct: C**

---

## D2-04 · Three Data States (120 s)

### Learning objective

Learner can identify at-rest, in-transit, and in-use data and pick
state-specific controls.

### Why animation

Clear visual distinction of the three states eliminates the most
common Domain 2 conceptual error.

### Tool

Manim for the geometric representations + AE for composition.

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:15 | Three scenes split horizontally: a disk (at rest), a network cable (in transit), a CPU (in use). | "Three states. Three sets of controls." |
| 2 | 0:15–0:35 | Disk glows with an AES lock. "Encryption, access control, physical security." | "At rest: encrypt. Control access. Physically protect the media. Standard stuff — and mostly solved." |
| 3 | 0:35–0:55 | Cable animates with encrypted traffic. "TLS, IPsec, VPN, authenticated channels." | "In transit: encrypt the channel. TLS for application traffic, IPsec for networks, VPN for user tunnels. Every modern protocol defaults to TLS 1.2 or higher." |
| 4 | 0:55–1:20 | CPU scene. Plaintext data flows in. Question mark appears. | "In use: here's the problem. The CPU needs plaintext to compute. An attacker with memory access — or a hypervisor, or a compromised kernel — can read it." |
| 5 | 1:20–1:45 | Confidential computing icons appear: SGX, TDX, SEV, Nitro Enclaves. "Enclave tech." | "Modern answer: confidential computing. Hardware enclaves that hide memory from the OS, the hypervisor, even the CPU vendor's debug tools. Intel SGX and TDX, AMD SEV, AWS Nitro Enclaves, Azure Confidential VMs." |
| 6 | 1:45–2:00 | Summary card: "At rest → encryption. In transit → TLS. In use → enclaves or compensating controls." | "State-specific controls. Never assume that an at-rest control covers in-use risk. That's the number one Domain 2 trap." |

### Assessment hook

> **A data analytics application processes encrypted patient data
> in a commercial cloud. Which technology is MOST directly designed
> to protect data in use?**
>
> A. AES-256 at-rest encryption
> B. TLS 1.3 for in-transit encryption
> C. Confidential computing / hardware enclaves
> D. Database audit logs
>
> **Correct: C**

---

## D2-05 · NIST SP 800-88 Clear / Purge / Destroy (105 s)

### Learning objective

Learner can select the correct sanitization level for a given
medium and classification.

### Why animation

The three levels are easy to confuse; a ladder metaphor ordered by
difficulty-to-recover makes the distinction stick.

### Tool

After Effects with media icons.

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Three rungs labeled Clear, Purge, Destroy, with increasing cost and decreasing recoverability. | "NIST SP 800-88. Three levels of media sanitization. Pick the right one." |
| 2 | 0:10–0:25 | Clear rung. An HDD with overwrite pattern. "Standard recovery tools can't recover the data." | "Clear: overwrite the data. Standard recovery utilities can't get it back. Appropriate for low-classification data staying within the organization." |
| 3 | 0:25–0:45 | Purge rung. An SSD with crypto-erase. A magnetic tape with degausser. | "Purge: even specialized lab tools can't recover. Cryptographic erase on an SSD with self-encrypting drive support counts as Purge. Degaussing a magnetic tape counts as Purge." |
| 4 | 0:45–1:00 | Destroy rung. A shredder eating a disk; a furnace. | "Destroy: physical destruction. Shredding, incineration, pulverization, melting. The media cannot be reused. Required for the highest classification or damaged media that cannot be reliably purged." |
| 5 | 1:00–1:25 | Decision matrix: (Clear, Purge, Destroy) × (Low, Moderate, High classification) × (leaving org). Cells shade in. | "The decision grid: classification on one axis, destination on the other. Low classification leaving the organization? Clear is usually enough. High classification? Destroy, and document with a certificate." |
| 6 | 1:25–1:45 | Final card: "SSD crypto-erase = Purge. Delete ≠ Clear. Reformat ≠ Clear." | "Three final points. SSD crypto-erase counts as Purge when properly implemented. Deleting files is not Clear — the blocks are still there. Reformatting is not Clear — it often just rewrites the filesystem table." |

### Assessment hook

> **A hospital is disposing of SSDs that contained HIPAA-protected
> PHI. Which sanitization method is MOST appropriate?**
>
> A. Delete files and reformat
> B. Single-pass overwrite
> C. Cryptographic erase (if supported) or physical destruction
> D. Degauss
>
> **Correct: C** — degaussing does not work on SSDs (no magnetic media).

---

## D2-06 · Retention Conflict Resolver (110 s)

### Learning objective

Learner can resolve conflicts between competing retention
obligations.

### Why animation

Multiple clocks visualized side-by-side make the conflict concrete.

### Tool

After Effects.

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Four clocks labeled SOX (7 yr), HIPAA (6 yr), GDPR (minimize), legal hold (indefinite). | "Four clocks. One dataset. Which one wins?" |
| 2 | 0:10–0:30 | Legal hold clock overrides the others with a red banner. | "Rule one: legal holds always win. If litigation is anticipated or active, destruction is suspended. Period. Regardless of what other retention rules say." |
| 3 | 0:30–0:50 | Remove legal hold. SOX (7 yr) clock highlights. | "Rule two: when no hold applies, the longest applicable retention governs the minimum. If SOX says keep for 7, you keep for at least 7, regardless of HIPAA's shorter figure." |
| 4 | 0:50–1:10 | GDPR clock appears as a ceiling: "no longer than necessary for the purpose." | "Rule three: the shortest data-minimization obligation governs the maximum. GDPR doesn't say a number — it says 'no longer than necessary'. Once the purpose is fulfilled, you must delete." |
| 5 | 1:10–1:35 | Example scenario: SOX 7 yr, HIPAA 6 yr, GDPR necessary 3 yr. Result: conflict. | "Now the interesting case. SOX wants 7. HIPAA wants 6. GDPR says the purpose expires at 3. Which wins?" |
| 6 | 1:35–1:50 | Resolution: SOX wins because statutory retention overrides data-minimization for the data elements it covers. | "Statutory retention obligations override data-minimization for the specific data elements they cover. You keep SOX-covered financial records for 7 years even if GDPR would otherwise have you delete them." |

### Assessment hook

> **A company under active litigation hold discovers that some
> of the held data has reached the end of its GDPR retention
> period. What should the company do?**
>
> A. Delete the data to comply with GDPR
> B. Retain the data under the legal hold; document the conflict
> C. Negotiate with counsel to partially delete
> D. Ignore the GDPR obligation
>
> **Correct: B** — legal holds override normal retention.

---

## D2-07 · GDPR Roles (100 s)

### Learning objective

Learner can assign the correct GDPR role (subject, controller,
processor, joint controllers) in a given scenario.

### Tool

Lottie + AE.

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Three characters: subject (individual), controller (business), processor (vendor). | "GDPR gives you three roles. Know them." |
| 2 | 0:10–0:25 | Subject glows. "The individual the data is about." | "The data subject: the natural person the data identifies. Rights attach here — access, correction, deletion, portability, objection." |
| 3 | 0:25–0:45 | Controller glows. "Decides why and how data is processed." | "The controller decides the why and the how of processing. Purpose, lawful basis, retention, recipients. The controller is accountable to the supervisory authority." |
| 4 | 0:45–1:05 | Processor glows. "Processes data on behalf of the controller." | "The processor executes the controller's instructions. No independent purposes, no reuse, no sub-processing without authorization. Bound by a Data Processing Agreement." |
| 5 | 1:05–1:25 | Scenario: "A SaaS payroll vendor serves an EU retailer." The retailer is controller, the vendor is processor. | "Payroll SaaS serving a retailer: retailer is controller, vendor is processor. Retailer decides what to process. Vendor executes." |
| 6 | 1:25–1:40 | Joint controllers visual. | "Joint controllers: two entities that together determine the purposes and means of processing. They must arrange their respective responsibilities transparently." |

### Assessment hook

> **An advertising company uses its own algorithms to target ads
> to EU users on behalf of a retailer. Both decide on categories
> and criteria. What is the ad company's GDPR role?**
>
> A. Processor
> B. Controller
> C. Joint controller with the retailer
> D. Data subject
>
> **Correct: C**

---

## D2-08 · HIPAA Roles (90 s)

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Three characters: individual, covered entity, business associate. | "HIPAA has three roles. Let's name them." |
| 2 | 0:10–0:25 | Individual glows. "The person whose PHI is protected." | "The individual is the patient or plan member whose Protected Health Information is at stake." |
| 3 | 0:25–0:45 | Covered entity glows. Icons: provider, health plan, clearinghouse. | "A covered entity is a healthcare provider that transmits health information electronically, a health plan, or a health care clearinghouse. These are the three HIPAA-defined covered entities." |
| 4 | 0:45–1:05 | Business associate glows. "Third party handling PHI for a covered entity." | "A business associate is any third party that handles PHI on behalf of a covered entity. Cloud providers, billing companies, transcription services, IT consultants with PHI access. A BAA — Business Associate Agreement — is legally required." |
| 5 | 1:05–1:30 | Sub-contractor business associate chained behind the BA. | "And one more: the BA's own subcontractors who handle PHI are themselves business associates, with flow-down BAAs required. HITECH made this explicit in 2013." |

### Assessment hook

> **A hospital contracts with an AWS-based SaaS company for
> electronic health records. AWS hosts the SaaS company's
> infrastructure. Under HIPAA, AWS is:**
>
> A. Not subject to HIPAA because it does not see PHI
> B. A business associate of the SaaS company, which is itself a business associate of the hospital
> C. A covered entity
> D. Exempt because it is cloud infrastructure
>
> **Correct: B**

---

## D2-09 · Anonymization vs Pseudonymization (115 s)

### Learning objective

Learner can distinguish reversible from irreversible de-identification
and apply the GDPR rule correctly.

### Why animation

The reversibility test is best shown, not told — watch a key unlock
pseudonyms but fail on anonymized data.

### Tool

Manim for the key/data interaction.

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:15 | A table of personal records: name, DOB, address, diagnosis. | "Personal data. GDPR applies. We want to use it for analytics without the privacy risk." |
| 2 | 0:15–0:35 | Pseudonymization: names replaced with codes, but a key sits in a vault. An arrow shows the key unlocks the codes. | "Pseudonymization. Replace direct identifiers with codes. Keep the key separate. Authorized users can re-identify with the key. Unauthorized users cannot." |
| 3 | 0:35–0:55 | Title card: "Still personal data under GDPR." | "Here's the trap. GDPR says pseudonymized data is still personal data, because re-identification is possible with the key. GDPR applies." |
| 4 | 0:55–1:20 | Anonymization: identifiers removed, aggregated, blurred. No key exists. Vault is empty. | "Anonymization. Remove identifiers irreversibly. No key anywhere. Re-identification must be impossible — or at least infeasible." |
| 5 | 1:20–1:40 | Title card: "No longer personal data under GDPR." | "When anonymization is successful, GDPR no longer applies. The data is outside the regulation." |
| 6 | 1:40–1:55 | Warning card: real-world re-identification attacks (Netflix Prize, Strava). | "But the real world is harder than the lab. Netflix Prize, Strava heatmap, AOL search history — all cases where 'anonymized' data was re-identified through linkage. Treat anonymization claims skeptically." |

### Assessment hook

> **A research institution removes direct identifiers from a
> health dataset and replaces them with patient codes, storing
> the code-to-identity mapping in an encrypted vault. Under GDPR,
> this dataset is:**
>
> A. No longer personal data
> B. Still personal data (pseudonymized)
> C. Anonymous
> D. Exempt from GDPR
>
> **Correct: B**

---

## D2-10 · Cloud Provisioning Gates (100 s)

### Learning objective

Learner can name the six gates that must pass before a new cloud
asset is in production.

### Tool

After Effects gate-sequence animation.

### Scenes

| # | Time | Visual | Narration |
|---|---|---|---|
| 1 | 0:00–0:10 | Six gates in sequence: Inventory, Owner, Baseline, Label, Access, Monitor. | "Before any new asset goes live, it must pass six gates." |
| 2 | 0:10–0:22 | Gate 1: Inventory. Asset appears in the inventory. | "Gate one: inventory. If it's not in the inventory, it doesn't exist — and no one will find it if it's attacked." |
| 3 | 0:22–0:34 | Gate 2: Owner. A business owner icon attaches. | "Gate two: owner. Every asset has a named business owner. The owner is accountable." |
| 4 | 0:34–0:46 | Gate 3: Baseline. Hardening icon applies. | "Gate three: baseline. The asset is deployed to a known, hardened starting state — a CIS Benchmark, STIG, or equivalent." |
| 5 | 0:46–0:58 | Gate 4: Label. Classification label attaches. | "Gate four: label. The data the asset holds is classified, and the asset itself is tagged." |
| 6 | 0:58–1:10 | Gate 5: Access. Least-privilege provisioning icon. | "Gate five: access. Initial access follows least privilege. No default admin. No shared credentials." |
| 7 | 1:10–1:22 | Gate 6: Monitor. Logging, vulnerability scanning, IR coverage icons. | "Gate six: monitor. Logging is enabled, the asset is in the vulnerability scanning scope, and incident response covers it." |
| 8 | 1:22–1:40 | Summary card: "Six gates. Miss one and you have a ghost asset." | "Miss a gate and you've created a ghost asset. The repeated S3 misconfigurations, exposed Kubernetes APIs, Snowflake no-MFA incidents — each was a ghost asset that skipped one or more gates." |

### Assessment hook

> **A new cloud application is deployed to production without
> being added to the enterprise asset inventory or assigned a
> business owner. Which provisioning gates were skipped?**
>
> A. Baseline and Access
> B. Inventory and Owner
> C. Label and Monitor
> D. All six
>
> **Correct: B**
