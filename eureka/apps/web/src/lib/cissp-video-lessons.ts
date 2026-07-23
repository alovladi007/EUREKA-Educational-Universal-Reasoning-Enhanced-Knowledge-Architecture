/**
 * CISSP video lesson data for the Video Lessons tab.
 * 21 rendered Manim animations covering all 8 domains.
 */

export interface CISSPVideoLesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  section: string;
  domain: number;
  key_concepts: string[];
  official_notes: string;
}

export const CISSP_VIDEO_LESSONS: CISSPVideoLesson[] = [
  // ═══ DOMAIN 1: Security & Risk Management ═══
  {
    id: 'vid-ethics-canons',
    title: '(ISC)² Code of Ethics: The Four Canons',
    description: 'The four canons in priority order, how to resolve conflicts between them, and the complaint standing rules. Includes a real-world scenario demonstrating Canon I vs Canon III.',
    video_url: '/videos/cissp/ethics-canons.mp4',
    duration_seconds: 22,
    section: 'Security & Risk Management',
    domain: 1,
    key_concepts: ['Ethics', 'Four Canons', 'Priority Order', 'SPSP'],
    official_notes: 'Canon I (Society) > Canon II (Honor) > Canon III (Service) > Canon IV (Profession). Complaint standing: A-A-P-L.',
  },
  {
    id: 'vid-cia-triad',
    title: 'CIA Triad → Parkerian Hexad',
    description: 'Watch the CIA triangle morph into the Parkerian Hexad. Understand when the triad cannot describe a loss (stolen encrypted laptop) and how Authenticity, Utility, and Possession fill the gap.',
    video_url: '/videos/cissp/cia-triad.mp4',
    duration_seconds: 28,
    section: 'Security & Risk Management',
    domain: 1,
    key_concepts: ['CIA Triad', 'Parkerian Hexad', 'Possession', 'Authenticity', 'Utility'],
    official_notes: 'Hexad adds: Authenticity (source verification), Utility (usability), Possession (control). Stolen encrypted laptop = loss of Possession.',
  },
  {
    id: 'vid-risk-math',
    title: 'Risk Math Machine: AV → SLE → ALE → ROSI',
    description: 'The CISSP quantitative risk formulas animated step by step with a worked laptop-fleet example showing when a control is and isn\'t financially justified.',
    video_url: '/videos/cissp/risk-math-machine.mp4',
    duration_seconds: 42,
    section: 'Security & Risk Management',
    domain: 1,
    key_concepts: ['ALE', 'SLE', 'ARO', 'EF', 'ROSI', 'Quantitative Risk'],
    official_notes: 'SLE = AV × EF. ALE = SLE × ARO. ROSI = (ALE_before − ALE_after − Cost) / Cost.',
  },
  {
    id: 'vid-risk-treatment',
    title: 'Risk Treatment Compass',
    description: 'A compass needle swings to Avoid, Mitigate, Transfer, and Accept as scenarios change. Shows the priority order and why "Ignore" is never valid.',
    video_url: '/videos/cissp/risk-treatment-compass.mp4',
    duration_seconds: 38,
    section: 'Security & Risk Management',
    domain: 1,
    key_concepts: ['Risk Treatment', 'Avoid', 'Mitigate', 'Transfer', 'Accept'],
    official_notes: 'Order: Mitigate to appetite → Transfer residual → Accept what remains → Avoid if above capacity. Ignore is NOT a treatment.',
  },
  {
    id: 'vid-bia-clock',
    title: 'BIA Clock: MTD, RTO, RPO, WRT',
    description: 'Recovery metrics placed on a timeline. RPO looks backward, RTO looks forward, WRT is the gap after. Includes the critical formula MTD ≥ RTO + WRT with worked examples.',
    video_url: '/videos/cissp/bia-clock.mp4',
    duration_seconds: 28,
    section: 'Security & Risk Management',
    domain: 1,
    key_concepts: ['BIA', 'MTD', 'RTO', 'RPO', 'WRT'],
    official_notes: 'MTD ≥ RTO + WRT. RPO = max data loss (backward). RTO = time to restore (forward). WRT = verify & resume (after).',
  },

  // ═══ DOMAIN 2: Asset Security ═══
  {
    id: 'vid-data-states',
    title: 'Three Data States: At Rest, In Transit, In Use',
    description: 'The three data states with their specific controls. Reveals the #1 Domain 2 trap: encryption does NOT protect data in use.',
    video_url: '/videos/cissp/data-states.mp4',
    duration_seconds: 17,
    section: 'Asset Security',
    domain: 2,
    key_concepts: ['Data States', 'At Rest', 'In Transit', 'In Use', 'Confidential Computing'],
    official_notes: 'At rest → encryption. In transit → TLS. In use → enclaves (SGX/SEV/TDX). Encryption does NOT protect data in use.',
  },
  {
    id: 'vid-nist-sanitization',
    title: 'NIST SP 800-88: Clear / Purge / Destroy',
    description: 'The three sanitization levels as a ladder of cost and assurance. Key facts: SSD crypto-erase = Purge, degaussing does NOT work on SSDs, delete ≠ Clear.',
    video_url: '/videos/cissp/nist-sanitization.mp4',
    duration_seconds: 15,
    section: 'Asset Security',
    domain: 2,
    key_concepts: ['NIST 800-88', 'Clear', 'Purge', 'Destroy', 'Media Sanitization'],
    official_notes: 'Clear: overwrite. Purge: crypto-erase or degauss. Destroy: physical destruction. SSD crypto-erase = Purge. Degauss ≠ SSD.',
  },

  // ═══ DOMAIN 3: Security Architecture & Engineering ═══
  {
    id: 'vid-blp-biba',
    title: 'Bell-LaPadula vs Biba: Confidentiality vs Integrity',
    description: 'Side-by-side animation of BLP (no read up, no write down) and Biba (no read down, no write up). Shows how they are duals protecting different properties.',
    video_url: '/videos/cissp/blp-vs-biba.mp4',
    duration_seconds: 17,
    section: 'Security Architecture & Engineering',
    domain: 3,
    key_concepts: ['Bell-LaPadula', 'Biba', 'Confidentiality', 'Integrity', 'Security Models'],
    official_notes: 'BLP: No Read Up, No Write Down (confidentiality). Biba: No Read Down, No Write Up (integrity). They are duals.',
  },
  {
    id: 'vid-symmetric-asymmetric',
    title: 'Symmetric vs Asymmetric Cryptography',
    description: 'When to use which: symmetric for bulk data (fast), asymmetric for key exchange and signatures (slow). Shows the hybrid pattern used by TLS, IPsec, SSH, and Signal.',
    video_url: '/videos/cissp/symmetric-vs-asymmetric.mp4',
    duration_seconds: 29,
    section: 'Security Architecture & Engineering',
    domain: 3,
    key_concepts: ['Symmetric', 'Asymmetric', 'Hybrid', 'AES', 'RSA', 'ECDH'],
    official_notes: 'Symmetric for bulk encryption. Asymmetric for key exchange and signatures. Real protocols are hybrid.',
  },
  {
    id: 'vid-aes-gcm',
    title: 'AES-GCM: Authenticated Encryption',
    description: 'How AES-GCM provides confidentiality, integrity, and authenticity in one operation. Shows inputs, processing paths, and the critical nonce-reuse warning.',
    video_url: '/videos/cissp/aes-gcm-flow.mp4',
    duration_seconds: 16,
    section: 'Security Architecture & Engineering',
    domain: 3,
    key_concepts: ['AES-GCM', 'AEAD', 'Nonce', 'GHASH', 'Authenticated Encryption'],
    official_notes: 'AES-GCM = AES-CTR + GHASH. Provides C+I+A. NEVER reuse a nonce with the same key — catastrophic.',
  },
  {
    id: 'vid-zero-trust',
    title: 'Zero Trust Architecture (NIST SP 800-207)',
    description: 'From castle-and-moat to zero trust. Shows the Policy Engine, Policy Administrator, Policy Enforcement Point architecture with per-request evaluation.',
    video_url: '/videos/cissp/zero-trust.mp4',
    duration_seconds: 28,
    section: 'Security Architecture & Engineering',
    domain: 3,
    key_concepts: ['Zero Trust', 'NIST 800-207', 'PEP', 'PE', 'PA', 'Never Trust Always Verify'],
    official_notes: 'Zero trust is an architecture, not a product. Every request evaluated against identity + device + context. NIST SP 800-207.',
  },

  // ═══ DOMAIN 4: Communication & Network Security ═══
  {
    id: 'vid-tls13',
    title: 'TLS 1.3 Handshake (1-RTT)',
    description: 'The TLS 1.3 one-round-trip handshake: ClientHello with ECDHE key share, ServerHello with certificate, and encrypted application data.',
    video_url: '/videos/cissp/tls13-handshake.mp4',
    duration_seconds: 14,
    section: 'Communication & Network Security',
    domain: 4,
    key_concepts: ['TLS 1.3', 'Forward Secrecy', 'ECDHE', 'AEAD', '1-RTT'],
    official_notes: 'TLS 1.3: forward secrecy mandatory, AEAD only, 1-RTT. Removed: static RSA, CBC, SHA-1, RC4.',
  },
  {
    id: 'vid-tcp-syn',
    title: 'TCP Handshake, SYN Flood & SYN Cookies',
    description: 'Three parts: the normal TCP handshake, the SYN flood attack that exploits it, and the SYN cookies defense.',
    video_url: '/videos/cissp/tcp-handshake.mp4',
    duration_seconds: 31,
    section: 'Communication & Network Security',
    domain: 4,
    key_concepts: ['TCP', 'SYN Flood', 'SYN Cookies', 'DoS', 'Layer 4'],
    official_notes: 'SYN flood fills connection table. SYN cookies: encode state in sequence number, allocate only on valid ACK.',
  },
  {
    id: 'vid-ipsec',
    title: 'IPsec: Tunnel vs Transport Mode',
    description: 'Visual comparison of IPsec transport mode (host-to-host, keeps original header) and tunnel mode (site-to-site, encapsulates entire packet).',
    video_url: '/videos/cissp/ipsec-modes.mp4',
    duration_seconds: 22,
    section: 'Communication & Network Security',
    domain: 4,
    key_concepts: ['IPsec', 'Tunnel Mode', 'Transport Mode', 'ESP', 'AH', 'VPN'],
    official_notes: 'Transport: keeps original IP header, host-to-host. Tunnel: new IP header wraps everything, site-to-site VPN.',
  },

  // ═══ DOMAIN 5: Identity & Access Management ═══
  {
    id: 'vid-kerberos',
    title: 'Kerberos Authentication Flow',
    description: 'Step-by-step: AS-REQ, TGT issuance, TGS-REQ, service ticket, and service access. No passwords cross the wire.',
    video_url: '/videos/cissp/kerberos-flow.mp4',
    duration_seconds: 20,
    section: 'Identity & Access Management (IAM)',
    domain: 5,
    key_concepts: ['Kerberos', 'KDC', 'TGT', 'Service Ticket', 'AS', 'TGS'],
    official_notes: 'KDC = AS + TGS. Flow: AS-REQ → TGT → TGS-REQ → Service Ticket → Service. No passwords on the wire.',
  },
  {
    id: 'vid-access-models',
    title: 'Access Control Models: DAC / MAC / RBAC / ABAC',
    description: 'Four access control models compared: when to use each, with pros, cons, and exam-matching guidance.',
    video_url: '/videos/cissp/access-control-models.mp4',
    duration_seconds: 24,
    section: 'Identity & Access Management (IAM)',
    domain: 5,
    key_concepts: ['DAC', 'MAC', 'RBAC', 'ABAC', 'Access Control'],
    official_notes: 'Owner DAC, System MAC, Role RBAC, Attribute ABAC. Government → MAC, Enterprise → RBAC, Cloud → ABAC.',
  },

  // ═══ DOMAIN 6: Security Assessment & Testing ═══
  {
    id: 'vid-owasp-top10',
    title: 'OWASP Top 10 (2021)',
    description: 'All 10 categories with the most critical three highlighted: Broken Access Control, Injection, and Vulnerable Components with their defenses.',
    video_url: '/videos/cissp/owasp-top10.mp4',
    duration_seconds: 22,
    section: 'Security Assessment & Testing',
    domain: 6,
    key_concepts: ['OWASP', 'Top 10', 'A01', 'Injection', 'Access Control'],
    official_notes: 'A01 Broken Access Control, A02 Crypto, A03 Injection, A04 Insecure Design, A05 Misconfig, A06 Components, A07 Auth, A08 Integrity, A09 Logging, A10 SSRF.',
  },

  // ═══ DOMAIN 7: Security Operations ═══
  {
    id: 'vid-nist-ir',
    title: 'NIST IR Lifecycle (SP 800-61)',
    description: 'The four-phase incident response loop: Preparation → Detection & Analysis → Containment/Eradication/Recovery → Lessons Learned. With details for each phase.',
    video_url: '/videos/cissp/nist-ir-lifecycle.mp4',
    duration_seconds: 26,
    section: 'Security Operations',
    domain: 7,
    key_concepts: ['Incident Response', 'NIST 800-61', 'Preparation', 'Containment', 'Lessons Learned'],
    official_notes: 'Prepare → Detect → Contain/Eradicate/Recover → Lessons Learned. It is a LOOP. Personnel safety always first.',
  },
  {
    id: 'vid-backup-321',
    title: '3-2-1-1-0 Backup Strategy',
    description: 'Why 3-2-1 is not enough in the ransomware era. The extra "1" (immutable) and "0" (verified) protect against backup-targeting attacks.',
    video_url: '/videos/cissp/backup-321.mp4',
    duration_seconds: 31,
    section: 'Security Operations',
    domain: 7,
    key_concepts: ['Backup', '3-2-1-1-0', 'Immutable', 'Air-gapped', 'Ransomware'],
    official_notes: '3 copies, 2 media, 1 offsite, 1 immutable/air-gapped, 0 errors verified. Modern ransomware targets backups.',
  },

  // ═══ DOMAIN 8: Software Development Security ═══
  {
    id: 'vid-sql-injection',
    title: 'SQL Injection & Parameterized Queries',
    description: 'How SQL injection works (string concatenation), why it is devastating, and how parameterized queries make it structurally impossible.',
    video_url: '/videos/cissp/sql-injection.mp4',
    duration_seconds: 29,
    section: 'Software Development Security',
    domain: 8,
    key_concepts: ['SQL Injection', 'Parameterized Queries', 'OWASP A03', 'Input Validation'],
    official_notes: 'Parameterized queries separate code from data. Injection is structurally impossible. Never concatenate user input into SQL.',
  },
  {
    id: 'vid-devsecops',
    title: 'DevSecOps Pipeline Security Gates',
    description: 'Security integrated at every stage: pre-commit through runtime. Shows the tools at each gate and the risk-tiered blocking strategy.',
    video_url: '/videos/cissp/devsecops-pipeline.mp4',
    duration_seconds: 18,
    section: 'Software Development Security',
    domain: 8,
    key_concepts: ['DevSecOps', 'SAST', 'DAST', 'SCA', 'SBOM', 'CI/CD Security'],
    official_notes: 'Shift left for speed, shift everywhere for depth. Critical → block, Medium → ticket, Low → trend analysis.',
  },
];

export function getCISSPVideoLessons(): Record<string, CISSPVideoLesson[]> {
  // Group under the REAL CISSP domain names in official domain order (1-8),
  // not the internal slugs — the curriculum rail displays these keys verbatim
  // (the old slug keys rendered as "Security Risk", "Comm Network", "Iam").
  const grouped: Record<string, CISSPVideoLesson[]> = {};
  const sorted = [...CISSP_VIDEO_LESSONS].sort((a, b) => a.domain - b.domain);
  for (const lesson of sorted) {
    const label = `Domain ${lesson.domain} · ${lesson.section}`;
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(lesson);
  }
  return grouped;
}
