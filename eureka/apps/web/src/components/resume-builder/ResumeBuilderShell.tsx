"use client";

import { useState, useRef } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileEdit,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { MeridianTemplate } from "./templates/MeridianTemplate";
import { AtlasTemplate } from "./templates/AtlasTemplate";
import { ContactInfoPanel } from "./editor/ContactInfoPanel";
import { SummaryPanel } from "./editor/SummaryPanel";
import { ExperiencePanel } from "./editor/ExperiencePanel";
import { EducationPanel } from "./editor/EducationPanel";
import { SkillsPanel } from "./editor/SkillsPanel";
import { ProjectsPanel } from "./editor/ProjectsPanel";
import { CertificationsPanel } from "./editor/CertificationsPanel";
import { LanguagesPanel } from "./editor/LanguagesPanel";
import { EditorSidebar } from "./editor/EditorSidebar";
import { TEMPLATES } from "@/lib/resume/template-registry";
import type { TemplateId, TemplateProps } from "@/types/resume";

const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<TemplateProps>> = {
  meridian: MeridianTemplate,
  atlas: AtlasTemplate,
  // Phase 2: prism, scholar, carta, vertex, foundry, pulse
};

export function ResumeBuilderShell() {
  const doc = useResumeStore((s) => s.activeDocument());
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const [previewScale, setPreviewScale] = useState(0.55);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const previewRef = useRef<HTMLDivElement>(null);

  if (!doc) return null;

  const TemplateComponent = TEMPLATE_COMPONENTS[doc.templateId] || MeridianTemplate;

  const zoomIn = () => setPreviewScale((s) => Math.min(s + 0.1, 1.0));
  const zoomOut = () => setPreviewScale((s) => Math.max(s - 0.1, 0.3));

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm truncate max-w-[200px]">{doc.title}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {doc.updatedAt ? `Saved ${new Date(doc.updatedAt).toLocaleTimeString()}` : ""}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Template Selector */}
          <select
            className="text-xs border rounded px-2 py-1 bg-background"
            value={doc.templateId}
            onChange={(e) => setTemplate(e.target.value as TemplateId)}
          >
            {Object.values(TEMPLATES).map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Zoom Controls */}
          <Button variant="ghost" size="icon" className="h-7 w-7 hidden md:flex" onClick={zoomOut}>
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground hidden md:inline w-10 text-center">
            {Math.round(previewScale * 100)}%
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7 hidden md:flex" onClick={zoomIn}>
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>

          <div className="w-px h-5 bg-border mx-1 hidden md:block" />

          {/* Export */}
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => window.print()}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden border-b px-4 py-1">
        <div className="flex gap-1">
          <Button
            variant={mobileTab === "edit" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => setMobileTab("edit")}
          >
            Edit
          </Button>
          <Button
            variant={mobileTab === "preview" ? "default" : "ghost"}
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => setMobileTab("preview")}
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Main Content — Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor Panel */}
        <div className={`w-full md:w-1/2 lg:w-[45%] overflow-y-auto border-r bg-muted/30 ${mobileTab !== "edit" ? "hidden md:block" : ""}`}>
          <div className="p-4 space-y-3">
            <EditorSidebar />

            <ContactInfoPanel />
            <SummaryPanel />
            <ExperiencePanel />
            <EducationPanel />
            <SkillsPanel />
            <ProjectsPanel />
            <CertificationsPanel />
            <LanguagesPanel />
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className={`w-full md:w-1/2 lg:w-[55%] overflow-auto bg-muted/50 ${mobileTab !== "preview" ? "hidden md:block" : ""}`}>
          <div className="p-4 flex justify-center">
            <div
              ref={previewRef}
              className="shadow-xl"
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: "top center",
              }}
            >
              <TemplateComponent
                data={doc.data}
                sectionVisibility={doc.sectionVisibility}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
