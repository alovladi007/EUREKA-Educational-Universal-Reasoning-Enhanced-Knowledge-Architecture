"use client";

import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlignLeft } from "lucide-react";

export function SummaryPanel() {
  const doc = useResumeStore((s) => s.activeDocument());
  const updateSummary = useResumeStore((s) => s.updateSummary);

  if (!doc || doc.sectionVisibility.summary === false) return null;

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
        <AlignLeft className="w-4 h-4 text-primary" />
        Professional Summary
      </h3>
      <Label className="text-xs text-muted-foreground">2-4 sentences highlighting your top qualifications</Label>
      <textarea
        className="mt-1 w-full min-h-[80px] rounded-md border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
        value={doc.data.summary.content}
        onChange={(e) => updateSummary(e.target.value)}
        placeholder="Results-driven software engineer with 5+ years of experience..."
      />
      <p className="text-xs text-muted-foreground mt-1">
        {doc.data.summary.content.length} / 500 characters
      </p>
    </Card>
  );
}
