"use client";

/**
 * Medical Education sub-navigation — same pill pattern as the other
 * learner tiers (graduate / undergraduate / high-school), with the addition
 * of medical-specific learner tools that already exist as standalone
 * sub-routes: QBank, Cases, Anatomy, OSCE, AI Tutor. Without this layout
 * those sub-modules were orphaned (reachable only by direct URL) — now
 * they're first-class tabs in the medical tree.
 *
 * Admin-only sections (Content Studio, ML Demos) are gated behind the
 * org_admin / super_admin role check, mirroring how graduate gates "Manage".
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  ClipboardList,
  FileText,
  Activity,
  UserCheck,
  Brain,
  Layers,
  Target,
  Folder,
  Edit,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/eureka-api";
import { useAuthStore } from "@/stores/auth";

const TIER = "medical";

type Counts = {
  enrollment: number;
  skills: number;
  resources: number;
};

// Counts here are only for the tier-shaped tabs (Enrollment, Skills,
// Resources). The medical-specific tabs (QBank, Cases, Anatomy, OSCE,
// AI Tutor) are self-contained sub-modules using different APIs — adding
// counts for them would require knowing each one's data layer, and the
// payoff is low: those tabs are about depth, not breadth, and "n cases"
// is less useful than "you have 1 pending case to finish" which we don't
// model yet.
const LEARNER_SECTIONS = [
  { href: "/dashboard/medical", label: "Overview", icon: Stethoscope, exact: true, countKey: null as null | keyof Counts },
  { href: "/dashboard/medical/qbank", label: "QBank", icon: ClipboardList, exact: false, countKey: null },
  { href: "/dashboard/medical/cases", label: "Cases", icon: FileText, exact: false, countKey: null },
  { href: "/dashboard/medical/anatomy", label: "Anatomy", icon: Activity, exact: false, countKey: null },
  { href: "/dashboard/medical/osce", label: "OSCE", icon: UserCheck, exact: false, countKey: null },
  { href: "/dashboard/medical/ai-tutor", label: "AI Tutor", icon: Brain, exact: false, countKey: null },
  { href: "/dashboard/medical/enrollment", label: "My enrollment", icon: Layers, exact: false, countKey: "enrollment" as const },
  { href: "/dashboard/medical/skills", label: "Skills", icon: Target, exact: false, countKey: "skills" as const },
  { href: "/dashboard/medical/resources", label: "Resources", icon: Folder, exact: false, countKey: "resources" as const },
];

const ADMIN_SECTIONS = [
  { href: "/dashboard/medical/content-studio", label: "Content Studio", icon: Edit, exact: false, countKey: null as null | keyof Counts },
  { href: "/dashboard/medical/ml-demos", label: "ML Demos", icon: Cpu, exact: false, countKey: null as null | keyof Counts },
];

type TierEnrollment = { tier: string; status: string };

export default function MedicalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const user = useAuthStore((s) => s.user);
  const role = user?.role || "";
  const isAdmin = role === "org_admin" || role === "super_admin";

  const [counts, setCounts] = useState<Counts>({
    enrollment: 0,
    skills: 0,
    resources: 0,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [es, ms, rsx] = await Promise.all([
          api<TierEnrollment[]>("/tier-enrollments/me").catch(() => []),
          api<unknown[]>("/analytics/me/skills").catch(() => []),
          api<unknown[]>(`/resources?tier=${TIER}&limit=50`).catch(() => []),
        ]);
        if (cancelled) return;
        const enrolment = (Array.isArray(es) ? es : []).filter(
          (e) => e.tier === TIER && e.status !== "withdrawn" && e.status !== "archived",
        ).length;
        setCounts({
          enrollment: enrolment,
          skills: Array.isArray(ms) ? ms.length : 0,
          resources: Array.isArray(rsx) ? rsx.length : 0,
        });
      } catch {
        /* keep zeros */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const SECTIONS = isAdmin ? [...LEARNER_SECTIONS, ...ADMIN_SECTIONS] : LEARNER_SECTIONS;

  const activeLabel =
    SECTIONS.find((s) =>
      s.exact ? pathname === s.href : pathname === s.href || pathname.startsWith(s.href + "/"),
    )?.label ?? "Overview";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/dashboard/medical" className="hover:text-foreground">
          Medical Education
        </Link>
        {activeLabel !== "Overview" && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{activeLabel}</span>
          </>
        )}
      </div>

      <nav className="flex flex-wrap gap-1.5">
        {SECTIONS.map((s) => {
          const active = s.exact
            ? pathname === s.href
            : pathname === s.href || pathname.startsWith(s.href + "/");
          const cnum = s.countKey ? counts[s.countKey] : null;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-input hover:bg-muted hover:text-foreground",
              )}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
              {cnum !== null && cnum > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full text-[10px] font-semibold tabular-nums min-w-[1.25rem] px-1.5 py-0.5",
                    active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {cnum}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div>{children}</div>
    </div>
  );
}
