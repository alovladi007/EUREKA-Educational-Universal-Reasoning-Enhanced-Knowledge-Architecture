"use client";

/**
 * Phase 9.1 — Cohort admin console.
 * List + create, drill into at-risk + analytics for any cohort.
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type Cohort = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  target_skill_codes: string[];
  target_mastery: number;
  min_weekly_attempts: number;
  status: string;
  created_at: string;
};

type AtRiskRow = {
  user_id: string;
  email: string | null;
  combined: number;
  at_risk: boolean;
  score_mastery: number;
  score_engagement: number;
  score_trajectory: number;
  score_mock: number;
  notes: string[];
};

export default function CohortsPage() {
  const [rows, setRows] = useState<Cohort[]>([]);
  const [selected, setSelected] = useState<Cohort | null>(null);
  const [atRisk, setAtRisk] = useState<AtRiskRow[] | null>(null);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [targetSkills, setTargetSkills] = useState("STEP1.CARD.HF");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      setRows(await api<Cohort[]>("/cohorts"));
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      await api(`/cohorts`, {
        method: "POST",
        body: JSON.stringify({
          slug,
          name,
          target_skill_codes: targetSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      setSlug("");
      setName("");
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function showAtRisk(c: Cohort) {
    setSelected(c);
    setAtRisk(null);
    try {
      setAtRisk(await api<AtRiskRow[]>(`/cohorts/${c.id}/at-risk`));
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Cohorts</h1>
        <p className="text-slate-600">
          Group learners around a target exam + mastery threshold.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create cohort</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="usmle-2027-summer"
            />
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Target skill codes (comma-separated)</Label>
            <Input
              value={targetSkills}
              onChange={(e) => setTargetSkills(e.target.value)}
            />
          </div>
          <Button onClick={create} disabled={busy || !slug || !name}>
            Create
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All cohorts</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 && (
            <p className="text-slate-500 text-sm">No cohorts yet.</p>
          )}
          <ul className="divide-y">
            {rows.map((c) => (
              <li key={c.id} className="py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{c.name}</span>
                    <Badge variant="outline">{c.status}</Badge>
                    <code className="text-xs text-slate-500">{c.slug}</code>
                  </div>
                  <div className="text-xs text-slate-500">
                    target ≥ {Number(c.target_mastery) * 100}% on{" "}
                    {c.target_skill_codes.join(", ") || "—"} · created{" "}
                    {formatDate(c.created_at)}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => showAtRisk(c)}>
                  At-risk
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              At-risk learners — {selected.name}
            </CardTitle>
            <CardDescription>
              Ranked by combined risk score. Notes explain which signal triggered the flag.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {atRisk === null && <p className="text-slate-500 text-sm">Loading…</p>}
            {atRisk && atRisk.length === 0 && (
              <p className="text-slate-500 text-sm">No learners ranked yet.</p>
            )}
            <ul className="divide-y">
              {atRisk?.map((r) => (
                <li key={r.user_id} className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{r.user_id.slice(0, 8)}…</span>
                    {r.at_risk && <Badge variant="destructive">at risk</Badge>}
                    <span className="text-sm">
                      combined {Number(r.combined).toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500">
                      mastery {Number(r.score_mastery).toFixed(2)} · engagement{" "}
                      {Number(r.score_engagement).toFixed(2)} · trajectory{" "}
                      {Number(r.score_trajectory).toFixed(2)} · mock{" "}
                      {Number(r.score_mock).toFixed(2)}
                    </span>
                  </div>
                  {r.notes.length > 0 && (
                    <ul className="text-xs text-slate-500 ml-4 mt-1 list-disc">
                      {r.notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
