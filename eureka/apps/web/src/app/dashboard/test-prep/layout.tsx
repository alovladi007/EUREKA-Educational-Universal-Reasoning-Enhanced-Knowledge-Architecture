"use client";

/**
 * Test-Prep module sub-navigation — same pill pattern as the other learner
 * modules (graduate / undergraduate / high-school / medical), but minus
 * the count badges. Why no counts: test-prep is exam-driven, not
 * resource-counted. The "interesting numbers" here are the current
 * streak, today's questions answered, and readiness score — none of
 * which map cleanly to "items behind this tab" the way "5 courses"
 * does for HS/undergrad. Each tab's page surfaces its own metrics.
 *
 * Tabs: Overview / Practice / Study plan / Analytics / Exam / Profile.
 *
 * Skipped from the sub-nav:
 *   - /fe-ee-course (8075-line FE-EE specialty course) — exam-specific,
 *     deep-linked from the FE_EE exam selection inside Overview.
 *   - /[exam]/* (command-center / live / mpep-workbench / patent-program)
 *     — these are inside a specific exam context (e.g. /test-prep/PATENT_BAR/
 *     command-center), not top-level features.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  Brain,
  Calendar,
  BarChart3,
  Target,
  User,
  Video,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "/dashboard/test-prep", label: "Overview", icon: Trophy, exact: true },
  { href: "/dashboard/test-prep/practice", label: "Practice", icon: Brain, exact: false },
  { href: "/dashboard/test-prep/study-plan", label: "Study plan", icon: Calendar, exact: false },
  { href: "/dashboard/test-prep/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { href: "/dashboard/test-prep/exam", label: "Exam", icon: Target, exact: false },
  // Videos = the subscription-gated course portal that used to live at
  // /test-prep (route-group collision with this very dashboard). Pulled
  // in here so test-prep is one tree with one sub-nav.
  { href: "/dashboard/test-prep/videos", label: "Videos", icon: Video, exact: false },
  { href: "/dashboard/test-prep/profile", label: "Profile", icon: User, exact: false },
];

export default function TestPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  // For deep paths under /[exam]/* or /fe-ee-course, don't try to map
  // them to a sibling tab — leave activeLabel as the parent ("Overview"
  // would be wrong, "Exam" is misleading). Just show no breadcrumb tail
  // in that case.
  const matchedTab = SECTIONS.find((s) =>
    s.exact ? pathname === s.href : pathname === s.href || pathname.startsWith(s.href + "/"),
  );
  const activeLabel = matchedTab?.label ?? null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/dashboard/test-prep" className="hover:text-foreground">
          Test Prep
        </Link>
        {activeLabel && activeLabel !== "Overview" && (
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
            </Link>
          );
        })}
      </nav>

      <div>{children}</div>
    </div>
  );
}
