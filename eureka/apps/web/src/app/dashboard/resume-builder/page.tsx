"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileEdit,
  Plus,
  Download,
  Eye,
  Trash2,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Globe,
  User,
} from "lucide-react";

interface ResumeSection {
  id: string;
  type: "education" | "experience" | "skills" | "projects" | "certifications";
  title: string;
  entries: ResumeEntry[];
}

interface ResumeEntry {
  id: string;
  primary: string;
  secondary: string;
  date: string;
  details: string[];
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  education: GraduationCap,
  experience: Briefcase,
  skills: Code,
  projects: Globe,
  certifications: Award,
};

const SECTION_LABELS: Record<string, string> = {
  education: "Education",
  experience: "Work Experience",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications & Licenses",
};

const DEFAULT_SECTIONS: ResumeSection[] = [
  {
    id: "edu",
    type: "education",
    title: "Education",
    entries: [
      {
        id: "edu-1",
        primary: "Bachelor of Science in Mechanical Engineering",
        secondary: "University Name",
        date: "Expected May 2026",
        details: ["GPA: 3.5/4.0", "Relevant Coursework: Thermodynamics, Fluid Mechanics, Machine Design"],
      },
    ],
  },
  {
    id: "exp",
    type: "experience",
    title: "Work Experience",
    entries: [
      {
        id: "exp-1",
        primary: "Engineering Intern",
        secondary: "Company Name",
        date: "Summer 2025",
        details: [
          "Designed and tested mechanical components using SolidWorks and ANSYS",
          "Collaborated with cross-functional teams to optimize manufacturing processes",
          "Reduced production waste by 15% through process improvement analysis",
        ],
      },
    ],
  },
  {
    id: "skills",
    type: "skills",
    title: "Skills",
    entries: [
      {
        id: "skills-1",
        primary: "Technical Skills",
        secondary: "",
        date: "",
        details: [
          "CAD: SolidWorks, AutoCAD, CATIA",
          "FEA/CFD: ANSYS, COMSOL",
          "Programming: Python, MATLAB, C++",
          "Manufacturing: CNC machining, 3D printing, GD&T",
        ],
      },
    ],
  },
  {
    id: "proj",
    type: "projects",
    title: "Projects",
    entries: [
      {
        id: "proj-1",
        primary: "Senior Design Project",
        secondary: "Autonomous Solar Tracking System",
        date: "2025-2026",
        details: [
          "Designed a dual-axis solar tracker increasing energy capture by 30%",
          "Built and programmed Arduino-based control system with light sensors",
          "Presented to industry panel and received Best Design Award",
        ],
      },
    ],
  },
  {
    id: "cert",
    type: "certifications",
    title: "Certifications",
    entries: [
      {
        id: "cert-1",
        primary: "FE Mechanical Engineering (EIT)",
        secondary: "NCEES",
        date: "2026",
        details: ["Passed Fundamentals of Engineering exam"],
      },
    ],
  },
];

export default function ResumeBuilderPage() {
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    location: "",
  });
  const [sections, setSections] = useState<ResumeSection[]>(DEFAULT_SECTIONS);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const addEntry = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: [
                ...s.entries,
                {
                  id: `${s.type}-${Date.now()}`,
                  primary: "",
                  secondary: "",
                  date: "",
                  details: [""],
                },
              ],
            }
          : s
      )
    );
  };

  const removeEntry = (sectionId: string, entryId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) }
          : s
      )
    );
  };

  const updateEntry = (
    sectionId: string,
    entryId: string,
    field: keyof ResumeEntry,
    value: string | string[]
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: s.entries.map((e) =>
                e.id === entryId ? { ...e, [field]: value } : e
              ),
            }
          : s
      )
    );
  };

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Resume Preview</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(false)}>
              Back to Editor
            </Button>
            <Button onClick={() => window.print()}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card className="p-8 print:shadow-none print:border-none">
          {/* Header */}
          <div className="text-center border-b pb-4 mb-6">
            <h1 className="text-3xl font-bold">
              {contactInfo.name || "Your Name"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {[contactInfo.email, contactInfo.phone, contactInfo.location, contactInfo.linkedin]
                .filter(Boolean)
                .join(" | ") || "email@example.com | (555) 123-4567 | City, State"}
            </p>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <div key={section.id} className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider border-b border-foreground/20 pb-1 mb-3">
                {section.title}
              </h2>
              {section.entries.map((entry) => (
                <div key={entry.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{entry.primary}</p>
                      {entry.secondary && (
                        <p className="text-muted-foreground italic">
                          {entry.secondary}
                        </p>
                      )}
                    </div>
                    {entry.date && (
                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                        {entry.date}
                      </p>
                    )}
                  </div>
                  {entry.details.length > 0 && entry.details[0] && (
                    <ul className="mt-1 space-y-0.5">
                      {entry.details
                        .filter(Boolean)
                        .map((detail, i) => (
                          <li key={i} className="text-sm pl-4 relative before:content-['•'] before:absolute before:left-0">
                            {detail}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileEdit className="w-8 h-8 text-primary" />
            Resume Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and customize your professional resume
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <User className="w-5 h-5" />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Full Name"
            value={contactInfo.name}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, name: e.target.value })
            }
          />
          <Input
            placeholder="Email Address"
            type="email"
            value={contactInfo.email}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, email: e.target.value })
            }
          />
          <Input
            placeholder="Phone Number"
            value={contactInfo.phone}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, phone: e.target.value })
            }
          />
          <Input
            placeholder="LinkedIn URL"
            value={contactInfo.linkedin}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, linkedin: e.target.value })
            }
          />
          <Input
            placeholder="City, State"
            value={contactInfo.location}
            onChange={(e) =>
              setContactInfo({ ...contactInfo, location: e.target.value })
            }
          />
        </div>
      </Card>

      {/* Resume Sections */}
      {sections.map((section) => {
        const Icon = SECTION_ICONS[section.type] || FileEdit;
        const isExpanded = activeSection === section.id;

        return (
          <Card key={section.id} className="p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                setActiveSection(isExpanded ? null : section.id)
              }
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                {SECTION_LABELS[section.type] || section.title}
                <span className="text-sm font-normal text-muted-foreground">
                  ({section.entries.length}{" "}
                  {section.entries.length === 1 ? "entry" : "entries"})
                </span>
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  addEntry(section.id);
                  setActiveSection(section.id);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                {section.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-4 space-y-3 bg-muted/30"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder={
                            section.type === "education"
                              ? "Degree / Program"
                              : section.type === "experience"
                              ? "Job Title"
                              : section.type === "skills"
                              ? "Skill Category"
                              : section.type === "projects"
                              ? "Project Name"
                              : "Certification Name"
                          }
                          value={entry.primary}
                          onChange={(e) =>
                            updateEntry(
                              section.id,
                              entry.id,
                              "primary",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          placeholder={
                            section.type === "education"
                              ? "School Name"
                              : section.type === "experience"
                              ? "Company Name"
                              : section.type === "projects"
                              ? "Description"
                              : "Issuing Organization"
                          }
                          value={entry.secondary}
                          onChange={(e) =>
                            updateEntry(
                              section.id,
                              entry.id,
                              "secondary",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          placeholder="Date (e.g., May 2024 - Present)"
                          value={entry.date}
                          onChange={(e) =>
                            updateEntry(
                              section.id,
                              entry.id,
                              "date",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive ml-2"
                        onClick={() => removeEntry(section.id, entry.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Bullet Points</p>
                      {entry.details.map((detail, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-muted-foreground mt-2">
                            &bull;
                          </span>
                          <Input
                            placeholder="Describe an achievement or responsibility..."
                            value={detail}
                            onChange={(e) => {
                              const newDetails = [...entry.details];
                              newDetails[i] = e.target.value;
                              updateEntry(
                                section.id,
                                entry.id,
                                "details",
                                newDetails
                              );
                            }}
                          />
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateEntry(section.id, entry.id, "details", [
                            ...entry.details,
                            "",
                          ])
                        }
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add bullet point
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
