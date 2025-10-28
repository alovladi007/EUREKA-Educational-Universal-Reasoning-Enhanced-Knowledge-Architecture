# Compliance & Regulatory Framework

## Overview

EUREKA is designed to meet stringent regulatory requirements across multiple educational contexts. This document outlines our compliance approach for each tier and applicable regulations.

## Regulatory Matrix by Tier

| Tier | Primary Regulations | Secondary Compliance |
|------|---------------------|---------------------|
| High School | FERPA, COPPA | State Education Laws |
| Undergraduate | FERPA | ADA, Title IX |
| Graduate | FERPA, IRB | Research Ethics |
| Medical | HIPAA, FERPA | LCME, AAMC |
| Law | ABA, FERPA | State Bar Rules |
| MBA | FERPA, AACSB | GDPR (international) |
| Engineering | FERPA, ABET | NCEES Ethics |

---

## FERPA (Family Educational Rights and Privacy Act)

**Applies to**: All tiers

### Requirements

**Education Records Protection:**
- Personally identifiable information (PII) requires consent before disclosure
- Directory information may be shared with limited restrictions
- Students have right to inspect and review their records
- Students can request amendments to inaccurate records

**EUREKA Implementation:**

✅ **Access Controls**
```
- Role-based access (students, educators, admins)
- Org-scoped tenancy prevents cross-institution access
- Audit logs for all record access (who, what, when)
- Consent tracking for data sharing
```

✅ **Student Rights**
```
- Self-service record viewing
- Amendment request workflow
- Data export (JSON/PDF)
- Deletion requests (with retention policy checks)
```

✅ **Data Retention**
```
- 7-year default retention
- Automatic archival after graduation
- Secure deletion procedures
- Exception handling for legal holds
```

### FERPA-Compliant Features

1. **Consent Management**
   - Granular consent for directory information
   - Third-party sharing agreements tracked
   - Annual consent renewal reminders

2. **Audit Trail**
   - Immutable logs in Postgres (audit_logs table)
   - Minimum retention: 7 years
   - Queryable by student/parent

3. **Data Minimization**
   - Collect only necessary information
   - Pseudonymization where possible
   - Aggregation for analytics

---

## COPPA (Children's Online Privacy Protection Act)

**Applies to**: High School tier (users under 13)

### Requirements

**Parental Consent:**
- Verifiable parental consent before collecting PII from children
- Clear privacy policy in plain language
- Parents must be able to review and delete child's information

**EUREKA Implementation:**

✅ **Age Gate**
```
- Date of birth collection at signup
- Redirect to parental consent flow if < 13
- Email verification for parent email
```

✅ **Consent Flow**
```
1. Student provides parent email
2. Parent receives consent request
3. Parent reviews privacy policy
4. Parent provides verifiable consent (credit card verification or digital signature)
5. Account activated after consent
```

✅ **Parental Controls**
```
- Parent dashboard for child's activity
- Ability to view/export/delete child data
- Control over data sharing settings
- Email notifications for key events
```

### COPPA-Compliant Features

1. **Data Collection Limits**
   - No persistent identifiers in cookies without consent
   - No geolocation tracking
   - No social features for under-13 users
   - No third-party advertising

2. **Safety Features**
   - Content filtering (age-appropriate only)
   - No public profiles
   - Moderated chat (if enabled)
   - Safe search defaults

---

## HIPAA (Health Insurance Portability and Accountability Act)

**Applies to**: Medical tier (Professional Schools - Medical)

### Requirements

**Protected Health Information (PHI):**
- Safeguards for electronic PHI (ePHI)
- Business Associate Agreements with vendors
- Breach notification (60 days)
- Patient rights (access, amendment, accounting)

**EUREKA Implementation:**

✅ **PHI Protection**
```
- Automatic de-identification before AI processing
- Regex-based PII/PHI detection
- Separate encrypted database for PHI
- Access logging (6-year retention)
```

✅ **Technical Safeguards**
```
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Access controls (role + attribute-based)
- Automatic logoff (15 minutes)
- Audit trails (immutable)
```

✅ **Administrative Safeguards**
```
- Annual HIPAA training required
- Risk assessments (annual)
- Incident response plan
- Workforce sanctions policy
```

### HIPAA-Compliant Features (Medical Tier)

1. **Case Simulator**
   - All cases use synthetic patient data
   - No real PHI in training scenarios
   - Warnings on uploads (no PHI allowed)

2. **De-Identification Service**
   - Automatic scrubbing of 18 HIPAA identifiers
   - Safe harbor method compliance
   - Audit trail for de-identification actions

3. **OSCE Recording**
   - Encrypted storage
   - Automatic deletion after grading period
   - Student consent for recording
   - No cloud processing of video

4. **Breach Response**
   - Automated detection of anomalous access
   - Incident workflow (assess, contain, notify)
   - 60-day notification compliance
   - HHS breach portal reporting

---

## ABA (American Bar Association) Guidelines

**Applies to**: Law tier (Professional Schools - Law)

### Requirements

**Confidentiality:**
- Attorney-client privilege protection
- Conflict checking
- Professional responsibility education

**EUREKA Implementation:**

✅ **Confidentiality Controls**
```
- Warnings on case analysis (no real client info)
- Confidentiality banners in all interfaces
- Ethics training tracking
```

✅ **Conflict Checking**
```
- Stub API for conflict detection
- Manual review workflow
- Disclosure requirements
```

### ABA-Compliant Features

1. **IRAC Engine**
   - Uses only published case law (no confidential sources)
   - Citation to primary sources only
   - Warnings about unauthorized practice

2. **Moot Court**
   - All scenarios use public domain cases
   - No real party identification
   - Ethics module prerequisite

3. **Professional Responsibility**
   - Required ethics course integration
   - Character & fitness tracking
   - Pro bono hours logging

---

## IRB (Institutional Review Board) for Research

**Applies to**: Graduate tier (research mode)

### Requirements

**Human Subjects Research:**
- IRB approval before research involving human subjects
- Informed consent
- Risk minimization
- Data anonymization

**EUREKA Implementation:**

✅ **Research Mode**
```
- Separate consent flow for research participation
- Opt-in only (default = no research use)
- Data export with de-identification
- IRB protocol templates
```

✅ **Consent Management**
```
- Informed consent forms (digital signature)
- Right to withdraw at any time
- Separate from educational consent
- Version tracking for consent forms
```

### IRB-Compliant Features

1. **A/B Testing Framework**
   - IRB protocol generator
   - Randomization with audit trail
   - Automated consent checks
   - Statistical analysis tools

2. **De-Identification Pipeline**
   - k-anonymity enforcement
   - Differential privacy options
   - Re-identification risk assessment

3. **Data Use Agreements**
   - Template DUAs for researchers
   - Access restrictions by protocol
   - Time-limited data access

---

## GDPR (General Data Protection Regulation)

**Applies to**: All tiers (EU users)

### Requirements

**Data Subject Rights:**
- Right to access
- Right to rectification
- Right to erasure ("right to be forgotten")
- Right to data portability
- Right to object

**EUREKA Implementation:**

✅ **GDPR Features**
```
- Self-service data export (JSON)
- Deletion workflow (30-day processing)
- Consent management (granular)
- Data processing agreements
```

✅ **Legal Basis**
```
- Legitimate interest (educational service)
- Explicit consent (marketing, research)
- Contract (paid tiers)
```

### GDPR-Compliant Features

1. **Privacy by Design**
   - Data minimization
   - Purpose limitation
   - Storage limitation
   - Pseudonymization

2. **Data Subject Requests**
   - Automated DSR portal
   - 30-day response time
   - Identity verification
   - Free of charge (first request)

---

## State-Specific Requirements

### California (CPRA)
- Enhanced privacy rights
- Sensitive personal information protections
- Opt-out of selling/sharing

### New York (SHIELD Act)
- Data security requirements
- Breach notification

### Massachusetts (201 CMR 17.00)
- Comprehensive written information security program

**EUREKA Implementation:**
- State-aware compliance checks
- Configurable per organization
- Legal review for new states

---

## Accessibility Compliance

### ADA / Section 508 / WCAG 2.2 AA

**EUREKA Implementation:**

✅ **Accessibility Features**
```
- Keyboard navigation (all interfaces)
- Screen reader compatibility
- ARIA landmarks and labels
- Color contrast (4.5:1 minimum)
- Text resizing (up to 200%)
- Closed captioning (video content)
- Transcripts (audio content)
```

✅ **Testing**
```
- Automated: axe-core in CI/CD
- Manual: Quarterly audits
- User testing: Annual with disabled users
```

---

## Data Retention Policies

| Data Type | Retention Period | Regulation |
|-----------|------------------|------------|
| Student records | 7 years post-graduation | FERPA |
| Audit logs | 7 years | FERPA |
| HIPAA audit logs | 6 years | HIPAA |
| Financial records | 7 years | IRS |
| Consent forms | 7 years post-relationship | GDPR |
| Research data | Protocol-specific | IRB |
| Backups | 90 days | Best practice |

---

## Vendor Management

### Third-Party Compliance

All vendors must:
- Sign Data Processing Agreements (DPA)
- Provide SOC 2 Type II reports (or equivalent)
- Undergo annual security reviews
- Maintain appropriate insurance
- Report breaches within 24 hours

### Current Vendors
- LLM Providers: Anthropic, OpenAI (BAA where applicable)
- Cloud: AWS (HIPAA-eligible services)
- Auth: Ory / Auth0 (SOC 2 Type II)
- Monitoring: Sentry, Datadog (GDPR-compliant)

---

## Compliance Audits

### Internal Audits
- **Quarterly**: FERPA controls review
- **Bi-annually**: COPPA consent verification
- **Annually**: HIPAA risk assessment (Medical tier)

### External Audits
- **Annually**: Third-party security audit
- **Annually**: Penetration testing
- **Bi-annually**: Accessibility audit

### Certification Goals
- [ ] SOC 2 Type II (Year 1)
- [ ] ISO 27001 (Year 2)
- [ ] StateRAMP (Year 3, for government contracts)

---

## Training Requirements

### Staff Training
- **Annual**: FERPA training (all staff)
- **Annual**: HIPAA training (Medical tier staff)
- **Quarterly**: Security awareness (all staff)
- **Ad-hoc**: Compliance updates

### Institutional Training
- Onboarding guides for admins
- Compliance checklists
- Incident response drills
- Privacy officer designation

---

## Incident Response

### Breach Notification Timelines

| Regulation | Notification Timeline | Authority |
|------------|----------------------|-----------|
| FERPA | "As soon as practicable" | Department of Education |
| COPPA | "As soon as practicable" | FTC |
| HIPAA | 60 days | HHS OCR |
| GDPR | 72 hours | Supervisory Authority |
| State Laws | Varies (often 30-90 days) | State AG |

### Response Workflow
1. **Detection** (0-24h): Identify incident
2. **Assessment** (24-48h): Classify severity
3. **Containment** (48-72h): Stop breach
4. **Investigation** (1-2 weeks): Root cause analysis
5. **Notification** (per timeline): Affected parties
6. **Remediation** (ongoing): Fix vulnerabilities
7. **Review** (post-incident): Lessons learned

---

## Privacy Policy

Separate, user-facing privacy policies are maintained:
- [General Privacy Policy](./docs/privacy/general.md)
- [COPPA Privacy Policy](./docs/privacy/coppa.md) (parent-friendly)
- [Medical Tier Privacy Notice](./docs/privacy/medical.md)
- [Research Participant Notice](./docs/privacy/research.md)

Updated annually and whenever material changes occur.

---

## Contact

- **Privacy Officer**: privacy@eureka.edu
- **Data Protection Officer (DPO)**: dpo@eureka.edu (EU)
- **Compliance Team**: compliance@eureka.edu
- **Legal**: legal@eureka.edu

---

**Last Updated**: January 27, 2025  
**Version**: 1.0.0  
**Next Review**: July 27, 2025
