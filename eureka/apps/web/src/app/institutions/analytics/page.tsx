"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";

type Partnership = { id: string; name: string };
type Analytics = {
  active_seats: number;
  contracted_seats: number;
  programs_active: number;
  assignments_total: number;
  assignments_overdue: number;
  compliance_overdue: number;
  compliance_due_soon: number;
  by_team: { label: string; seat_count: number; in_progress: number; completed: number; overdue: number }[];
  by_role: { label: string; seat_count: number; in_progress: number; completed: number; overdue: number }[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<{ p: Partnership; a: Analytics }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ps = await api<Partnership[]>("/partnerships");
        const out: { p: Partnership; a: Analytics }[] = [];
        for (const p of ps) {
          try {
            const a = await api<Analytics>(`/partnerships/${p.id}/analytics`);
            out.push({ p, a });
          } catch {/* skip */}
        }
        setData(out);
      } catch (e) {
        setError(String((e as Error).message));
      }
    })();
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Workforce analytics</h1>
        <p className="text-slate-600">
          Funnels by team and role per partnership.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data.length === 0 && !error && <p className="text-slate-500">Loading…</p>}

      {data.map(({ p, a }) => (
        <Card key={p.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <Link
                href={`/institutions/partnerships/${p.id}`}
                className="text-sm text-amber-700 hover:underline"
              >
                Open partnership →
              </Link>
            </div>
            <CardDescription>
              {a.active_seats} seats · {a.programs_active} programs · {a.assignments_overdue} assignments overdue · {a.compliance_overdue} compliance overdue
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Funnel title="By team" rows={a.by_team} />
            <Funnel title="By role" rows={a.by_role} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Funnel({ title, rows }: { title: string; rows: { label: string; seat_count: number; in_progress: number; completed: number; overdue: number }[] }) {
  return (
    <div>
      <div className="text-xs uppercase font-medium text-slate-500 mb-2">{title}</div>
      <table className="w-full text-sm">
        <thead className="text-xs text-slate-500 uppercase">
          <tr>
            <th className="text-left">Label</th>
            <th>Seats</th>
            <th>In progress</th>
            <th>Done</th>
            <th>Overdue</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td className="py-2 text-slate-500" colSpan={5}>No data yet</td></tr>
          )}
          {rows.map((r) => (
            <tr key={r.label} className="border-t">
              <td className="py-1">{r.label}</td>
              <td className="text-center">{r.seat_count}</td>
              <td className="text-center">{r.in_progress}</td>
              <td className="text-center">{r.completed}</td>
              <td className="text-center">{r.overdue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
