"use client";

import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Languages, Plus, Trash2 } from "lucide-react";

const PROFICIENCY_LEVELS = ["Native", "Fluent", "Professional", "Conversational", "Basic"] as const;

export function LanguagesPanel() {
  const doc = useResumeStore((s) => s.activeDocument());
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const removeLanguage = useResumeStore((s) => s.removeLanguage);

  if (!doc || doc.sectionVisibility.languages === false) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Languages className="w-4 h-4 text-primary" />
          Languages
          <span className="text-xs font-normal text-muted-foreground">({doc.data.languages.length})</span>
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addLanguage}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {doc.data.languages.map((lang) => (
          <div key={lang.id} className="flex items-center gap-2">
            <Input className="h-8 text-sm flex-1" value={lang.language} onChange={(e) => updateLanguage(lang.id, "language", e.target.value)} placeholder="Language" />
            <select
              className="h-8 text-sm border rounded px-2 bg-background"
              value={lang.proficiency}
              onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
            >
              {PROFICIENCY_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/50 hover:text-destructive" onClick={() => removeLanguage(lang.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
