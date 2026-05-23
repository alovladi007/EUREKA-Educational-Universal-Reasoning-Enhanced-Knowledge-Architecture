"use client";

/**
 * Institutional dashboard shell — dedicated to L&D admins / org_admins.
 * Lives at /institutions/* with its own sidebar that hides learner-facing
 * sections and surfaces partnership / cohort / compliance / analytics work.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldCheck,
  ClipboardList,
  LineChart,
  ScrollText,
  Settings,
  ArrowLeft,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "/institutions", label: "Overview", icon: LayoutDashboard },
  { href: "/institutions/partnerships", label: "Partnerships", icon: Building2 },
  { href: "/institutions/cohorts", label: "Cohorts", icon: GraduationCap },
  { href: "/institutions/programs", label: "Programs", icon: ClipboardList },
  // Graduate programs moved to /dashboard/graduate/admin (2026-05-23) so
  // there's a single navigation tree for everything graduate. Don't list
  // it here anymore.
  { href: "/institutions/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/institutions/workers", label: "Workers (seats)", icon: Users },
  { href: "/institutions/analytics", label: "Analytics", icon: LineChart },
  { href: "/institutions/audit", label: "Audit log", icon: ScrollText },
  { href: "/institutions/settings", label: "Settings", icon: Settings },
];

export default function InstitutionsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-white">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <Building2 className="h-7 w-7 text-amber-600" />
          <div>
            <div className="text-base font-bold leading-tight">Institutions</div>
            <div className="text-[10px] uppercase text-slate-500">L&amp;D admin console</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <nav className="space-y-0.5">
            {SECTIONS.map((s) => {
              const active =
                pathname === s.href ||
                (s.href !== "/institutions" && pathname.startsWith(s.href + "/"));
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-amber-600 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  <s.icon className="h-4 w-4" />
                  {s.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="shrink-0 border-t p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to main site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
