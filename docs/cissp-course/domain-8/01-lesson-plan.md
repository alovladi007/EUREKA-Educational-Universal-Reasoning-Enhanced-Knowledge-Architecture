# Domain 8 — Software Development Security: Lesson Plan

> **AI-generated.** (ISC)² CISSP Exam Outline effective April 15, 2024.
> Weight: **10%**. Topic IDs: `cissp_sdlc`, `cissp_app_vuln`, `cissp_devops`.

## Summary

Domain 8 covers secure software development: SDLC integration, code-level
vulnerabilities (OWASP Top 10), DevSecOps, secure coding practices, software
supply chain, and application assessment. Mantra: **"Shift left, but shift everywhere."**

## LOs

| # | LO | Bloom |
|---|---|---|
| LO8.1 | **Apply** secure SDLC principles across requirements, design, build, test, deploy, operate | Apply |
| LO8.2 | **Analyze** OWASP Top 10 vulnerabilities and select defenses | Analyze |
| LO8.3 | **Evaluate** DevSecOps integration (CI/CD security gates, SAST/DAST/SCA in pipeline, IaC scanning) | Evaluate |
| LO8.4 | **Design** application security controls (input validation, output encoding, authentication, authorization, session management, cryptography, error handling, logging) | Create |
| LO8.5 | **Apply** NIST SSDF and Secure-by-Design principles | Apply |
| LO8.6 | **Evaluate** software supply chain security (dependency management, SBOM, signing, provenance) | Evaluate |

## Hours: 10

## Labs

- **8.A** — OWASP Top 10 code review exercise
- **8.B** — CI/CD pipeline security gate design
- **8.C** — Threat model for a new application feature
- **8.D** — SBOM generation and dependency vulnerability analysis

## Readiness gate

Notes / labs / QBank ≥75% / mini-mock ≥70% / θ pass prob ≥0.65

## Differentiators

Breach anchors: Log4Shell 2021 (dependency), SolarWinds 2020 (build compromise),
Codecov 2021 (CI/CD), Spring4Shell 2022 (framework), MOVEit 2023 (SQL injection).
