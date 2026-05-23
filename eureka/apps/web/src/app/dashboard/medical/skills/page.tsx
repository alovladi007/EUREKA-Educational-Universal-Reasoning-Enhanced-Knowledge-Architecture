"use client";

/**
 * /dashboard/medical/skills — skill mastery + recommendations for the
 * medical tier, filtered to USMLE / COMLEX / MBE frameworks. Parallel to
 * /dashboard/undergraduate/skills.
 */

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/eureka-api";
import { Target, Sparkles } from "lucide-react";

const FRAMEWORKS = [
  "usmle",
  "usmle_step_1",
  "usmle_step_2",
  "comlex",
  "mbe",
];

type SkillMastery = {
  skill_code: string;
  mastery: number;
  attempts?: number;
  correct_rate?: number;
};

type Recommendation = {
  skill_id?: string;
  framework?: string;
  code?: string;
  name?: string;
  score?: number;
  reason?: unknown;
};

function renderReason(reason: unknown): string {
  if (typeof reason === "string") return reason;
  if (!reason || typeof reason !== "object") return "";
  const obj = reason as Record<string, unknown>;
  const notes = obj.notes;
  if (Array.isArray(notes) && notes.length > 0)
    return (notes as unknown[]).join(" · ");
  const ent = Object.entries(obj)
    .filter(([, v]) => typeof v === "number" && (v as number) > 0)
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${(v as number).toFixed(2)}`);
  return ent.length > 0 ? ent.join(" · ") : "";
}

export default function MedicalSkillsPage() {
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [ms, rs] = await Promise.all([
          api<SkillMastery[]>("/analytics/me/skills").catch(() => []),
          api<Recommendation[]>("/recommendations/me").catch(() => []),
        ]);
        setSkills(Array.isArray(ms) ? ms : []);
        const recList = Array.isArray(rs) ? rs : [];
        setRecs(
          recList.filter(
            (r) =>
              !r.framework ||
              FRAMEWORKS.includes(String(r.framework).toLowerCase()),
          ),
        );
      } catch (e) {
        setError(String((e as Error)?.message ?? e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const topSkills = [...skills].sort((a, b) => b.mastery - a.mastery).slice(0, 8);
  const bottomSkills = [...skills]
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Skills
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Where you stand vs the USMLE / COMLEX / MBE blueprints. Live from{" "}
          <code className="font-mono">/analytics/me/skills</code> and{" "}
          <code className="font-mono">/recommendations/me</code>.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load skills</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && <p className="text-muted-foreground">Loading…</p>}

      {!loading && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill mastery</CardTitle>
              <CardDescription>
                {skills.length === 0
                  ? "No data yet — answer a few QBank questions to seed your mastery profile."
                  : `${skills.length} skills tracked across your enrolment.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                  Strongest
                </h3>
                {topSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {topSkills.map((s) => (
                      <SkillBar
                        key={`top-${s.skill_code}`}
                        s={s}
                        color="bg-emerald-500"
                      />
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                  Needs work
                </h3>
                {bottomSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {bottomSkills.map((s) => (
                      <SkillBar
                        key={`bot-${s.skill_code}`}
                        s={s}
                        color="bg-amber-500"
                      />
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Recommendations
              </CardTitle>
              <CardDescription>
                {recs.length === 0
                  ? "No recommendations yet. Answer a few QBank questions and they'll show up here."
                  : `${recs.length} suggestions filtered to medical frameworks.`}
              </CardDescription>
            </CardHeader>
            {recs.length > 0 && (
              <CardContent>
                <ul className="space-y-2">
                  {recs.slice(0, 12).map((r, i) => (
                    <li
                      key={`${r.skill_id ?? r.code ?? "rec"}-${i}`}
                      className="flex items-start justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <div className="font-medium">
                          {r.name ?? r.code ?? r.skill_id ?? "Untitled"}
                        </div>
                        {r.reason !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {renderReason(r.reason)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {typeof r.score === "number" && (
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {r.score.toFixed(2)}
                          </span>
                        )}
                        <Badge variant="outline" className="uppercase">
                          {r.framework ?? "rec"}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function SkillBar({ s, color }: { s: SkillMastery; color: string }) {
  const pct = Math.round((s.mastery ?? 0) * 100);
  return (
    <li>
      <div className="flex justify-between text-xs">
        <span className="font-medium">{s.skill_code}</span>
        <span className="text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="mt-1 h-2 rounded bg-secondary">
        <div
          className={`h-full rounded ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </li>
  );
}
