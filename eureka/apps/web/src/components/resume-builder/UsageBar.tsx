"use client";

import { useSubscriptionStore } from "@/stores/subscription";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Download, Target, Zap } from "lucide-react";

export function UsageBar() {
  const { plan, aiCreditsUsed, aiCreditsMax, exportsUsed, exportsMax, atsChecksUsed, atsChecksMax } = useSubscriptionStore();

  if (plan === "pro" || plan === "team") {
    return (
      <Card className="p-3 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            {plan === "team" ? "Team Plan" : "Pro Plan"} — Unlimited
          </span>
        </div>
      </Card>
    );
  }

  const aiPct = aiCreditsMax === Infinity ? 0 : (aiCreditsUsed / aiCreditsMax) * 100;
  const exportPct = exportsMax === Infinity ? 0 : (exportsUsed / exportsMax) * 100;

  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold flex items-center gap-1">
          <Zap className="w-3 h-3" /> Free Plan Usage
        </span>
        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-amber-600 hover:text-amber-700">
          <Crown className="w-3 h-3 mr-0.5" /> Upgrade to Pro
        </Button>
      </div>

      {/* AI Credits */}
      <div>
        <div className="flex justify-between text-[10px] mb-0.5">
          <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> AI Credits</span>
          <span>{aiCreditsUsed}/{aiCreditsMax}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${Math.min(aiPct, 100)}%` }} />
        </div>
      </div>

      {/* Exports */}
      <div>
        <div className="flex justify-between text-[10px] mb-0.5">
          <span className="flex items-center gap-1"><Download className="w-2.5 h-2.5" /> PDF Exports</span>
          <span>{exportsUsed}/{exportsMax}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(exportPct, 100)}%` }} />
        </div>
      </div>

      {/* ATS */}
      <div>
        <div className="flex justify-between text-[10px] mb-0.5">
          <span className="flex items-center gap-1"><Target className="w-2.5 h-2.5" /> ATS Checks</span>
          <span>{atsChecksUsed}/{atsChecksMax}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min((atsChecksUsed / atsChecksMax) * 100, 100)}%` }} />
        </div>
      </div>
    </Card>
  );
}
