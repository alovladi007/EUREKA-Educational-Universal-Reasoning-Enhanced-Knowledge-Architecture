/**
 * CISSP video lesson data for the Video Lessons tab.
 * Maps rendered Manim animations to lesson metadata.
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
  {
    id: 'cissp-vid-risk-math',
    title: 'Risk Math Machine: AV → SLE → ALE → ROSI',
    description: 'Watch the CISSP quantitative risk formulas come to life. Covers Asset Value, Exposure Factor, Single Loss Expectancy, Annualized Rate of Occurrence, Annualized Loss Expectancy, and Return on Security Investment with a worked laptop-fleet example.',
    video_url: '/videos/cissp/risk-math-machine.mp4',
    duration_seconds: 150,
    section: 'Security & Risk Management',
    domain: 1,
    key_concepts: ['ALE', 'SLE', 'ARO', 'EF', 'ROSI', 'Quantitative Risk Analysis'],
    official_notes: 'SLE = AV × EF\\nALE = SLE × ARO\\nROSI = (ALE_before − ALE_after − Cost) / Cost\\n\\nA negative ROSI means the control is not financially justified on pure math — but regulatory, reputational, and ethical factors may override.',
  },
  {
    id: 'cissp-vid-kerberos',
    title: 'Kerberos Authentication Flow',
    description: 'Step-by-step animation of Kerberos authentication: AS-REQ, TGT issuance, TGS-REQ, service ticket, and service access. No passwords cross the wire.',
    video_url: '/videos/cissp/kerberos-flow.mp4',
    duration_seconds: 150,
    section: 'Identity & Access Management (IAM)',
    domain: 5,
    key_concepts: ['Kerberos', 'KDC', 'TGT', 'Service Ticket', 'AS', 'TGS'],
    official_notes: 'Flow: Client → AS-REQ → AS issues TGT → Client → TGS-REQ with TGT → TGS issues Service Ticket → Client presents ticket to Service.\\n\\nKDC = AS + TGS. No passwords on the wire. Tickets are time-bound.',
  },
  {
    id: 'cissp-vid-tls13',
    title: 'TLS 1.3 Handshake (1-RTT)',
    description: 'Animated walkthrough of the TLS 1.3 one-round-trip handshake: ClientHello with ECDHE key share, ServerHello with certificate and signature, and the transition to encrypted application data.',
    video_url: '/videos/cissp/tls13-handshake.mp4',
    duration_seconds: 130,
    section: 'Communication & Network Security',
    domain: 4,
    key_concepts: ['TLS 1.3', 'Forward Secrecy', 'ECDHE', 'AEAD', '1-RTT Handshake'],
    official_notes: 'TLS 1.3 key properties:\\n• Forward secrecy mandatory (ECDHE/DHE only)\\n• 1-RTT handshake (was 2-RTT in TLS 1.2)\\n• AEAD-only cipher suites (AES-GCM, ChaCha20-Poly1305)\\n• Removed: static RSA, CBC, SHA-1, RC4, compression',
  },
  {
    id: 'cissp-vid-aes-gcm',
    title: 'AES-GCM: Authenticated Encryption in One Step',
    description: 'How AES-GCM provides confidentiality, integrity, and authenticity in a single operation. Shows the inputs (plaintext, key, nonce, AAD), the CTR encryption and GHASH authentication paths, and the critical nonce-reuse warning.',
    video_url: '/videos/cissp/aes-gcm-flow.mp4',
    duration_seconds: 120,
    section: 'Security Architecture & Engineering',
    domain: 3,
    key_concepts: ['AES-GCM', 'AEAD', 'Authenticated Encryption', 'Nonce', 'GHASH'],
    official_notes: 'AES-GCM = AES-CTR encryption + GHASH authentication.\\nProvides: Confidentiality + Integrity + Authenticity.\\n\\nCRITICAL: Never reuse a nonce with the same key. Nonce reuse allows recovery of the auth key and forging of arbitrary ciphertexts.',
  },
  {
    id: 'cissp-vid-tcp-syn',
    title: 'TCP Handshake, SYN Flood, and SYN Cookies',
    description: 'Three-part animation: the normal TCP three-way handshake (SYN → SYN-ACK → ACK), the SYN flood denial-of-service attack that exploits it, and the SYN cookies defense that solves it without allocating state.',
    video_url: '/videos/cissp/tcp-handshake.mp4',
    duration_seconds: 180,
    section: 'Communication & Network Security',
    domain: 4,
    key_concepts: ['TCP Handshake', 'SYN Flood', 'SYN Cookies', 'DoS', 'Layer 4'],
    official_notes: 'Normal: SYN → SYN-ACK → ACK.\\nAttack: Millions of SYNs with spoofed IPs fill the connection table.\\nDefense: SYN cookies encode state in the sequence number; server allocates only on valid ACK.',
  },
];

/**
 * Get CISSP video lessons grouped by section.
 */
// Section name → section ID mapping (matches exam-config.ts)
const SECTION_ID_MAP: Record<string, string> = {
  'Security & Risk Management': 'security_risk',
  'Asset Security': 'asset_security',
  'Security Architecture & Engineering': 'security_architecture',
  'Communication & Network Security': 'comm_network',
  'Identity & Access Management (IAM)': 'iam',
  'Security Assessment & Testing': 'security_assessment',
  'Security Operations': 'security_operations',
  'Software Development Security': 'software_security',
};

/**
 * Get CISSP video lessons grouped by section ID (matching exam-config.ts).
 */
export function getCISSPVideoLessons(): Record<string, CISSPVideoLesson[]> {
  const grouped: Record<string, CISSPVideoLesson[]> = {};
  for (const lesson of CISSP_VIDEO_LESSONS) {
    const sectionId = SECTION_ID_MAP[lesson.section] || lesson.section;
    if (!grouped[sectionId]) grouped[sectionId] = [];
    grouped[sectionId].push(lesson);
  }
  return grouped;
}
