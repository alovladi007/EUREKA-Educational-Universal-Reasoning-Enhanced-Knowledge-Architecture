"use client";

import { useState, useRef, useCallback } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  FileEdit,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  Sparkles,
  Target,
} from "lucide-react";
import { MeridianTemplate } from "./templates/MeridianTemplate";
import { AtlasTemplate } from "./templates/AtlasTemplate";
import { PrismTemplate } from "./templates/PrismTemplate";
import { ScholarTemplate } from "./templates/ScholarTemplate";
import { CartaTemplate } from "./templates/CartaTemplate";
import { VertexTemplate } from "./templates/VertexTemplate";
import { FoundryTemplate } from "./templates/FoundryTemplate";
import { PulseTemplate } from "./templates/PulseTemplate";
import { ContactInfoPanel } from "./editor/ContactInfoPanel";
import { SummaryPanel } from "./editor/SummaryPanel";
import { ExperiencePanel } from "./editor/ExperiencePanel";
import { EducationPanel } from "./editor/EducationPanel";
import { SkillsPanel } from "./editor/SkillsPanel";
import { ProjectsPanel } from "./editor/ProjectsPanel";
import { CertificationsPanel } from "./editor/CertificationsPanel";
import { LanguagesPanel } from "./editor/LanguagesPanel";
import { EditorSidebar } from "./editor/EditorSidebar";
import { DraggableSection } from "./editor/DraggableSection";
import { TemplateCustomizer } from "./customization/TemplateCustomizer";
import { ExportDialog } from "./export/ExportDialog";
import { AIAssistantPanel } from "./ai/AIAssistantPanel";
import { ATSScorePanel } from "./ats/ATSScorePanel";
import { TEMPLATES } from "@/lib/resume/template-registry";
import type { TemplateId, TemplateProps } from "@/types/resume";

const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<TemplateProps>> = {
  meridian: MeridianTemplate,
  atlas: AtlasTemplate,
  prism: PrismTemplate,
  scholar: ScholarTemplate,
  carta: CartaTemplate,
  vertex: VertexTemplate,
  foundry: FoundryTemplate,
  pulse: PulseTemplate,
};

export function ResumeBuilderShell() {
  const doc = useResumeStore((s) => s.activeDocument());
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setActiveDocument = useResumeStore((s) => s.setActiveDocument);
  const reorderSections = useResumeStore((s) => s.reorderSections);
  const [previewScale, setPreviewScale] = useState(0.55);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [showExport, setShowExport] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showATS, setShowATS] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const sectionOrder = doc?.data.meta.sectionOrder ?? [];

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as (typeof sectionOrder)[number]);
      const newIndex = sectionOrder.indexOf(over.id as (typeof sectionOrder)[number]);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove([...sectionOrder], oldIndex, newIndex);
        reorderSections(newOrder as typeof sectionOrder);
      }
    }
  }, [sectionOrder, reorderSections]);

  if (!doc) return null;

  const TemplateComponent = TEMPLATE_COMPONENTS[doc.templateId] || MeridianTemplate;

  const zoomIn = () => setPreviewScale((s) => Math.min(s + 0.1, 1.0));
  const zoomOut = () => setPreviewScale((s) => Math.max(s - 0.1, 0.3));

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveDocument(null)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
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

          {/* AI Assistant */}
          <Button
            variant={showAI ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs ${showAI ? "bg-violet-500 hover:bg-violet-600" : ""}`}
            onClick={() => { setShowAI(!showAI); setShowATS(false); }}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI
          </Button>

          {/* ATS Score */}
          <Button
            variant={showATS ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs ${showATS ? "bg-blue-500 hover:bg-blue-600" : ""}`}
            onClick={() => { setShowATS(!showATS); setShowAI(false); }}
          >
            <Target className="w-3.5 h-3.5 mr-1" />
            ATS
          </Button>

          {/* Export */}
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowExport(true)}>
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
            <TemplateCustomizer />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                {sectionOrder.map((sectionId) => {
                  const renderPanel = () => {
                    switch (sectionId) {
                      case "header": return <ContactInfoPanel />;
                      case "summary": return <SummaryPanel />;
                      case "experience": return <ExperiencePanel />;
                      case "education": return <EducationPanel />;
                      case "skills": return <SkillsPanel />;
                      case "projects": return <ProjectsPanel />;
                      case "certifications": return <CertificationsPanel />;
                      case "languages": return <LanguagesPanel />;
                      default: return null;
                    }
                  };
                  const panel = renderPanel();
                  if (!panel) return null;
                  return (
                    <DraggableSection key={sectionId} id={sectionId}>
                      {panel}
                    </DraggableSection>
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className={`w-full md:w-1/2 lg:w-[55%] overflow-auto bg-muted/50 ${mobileTab !== "preview" ? "hidden md:block" : ""}`}>
          <div className="p-4 flex justify-center">
            <div
              ref={previewRef}
              data-resume-preview
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

      {/* AI Assistant Panel */}
      <AIAssistantPanel open={showAI} onClose={() => setShowAI(false)} />

      {/* ATS Score Panel */}
      <ATSScorePanel open={showATS} onClose={() => setShowATS(false)} />

      {/* Export Dialog */}
      <ExportDialog open={showExport} onClose={() => setShowExport(false)} />
    </div>
  );
}
