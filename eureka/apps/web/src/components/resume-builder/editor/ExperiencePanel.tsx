"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Plus, Trash2, ChevronDown, ChevronRight, Star } from "lucide-react";

export function ExperiencePanel() {
  const doc = useResumeStore((s) => s.activeDocument());
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const addBullet = useResumeStore((s) => s.addBullet);
  const updateBullet = useResumeStore((s) => s.updateBullet);
  const removeBullet = useResumeStore((s) => s.removeBullet);
  const toggleBulletHighlight = useResumeStore((s) => s.toggleBulletHighlight);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!doc || doc.sectionVisibility.experience === false) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          Work Experience
          <span className="text-xs font-normal text-muted-foreground">({doc.data.experience.length})</span>
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addExperience}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-2">
        {doc.data.experience.map((exp) => {
          const isExpanded = expandedId === exp.id;
          return (
            <div key={exp.id} className="border rounded-lg bg-background">
              <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50"
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="text-sm font-medium flex-1 truncate">
                  {exp.title || exp.company || "New Experience"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {exp.startDate && `${exp.startDate} — ${exp.current ? "Present" : exp.endDate || "..."}`}
                </span>
                <Button
                  variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 border-t">
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <Label className="text-xs">Job Title</Label>
                      <Input className="h-8 text-sm" value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} placeholder="Software Engineer" />
                    </div>
                    <div>
                      <Label className="text-xs">Company</Label>
                      <Input className="h-8 text-sm" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Acme Inc." />
                    </div>
                    <div>
                      <Label className="text-xs">Location</Label>
                      <Input className="h-8 text-sm" value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} placeholder="City, State" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label className="text-xs">Start</Label>
                        <Input className="h-8 text-sm" value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} placeholder="2022-01" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs">End</Label>
                        <Input className="h-8 text-sm" value={exp.endDate || ""} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value || null)} placeholder="Present" disabled={exp.current} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => {
                        updateExperience(exp.id, "current", e.target.checked);
                        if (e.target.checked) updateExperience(exp.id, "endDate", null);
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label className="text-xs">Currently working here</Label>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-1.5 mt-2">
                    <Label className="text-xs font-medium">Achievements & Responsibilities</Label>
                    {exp.bullets.map((bullet) => (
                      <div key={bullet.id} className="flex items-start gap-1">
                        <button
                          className={`mt-1.5 flex-shrink-0 ${bullet.highlighted ? "text-amber-500" : "text-muted-foreground/30 hover:text-muted-foreground"}`}
                          onClick={() => toggleBulletHighlight(exp.id, bullet.id)}
                          title="Highlight as key achievement"
                        >
                          <Star className="w-3 h-3" fill={bullet.highlighted ? "currentColor" : "none"} />
                        </button>
                        <Input
                          className="h-8 text-sm flex-1"
                          value={bullet.content}
                          onChange={(e) => updateBullet(exp.id, bullet.id, e.target.value)}
                          placeholder="Led migration of API to microservices..."
                        />
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 text-destructive/50 hover:text-destructive flex-shrink-0"
                          onClick={() => removeBullet(exp.id, bullet.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addBullet(exp.id)}>
                      <Plus className="w-3 h-3 mr-1" /> Add bullet
                    </Button>
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
