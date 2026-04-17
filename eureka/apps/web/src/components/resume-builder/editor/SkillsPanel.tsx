"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Code, Plus, Trash2, X } from "lucide-react";

export function SkillsPanel() {
  const doc = useResumeStore((s) => s.activeDocument());
  const addSkillGroup = useResumeStore((s) => s.addSkillGroup);
  const updateSkillGroupLabel = useResumeStore((s) => s.updateSkillGroupLabel);
  const removeSkillGroup = useResumeStore((s) => s.removeSkillGroup);
  const addSkill = useResumeStore((s) => s.addSkill);
  const removeSkill = useResumeStore((s) => s.removeSkill);
  const [newSkill, setNewSkill] = useState<Record<string, string>>({});

  if (!doc || doc.sectionVisibility.skills === false) return null;

  const handleAddSkill = (groupId: string) => {
    const skill = (newSkill[groupId] || "").trim();
    if (skill) {
      addSkill(groupId, skill);
      setNewSkill((prev) => ({ ...prev, [groupId]: "" }));
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          Skills
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addSkillGroup}>
          <Plus className="w-3 h-3 mr-1" /> Add Category
        </Button>
      </div>

      <div className="space-y-3">
        {doc.data.skills.groups.map((group) => (
          <div key={group.id} className="border rounded-lg p-3 bg-background">
            <div className="flex items-center gap-2 mb-2">
              <Input
                className="h-7 text-sm font-medium flex-1"
                value={group.label}
                onChange={(e) => updateSkillGroupLabel(group.id, e.target.value)}
                placeholder="Category name"
              />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/50 hover:text-destructive" onClick={() => removeSkillGroup(group.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {group.skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs gap-1 pr-1">
                  {skill}
                  <button className="hover:text-destructive" onClick={() => removeSkill(group.id, i)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-1">
              <Input
                className="h-7 text-sm flex-1"
                value={newSkill[group.id] || ""}
                onChange={(e) => setNewSkill((prev) => ({ ...prev, [group.id]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(group.id); } }}
                placeholder="Type a skill and press Enter"
              />
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleAddSkill(group.id)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
