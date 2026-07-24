"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/stores/resume";
import { ResumeBuilderShell } from "@/components/resume-builder/ResumeBuilderShell";
import { ImportDialog } from "@/components/resume-builder/export/ImportDialog";
import { OnboardingWizard } from "@/components/resume-builder/OnboardingWizard";
import { ConfirmDialog } from "@/components/resume-builder/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, formatDate } from "@/lib/eureka-api";
import {
  FileEdit,
  Plus,
  Trash2,
  Copy,
  Clock,
  Layout,
  Upload,
  Pencil,
  Cloud,
  RefreshCw,
} from "lucide-react";

type CloudResume = {
  id: string;
  title: string;
  updated_at: string;
  is_public?: boolean;
  slug?: string | null;
};

export default function ResumeBuilderPage() {
  const documents = useResumeStore((s) => s.documents);
  const activeDocumentId = useResumeStore((s) => s.activeDocumentId);
  const createDocument = useResumeStore((s) => s.createDocument);
  const deleteDocument = useResumeStore((s) => s.deleteDocument);
  const duplicateDocument = useResumeStore((s) => s.duplicateDocument);
  const setActiveDocument = useResumeStore((s) => s.setActiveDocument);
  const renameDocument = useResumeStore((s) => s.renameDocument);
  const setCloudId = useResumeStore((s) => s.setCloudId);
  const loadCloudResume = useResumeStore((s) => s.loadCloudResume);
  const [showImport, setShowImport] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Phase 17 — Cloud-saved resumes from /api/v1/resumes. Independent of
  // the local Zustand store, so users get both: local-first editing AND
  // cross-device persistence on the server.
  const [cloudResumes, setCloudResumes] = useState<CloudResume[]>([]);
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [cloudBusy, setCloudBusy] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  const refreshCloud = async () => {
    setCloudError(null);
    try {
      const rows = await api<CloudResume[]>("/resumes");
      setCloudResumes(Array.isArray(rows) ? rows : []);
    } catch (e) {
      setCloudError(String((e as Error).message));
      setCloudResumes([]);
    } finally {
      setCloudLoaded(true);
    }
  };

  useEffect(() => {
    refreshCloud();
  }, []);

  const saveActiveToCloud = async () => {
    if (!activeDocumentId) return;
    const doc = documents[activeDocumentId];
    if (!doc) return;
    setCloudBusy(true);
    setCloudError(null);
    try {
      const fullName = `${doc.data.header.firstName} ${doc.data.header.lastName}`.trim();
      const title = fullName || doc.data.header.headline || "Untitled resume";
      // Persist sectionVisibility alongside meta so a shared/reopened resume
      // renders identically to the editor.
      const body = JSON.stringify({
        title,
        template_id: doc.templateId,
        data: doc.data,
        template_config: { ...(doc.data.meta ?? {}), sectionVisibility: doc.sectionVisibility },
      });
      // Upsert: PATCH the existing cloud row instead of always POSTing (which
      // spawned a duplicate on every save). Record the id for next time.
      const saved = doc.cloudId
        ? await api<CloudResume>(`/resumes/${doc.cloudId}`, { method: "PATCH", body })
        : await api<CloudResume>("/resumes", { method: "POST", body });
      if (saved?.id) setCloudId(activeDocumentId, saved.id);
      await refreshCloud();
    } catch (e) {
      setCloudError(String((e as Error).message));
    } finally {
      setCloudBusy(false);
    }
  };

  // Open a cloud-saved resume in the editor (fixes "cloud list was display
  // only — a saved resume could never be restored").
  const openCloudResume = async (id: string) => {
    setCloudBusy(true);
    setCloudError(null);
    try {
      const row = await api<any>(`/resumes/${id}`);
      const cfg = row.template_config ?? {};
      loadCloudResume({
        id: row.id,
        templateId: row.template_id,
        data: row.data,
        sectionVisibility: cfg.sectionVisibility,
        title: row.title,
        isPublic: row.is_public,
        shareSlug: row.slug ?? undefined,
      });
    } catch (e) {
      setCloudError(String((e as Error).message));
    } finally {
      setCloudBusy(false);
    }
  };

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

      {/* Cloud sync (Phase 17 — additive, doesn't replace the local store) */}
      <Card className="p-4 border-primary/20 bg-primary/5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Cloud className="w-4 h-4 text-primary" />
              Cloud-saved resumes
              <span className="text-xs font-normal text-muted-foreground">
                ({cloudLoaded ? cloudResumes.length : "…"})
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Server backup of your resumes via{" "}
              <code className="font-mono text-[10px]">/api/v1/resumes</code>.
              The editor above stays local-first; this panel just keeps a copy
              on EUREKA so you can open them on any device.
            </p>
            {cloudError && (
              <p className="text-xs text-destructive mt-1">{cloudError}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={refreshCloud} disabled={cloudBusy}>
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${cloudBusy ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={saveActiveToCloud}
              disabled={!activeDocumentId || cloudBusy}
              title={
                activeDocumentId
                  ? "Save the currently open resume to the server"
                  : "Open a resume first, then save it to the cloud"
              }
            >
              Save active to cloud
            </Button>
          </div>
        </div>
        {cloudLoaded && cloudResumes.length > 0 && (
          <ul className="mt-3 divide-y divide-border/60">
            {cloudResumes.slice(0, 8).map((r) => (
              <li key={r.id} className="py-2 flex items-center justify-between gap-2 text-sm">
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{r.title || "Untitled resume"}</div>
                  <div className="text-xs text-muted-foreground">
                    Last saved {formatDate(r.updated_at)}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.is_public && <Badge variant="secondary" className="text-[10px]">Public</Badge>}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={cloudBusy}
                    onClick={() => openCloudResume(r.id)}
                  >
                    Open
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

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
