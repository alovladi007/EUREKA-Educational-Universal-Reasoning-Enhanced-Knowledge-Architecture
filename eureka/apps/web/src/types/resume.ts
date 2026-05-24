/**
 * Resume Builder — Type Definitions
 * Full TypeScript interfaces matching the product spec.
 */

// ═══════════════════════════════════════════════════════════════
// Core Resume Data Structure
// ═══════════════════════════════════════════════════════════════

export interface ResumeData {
  meta: ResumeMeta;
  header: ResumeHeader;
  summary: ResumeSummary;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsSection;
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  customSections: CustomSection[];
}

export interface ResumeMeta {
  language: string;
  colorScheme: string;
  fontFamily: string;
  fontSize: "sm" | "md" | "lg";
  sectionOrder: SectionId[];
  paperSize: "a4" | "letter";
  /** Optional template id selected from the template gallery. Some callers
   *  surface this on the resume-builder dashboard. */
  template?: string;
}

export interface ResumeHeader {
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photo?: string;
}

export interface ResumeSummary {
  content: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  bullets: BulletItem[];
}

export interface BulletItem {
  id: string;
  content: string;
  highlighted: boolean;
  aiGenerated?: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
}

export interface SkillsSection {
  display: "grouped" | "flat" | "rated";
  groups: SkillGroup[];
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
  bullets: BulletItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Conversational" | "Basic";
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  heading: string;
  subheading?: string;
  date?: string;
  bullets: string[];
}

// ═══════════════════════════════════════════════════════════════
// Template & UI Types
// ═══════════════════════════════════════════════════════════════

export type TemplateId =
  | "meridian"
  | "atlas"
  | "prism"
  | "scholar"
  | "carta"
  | "vertex"
  | "foundry"
  | "pulse";

export type SectionId =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "custom";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  bestFor: string;
  thumbnail?: string;
}

export interface TemplateProps {
  data: ResumeData;
  scale?: number;
  paperSize?: "a4" | "letter";
  sectionVisibility?: Record<SectionId, boolean>;
}

// ═══════════════════════════════════════════════════════════════
// Store Types
// ═══════════════════════════════════════════════════════════════

export interface ResumeDocument {
  id: string;
  title: string;
  data: ResumeData;
  templateId: TemplateId;
  sectionVisibility: Record<SectionId, boolean>;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  shareSlug?: string;
  deletedAt?: string; // Soft delete — recoverable for 30 days
  sharePassword?: string; // Optional password protection for shared links
}

// ═══════════════════════════════════════════════════════════════
// AI Types
// ═══════════════════════════════════════════════════════════════

export interface AIBulletSuggestion {
  original: string;
  improved: string[];
}

export interface AISummarySuggestion {
  variants: string[];
}

export interface ATSAnalysis {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  summary: string;
  missingKeywords: {
    keyword: string;
    importance: "critical" | "important" | "nice-to-have";
    suggestedSection: string;
  }[];
  presentKeywords: {
    keyword: string;
    count: number;
  }[];
  formatIssues: {
    issue: string;
    severity: "high" | "medium" | "low";
    fix: string;
  }[];
  recommendations: {
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
  }[];
}

// ═══════════════════════════════════════════════════════════════
// Export Types
// ═══════════════════════════════════════════════════════════════

export type ExportFormat = "pdf" | "docx" | "json";

export interface ExportOptions {
  format: ExportFormat;
  paperSize: "a4" | "letter";
  includePhoto: boolean;
}
