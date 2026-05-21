"use client";

/**
 * Graduate module sub-navigation — keeps the user IN the dashboard shell
 * across overview / programs / enrollments / research. Replaces the old
 * "Browse programs" link that jumped to /institutions/graduate-programs
 * (a completely different admin shell with amber L&D branding).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookMarked, FolderKanban, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "/dashboard/graduate", label: "Overview", icon: GraduationCap, exact: true },
  { href: "/dashboard/graduate/programs", label: "Programs", icon: BookMarked },
  { href: "/dashboard/graduate/enrollments", label: "My enrollments", icon: Layers },
  { href: "/dashboard/graduate/research", label: "Research", icon: FolderKanban },
];

export default function GraduateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  return (
    <div className="space-y-4">
      <nav className="flex gap-1 border-b -mx-6 px-6 pb-0 overflow-x-auto">
        {SECTIONS.map((s) => {
          const active = s.exact
            ? pathname === s.href
            : pathname === s.href || pathname.startsWith(s.href + "/");
          return (
            <Link
              key={s.href}
              href={s.href}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted",
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
