"use client";

/**
 * Phase 12.1 — Streak / XP / level banner for the learner home.
 * Reads /me/engagement and renders a slim card with the headline numbers.
 */

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/eureka-api";

type EngagementState = {
  current_streak_days: number;
  longest_streak_days: number;
  last_active_on: string | null;
  xp: number;
  level: number;
};

function xpForLevel(level: number): number {
  // Inverse of the server formula `level = 1 + floor(sqrt(xp/100))`.
  return Math.pow(level - 1, 2) * 100;
}

export function EngagementBanner() {
  const [state, setState] = useState<EngagementState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<EngagementState>(`/me/engagement`)
      .then(setState)
      .catch((e) => setError(String(e.detail || e.message)));
  }, []);

  if (error || !state) return null;

  const xpInLevel = state.xp - xpForLevel(state.level);
  const xpToNext = xpForLevel(state.level + 1) - xpForLevel(state.level);
  const pct = Math.min(100, Math.round((xpInLevel / xpToNext) * 100));

  return (
    <Card className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-amber-200">
      <CardContent className="pt-6 flex flex-wrap items-center gap-6">
        <div>
          <div className="text-xs uppercase font-medium text-slate-500">
            Current streak
          </div>
          <div className="text-3xl font-bold text-amber-900">
            🔥 {state.current_streak_days}
            <span className="ml-1 text-base font-medium text-slate-500">
              {state.current_streak_days === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Longest: {state.longest_streak_days}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-600 hover:bg-amber-700">
              Level {state.level}
            </Badge>
            <span className="text-sm text-slate-600">{state.xp} XP</span>
          </div>
          <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {xpInLevel.toLocaleString()} / {xpToNext.toLocaleString()} XP to next level
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
