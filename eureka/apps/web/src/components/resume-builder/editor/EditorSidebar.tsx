"use client";

import { useResumeStore } from "@/stores/resume";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import type { SectionId } from "@/types/resume";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "header", label: "Contact Info" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "languages", label: "Languages" },
];

export function EditorSidebar() {
  const doc = useResumeStore((s) => s.activeDocument());
  const toggleVisibility = useResumeStore((s) => s.toggleSectionVisibility);

  if (!doc) return null;

  return (
    <div className="flex flex-wrap gap-1.5 pb-2 border-b">
      {SECTIONS.map((section) => {
        const visible = doc.sectionVisibility[section.id] !== false;
        return (
          <Button
            key={section.id}
            variant={visible ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => toggleVisibility(section.id)}
          >
            {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 opacity-40" />}
            <span className={!visible ? "opacity-40 line-through" : ""}>{section.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
