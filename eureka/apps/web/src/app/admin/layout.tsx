"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EurekaNav } from "@/components/eureka-nav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Members" },
  { href: "/admin/cohorts", label: "Cohorts" },
  { href: "/admin/workforce", label: "Workforce" },
  { href: "/admin/integrations", label: "SSO & LTI" },
  { href: "/admin/jobs", label: "Background jobs" },
  { href: "/admin/audit", label: "Audit log" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  // /admin/* is the most sensitive surface (cohorts, audit log, background
  // jobs). Restrict to org_admin and super_admin roles — non-admin users
  // get redirected to /dashboard by ProtectedRoute.
  return (
    <ProtectedRoute allowedRoles={["org_admin", "super_admin"]}>
      <EurekaNav />
      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[200px_1fr] gap-6">
        <aside className="border rounded-md p-2 h-fit">
          <ul className="space-y-0.5 text-sm">
            {TABS.map((t) => {
              const active =
                pathname === t.href ||
                (t.href !== "/admin" && pathname.startsWith(t.href));
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className={`block px-3 py-1.5 rounded transition-colors ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
