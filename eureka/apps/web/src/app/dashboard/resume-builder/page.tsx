"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/stores/resume";
import { ResumeBuilderShell } from "@/components/resume-builder/ResumeBuilderShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileEdit,
  Plus,
  Trash2,
  Copy,
  Clock,
  Layout,
} from "lucide-react";

export default function ResumeBuilderPage() {
  const documents = useResumeStore((s) => s.documents);
  const activeDocumentId = useResumeStore((s) => s.activeDocumentId);
  const createDocument = useResumeStore((s) => s.createDocument);
  const deleteDocument = useResumeStore((s) => s.deleteDocument);
  const duplicateDocument = useResumeStore((s) => s.duplicateDocument);
  const setActiveDocument = useResumeStore((s) => s.setActiveDocument);

  const docList = Object.values(documents);
  const hasActive = activeDocumentId && documents[activeDocumentId];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className="p-6 border-2 border-dashed hover:border-primary/50 cursor-pointer transition-all hover:shadow-md group"
          onClick={() => createDocument("My Resume")}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Blank Resume</h3>
              <p className="text-sm text-muted-foreground">Start from scratch</p>
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
      </div>

      {/* Existing Resumes */}
      {docList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Your Resumes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docList.map((doc) => (
              <Card
                key={doc.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setActiveDocument(doc.id)}
              >
                {/* Mini preview placeholder */}
                <div className="h-32 bg-muted rounded-md mb-3 flex items-center justify-center border">
                  <FileEdit className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h3 className="font-semibold text-sm truncate">{doc.title}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost" size="sm" className="h-7 text-xs"
                    onClick={(e) => { e.stopPropagation(); duplicateDocument(doc.id); }}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Duplicate
                  </Button>
                  <Button
                    variant="ghost" size="sm" className="h-7 text-xs text-destructive"
                    onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
