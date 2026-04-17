import type { ResumeData, SectionId } from "@/types/resume";

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "header",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
];

export const DEFAULT_SECTION_VISIBILITY: Record<SectionId, boolean> = {
  header: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certifications: false,
  languages: false,
  custom: false,
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  meta: {
    language: "en",
    colorScheme: "#2563eb",
    fontFamily: "Inter",
    fontSize: "md",
    sectionOrder: DEFAULT_SECTION_ORDER,
    paperSize: "letter",
  },
  header: {
    firstName: "",
    lastName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: {
    content: "",
  },
  experience: [],
  education: [],
  skills: {
    display: "grouped",
    groups: [
      { id: "sk-1", label: "Technical Skills", skills: [] },
    ],
  },
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};

export const SAMPLE_RESUME_DATA: ResumeData = {
  meta: {
    language: "en",
    colorScheme: "#2563eb",
    fontFamily: "Inter",
    fontSize: "md",
    sectionOrder: DEFAULT_SECTION_ORDER,
    paperSize: "letter",
  },
  header: {
    firstName: "Alex",
    lastName: "Johnson",
    headline: "Software Engineer",
    email: "alex.johnson@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
  },
  summary: {
    content: "Results-driven software engineer with 4+ years of experience building scalable web applications. Proficient in React, TypeScript, and Node.js with a track record of delivering high-impact features that improve user engagement by 30%+. Passionate about clean architecture and developer experience.",
  },
  experience: [
    {
      id: "exp-1",
      company: "TechCorp Inc.",
      title: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-06",
      endDate: null,
      current: true,
      bullets: [
        { id: "b-1", content: "Led migration of monolithic API to microservices architecture, reducing p99 latency by 40% and improving deployment frequency from weekly to daily", highlighted: true, aiGenerated: false },
        { id: "b-2", content: "Mentored team of 4 junior engineers through code reviews and pair programming, resulting in 2 promotions within 12 months", highlighted: false, aiGenerated: false },
        { id: "b-3", content: "Architected real-time notification system using WebSockets and Redis, serving 500K+ concurrent users with 99.9% uptime", highlighted: false, aiGenerated: false },
      ],
    },
    {
      id: "exp-2",
      company: "StartupXYZ",
      title: "Software Engineer",
      location: "Remote",
      startDate: "2020-01",
      endDate: "2022-05",
      current: false,
      bullets: [
        { id: "b-4", content: "Built customer-facing dashboard using React and TypeScript, increasing user engagement by 35% and reducing support tickets by 20%", highlighted: true, aiGenerated: false },
        { id: "b-5", content: "Automated CI/CD pipeline using GitHub Actions, cutting deployment time from 45 minutes to 8 minutes", highlighted: false, aiGenerated: false },
        { id: "b-6", content: "Designed and implemented RESTful APIs serving 10M+ requests/day with comprehensive test coverage (95%+)", highlighted: false, aiGenerated: false },
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2016-08",
      endDate: "2020-05",
      gpa: "3.8",
      highlights: ["Dean's List (6 semesters)", "ACM Programming Club President"],
    },
  ],
  skills: {
    display: "grouped",
    groups: [
      { id: "sk-1", label: "Languages", skills: ["TypeScript", "JavaScript", "Python", "Go", "SQL"] },
      { id: "sk-2", label: "Frameworks", skills: ["React", "Next.js", "Node.js", "Express", "FastAPI"] },
      { id: "sk-3", label: "Tools & Infrastructure", skills: ["AWS", "Docker", "Kubernetes", "PostgreSQL", "Redis", "Git"] },
    ],
  },
  projects: [
    {
      id: "proj-1",
      name: "Open Source CLI Tool",
      description: "Developer productivity tool with 2K+ GitHub stars",
      url: "github.com/alexjohnson/cli-tool",
      technologies: ["Go", "Cobra", "GitHub Actions"],
      bullets: [
        { id: "pb-1", content: "Built a CLI tool for automating code review workflows, adopted by 50+ teams across 3 companies", highlighted: false, aiGenerated: false },
        { id: "pb-2", content: "Maintained CI/CD pipeline with automated releases, reducing manual deployment effort by 90%", highlighted: false, aiGenerated: false },
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "2023-03",
      url: "",
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native" },
    { id: "lang-2", language: "Spanish", proficiency: "Conversational" },
  ],
  customSections: [],
};

export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
