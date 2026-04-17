"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

export function EducationPanel() {
  const doc = useResumeStore((s) => s.activeDocument());
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!doc || doc.sectionVisibility.education === false) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary" />
          Education
          <span className="text-xs font-normal text-muted-foreground">({doc.data.education.length})</span>
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addEducation}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-2">
        {doc.data.education.map((edu) => {
          const isExpanded = expandedId === edu.id;
          return (
            <div key={edu.id} className="border rounded-lg bg-background">
              <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(isExpanded ? null : edu.id)}>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="text-sm font-medium flex-1 truncate">{edu.institution || edu.degree || "New Education"}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 border-t pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2"><Label className="text-xs">Institution</Label><Input className="h-8 text-sm" value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} placeholder="University of..." /></div>
                    <div><Label className="text-xs">Degree</Label><Input className="h-8 text-sm" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder="Bachelor of Science" /></div>
                    <div><Label className="text-xs">Field of Study</Label><Input className="h-8 text-sm" value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} placeholder="Computer Science" /></div>
                    <div><Label className="text-xs">Location</Label><Input className="h-8 text-sm" value={edu.location} onChange={(e) => updateEducation(edu.id, "location", e.target.value)} placeholder="City, State" /></div>
                    <div><Label className="text-xs">GPA</Label><Input className="h-8 text-sm" value={edu.gpa || ""} onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)} placeholder="3.8/4.0" /></div>
                    <div><Label className="text-xs">Start</Label><Input className="h-8 text-sm" value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} placeholder="2020-08" /></div>
                    <div><Label className="text-xs">End</Label><Input className="h-8 text-sm" value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} placeholder="2024-05" /></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
