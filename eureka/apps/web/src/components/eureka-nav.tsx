"use client";

/**
 * Shared top nav for the Phase 9–14 surfaces. Drop into the top of any page:
 *
 *   import { EurekaNav } from "@/components/eureka-nav";
 *   export default function Page() { return <><EurekaNav /> ...</>; }
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { href: "/learner", label: "Learner" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/transcript", label: "Transcript" },
  { href: "/settings", label: "Settings" },
  { href: "/admin", label: "Admin" },
];

export function EurekaNav() {
  const pathname = usePathname() || "";
  return (
    <header className="w-full border-b bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="font-bold text-lg tracking-tight">
          EUREKA
        </Link>
        <nav className="flex gap-1 items-center text-sm flex-1">
          {SECTIONS.map((s) => {
            const active = pathname === s.href || pathname.startsWith(s.href + "/");
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/auth/login"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Account
        </Link>
      </div>
    </header>
  );
}
