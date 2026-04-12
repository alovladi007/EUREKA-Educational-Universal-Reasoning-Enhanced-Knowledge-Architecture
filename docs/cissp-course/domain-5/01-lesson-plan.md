# Domain 5 — Identity and Access Management: Lesson Plan

> **AI-generated study material.** (ISC)² CISSP Exam Outline effective
> April 15, 2024. Domain weight: **13%**. Topic IDs: `cissp_auth`,
> `cissp_access_control`, `cissp_identity`, `cissp_iam_attacks`.

## 1. Summary

Domain 5 covers identification, authentication, authorization, access control
models (DAC/MAC/RBAC/ABAC/RuBAC), identity management, federated identity,
and IAM attacks. Mantra: **"Identify, authenticate, authorize, audit — and
default deny."**

## 2. Learning objectives

| # | LO | Bloom |
|---|---|---|
| LO5.1 | **Differentiate** DAC, MAC, RBAC, ABAC, Rule-BAC; pick correct for scenario | Analyze |
| LO5.2 | **Apply** authentication factors (know/have/are/do/somewhere) and MFA including phishing-resistance | Apply |
| LO5.3 | **Design** federated identity with SAML, OIDC, OAuth 2.0; distinguish AuthN from AuthZ | Create |
| LO5.4 | **Analyze** IAM attacks (credential stuffing, phishing, pass-the-hash, Kerberoasting, token theft, consent phishing) | Analyze |
| LO5.5 | **Evaluate** privileged access management (PAM, bastions, JIT, credential vaulting) | Evaluate |
| LO5.6 | **Design** identity lifecycle (joiner-mover-leaver) with provisioning and recertification | Create |
| LO5.7 | **Select** SSO patterns (enterprise SSO, Kerberos, OIDC) for given scenarios | Evaluate |

## 3. Hours

13 hr. Pre-read 0.5 / animations 1 / notes 5 / labs 2 / QBank 2.5 / mini-mock+SR 2.

## 4. Path

Pre-read → diagnostic → animations → notes → labs (federation flow, Kerberos,
PAM design) → QBank → mini-mock → SR.

## 5. Labs

- **5.A — Federation flow analysis.** Trace a SAML SP-initiated login end-to-end.
- **5.B — Kerberos flow and Kerberoasting.** Annotate AS-REQ, TGT issuance, TGS-REQ, service ticket, and the attack paths.
- **5.C — PAM design.** Design a privileged access workflow with JIT, approval, session recording, and MFA.
- **5.D — Joiner-mover-leaver workflow.** Specify how access is added, changed, and removed across systems.

## 6. Discussion prompts

1. "Why is 'phishing-resistant MFA' the phrase NIST SP 800-63B pushes?"
2. "OAuth 2.0 is about delegation, not authentication — why do so many systems misuse it for auth?"
3. "Passwordless authentication: what threats does it actually eliminate, and which does it NOT?"
4. "Service accounts are the weakest link in most AD environments. Discuss."

## 7. Readiness gate

Notes first pass / labs / QBank ≥75% / mini-mock ≥70% / SR active / θ pass prob ≥0.65.

## 8. Differentiators

Breach anchors: Colonial Pipeline 2021 (VPN no MFA), Twitter 2020 (admin tools),
Uber 2022 (MFA fatigue + self-service reset), Microsoft Midnight Blizzard 2024 (legacy test tenant),
SolarWinds 2020 (SAML token theft / Golden SAML).
