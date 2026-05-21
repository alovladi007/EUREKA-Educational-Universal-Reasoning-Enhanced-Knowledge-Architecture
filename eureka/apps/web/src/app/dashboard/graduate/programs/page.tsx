"use client";

/**
 * /dashboard/graduate/programs — learner-side browser of active graduate
 * programs in their org. Self-enroll via POST /me/graduate/programs/{id}/enroll.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";
import { BookMarked, ExternalLink } from "lucide-react";

type Program = {
  id: string;
  slug: string;
  name: string;
  degree_kind: string;
  department: string | null;
  description_md: string | null;
  target_years: number;
  min_credits: number;
  requires_thesis: boolean;
  requires_qualifying_exam: boolean;
  status: string;
  created_at: string;
};

export default function ProgramsBrowserPage() {
  const [available, setAvailable] = useState<Program[]>([]);
  const [enrolled, setEnrolled] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [avail, all] = await Promise.all([
          api<Program[]>("/me/graduate/available-programs").catch(() => [] as Program[]),
          api<Program[]>("/graduate/programs").catch(() => [] as Program[]),
        ]);
        const availSet = new Set((avail ?? []).map((p) => p.id));
        setAvailable(Array.isArray(avail) ? avail : []);
        setEnrolled((all ?? []).filter((p) => !availSet.has(p.id) && p.status === "active"));
      } catch (e) {
        setError(String((e as Error).message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Graduate programs in your org</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Active programs. Click into one to view details and enroll yourself.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && available.length === 0 && enrolled.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground space-y-2">
            <p>No active graduate programs in your org yet.</p>
            <p className="text-sm">
              Org admins create programs at{" "}
              <Link href="/institutions/graduate-programs" className="text-primary hover:underline">
                /institutions/graduate-programs
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      )}

      {available.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Available to enroll ({available.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {available.map((p) => <ProgramCard key={p.id} p={p} mode="enroll" />)}
          </div>
        </section>
      )}

      {enrolled.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Already enrolled ({enrolled.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {enrolled.map((p) => <ProgramCard key={p.id} p={p} mode="open" />)}
          </div>
        </section>
      )}
    </div>
  );
}

function ProgramCard({ p, mode }: { p: Program; mode: "enroll" | "open" }) {
  return (
    <Link href={`/dashboard/graduate/programs/${p.id}`}>
      <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
        <CardHeader>
          <CardTitle className="text-base flex items-start justify-between gap-2">
            <span className="min-w-0">
              <BookMarked className="h-4 w-4 text-primary inline mr-1 -mt-0.5" />
              {p.name}
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </CardTitle>
          <CardDescription>
            <span className="font-mono text-[11px]">{p.slug}</span>
            {p.department && <span className="ml-2">· {p.department}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline">{p.degree_kind}</Badge>
            {p.requires_thesis && <Badge variant="outline">thesis</Badge>}
            {p.requires_qualifying_exam && <Badge variant="outline">quals</Badge>}
            <Badge variant={mode === "enroll" ? "default" : "secondary"}>
              {mode === "enroll" ? "Available" : "Enrolled"}
            </Badge>
          </div>
          <div className="text-muted-foreground">
            {p.target_years}y · {p.min_credits} credits · created {formatDate(p.created_at)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
