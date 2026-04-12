# Domain 3 — Security Architecture and Engineering: Lesson Plan

> **AI-generated study material** aligned to the (ISC)² CISSP Exam Outline
> effective April 15, 2024. Domain weight: **13%**.
>
> Topic IDs in EUREKA curriculum: `cissp_models`, `cissp_crypto`,
> `cissp_physical`, `cissp_secure_design`
> (see `eureka/apps/web/src/lib/exam-curriculum.ts:443-448`).

---

## 1. Domain summary

Domain 3 is the most technically dense domain on the CISSP exam. It covers
security models, system architecture, cryptography, physical security, and
secure design principles. The manager-mindset framing still applies — the
exam wants risk-informed decisions about architecture, not pure engineering
— but the technical vocabulary is deep and precise. Cryptography alone
accounts for many questions.

If Domain 1's mantra is "think like a manager" and Domain 2's is "think
like a data owner," Domain 3's mantra is **"know the primitive, know its
guarantee, know its failure mode."** A cryptographic choice that looks
right at the algorithm level can fail at the mode, key management, or
protocol integration level. The exam rewards candidates who understand
the full chain.

## 2. Learning objectives

| # | Objective | Bloom |
|---|---|---|
| LO3.1 | **Apply** secure design principles (least privilege, defense in depth, fail-safe, separation of duties, KISS, privacy by design, zero trust, secure defaults). | Apply |
| LO3.2 | **Differentiate** security models (Bell-LaPadula, Biba, Clark-Wilson, Brewer-Nash, Take-Grant, HRU) and select the correct model for a given scenario. | Analyze |
| LO3.3 | **Evaluate** system architecture components (TCB, security kernel, reference monitor, rings, protection domains) against security requirements. | Evaluate |
| LO3.4 | **Select** cryptographic primitives (symmetric, asymmetric, hash, MAC, signature, KDF, KEM) for confidentiality, integrity, authenticity, non-repudiation, and key-management needs. | Evaluate |
| LO3.5 | **Design** a PKI including CA hierarchy, certificate lifecycle, revocation (CRL, OCSP, stapling), and key-escrow decisions. | Create |
| LO3.6 | **Analyze** cryptographic attacks (brute force, birthday, side channel, padding oracle, chosen-plaintext/ciphertext, known-plaintext, replay, downgrade) and name defenses. | Analyze |
| LO3.7 | **Evaluate** physical security controls (CPTED, layered perimeter, mantraps, environmental, fire suppression) for a given facility. | Evaluate |
| LO3.8 | **Explain** emerging technologies (confidential computing, homomorphic encryption, post-quantum cryptography, zero trust architecture) and their exam-relevant properties. | Understand, Evaluate |

## 3. Estimated study hours

13% exam weight → 13 hours target.

| Activity | Hours |
|---|---|
| Pre-read + vocabulary | 0.5 |
| Animation module (~14 videos) | 1.0 |
| Detailed notes | 5.0 |
| Worked examples (crypto selection, PKI design, model assignment) | 2.0 |
| 50-question QBank | 2.5 |
| Mini-mock + SR review | 2.0 |
| **Total** | **13.0 hr** |

## 4. Sequenced learning path

```
Pre-read → Diagnostic → Animation → Notes (first pass) →
Worked examples (crypto selection, PKI design, model assignment) →
QBank → Timed mini-mock → SR review and second pass
```

## 5. Knowledge checkpoints

| CP | After sub-objectives | Focus |
|---|---|---|
| CP-1 | 3.1, 3.2 | Design principles, security models |
| CP-2 | 3.3, 3.4 | System architecture, trusted computing |
| CP-3 | 3.5, 3.6 | Cryptography fundamentals, applied cryptography |
| CP-4 | 3.7 | Physical security, CPTED, environmental |

## 6. Labs

### Lab 3.A — Crypto primitive selection matrix

Given 10 scenarios (bulk file encryption, API integrity, non-repudiable
log signing, TLS session key exchange, password storage, JWT signing,
hardware device identity, memory-safe data-in-use computation, legacy
interop, constrained-device mutual auth), select the appropriate
primitive with algorithm, mode, key size, and key-management notes.

### Lab 3.B — PKI design

Design a two-tier offline root / online intermediate PKI for an internal
CA issuing TLS and client certificates. Include revocation strategy
(CRL vs OCSP vs stapling), validity periods, key protection (HSM),
issuance policies, and emergency revocation procedures.

### Lab 3.C — Security model assignment

Given 8 scenarios (military classified enclave, medical records system
with integrity as top concern, audit-firm client-data segregation,
dynamic privilege-granting service, chat platform with clearance
levels), assign the most appropriate security model and defend the
choice.

### Lab 3.D — Physical layered defense design

Design layered physical controls for a small data center: perimeter,
building, floor, rack. Include CPTED principles, mantraps, surveillance,
environmental, and fire suppression choices (wet pipe vs pre-action vs
inert gas vs FM-200 vs Novec 1230).

## 7. Discussion prompts

1. "Why does the CISSP exam still care about Bell-LaPadula when almost
   no modern systems implement it directly?"
2. "What should a CISSP say when an engineer proposes 'writing our own
   encryption' for a specific use case?"
3. "Post-quantum cryptography transition: what should a CISO do in 2026
   given NIST's finalized standards?"
4. "Is zero trust a product, an architecture, or a philosophy — and
   which does the CISSP exam treat it as?"
5. "Physical security vs logical security — where does each stop being
   sufficient alone?"
6. "Confidential computing is not widely deployed yet. What threat
   models justify the investment, and which do not?"

## 8. Readiness gate to Domain 4

- [ ] Notes first pass complete
- [ ] All 4 labs at met standard
- [ ] QBank ≥ 75%
- [ ] Mini-mock ≥ 70% under timer
- [ ] SR queue active
- [ ] Domain 3 θ pass probability ≥ 0.65

## 9. Differentiators active

- **Manager mindset translator**: every crypto/architecture rationale
  names the business-consequence framing.
- **Breach anchors**: Heartbleed 2014 (OpenSSL), DigiNotar 2011 (CA
  compromise), Dual_EC_DRBG (backdoored PRNG), Apple Goto Fail 2014
  (signature bypass), Meltdown/Spectre 2018 (CPU side channel).
- **AI tutor**: on crypto misses, explains the primitive guarantee vs
  the scenario's required guarantee.
