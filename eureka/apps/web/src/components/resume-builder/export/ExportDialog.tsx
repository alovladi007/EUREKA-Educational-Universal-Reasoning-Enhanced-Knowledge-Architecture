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
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Find the preview element
      const previewEl = document.querySelector("[data-resume-preview]") as HTMLElement;
      if (!previewEl) {
        alert("Preview not found. Please ensure the preview is visible.");
        return;
      }

      // Capture at high resolution
      const canvas = await html2canvas(previewEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgWidth = doc.data.meta.paperSize === "a4" ? 210 : 215.9; // mm
      const imgHeight = doc.data.meta.paperSize === "a4" ? 297 : 279.4; // mm

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: doc.data.meta.paperSize === "a4" ? "a4" : "letter",
      });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const pdfRatio = imgWidth / imgHeight;

      let finalWidth = imgWidth;
      let finalHeight = imgHeight;

      if (ratio > pdfRatio) {
        finalHeight = imgWidth / ratio;
      } else {
        finalWidth = imgHeight * ratio;
      }

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        finalWidth,
        finalHeight,
        undefined,
        "FAST"
      );

      const fileName = `${doc.data.header.firstName || "Resume"}-${doc.data.header.lastName || "Builder"}-Resume.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Try using the browser print (Ctrl+P) as a fallback.");
    } finally {
      setExporting(null);
    }
  }, [doc]);

  const exportDOCX = useCallback(async () => {
    if (!doc) return;
    setExporting("docx");
    try {
      const docx = await import("docx");
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;

      const children: InstanceType<typeof Paragraph>[] = [];

      // Header
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `${doc.data.header.firstName} ${doc.data.header.lastName}`, bold: true, size: 32 })],
        }),
      );
      if (doc.data.header.headline) {
        children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: doc.data.header.headline, size: 22, color: "666666" })] }));
      }
      const contactLine = [doc.data.header.email, doc.data.header.phone, doc.data.header.location].filter(Boolean).join(" | ");
      if (contactLine) {
        children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: contactLine, size: 18, color: "888888" })] }));
      }

      // Summary
      if (doc.data.summary.content) {
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true })] }));
        children.push(new Paragraph({ children: [new TextRun({ text: doc.data.summary.content, size: 20 })] }));
      }

      // Experience
      if (doc.data.experience.length > 0) {
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "EXPERIENCE", bold: true })] }));
        for (const exp of doc.data.experience) {
          children.push(new Paragraph({ children: [new TextRun({ text: exp.title, bold: true, size: 22 }), new TextRun({ text: ` — ${exp.company}`, italics: true, size: 22 })] }));
          children.push(new Paragraph({ children: [new TextRun({ text: `${exp.startDate} — ${exp.current ? "Present" : exp.endDate || ""}`, size: 18, color: "888888" })] }));
          for (const bullet of exp.bullets) {
            if (bullet.content) {
              children.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: bullet.content, size: 20, bold: bullet.highlighted })] }));
            }
          }
        }
      }

      // Education
      if (doc.data.education.length > 0) {
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "EDUCATION", bold: true })] }));
        for (const edu of doc.data.education) {
          children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, bold: true, size: 22 })] }));
          children.push(new Paragraph({ children: [new TextRun({ text: `${edu.institution} — ${edu.endDate}`, italics: true, size: 20, color: "666666" })] }));
        }
      }

      // Skills
      if (doc.data.skills.groups.some(g => g.skills.length > 0)) {
        children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "SKILLS", bold: true })] }));
        for (const group of doc.data.skills.groups) {
          if (group.skills.length > 0) {
            children.push(new Paragraph({ children: [new TextRun({ text: `${group.label}: `, bold: true, size: 20 }), new TextRun({ text: group.skills.join(", "), size: 20 })] }));
          }
        }
      }

      const wordDoc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(wordDoc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.data.header.firstName || "Resume"}-${doc.data.header.lastName || "Builder"}-Resume.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOCX export failed:", err);
      alert("DOCX export failed.");
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
              <p className="text-xs text-muted-foreground">ATS-friendly, editable</p>
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
