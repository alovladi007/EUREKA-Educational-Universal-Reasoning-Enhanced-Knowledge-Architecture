"use client";

/**
 * Phase 15 — Institution overview dashboard.
 * Aggregates the org's partnerships and surfaces top-line KPIs.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import {
  Building2,
  Users,
  ClipboardList,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

type Partnership = {
  id: string;
  name: string;
  partnership_kind: string;
  contracted_seats: number;
  status: string;
};

type Analytics = {
  active_seats: number;
  contracted_seats: number;
  programs_active: number;
  assignments_total: number;
  assignments_overdue: number;
  compliance_overdue: number;
  compliance_due_soon: number;
};

export default function InstitutionsOverview() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [agg, setAgg] = useState<Analytics>({
    active_seats: 0,
    contracted_seats: 0,
    programs_active: 0,
    assignments_total: 0,
    assignments_overdue: 0,
    compliance_overdue: 0,
    compliance_due_soon: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ps = await api<Partnership[]>("/partnerships");
        setPartnerships(ps);
        // Aggregate analytics across all partnerships
        const a = { ...agg };
        for (const p of ps) {
          try {
            const x = await api<Analytics>(`/partnerships/${p.id}/analytics`);
            a.active_seats += x.active_seats;
            a.contracted_seats += x.contracted_seats;
            a.programs_active += x.programs_active;
            a.assignments_total += x.assignments_total;
            a.assignments_overdue += x.assignments_overdue;
            a.compliance_overdue += x.compliance_overdue;
            a.compliance_due_soon += x.compliance_due_soon;
          } catch {
            /* skip partnership if analytics fails */
          }
        }
        setAgg(a);
      } catch (e) {
        setError(String((e as Error).message));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Institution overview</h1>
        <p className="text-slate-600">
          Everything your organization manages on EUREKA in one place — partnerships,
          workforce programs, cohorts, compliance, and analytics.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Users} label="Active seats" value={agg.active_seats} sub={`of ${agg.contracted_seats} contracted`} />
        <Stat icon={ClipboardList} label="Active programs" value={agg.programs_active} sub={`${agg.assignments_total} assignments`} />
        <Stat icon={ShieldCheck} label="Compliance overdue" value={agg.compliance_overdue} sub={`${agg.compliance_due_soon} due soon`} tone={agg.compliance_overdue > 0 ? "warn" : "ok"} />
        <Stat icon={Building2} label="Partnerships" value={partnerships.length} sub={`${partnerships.filter(p => p.status === "active").length} active`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your partnerships</CardTitle>
          <CardDescription>
            One partnership per organization. Click any row to manage seats, programs,
            compliance, and analytics for that institution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {partnerships.length === 0 && (
            <div className="text-sm text-slate-600 space-y-2">
              <p>No partnerships yet.</p>
              <Link
                href="/institutions/partnerships"
                className="inline-flex items-center gap-1 text-amber-700 hover:underline"
              >
                Create your first partnership <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}
          <ul className="divide-y">
            {partnerships.map((p) => (
              <li key={p.id} className="py-3">
                <Link
                  href={`/institutions/partnerships/${p.id}`}
                  className="flex items-center gap-4 group"
                >
                  <Building2 className="h-5 w-5 text-amber-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium group-hover:underline">{p.name}</span>
                      <Badge variant={p.status === "active" ? "default" : "outline"}>{p.status}</Badge>
                      <Badge variant="secondary">{p.partnership_kind}</Badge>
                    </div>
                    <div className="text-xs text-slate-500">
                      {p.contracted_seats} contracted seats
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-amber-700" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <QuickLink
          href="/institutions/cohorts"
          title="Cohorts"
          body="Group learners around an exam-prep goal (lighter than a partnership)."
        />
        <QuickLink
          href="/institutions/compliance"
          title="Compliance dashboard"
          body="HIPAA / OSHA / SOC2 / GDPR status across all your seats."
        />
        <QuickLink
          href="/institutions/analytics"
          title="Workforce analytics"
          body="Funnels by team and role across every partnership."
        />
        <QuickLink
          href="/institutions/audit"
          title="Audit log"
          body="Security-relevant events with actor, subject, IP, and severity."
        />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  tone = "ok",
}: {
  icon: typeof Building2;
  label: string;
  value: number;
  sub?: string;
  tone?: "ok" | "warn";
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <Icon
            className={`h-5 w-5 ${tone === "warn" ? "text-red-600" : "text-amber-600"}`}
          />
          <div className="text-right">
            <div className="text-3xl font-bold leading-none">{value}</div>
            <div className="text-[10px] uppercase font-medium text-slate-500 mt-1">
              {label}
            </div>
          </div>
        </div>
        {sub && <div className="text-xs text-slate-500 mt-2">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function QuickLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </div>
          <CardDescription>{body}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
