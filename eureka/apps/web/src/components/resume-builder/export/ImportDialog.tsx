"use client";

import { useState, useCallback, useRef } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileJson, FileText, Linkedin, X, Loader2, Check, AlertCircle } from "lucide-react";
import type { ResumeData } from "@/types/resume";

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ImportDialog({ open, onClose }: ImportDialogProps) {
  const createDocument = useResumeStore((s) => s.createDocument);
  const documents = useResumeStore((s) => s.documents);
  const setActiveDocument = useResumeStore((s) => s.setActiveDocument);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleJSONImport = useCallback(async (file: File) => {
    setImporting(true);
    setError(null);
    try {
      const text = await file.text();
      const data = JSON.parse(text) as ResumeData;

      // Basic validation
      if (!data.header || !data.meta || !data.experience) {
        throw new Error("Invalid resume JSON format. Expected ResumeData structure with header, meta, and experience fields.");
      }

      const id = createDocument(data.header.firstName ? `${data.header.firstName}'s Resume` : "Imported Resume");
      // Update the document with imported data
      const store = useResumeStore.getState();
      if (store.documents[id]) {
        store.documents[id].data = data;
      }
      setSuccess(true);
      setTimeout(() => { setActiveDocument(id); onClose(); }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON file");
    } finally {
      setImporting(false);
    }
  }, [createDocument, setActiveDocument, onClose]);

  const handlePDFImport = useCallback(async (file: File) => {
    setImporting(true);
    setError(null);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1"}`;
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${apiUrl}/resumes/import/pdf`, { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "PDF import failed");
      }
      const result = await res.json();
      if (result.success && result.data) {
        const id = createDocument(result.data.header?.firstName ? `${result.data.header.firstName}'s Resume` : "Imported Resume");
        const store = useResumeStore.getState();
        if (store.documents[id]) {
          store.documents[id].data = { ...store.documents[id].data, ...result.data };
        }
        setSuccess(true);
        setTimeout(() => { setActiveDocument(id); onClose(); }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF import failed");
    } finally {
      setImporting(false);
    }
  }, [createDocument, setActiveDocument, onClose]);

  const handleLinkedInZipImport = useCallback(async (file: File) => {
    setImporting(true);
    setError(null);
    try {
      const { parseLinkedInZip } = await import("@/lib/resume/import-linkedin");
      const data = await parseLinkedInZip(file);
      const name = data.header?.firstName ? `${data.header.firstName}'s Resume` : "LinkedIn Import";
      const id = createDocument(name);
      const store = useResumeStore.getState();
      if (store.documents[id] && data) {
        store.documents[id].data = { ...store.documents[id].data, ...data } as typeof store.documents[string]["data"];
      }
      setSuccess(true);
      setTimeout(() => { setActiveDocument(id); onClose(); }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "LinkedIn import failed. Make sure it's a valid LinkedIn data export ZIP.");
    } finally {
      setImporting(false);
    }
  }, [createDocument, setActiveDocument, onClose]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".json")) {
      handleJSONImport(file);
    } else if (file.name.endsWith(".pdf")) {
      handlePDFImport(file);
    } else if (file.name.endsWith(".zip")) {
      handleLinkedInZipImport(file);
    } else {
      setError("Supported formats: .json, .pdf, .zip (LinkedIn export)");
    }
  }, [handleJSONImport]);

  const handleLinkedInPaste = useCallback((text: string) => {
    setError(null);
    try {
      const data = JSON.parse(text);
      if (data.header || data.experience || data.basics) {
        const id = createDocument("LinkedIn Import");
        setSuccess(true);
        setTimeout(() => { setActiveDocument(id); onClose(); }, 1000);
      } else {
        setError("Could not parse LinkedIn data. Try exporting your LinkedIn data as JSON first.");
      }
    } catch {
      setError("Invalid JSON format. Please paste valid LinkedIn export data.");
    }
  }, [createDocument, setActiveDocument, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Resume
          </h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <Check className="w-12 h-12 text-green-500 mx-auto" />
            <p className="font-semibold mt-2">Import Successful!</p>
            <p className="text-sm text-muted-foreground">Opening your resume...</p>
          </div>
        ) : (
          <>
            {/* File Upload */}
            <div className="space-y-3">
              <input
                ref={fileRef}
                type="file"
                accept=".json,.pdf,.zip"
                className="hidden"
                onChange={handleFileSelect}
              />

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-14 border-dashed border-2"
                onClick={() => fileRef.current?.click()}
                disabled={importing}
              >
                {importing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileJson className="w-5 h-5 text-green-500" />
                )}
                <div className="text-left">
                  <p className="font-medium">Upload JSON File</p>
                  <p className="text-xs text-muted-foreground">Import a previously exported resume JSON</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-14 border-dashed border-2"
                onClick={() => fileRef.current?.click()}
                disabled={importing}
              >
                <FileText className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <p className="font-medium">Upload PDF Resume</p>
                  <p className="text-xs text-muted-foreground">AI will extract and structure your resume data</p>
                </div>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-14 border-dashed border-2"
                onClick={() => fileRef.current?.click()}
                disabled={importing}
              >
                <Linkedin className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Import LinkedIn Data Export</p>
                  <p className="text-xs text-muted-foreground">Upload your LinkedIn ZIP (Settings → Data Privacy → Get a copy)</p>
                </div>
              </Button>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/20 text-sm">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Supported formats: JSON (from our export), PDF (AI-powered extraction)
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
