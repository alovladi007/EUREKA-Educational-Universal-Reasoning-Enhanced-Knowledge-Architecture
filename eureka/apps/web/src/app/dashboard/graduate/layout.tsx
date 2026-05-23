"use client";

/**
 * Graduate module sub-navigation — pill style for visibility, with active
 * counts pulled live from /me/graduate + /me/graduate/available-programs +
 * /me/research/workspaces so each tab shows what's behind it instead of a
 * bare label.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap, BookMarked, FolderKanban, Layers, ChevronRight, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/eureka-api";
import { useAuthStore } from "@/stores/auth";

type Counts = {
  enrollments: number;
  availablePrograms: number;
  workspaces: number;
  totalPrograms: number;
};

const LEARNER_SECTIONS = [
  { href: "/dashboard/graduate", label: "Overview", icon: GraduationCap, exact: true, countKey: null as null | keyof Counts },
  { href: "/dashboard/graduate/programs", label: "Programs", icon: BookMarked, exact: false, countKey: "availablePrograms" as const },
  { href: "/dashboard/graduate/enrollments", label: "My enrollments", icon: Layers, exact: false, countKey: "enrollments" as const },
  { href: "/dashboard/graduate/research", label: "Research", icon: FolderKanban, exact: false, countKey: "workspaces" as const },
];

// Visible only to org_admin / super_admin — replaces the old jump
// to /institutions/graduate-programs.
const ADMIN_SECTIONS = [
  { href: "/dashboard/graduate/admin", label: "Manage", icon: Settings, exact: false, countKey: "totalPrograms" as const },
];

export default function GraduateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const user = useAuthStore((s) => s.user);
  const role = user?.role || "";
  const isAdmin = role === "org_admin" || role === "super_admin";

  const [counts, setCounts] = useState<Counts>({
    enrollments: 0, availablePrograms: 0, workspaces: 0, totalPrograms: 0,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const calls: Promise<unknown>[] = [
          api<{ enrollments: unknown[] }>("/me/graduate").catch(() => ({ enrollments: [] })),
          api<unknown[]>("/me/graduate/available-programs").catch(() => []),
          api<unknown[]>("/me/research/workspaces").catch(() => []),
        ];
        if (isAdmin) {
          calls.push(api<unknown[]>("/graduate/programs").catch(() => []));
        }
        const results = await Promise.all(calls);
        if (cancelled) return;
        const me = results[0] as { enrollments: unknown[] };
        const avail = results[1] as unknown[];
        const ws = results[2] as unknown[];
        const allPrograms = (isAdmin ? (results[3] as { status?: string }[]) : []) || [];
        setCounts({
          enrollments: Array.isArray(me?.enrollments) ? me.enrollments.filter((e: unknown) => {
            const status = (e as { status?: string })?.status;
            return status !== "withdrawn" && status !== "dismissed";
          }).length : 0,
          availablePrograms: Array.isArray(avail) ? avail.length : 0,
          workspaces: Array.isArray(ws) ? ws.length : 0,
          totalPrograms: Array.isArray(allPrograms)
            ? allPrograms.filter((p) => p.status !== "archived").length
            : 0,
        });
      } catch { /* keep zeros */ }
    })();
    return () => { cancelled = true; };
  }, [pathname, isAdmin]);

  // Sections to show — learner sections always, admin section only if admin
  const SECTIONS = isAdmin ? [...LEARNER_SECTIONS, ...ADMIN_SECTIONS] : LEARNER_SECTIONS;

  // Breadcrumb-ish active label for the page title in the sub-nav row
  const activeLabel = SECTIONS.find((s) =>
    s.exact ? pathname === s.href : pathname === s.href || pathname.startsWith(s.href + "/"),
  )?.label ?? "Overview";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/dashboard/graduate" className="hover:text-foreground">Graduate</Link>
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
