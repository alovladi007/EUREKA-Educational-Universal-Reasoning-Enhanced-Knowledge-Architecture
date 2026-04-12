/**
 * Structured CISSP course content with sections, rich text, exam tips, and quizzes.
 * Maps to topic IDs from exam-curriculum.ts.
 *
 * Content structure: each topic has multiple sections, each section has
 * markdown content, optional exam tips, and optional quiz questions.
 */

import type { QuizQuestion } from '@/components/test-prep/cissp/LessonQuiz';

export interface LessonSection {
  id: string;
  title: string;
  content: string;       // Markdown content
  examTip?: string;      // Optional exam tip box
  importantNote?: string; // Optional important note box
  quiz?: QuizQuestion[]; // Optional inline quiz
}

export interface TopicLesson {
  topicId: string;
  title: string;
  domainWeight: string;
  overview: string;
  sections: LessonSection[];
  keyTakeaways?: string[];
}

/**
 * Full course content for all 29 CISSP topics.
 * Each topic contains multiple sections with rich content and quizzes.
 */
export const CISSP_COURSE: Record<string, TopicLesson> = {

// ══════════════════════════════════════════════════════════════
// DOMAIN 1 — Security & Risk Management (16%)
// ══════════════════════════════════════════════════════════════

cissp_governance: {
  topicId: 'cissp_governance',
  title: 'Security Governance',
  domainWeight: '16%',
  overview: 'Security governance establishes the organizational framework for implementing and managing security. It defines how security decisions are made, who has authority, and how security aligns with business objectives.',
  sections: [
    {
      id: 'gov-alignment',
      title: 'Alignment of Security to Business Strategy',
      content: \`Security must not be viewed as a constraint on business operations but as an enabler that reduces risk while supporting business growth. This alignment involves understanding business drivers, competitive positioning, regulatory environment, and growth trajectory.

The Chief Information Security Officer (CISO) must translate business objectives into security requirements and metrics. Security governance frameworks like COBIT specifically address this alignment through "value delivery" principles.

**Key alignment elements:**
- Business drivers: Revenue growth, market share, cost reduction, innovation
- Strategic planning cycles: 3-5 year plans with annual reassessment
- Balanced scorecard approach: Linking security metrics to business KPIs
- Enterprise architecture: Integrating security into IT architecture planning
- Stakeholder communication: Regular reporting to C-suite and board\`,
    },
    {
      id: 'gov-processes',
      title: 'Organizational Processes',
      content: \`Organizations undergo structural changes including mergers and acquisitions, divestitures, reorganizations, and governance restructuring. Each creates significant security implications.

### Mergers and Acquisitions (M&A)

Pre-acquisition due diligence should assess the target's security posture, identify risks, and plan integration. Post-merger integration involves aligning security policies, consolidating security tools, managing redundant systems, and establishing unified governance.

**M&A security checklist:**
- Security assessment of target organization during due diligence
- Identification of conflicting policies, standards, and procedures
- Timeline for policy harmonization and tool consolidation
- Management of separate security teams and cultural differences
- Transition period risk management with temporary increased monitoring

### Governance Committees

A Security Steering Committee typically includes senior business and IT leaders who provide strategic direction. Risk committees oversee enterprise risk management. Compliance committees ensure adherence to regulatory requirements.\`,
    },
    {
      id: 'gov-roles',
      title: 'Organizational Roles and Responsibilities',
      content: \`Clear role definition is essential for effective security governance.

| Role | Responsibilities |
|---|---|
| **CEO/Executive Leadership** | Ultimate accountability; sets tone; allocates budget |
| **Board/Audit Committee** | Provides oversight; reviews risks; approves policies |
| **CISO** | Develops strategy; manages team; reports to executives |
| **Security Architect** | Designs infrastructure; aligns with business requirements |
| **SOC** | Monitors threats; responds to incidents; 24/7 coverage |
| **Compliance Officer** | Ensures regulatory compliance; manages audits |
| **Risk Manager** | Identifies and assesses risks; develops mitigation |
| **Data Owners** | Classify data; define access requirements; approve access |
| **System Owners** | Responsible for system security; implement controls |\`,
      examTip: 'The exam deliberately confuses risk appetite (strategic/board-level willingness to take risk), risk tolerance (tactical/operational acceptable deviation), and risk acceptance (a specific response to an identified risk). Appetite answers governance questions; tolerance answers operational questions; acceptance answers "what do we do about THIS risk?" questions.',
    },
    {
      id: 'gov-frameworks',
      title: 'Security Control Frameworks',
      content: \`Multiple frameworks provide structure for implementing security controls.

### NIST Cybersecurity Framework (CSF) and RMF

The NIST CSF organizes security into five core functions: Identify, Protect, Detect, Respond, and Recover. NIST RMF provides a seven-step process: Prepare, Categorize, Select, Implement, Assess, Authorize, and Monitor.

### ISO/IEC 27001 and 27002

ISO 27001 specifies requirements for an ISMS. Organizations can achieve certification. ISO 27002 provides best practices and implementation guidance.

### COBIT 2019

Enterprise governance framework covering IT governance, risk management, compliance, and value delivery. Emphasizes alignment of IT with business strategy.

### CIS Critical Security Controls

Prioritized set of 20 technical security controls based on real-world breach analysis.

| Framework | Primary Focus |
|---|---|
| **NIST CSF/RMF** | Core functions and risk management; federal mandate |
| **ISO 27001/27002** | ISMS establishment; international standard |
| **COBIT 2019** | Enterprise governance and IT alignment |
| **SABSA** | Architecture-driven security design |
| **CIS Controls** | Prioritized technical controls; breach prevention |\`,
    },
    {
      id: 'gov-duecare',
      title: 'Due Care and Due Diligence',
      content: \`**Due diligence** represents investigation and analysis of risks to understand the organization's security posture.

**Due care** means implementing reasonable and appropriate security measures once risks are identified.

Organizations that fail to implement due care can face liability. A company that conducts due diligence but fails to implement reasonable controls based on findings can be held negligent.\`,
      importantNote: 'Due diligence = investigation and discovery (what\'s wrong?). Due care = implementation of safeguards (fixing what\'s wrong). Both are necessary; neither alone is sufficient.',
    },
  ],
  keyTakeaways: [
    'Security governance aligns security strategy with business objectives',
    'Frameworks like NIST, ISO, COBIT provide structure for implementation',
    'Due care (do) and due diligence (verify) are both required',
    'Risk appetite is strategic (board), tolerance is tactical (operations)',
    'Clear roles: CEO owns accountability, CISO executes strategy, board oversees',
  ],
},

// I'll continue with more topics, but first let me establish the pattern
// and wire it into the ReadLessonsTab to verify it works.

};

/**
 * Get full course content for a topic.
 */
export function getCISSPCourseContent(topicId: string): TopicLesson | null {
  return CISSP_COURSE[topicId] || null;
}

/**
 * Check if rich course content exists for a topic.
 */
export function hasCISSPCourseContent(topicId: string): boolean {
  return topicId in CISSP_COURSE;
}
