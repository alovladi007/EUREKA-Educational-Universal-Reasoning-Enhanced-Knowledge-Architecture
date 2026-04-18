"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume";
import { ResumeBuilderShell } from "@/components/resume-builder/ResumeBuilderShell";
import { ImportDialog } from "@/components/resume-builder/export/ImportDialog";
import { OnboardingWizard } from "@/components/resume-builder/OnboardingWizard";
import { ConfirmDialog } from "@/components/resume-builder/ConfirmDialog";
import { UsageBar } from "@/components/resume-builder/UsageBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileEdit,
  Plus,
  Trash2,
  Copy,
  Clock,
  Layout,
  Upload,
  Pencil,
} from "lucide-react";

export default function ResumeBuilderPage() {
  const documents = useResumeStore((s) => s.documents);
  const activeDocumentId = useResumeStore((s) => s.activeDocumentId);
  const createDocument = useResumeStore((s) => s.createDocument);
  const deleteDocument = useResumeStore((s) => s.deleteDocument);
  const duplicateDocument = useResumeStore((s) => s.duplicateDocument);
  const setActiveDocument = useResumeStore((s) => s.setActiveDocument);
  const renameDocument = useResumeStore((s) => s.renameDocument);
  const [showImport, setShowImport] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const recoverDocument = useResumeStore((s) => s.recoverDocument);
  const permanentlyDeleteDocument = useResumeStore((s) => s.permanentlyDeleteDocument);

  const docList = Object.values(documents).filter((d) => !d.deletedAt);
  const deletedList = Object.values(documents).filter((d) => !!d.deletedAt);
  const hasActive = activeDocumentId && documents[activeDocumentId] && !documents[activeDocumentId]?.deletedAt;

  // If there's an active document, show the editor
  if (hasActive) {
    return <ResumeBuilderShell />;
  }

  // Otherwise show the resume list / create screen
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileEdit className="w-8 h-8 text-primary" />
            Resume Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Create professional resumes with live preview, templates, and AI assistance
          </p>
        </div>
      </div>

      {/* Create Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className="p-6 border-2 border-dashed hover:border-primary/50 cursor-pointer transition-all hover:shadow-md group"
          onClick={() => setShowWizard(true)}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">New Resume</h3>
              <p className="text-sm text-muted-foreground">5-step guided wizard</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 border-2 border-dashed hover:border-primary/50 cursor-pointer transition-all hover:shadow-md group"
          onClick={() => createDocument("Sample Resume", true)}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Layout className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold">Start with Sample</h3>
              <p className="text-sm text-muted-foreground">Pre-filled with example content</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 border-2 border-dashed hover:border-primary/50 cursor-pointer transition-all hover:shadow-md group"
          onClick={() => setShowImport(true)}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
              <Upload className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <h3 className="font-semibold">Import Resume</h3>
              <p className="text-sm text-muted-foreground">Upload JSON or PDF</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Import Dialog */}
      <ImportDialog open={showImport} onClose={() => setShowImport(false)} />

      {/* Onboarding Wizard */}
      {showWizard && (
        <OnboardingWizard
          onComplete={(id) => { setShowWizard(false); setActiveDocument(id); }}
          onCancel={() => setShowWizard(false)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => { if (deleteTarget) deleteDocument(deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Usage Bar */}
      <UsageBar />

      {/* Existing Resumes */}
      {docList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Your Resumes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docList.map((doc) => {
              const fullName = `${doc.data.header.firstName} ${doc.data.header.lastName}`.trim();
              const hasContent = !!(doc.data.header.firstName || doc.data.summary.content || doc.data.experience.length);
              return (
                <Card
                  key={doc.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer group relative"
                  onClick={() => setActiveDocument(doc.id)}
                >
                  {/* Mini preview with content hint */}
                  <div className="h-36 bg-white dark:bg-gray-900 rounded-md mb-3 border overflow-hidden p-3 text-[6px] leading-tight pointer-events-none" style={{ color: doc.data.meta.colorScheme || "#333" }}>
                    {hasContent ? (
                      <>
                        <div className="font-bold text-[8px] text-center mb-0.5" style={{ color: doc.data.meta.colorScheme }}>
                          {fullName || "Your Name"}
                        </div>
                        {doc.data.header.headline && <div className="text-center text-[5px] text-gray-500 mb-1">{doc.data.header.headline}</div>}
                        {doc.data.summary.content && <div className="text-gray-600 text-[4.5px] mb-1 line-clamp-2">{doc.data.summary.content.slice(0, 120)}</div>}
                        {doc.data.experience.slice(0, 2).map((exp) => (
                          <div key={exp.id} className="mb-0.5">
                            <div className="font-semibold text-[5px]">{exp.title}</div>
                            <div className="text-gray-400 text-[4px]">{exp.company}</div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <FileEdit className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Template badge */}
                  <div className="absolute top-2 right-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                      {doc.templateId}
                    </span>
                  </div>

                  {/* Title with inline rename */}
                  <h3 className="font-semibold text-sm truncate">{doc.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(doc.updatedAt).toLocaleDateString()}</span>
                    {fullName && <span className="truncate">· {fullName}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost" size="sm" className="h-6 text-[10px] px-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        const name = prompt("Rename resume:", doc.title);
                        if (name) renameDocument(doc.id, name);
                      }}
                    >
                      <Pencil className="w-3 h-3 mr-0.5" /> Rename
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="h-6 text-[10px] px-1.5"
                      onClick={(e) => { e.stopPropagation(); duplicateDocument(doc.id); }}
                    >
                      <Copy className="w-3 h-3 mr-0.5" /> Copy
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-destructive"
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(doc.id); }}
                    >
                      <Trash2 className="w-3 h-3 mr-0.5" /> Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Recently Deleted */}
      {deletedList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Recently Deleted ({deletedList.length})
          </h2>
          <div className="space-y-1">
            {deletedList.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2 rounded border bg-muted/30 text-sm">
                <div className="flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-muted-foreground/50" />
                  <span className="line-through text-muted-foreground">{doc.title}</span>
                  <span className="text-[10px] text-muted-foreground">
                    deleted {doc.deletedAt ? new Date(doc.deletedAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => recoverDocument(doc.id)}>
                    Recover
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive" onClick={() => permanentlyDeleteDocument(doc.id)}>
                    Delete Forever
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
