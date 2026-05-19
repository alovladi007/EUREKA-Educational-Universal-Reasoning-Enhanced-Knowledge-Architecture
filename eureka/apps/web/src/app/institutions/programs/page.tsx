"use client";

/**
 * Cross-partnership view of all programs the institution authors.
 * (Per-partnership management is on the partnership detail page.)
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";
import { ClipboardList } from "lucide-react";

type Partnership = { id: string; name: string };
type Program = {
  id: string;
  partnership_id: string;
  slug: string;
  name: string;
  target_role: string | null;
  target_skill_codes: string[];
  duration_weeks: number;
  is_mandatory: boolean;
  status: string;
  created_at: string;
};

export default function ProgramsAcrossPartnershipsPage() {
  const [data, setData] = useState<{ partnership: Partnership; programs: Program[] }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ps = await api<Partnership[]>("/partnerships");
        const out: { partnership: Partnership; programs: Program[] }[] = [];
        for (const p of ps) {
          try {
            const programs = await api<Program[]>(`/partnerships/${p.id}/programs`);
            out.push({ partnership: p, programs });
          } catch {
            out.push({ partnership: p, programs: [] });
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
        <h1 className="text-3xl font-bold mb-1">Programs</h1>
        <p className="text-slate-600">
          Role-based curricula across all your partnerships. Click a partnership to author
          new programs or assign workers.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data.length === 0 && !error && <p className="text-slate-500">Loading…</p>}

      {data.map(({ partnership, programs }) => (
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
            <CardDescription>{programs.length} program{programs.length === 1 ? "" : "s"}</CardDescription>
          </CardHeader>
          <CardContent>
            {programs.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No programs yet.{" "}
                <Link
                  href={`/institutions/partnerships/${partnership.id}`}
                  className="text-amber-700 hover:underline"
                >
                  Create one →
                </Link>
              </p>
            ) : (
              <ul className="divide-y">
                {programs.map((pr) => (
                  <li key={pr.id} className="py-3 flex items-center gap-3">
                    <ClipboardList className="h-4 w-4 text-amber-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{pr.name}</span>
                        <Badge variant={pr.status === "active" ? "default" : "outline"}>{pr.status}</Badge>
                        {pr.is_mandatory && <Badge variant="destructive">mandatory</Badge>}
                        {pr.target_role && <Badge variant="secondary">{pr.target_role}</Badge>}
                      </div>
                      <div className="text-xs text-slate-500">
                        {pr.duration_weeks} weeks · {pr.target_skill_codes.length} skill target{pr.target_skill_codes.length === 1 ? "" : "s"} ·
                        created {formatDate(pr.created_at)}
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
