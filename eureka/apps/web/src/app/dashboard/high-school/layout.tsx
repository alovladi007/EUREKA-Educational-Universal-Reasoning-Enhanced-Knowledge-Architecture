"use client";

/**
 * High-school module sub-navigation — same pattern as the graduate and
 * undergraduate modules (see ../graduate/layout.tsx and ../undergraduate/
 * layout.tsx). Counts come live from the tier-shaped endpoints the
 * original mega-page used.
 *
 * Tabs: Overview / Courses / Enrollment / Skills / Resources.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { School, BookOpen, Layers, Target, Folder, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/eureka-api";

const TIER = "high_school";

type Counts = {
  courses: number;
  enrollment: number;
  skills: number;
  resources: number;
};

const SECTIONS = [
  {
    href: "/dashboard/high-school",
    label: "Overview",
    icon: School,
    exact: true,
    countKey: null as null | keyof Counts,
  },
  {
    href: "/dashboard/high-school/courses",
    label: "Courses",
    icon: BookOpen,
    exact: false,
    countKey: "courses" as const,
  },
  {
    href: "/dashboard/high-school/enrollment",
    label: "My enrollment",
    icon: Layers,
    exact: false,
    countKey: "enrollment" as const,
  },
  {
    href: "/dashboard/high-school/skills",
    label: "Skills",
    icon: Target,
    exact: false,
    countKey: "skills" as const,
  },
  {
    href: "/dashboard/high-school/resources",
    label: "Resources",
    icon: Folder,
    exact: false,
    countKey: "resources" as const,
  },
];

type TierEnrollment = { tier: string; status: string };
type CoursePage = { items?: unknown[]; total?: number };

export default function HighSchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const [counts, setCounts] = useState<Counts>({
    courses: 0,
    enrollment: 0,
    skills: 0,
    resources: 0,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [es, cs, ms, rsx] = await Promise.all([
          api<TierEnrollment[]>("/tier-enrollments/me").catch(() => []),
          api<CoursePage | unknown[]>(
            `/courses/?limit=50&tier=${TIER}&is_published=true`,
          ).catch(() => ({ items: [] })),
          api<unknown[]>("/analytics/me/skills").catch(() => []),
          api<unknown[]>(`/resources?tier=${TIER}&limit=50`).catch(() => []),
        ]);
        if (cancelled) return;
        const enrolment = (Array.isArray(es) ? es : []).filter(
          (e) =>
            e.tier === TIER &&
            e.status !== "withdrawn" &&
            e.status !== "archived",
        ).length;
        const courseCount = Array.isArray(cs)
          ? cs.length
          : Array.isArray((cs as CoursePage)?.items)
            ? ((cs as CoursePage).items as unknown[]).length
            : 0;
        setCounts({
          courses: courseCount,
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

  const activeLabel =
    SECTIONS.find((s) =>
      s.exact
        ? pathname === s.href
        : pathname === s.href || pathname.startsWith(s.href + "/"),
    )?.label ?? "Overview";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/dashboard/high-school" className="hover:text-foreground">
          High School
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
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
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
