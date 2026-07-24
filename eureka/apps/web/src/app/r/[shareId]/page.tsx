"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useResumeStore } from "@/stores/resume";
import { apiGetPublicResume } from "@/lib/resume/api";
import { DEFAULT_RESUME_DATA } from "@/lib/resume/default-data";
import type { ResumeData } from "@/types/resume";
import { MeridianTemplate } from "@/components/resume-builder/templates/MeridianTemplate";
import { AtlasTemplate } from "@/components/resume-builder/templates/AtlasTemplate";
import { PrismTemplate } from "@/components/resume-builder/templates/PrismTemplate";
import { ScholarTemplate } from "@/components/resume-builder/templates/ScholarTemplate";
import { CartaTemplate } from "@/components/resume-builder/templates/CartaTemplate";
import { VertexTemplate } from "@/components/resume-builder/templates/VertexTemplate";
import { FoundryTemplate } from "@/components/resume-builder/templates/FoundryTemplate";
import { PulseTemplate } from "@/components/resume-builder/templates/PulseTemplate";
import { Button } from "@/components/ui/button";
import { FileEdit, Download, AlertCircle } from "lucide-react";
import type { TemplateProps, ResumeDocument } from "@/types/resume";
import Link from "next/link";

// A shared resume's stored `data` can be partial or shape-drifted (older
// versions, hand-crafted rows). Merge it over the default skeleton so the
// public page never white-screens on a missing field — e.g. the templates
// call data.skills.groups.some(...), which throws if skills isn't an object.
function normalizeResumeData(raw: any): ResumeData {
  const d = raw ?? {};
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);
  return {
    ...DEFAULT_RESUME_DATA,
    ...d,
    meta: { ...DEFAULT_RESUME_DATA.meta, ...(d.meta ?? {}) },
    header: { ...DEFAULT_RESUME_DATA.header, ...(d.header ?? {}) },
    summary: { ...DEFAULT_RESUME_DATA.summary, ...(d.summary ?? {}) },
    skills:
      d.skills && Array.isArray(d.skills.groups)
        ? d.skills
        : DEFAULT_RESUME_DATA.skills,
    experience: arr(d.experience),
    education: arr(d.education),
    projects: arr(d.projects),
    certifications: arr(d.certifications),
    languages: arr(d.languages),
    customSections: arr(d.customSections),
  } as ResumeData;
}

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

export default function SharedResumePage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const documents = useResumeStore((s) => s.documents);
  const [resume, setResume] = useState<ResumeDocument | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Primary path: fetch the shared resume from the backend so the link
      // resolves for ANY visitor, not just the browser that created it.
      try {
        const row: any = await apiGetPublicResume(shareId);
        if (cancelled) return;
        const cfg = row.template_config ?? {};
        setResume({
          id: row.id,
          title: row.title ?? "",
          data: normalizeResumeData(row.data),
          templateId: (row.template_id as ResumeDocument["templateId"]) ?? "meridian",
          sectionVisibility: cfg.sectionVisibility ?? row.data?.meta?.sectionVisibility ?? {},
          createdAt: row.created_at ?? "",
          updatedAt: row.updated_at ?? "",
          isPublic: true,
        } as ResumeDocument);
        return;
      } catch {
        // Fall through to the local store (same-browser preview before the
        // first cloud save).
      }
      const found = Object.values(documents).find(
        (doc) => doc.shareSlug === shareId && doc.isPublic,
      );
      if (cancelled) return;
      if (found) setResume(found);
      else setNotFound(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [shareId, documents]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto" />
          <h1 className="text-2xl font-bold mt-4">Resume Not Found</h1>
          <p className="text-muted-foreground mt-2">
            This resume link may have been removed or set to private.
          </p>
          <Link href="/dashboard/resume-builder">
            <Button className="mt-4">
              <FileEdit className="w-4 h-4 mr-2" />
              Create Your Own Resume
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading resume...</div>
      </div>
    );
  }

  const TemplateComponent = TEMPLATE_COMPONENTS[resume.templateId] || MeridianTemplate;
  const fullName = `${resume.data.header.firstName} ${resume.data.header.lastName}`.trim();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Minimal header */}
      <div className="bg-background border-b py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">{fullName || "Resume"}</span>
          <span className="text-xs text-muted-foreground">
            {resume.data.header.headline}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => window.print()}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Download PDF
          </Button>
          <Link href="/dashboard/resume-builder">
            <Button size="sm" className="h-7 text-xs">
              <FileEdit className="w-3.5 h-3.5 mr-1" />
              Build Yours
            </Button>
          </Link>
        </div>
      </div>

      {/* Resume render */}
      <div className="flex justify-center py-8">
        <div className="shadow-2xl">
          <TemplateComponent
            data={resume.data}
            sectionVisibility={resume.sectionVisibility}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-muted-foreground">
        Built with <Link href="/dashboard/resume-builder" className="text-primary hover:underline">EUREKA Resume Builder</Link>
      </div>
    </div>
  );
}
