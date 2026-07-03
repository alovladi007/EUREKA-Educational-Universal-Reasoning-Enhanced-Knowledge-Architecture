/**
 * Security+ (SY0-701) Performance-Based Questions (PBQs).
 *
 * PBQs are the interactive, simulation-style items on the real exam where the
 * candidate drags/assigns items or orders a sequence rather than picking one
 * of four choices. Two interaction types are modeled here:
 *   - `categorize`: drag each token into the correct category / drop zone.
 *   - `order`:      arrange steps into the correct sequence.
 *
 * AI-generated study material aligned to the CompTIA Security+ SY0-701
 * objectives. Requires human SME review before publication.
 */

export interface CategorizePBQ {
  id: string;
  type: 'categorize';
  domain: number; // SY0-701 topicId 0-4
  domainName: string;
  title: string;
  scenario: string;
  instructions: string;
  categories: { id: string; label: string }[];
  tokens: { id: string; label: string; answer: string }[]; // answer = category id
  explanation: string;
}

export interface OrderPBQ {
  id: string;
  type: 'order';
  domain: number;
  domainName: string;
  title: string;
  scenario: string;
  instructions: string;
  items: { id: string; label: string }[]; // presented shuffled
  answer: string[]; // correct order of item ids (top → bottom)
  explanation: string;
}

export type PBQ = CategorizePBQ | OrderPBQ;

export const SECURITY_PLUS_PBQS: PBQ[] = [
  // ── PBQ 1 — Control TYPES ────────────────────────────────────────────────
  {
    id: 'pbq_control_types',
    type: 'categorize',
    domain: 0,
    domainName: 'General Security Concepts',
    title: 'Classify Security Controls by TYPE',
    scenario:
      'A security architect is documenting the controls protecting a data center. Each control must be labeled by what it DOES (its control type).',
    instructions: 'Drag each control into the control TYPE it best represents.',
    categories: [
      { id: 'preventive', label: 'Preventive' },
      { id: 'detective', label: 'Detective' },
      { id: 'corrective', label: 'Corrective' },
      { id: 'deterrent', label: 'Deterrent' },
    ],
    tokens: [
      { id: 't1', label: 'Firewall blocking unauthorized ports', answer: 'preventive' },
      { id: 't2', label: 'Full-disk encryption on laptops', answer: 'preventive' },
      { id: 't3', label: 'IDS generating alerts on anomalies', answer: 'detective' },
      { id: 't4', label: 'SIEM log review and correlation', answer: 'detective' },
      { id: 't5', label: 'Restoring systems from backup after ransomware', answer: 'corrective' },
      { id: 't6', label: 'Antivirus quarantining an infected file', answer: 'corrective' },
      { id: 't7', label: 'Warning banner on the login screen', answer: 'deterrent' },
      { id: 't8', label: '"Premises under video surveillance" sign', answer: 'deterrent' },
    ],
    explanation:
      'Control TYPES describe what a control DOES. Preventive controls stop an incident before it happens (firewall, encryption). Detective controls identify an incident in progress or after (IDS, SIEM log review). Corrective controls remediate after an incident (backup restore, AV quarantine). Deterrent controls discourage an attacker from trying (warning banners/signs). Note: TYPE (what it does) is different from CATEGORY (how it is implemented — technical/managerial/operational/physical).',
  },

  // ── PBQ 2 — Control CATEGORIES ───────────────────────────────────────────
  {
    id: 'pbq_control_categories',
    type: 'categorize',
    domain: 0,
    domainName: 'General Security Concepts',
    title: 'Classify Security Controls by CATEGORY',
    scenario:
      'The same architect must now file each control under its implementation CATEGORY for the SY0-701 control matrix.',
    instructions: 'Drag each control into the control CATEGORY (how it is implemented).',
    categories: [
      { id: 'technical', label: 'Technical' },
      { id: 'managerial', label: 'Managerial' },
      { id: 'operational', label: 'Operational' },
      { id: 'physical', label: 'Physical' },
    ],
    tokens: [
      { id: 't1', label: 'Access control list on a router', answer: 'technical' },
      { id: 't2', label: 'Data-at-rest encryption', answer: 'technical' },
      { id: 't3', label: 'Annual risk assessment', answer: 'managerial' },
      { id: 't4', label: 'Written acceptable use policy', answer: 'managerial' },
      { id: 't5', label: 'Security awareness training program', answer: 'operational' },
      { id: 't6', label: 'Change management process', answer: 'operational' },
      { id: 't7', label: 'Bollards outside the entrance', answer: 'physical' },
      { id: 't8', label: 'Badge reader on the server room door', answer: 'physical' },
    ],
    explanation:
      'Control CATEGORIES describe HOW a control is implemented. Technical (a.k.a. logical) controls use technology (ACLs, encryption). Managerial controls are administrative/risk decisions (risk assessments, policies). Operational controls are day-to-day human processes (training, change management). Physical controls are tangible barriers (bollards, badge readers). Watch the exam trap: category (technical/managerial/operational/physical) is orthogonal to type (preventive/detective/corrective/deterrent/compensating/directive).',
  },

  // ── PBQ 3 — Attack classification ────────────────────────────────────────
  {
    id: 'pbq_attack_types',
    type: 'categorize',
    domain: 1,
    domainName: 'Threats, Vulnerabilities & Mitigations',
    title: 'Classify the Attack',
    scenario:
      'A SOC analyst triages several alerts. Each observed activity must be classified into the correct attack family so the right playbook is chosen.',
    instructions: 'Drag each observed activity into the attack family it belongs to.',
    categories: [
      { id: 'social', label: 'Social Engineering' },
      { id: 'network', label: 'Network Attack' },
      { id: 'application', label: 'Application Attack' },
      { id: 'crypto', label: 'Cryptographic Attack' },
    ],
    tokens: [
      { id: 't1', label: 'Fraudulent email urging a wire transfer', answer: 'social' },
      { id: 't2', label: 'Phone call impersonating the help desk (vishing)', answer: 'social' },
      { id: 't3', label: 'SYN flood exhausting server connections', answer: 'network' },
      { id: 't4', label: 'ARP poisoning to intercept LAN traffic', answer: 'network' },
      { id: 't5', label: "' OR 1=1 -- injected into a login form", answer: 'application' },
      { id: 't6', label: 'Malicious script stored in a comment field (XSS)', answer: 'application' },
      { id: 't7', label: 'Downgrade attack forcing weak TLS 1.0', answer: 'crypto' },
      { id: 't8', label: 'Birthday attack producing a hash collision', answer: 'crypto' },
    ],
    explanation:
      'Social engineering manipulates people (phishing, vishing). Network attacks target the transport/infrastructure layer (SYN flood/DoS, ARP poisoning/MITM). Application attacks exploit software input handling (SQL injection, XSS). Cryptographic attacks defeat the crypto itself (downgrade attacks, collision/birthday attacks). Choosing the family drives the correct mitigation — e.g., input validation for application attacks, mutual TLS and disabling weak ciphers for cryptographic attacks.',
  },

  // ── PBQ 4 — Authentication factors ───────────────────────────────────────
  {
    id: 'pbq_auth_factors',
    type: 'categorize',
    domain: 3,
    domainName: 'Security Operations',
    title: 'Map Authenticators to their Factor',
    scenario:
      'An IAM engineer is designing MFA. To guarantee true multifactor (not just multi-step), each authenticator must come from a DIFFERENT factor category.',
    instructions: 'Drag each authenticator to the authentication factor it represents.',
    categories: [
      { id: 'know', label: 'Something you KNOW' },
      { id: 'have', label: 'Something you HAVE' },
      { id: 'are', label: 'Something you ARE' },
      { id: 'where', label: 'Somewhere you ARE' },
    ],
    tokens: [
      { id: 't1', label: 'Account password', answer: 'know' },
      { id: 't2', label: 'PIN / security question', answer: 'know' },
      { id: 't3', label: 'TOTP code from an authenticator app', answer: 'have' },
      { id: 't4', label: 'Smart card / hardware security key', answer: 'have' },
      { id: 't5', label: 'Fingerprint scan', answer: 'are' },
      { id: 't6', label: 'Facial recognition', answer: 'are' },
      { id: 't7', label: 'GPS geolocation of the device', answer: 'where' },
      { id: 't8', label: 'Corporate-network geofencing / source IP', answer: 'where' },
    ],
    explanation:
      'True MFA combines authenticators from two or more DIFFERENT factor categories. Something you know = knowledge (password, PIN). Something you have = possession (TOTP token, smart card). Something you are = inherence/biometrics (fingerprint, face). Somewhere you are = location (GPS, geofencing). Exam trap: a password plus a PIN is still single-factor (both "know"), so it is multi-step, not multifactor.',
  },

  // ── PBQ 5 — Incident Response order ──────────────────────────────────────
  {
    id: 'pbq_ir_order',
    type: 'order',
    domain: 3,
    domainName: 'Security Operations',
    title: 'Order the Incident Response Lifecycle',
    scenario:
      'A ransomware outbreak is detected. Arrange the NIST incident response phases into the correct sequence the team should follow.',
    instructions: 'Drag or use the arrows to place the phases in order, first at the top.',
    items: [
      { id: 'prep', label: 'Preparation' },
      { id: 'detect', label: 'Detection & Analysis' },
      { id: 'contain', label: 'Containment' },
      { id: 'eradicate', label: 'Eradication' },
      { id: 'recover', label: 'Recovery' },
      { id: 'lessons', label: 'Lessons Learned' },
    ],
    answer: ['prep', 'detect', 'contain', 'eradicate', 'recover', 'lessons'],
    explanation:
      'The NIST SP 800-61 incident response lifecycle is: Preparation → Detection & Analysis → Containment → Eradication → Recovery → Lessons Learned. The classic exam trap is sequencing: you must CONTAIN before you ERADICATE (stop the spread before removing the threat), and RECOVERY (restoring to normal operations) precedes the post-incident LESSONS LEARNED review. Preparation is ongoing but is listed first because controls and playbooks must exist before an incident.',
  },

  // ── PBQ 6 — Order of volatility ──────────────────────────────────────────
  {
    id: 'pbq_volatility_order',
    type: 'order',
    domain: 3,
    domainName: 'Security Operations',
    title: 'Order of Volatility for Evidence Collection',
    scenario:
      'A forensic analyst must collect digital evidence from a live compromised host. To preserve the most fragile evidence first, collection must follow the order of volatility.',
    instructions: 'Order the evidence sources from MOST volatile (top) to LEAST volatile (bottom).',
    items: [
      { id: 'registers', label: 'CPU registers & cache' },
      { id: 'ram', label: 'RAM (memory) contents' },
      { id: 'network', label: 'Network connections / ARP cache / routing table' },
      { id: 'processes', label: 'Running processes & temp/swap files' },
      { id: 'disk', label: 'Data on disk (files)' },
      { id: 'archival', label: 'Backups / archival media' },
    ],
    answer: ['registers', 'ram', 'network', 'processes', 'disk', 'archival'],
    explanation:
      'The order of volatility (RFC 3227) collects the most ephemeral evidence first: CPU registers & cache → RAM → network state (ARP cache, routing table, live connections) → running processes and temp/swap → on-disk files → backups/archival media. Volatile data vanishes on power-off or over time, so capturing a memory image before shutting down (and before touching the disk) is critical. Throughout, maintain chain of custody and hash the evidence to prove integrity.',
  },
];

export function getSecurityPlusPBQs(): PBQ[] {
  return SECURITY_PLUS_PBQS;
}
