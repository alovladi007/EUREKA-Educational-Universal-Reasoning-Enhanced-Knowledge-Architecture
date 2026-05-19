"use client";

/**
 * Cross-partnership compliance dashboard.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import { ShieldCheck } from "lucide-react";

type Partnership = { id: string; name: string };
type Requirement = {
  id: string;
  code: string;
  name: string;
  regulation: string;
  recurrence_months: number;
  is_active: boolean;
};

export default function CompliancePage() {
  const [data, setData] = useState<{ partnership: Partnership; reqs: Requirement[] }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ps = await api<Partnership[]>("/partnerships");
        const out: { partnership: Partnership; reqs: Requirement[] }[] = [];
        for (const p of ps) {
          try {
            const reqs = await api<Requirement[]>(`/partnerships/${p.id}/compliance`);
            out.push({ partnership: p, reqs });
          } catch {
            out.push({ partnership: p, reqs: [] });
          }
        }
        setData(out);
      } catch (e) {
        setError(String((e as Error).message));
      }
    })();
  }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Compliance</h1>
        <p className="text-slate-600">
          HIPAA / OSHA / SOC2 / GDPR and other regulatory requirements per partnership.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data.length === 0 && !error && <p className="text-slate-500">Loading…</p>}

      {data.map(({ partnership, reqs }) => (
        <Card key={partnership.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{partnership.name}</CardTitle>
              <Link
                href={`/institutions/partnerships/${partnership.id}`}
                className="text-sm text-amber-700 hover:underline"
              >
                Manage →
              </Link>
            </div>
            <CardDescription>{reqs.length} requirement{reqs.length === 1 ? "" : "s"}</CardDescription>
          </CardHeader>
          <CardContent>
            {reqs.length === 0 ? (
              <p className="text-slate-500 text-sm">No requirements yet.</p>
            ) : (
              <ul className="divide-y">
                {reqs.map((r) => (
                  <li key={r.id} className="py-3 flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{r.name}</span>
                        <Badge variant="outline" className="uppercase text-[10px]">{r.regulation}</Badge>
                        <Badge variant={r.is_active ? "default" : "outline"}>
                          {r.is_active ? "active" : "paused"}
                        </Badge>
                        <code className="text-xs text-slate-500">{r.code}</code>
                      </div>
                      <div className="text-xs text-slate-500">
                        Refresh every {r.recurrence_months || "—"} months
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
