"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/eureka-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Skill = {
  id?: string;
  code?: string | null;
  framework?: string | null;
  name?: string | null;
};

const LEARNING_MODEL: { n: string; text: string }[] = [
  {
    n: "1",
    text:
      "Skill graph from Phase 4.2 — 8 frameworks, cross-tier prereq edges.",
  },
  {
    n: "2",
    text: "IRT 2-PL difficulty calibration per item (Phase 7.2).",
  },
  {
    n: "3",
    text: "FSRS-lite spaced repetition (Phase 7.5).",
  },
  {
    n: "4",
    text: "Socratic hint-ladder via Claude (Phase 6).",
  },
  {
    n: "5",
    text: "Mastery-based recommendations (Phase 4.5).",
  },
];

const REFERENCES = [
  {
    label: "docs/ARCHITECTURE.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/ARCHITECTURE.md",
  },
  {
    label: "docs/STATUS.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/STATUS.md",
  },
];

export default function PedagogyPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await api<Skill[]>("/skills?limit=50").catch(
        () => [] as Skill[],
      );
      if (cancelled) return;
      setSkills(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sample = skills.slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pedagogy</h1>
        <p className="text-muted-foreground">
          How EUREKA&apos;s learning engine is designed — skill graph, item
          calibration, spaced repetition, and Socratic tutoring.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Wired to <code>GET /api/v1/skills?limit=50</code>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning model</CardTitle>
          <CardDescription>
            The five-piece loop EUREKA uses for every learner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {LEARNING_MODEL.map((m) => (
              <li key={m.n} className="flex gap-2">
                <Badge variant="outline" className="shrink-0">
                  {m.n}
                </Badge>
                <span>{m.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live skill graph (sample)</CardTitle>
          <CardDescription>
            First 20 skills returned by the api-core skill registry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : sample.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No skills returned.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sample.map((s, i) => (
                <Badge
                  key={s.id ?? `${s.framework}-${s.code}-${i}`}
                  variant="secondary"
                >
                  {s.framework ?? "—"}: {s.code ?? "—"}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>References</CardTitle>
          <CardDescription>
            Architecture and current status of the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {REFERENCES.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  {r.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
