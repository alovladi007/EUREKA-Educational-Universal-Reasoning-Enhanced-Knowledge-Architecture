"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { History, X, Save, RotateCcw, Clock, Tag, Plus } from "lucide-react";

interface VersionHistoryPanelProps {
  open: boolean;
  onClose: () => void;
}

export function VersionHistoryPanel({ open, onClose }: VersionHistoryPanelProps) {
  const doc = useResumeStore((s) => s.activeDocument());
  const saveVersion = useResumeStore((s) => s.saveVersion);
  const restoreVersion = useResumeStore((s) => s.restoreVersion);
  const versions = useResumeStore((s) => s.getSavedVersions());
  const [newLabel, setNewLabel] = useState("");
  const [showSave, setShowSave] = useState(false);

  const handleSave = () => {
    saveVersion(newLabel);
    setNewLabel("");
    setShowSave(false);
  };

  const handleRestore = (versionId: string, label: string) => {
    if (!confirm(`Restore "${label}"? Your current changes will be saved to undo history.`)) return;
    restoreVersion(versionId);
  };

  if (!open) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-80 bg-background border-l shadow-xl z-40 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-sm">Version History</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3 border-b">
        {showSave ? (
          <div className="flex gap-2">
            <Input
              className="h-8 text-sm flex-1"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g., 'Applied to Google'"
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              autoFocus
            />
            <Button size="sm" className="h-8 text-xs" onClick={handleSave}>
              <Save className="w-3 h-3 mr-1" /> Save
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="w-full h-8 text-xs" onClick={() => setShowSave(true)}>
            <Plus className="w-3 h-3 mr-1" /> Save Current Version
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Current auto-save */}
        <Card className="p-3 border-green-200 bg-green-50/50 dark:bg-green-950/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">Current Version</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {doc?.updatedAt ? new Date(doc.updatedAt).toLocaleString() : "Just now"}
          </div>
        </Card>

        {/* Saved versions (from store, persisted to localStorage) */}
        {versions.map((version) => (
          <Card key={version.id} className="p-3 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2">
              <Tag className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-semibold">{version.label}</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date(version.createdAt).toLocaleString()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs mt-2 w-full text-orange-600 hover:text-orange-700"
              onClick={() => handleRestore(version.id, version.label)}
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Restore This Version
            </Button>
          </Card>
        ))}

        {versions.length === 0 && (
          <div className="text-center py-8">
            <History className="w-8 h-8 text-muted-foreground/30 mx-auto" />
            <p className="text-xs text-muted-foreground mt-2">No saved versions yet</p>
            <p className="text-[10px] text-muted-foreground">Save versions before major edits to easily revert</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-muted/30">
        <p className="text-[10px] text-muted-foreground text-center">
          Versions persist to local storage. Max 20 versions per resume.
        </p>
      </div>
    </div>
  );
}
