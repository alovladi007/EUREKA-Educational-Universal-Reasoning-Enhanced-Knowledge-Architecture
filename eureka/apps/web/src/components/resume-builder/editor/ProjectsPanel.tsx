"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderGit2, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

export function ProjectsPanel() {
  const doc = useResumeStore((s) => s.activeDocument());
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);
  const addProjectBullet = useResumeStore((s) => s.addProjectBullet);
  const updateProjectBullet = useResumeStore((s) => s.updateProjectBullet);
  const removeProjectBullet = useResumeStore((s) => s.removeProjectBullet);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!doc || doc.sectionVisibility.projects === false) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-primary" />
          Projects
          <span className="text-xs font-normal text-muted-foreground">({doc.data.projects.length})</span>
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addProject}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {doc.data.projects.map((proj) => {
          const isExpanded = expandedId === proj.id;
          return (
            <div key={proj.id} className="border rounded-lg bg-background">
              <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(isExpanded ? null : proj.id)}>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="text-sm font-medium flex-1 truncate">{proj.name || "New Project"}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 border-t pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Project Name</Label><Input className="h-8 text-sm" value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} placeholder="My Project" /></div>
                    <div><Label className="text-xs">URL</Label><Input className="h-8 text-sm" value={proj.url} onChange={(e) => updateProject(proj.id, "url", e.target.value)} placeholder="github.com/..." /></div>
                    <div className="col-span-2"><Label className="text-xs">Description</Label><Input className="h-8 text-sm" value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} placeholder="Brief description" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Key Points</Label>
                    {proj.bullets.map((bullet) => (
                      <div key={bullet.id} className="flex items-center gap-1">
                        <span className="text-muted-foreground text-xs">&bull;</span>
                        <Input className="h-8 text-sm flex-1" value={bullet.content} onChange={(e) => updateProjectBullet(proj.id, bullet.id, e.target.value)} placeholder="Describe impact..." />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/50" onClick={() => removeProjectBullet(proj.id, bullet.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addProjectBullet(proj.id)}>
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
