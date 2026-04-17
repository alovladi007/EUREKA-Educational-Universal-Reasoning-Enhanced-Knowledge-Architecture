"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutList, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { generateId } from "@/lib/resume/default-data";
import type { CustomSection, CustomSectionItem } from "@/types/resume";

export function CustomSectionPanel() {
  const doc = useResumeStore((s) => s.activeDocument());
  const activeId = useResumeStore((s) => s.activeDocumentId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!doc || doc.sectionVisibility.custom === false) return null;

  const customSections = doc.data.customSections;

  const addSection = () => {
    if (!activeId) return;
    useResumeStore.setState((state) => {
      const d = state.documents[activeId];
      if (d) {
        d.data.customSections.push({
          id: generateId("csec"),
          title: "New Section",
          items: [],
        });
        d.updatedAt = new Date().toISOString();
      }
    });
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    if (!activeId) return;
    useResumeStore.setState((state) => {
      const sec = state.documents[activeId]?.data.customSections.find((s) => s.id === sectionId);
      if (sec) sec.title = title;
    });
  };

  const removeSection = (sectionId: string) => {
    if (!activeId) return;
    useResumeStore.setState((state) => {
      const d = state.documents[activeId];
      if (d) {
        d.data.customSections = d.data.customSections.filter((s) => s.id !== sectionId);
      }
    });
  };

  const addItem = (sectionId: string) => {
    if (!activeId) return;
    useResumeStore.setState((state) => {
      const sec = state.documents[activeId]?.data.customSections.find((s) => s.id === sectionId);
      if (sec) {
        sec.items.push({
          id: generateId("citem"),
          heading: "",
          subheading: "",
          date: "",
          bullets: [""],
        });
      }
    });
  };

  const updateItem = (sectionId: string, itemId: string, field: string, value: string) => {
    if (!activeId) return;
    useResumeStore.setState((state) => {
      const sec = state.documents[activeId]?.data.customSections.find((s) => s.id === sectionId);
      const item = sec?.items.find((i) => i.id === itemId);
      if (item) (item as Record<string, unknown>)[field] = value;
    });
  };

  const removeItem = (sectionId: string, itemId: string) => {
    if (!activeId) return;
    useResumeStore.setState((state) => {
      const sec = state.documents[activeId]?.data.customSections.find((s) => s.id === sectionId);
      if (sec) {
        sec.items = sec.items.filter((i) => i.id !== itemId);
      }
    });
  };

  const addBullet = (sectionId: string, itemId: string) => {
    if (!activeId) return;
    useResumeStore.setState((state) => {
      const sec = state.documents[activeId]?.data.customSections.find((s) => s.id === sectionId);
      const item = sec?.items.find((i) => i.id === itemId);
      if (item) item.bullets.push("");
    });
  };

  const updateBullet = (sectionId: string, itemId: string, index: number, value: string) => {
    if (!activeId) return;
    useResumeStore.setState((state) => {
      const sec = state.documents[activeId]?.data.customSections.find((s) => s.id === sectionId);
      const item = sec?.items.find((i) => i.id === itemId);
      if (item) item.bullets[index] = value;
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <LayoutList className="w-4 h-4 text-primary" />
          Custom Sections
          <span className="text-xs font-normal text-muted-foreground">({customSections.length})</span>
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addSection}>
          <Plus className="w-3 h-3 mr-1" /> Add Section
        </Button>
      </div>

      {customSections.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          Add custom sections for Volunteer Work, Publications, Awards, etc.
        </p>
      )}

      <div className="space-y-2">
        {customSections.map((section) => {
          const isExpanded = expandedId === section.id;
          return (
            <div key={section.id} className="border rounded-lg bg-background">
              <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(isExpanded ? null : section.id)}>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <Input
                  className="h-7 text-sm font-medium flex-1 border-0 bg-transparent p-0 focus-visible:ring-0"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Section Title"
                />
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t pt-2">
                  {section.items.map((item) => (
                    <div key={item.id} className="border rounded p-2 bg-muted/20 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Heading</Label>
                          <Input className="h-7 text-sm" value={item.heading} onChange={(e) => updateItem(section.id, item.id, "heading", e.target.value)} placeholder="Title / Role" />
                        </div>
                        <div>
                          <Label className="text-xs">Subheading</Label>
                          <Input className="h-7 text-sm" value={item.subheading || ""} onChange={(e) => updateItem(section.id, item.id, "subheading", e.target.value)} placeholder="Organization" />
                        </div>
                        <div>
                          <Label className="text-xs">Date</Label>
                          <Input className="h-7 text-sm" value={item.date || ""} onChange={(e) => updateItem(section.id, item.id, "date", e.target.value)} placeholder="2024" />
                        </div>
                        <div className="flex items-end">
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => removeItem(section.id, item.id)}>
                            <Trash2 className="w-3 h-3 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                      {/* Bullets */}
                      <div className="space-y-1">
                        {item.bullets.map((bullet, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-muted-foreground text-xs">&bull;</span>
                            <Input className="h-7 text-sm flex-1" value={bullet} onChange={(e) => updateBullet(section.id, item.id, i, e.target.value)} placeholder="Detail..." />
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addBullet(section.id, item.id)}>
                          <Plus className="w-3 h-3 mr-1" /> Bullet
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="h-7 text-xs w-full" onClick={() => addItem(section.id)}>
                    <Plus className="w-3 h-3 mr-1" /> Add Item
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
