"use client";

import { useEffect, useState } from "react";
import { Calculator, Flame, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// "One product feel" (Integration Plan S5): the EUREKA dashboard surfaces the
// learner's AXIOM mathematics progress -- mastery, XP, level, streak -- fetched
// straight from the AXIOM API with the same EUREKA JWT (AXIOM verifies it via
// the shared HS256 secret). Opening AXIOM reuses the sidebar's token-hash
// handoff so the user lands signed in.
const AXIOM_API_URL =
  process.env.NEXT_PUBLIC_AXIOM_API_URL || "http://localhost:8400";
const AXIOM_WEB_URL =
  process.env.NEXT_PUBLIC_AXIOM_WEB_URL || "http://localhost:4100";

type Stats = {
  xp: number;
  level: number;
  streak: number;
  mastered: number;
  skills: number;
};

export function AxiomMathCard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("access_token")
        : null;
    if (!token) {
      setState("unavailable");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${AXIOM_API_URL}/api/v1/gamification/me`, { headers }).then((r) =>
        r.ok ? r.json() : null,
      ),
      fetch(`${AXIOM_API_URL}/api/v1/adaptive/mastery/me`, { headers }).then(
        (r) => (r.ok ? r.json() : null),
      ),
    ])
      .then(([game, mastery]) => {
        if (!game && !mastery) {
          setState("unavailable");
          return;
        }
        const rows: Array<{ p_known?: number; level?: string }> = Array.isArray(
          mastery,
        )
          ? mastery
          : (mastery?.mastery ?? []);
        setStats({
          xp: game?.xp_total ?? 0,
          level: game?.level ?? 1,
          streak: game?.streak_days ?? game?.streak ?? 0,
          mastered: rows.filter(
            (m) => (m.p_known ?? 0) >= 0.85 || m.level === "mastered",
          ).length,
          skills: rows.length,
        });
        setState("ready");
      })
      .catch(() => setState("unavailable"));
  }, []);

  const openAxiom = () => {
    try {
      const token = window.localStorage.getItem("access_token");
      const base = `${AXIOM_WEB_URL}/dashboard`;
      window.open(
        token ? `${base}#access_token=${encodeURIComponent(token)}` : base,
        "_blank",
        "noopener",
      );
    } catch {
      window.open(AXIOM_WEB_URL, "_blank", "noopener");
    }
  };

  if (state === "unavailable") return null; // AXIOM down or signed out: stay quiet

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Calculator className="h-4 w-4" /> Mathematics (AXIOM)
        </CardTitle>
        <Button size="sm" variant="outline" onClick={openAxiom}>
          Open AXIOM
        </Button>
      </CardHeader>
      <CardContent>
        {state === "loading" || !stats ? (
          <p className="text-sm text-muted-foreground">Loading your progress…</p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span>
              <strong>{stats.mastered}</strong> of{" "}
              <strong>{stats.skills}</strong> skills mastered
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" /> {stats.xp} XP · level{" "}
              {stats.level}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" /> {stats.streak}-day streak
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
