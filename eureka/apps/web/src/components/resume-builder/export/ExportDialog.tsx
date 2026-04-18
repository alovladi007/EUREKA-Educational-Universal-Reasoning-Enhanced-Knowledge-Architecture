"use client";

import { useState, useCallback } from "react";
import { useResumeStore } from "@/stores/resume";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileText, FileJson, File, Loader2, X } from "lucide-react";
import type { ExportFormat } from "@/types/resume";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ExportDialog({ open, onClose }: ExportDialogProps) {
  const doc = useResumeStore((s) => s.activeDocument());
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const exportPDF = useCallback(async () => {
    if (!doc) return;
    setExporting("pdf");
    try {
      // Use browser print dialog for PDF export
      // This produces the best quality and works across all browsers
      const previewEl = document.querySelector("[data-resume-preview]") as HTMLElement;
      if (!previewEl) {
        window.print();
        return;
      }

      // Create a print-only window with the resume content
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        // Fallback if popup blocked
        window.print();
        return;
      }

      const fontFamily = doc.data.meta.fontFamily || "Inter";
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${doc.data.header.firstName || "Resume"} ${doc.data.header.lastName || ""} - Resume</title>
            <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { display: flex; justify-content: center; }
              @media print { body { margin: 0; } }
              @page { margin: 0; size: ${doc.data.meta.paperSize === "a4" ? "A4" : "letter"}; }
            </style>
          </head>
          <body>${previewEl.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();

      // Wait for fonts to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (err) {
      console.error("PDF export failed:", err);
      window.print();
    } finally {
      setExporting(null);
    }
  }, [doc]);

  const exportDOCX = useCallback(async () => {
    if (!doc) return;
    setExporting("docx");
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1"}`;
      const res = await fetch(`${apiUrl}/exports/docx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_data: doc.data, template_id: doc.templateId }),
      });

      if (!res.ok) throw new Error("DOCX generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const h = doc.data.header;
      a.download = `${h.firstName || "Resume"}-${h.lastName || "Builder"}-Resume.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX export failed:", err);
      // Fallback to plain text if backend unavailable
      const lines: string[] = [];
      const h = doc.data.header;
      lines.push(`${h.firstName} ${h.lastName}`);
      if (h.headline) lines.push(h.headline);
      lines.push([h.email, h.phone, h.location].filter(Boolean).join(" | "));
      lines.push("");
      if (doc.data.summary.content) { lines.push("PROFESSIONAL SUMMARY"); lines.push(doc.data.summary.content); lines.push(""); }
      for (const exp of doc.data.experience) { lines.push(`${exp.title} — ${exp.company}`); for (const b of exp.bullets) { if (b.content) lines.push(`• ${b.content}`); } lines.push(""); }
      for (const edu of doc.data.education) { lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ""} — ${edu.institution}`); lines.push(""); }
      for (const g of doc.data.skills.groups) { if (g.skills.length > 0) lines.push(`${g.label}: ${g.skills.join(", ")}`); }
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${h.firstName || "Resume"}-${h.lastName || "Builder"}-Resume.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  }, [doc]);

  const exportJSON = useCallback(() => {
    if (!doc) return;
    setExporting("json");
    const blob = new Blob([JSON.stringify(doc.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.data.header.firstName || "Resume"}-${doc.data.header.lastName || "Builder"}-Resume.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(null);
  }, [doc]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Resume
          </h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={exportPDF}
            disabled={!!exporting}
          >
            {exporting === "pdf" ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5 text-red-500" />}
            <div className="text-left">
              <p className="font-medium">PDF</p>
              <p className="text-xs text-muted-foreground">Pixel-perfect, print-ready</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={exportDOCX}
            disabled={!!exporting}
          >
            {exporting === "docx" ? <Loader2 className="w-5 h-5 animate-spin" /> : <File className="w-5 h-5 text-blue-500" />}
            <div className="text-left">
              <p className="font-medium">DOCX (Word)</p>
              <p className="text-xs text-muted-foreground">ATS-friendly, editable in Word</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12"
            onClick={exportJSON}
            disabled={!!exporting}
          >
            {exporting === "json" ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileJson className="w-5 h-5 text-green-500" />}
            <div className="text-left">
              <p className="font-medium">JSON</p>
              <p className="text-xs text-muted-foreground">Backup & import data</p>
            </div>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          PDF uses browser rendering. For best results, use Chrome or Edge.
        </p>
      </Card>
    </div>
  );
}
