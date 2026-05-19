"use client";

/**
 * Cross-partnership view of seat utilisation.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";

type Partnership = { id: string; name: string };
type SeatUtil = {
  contracted_seats: number;
  active_seats: number;
  available_seats: number;
  by_team: Record<string, number>;
  by_role: Record<string, number>;
};

export default function WorkersPage() {
  const [data, setData] = useState<{ p: Partnership; u: SeatUtil }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ps = await api<Partnership[]>("/partnerships");
        const out: { p: Partnership; u: SeatUtil }[] = [];
        for (const p of ps) {
          try {
            const u = await api<SeatUtil>(`/partnerships/${p.id}/seat-utilisation`);
            out.push({ p, u });
          } catch {/* skip */}
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
        <h1 className="text-3xl font-bold mb-1">Workers (seats)</h1>
        <p className="text-slate-600">
          Active seat licences across every partnership, with team and role breakdowns.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data.length === 0 && !error && <p className="text-slate-500">Loading…</p>}

      {data.map(({ p, u }) => (
        <Card key={p.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <Link
                href={`/institutions/partnerships/${p.id}`}
                className="text-sm text-amber-700 hover:underline"
              >
                Manage seats →
              </Link>
            </div>
            <CardDescription>
              {u.active_seats} active / {u.contracted_seats} contracted · {u.available_seats} available
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs uppercase font-medium text-slate-500 mb-1">By team</div>
              <ul className="text-sm divide-y">
                {Object.entries(u.by_team).map(([k, v]) => (
                  <li key={k} className="py-1 flex justify-between">
                    <span>{k}</span>
                    <Badge variant="outline">{v}</Badge>
                  </li>
                ))}
                {Object.keys(u.by_team).length === 0 && (
                  <li className="py-1 text-slate-500">No seats yet</li>
                )}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase font-medium text-slate-500 mb-1">By role</div>
              <ul className="text-sm divide-y">
                {Object.entries(u.by_role).map(([k, v]) => (
                  <li key={k} className="py-1 flex justify-between">
                    <span>{k}</span>
                    <Badge variant="outline">{v}</Badge>
                  </li>
                ))}
                {Object.keys(u.by_role).length === 0 && (
                  <li className="py-1 text-slate-500">No seats yet</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
