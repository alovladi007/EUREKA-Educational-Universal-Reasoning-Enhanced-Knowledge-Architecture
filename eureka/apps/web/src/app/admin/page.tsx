"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminIndex() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Admin</h1>
        <p className="text-slate-600">
          Org-admin / super-admin tooling. Requires role <code>org_admin</code> or higher.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            href: "/admin/cohorts",
            title: "Cohorts (Phase 9)",
            body: "Cohort lifecycle, members, blueprints, at-risk early-warning.",
          },
          {
            href: "/admin/jobs",
            title: "Background jobs (Phase 14)",
            body: "Queue depth, recent runs, run-once trigger.",
          },
          {
            href: "/admin/audit",
            title: "Audit log (Phase 13.5)",
            body: "Security-relevant events with actor + subject + IP.",
          },
        ].map((p) => (
          <Link key={p.href} href={p.href}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.body}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-slate-500">Open →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
