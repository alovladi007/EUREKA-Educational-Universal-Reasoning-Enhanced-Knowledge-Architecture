"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Entry = {
  href: string;
  title: string;
  description: string;
};

const ENTRIES: Entry[] = [
  {
    href: "/admin",
    title: "Operations console",
    description: "Phase 14 ops dashboard: health, metrics, and runbooks.",
  },
  {
    href: "/admin/cohorts",
    title: "Cohorts",
    description: "Phase 9 cohort management and at-risk monitoring.",
  },
  {
    href: "/admin/jobs",
    title: "Jobs",
    description: "Phase 14.2 background-job inspector and retries.",
  },
  {
    href: "/admin/audit",
    title: "Audit log",
    description: "Phase 13.5 audit trail across the platform.",
  },
  {
    href: "/institutions",
    title: "Institutions",
    description: "Phase 15 L&D admin: orgs, programs, learners.",
  },
  {
    href: "/institutions/graduate-programs",
    title: "Graduate programs",
    description: "Phase 16.1 graduate program management.",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-muted-foreground">
          Jump into the platform's admin surfaces.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ENTRIES.map((e) => (
          <Link key={e.href} href={e.href} className="block">
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-lg">{e.title}</CardTitle>
                <CardDescription>{e.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs font-mono text-muted-foreground">
                  {e.href}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Admin requires <code>org_admin</code> or <code>super_admin</code> role.
      </p>
    </div>
  );
}
