"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";

interface FreemiumGateProps {
  feature: string;
  description?: string;
  requiredPlan?: "pro" | "team";
  children: ReactNode;
  /** If true, always show children (gate disabled for dev/testing) */
  bypass?: boolean;
}

// In production, this would check user.plan from auth store or a subscription store
function useUserPlan(): "free" | "pro" | "team" {
  // TODO: Read from auth store or subscription API
  // For now, always return "pro" to allow full access during development
  return "pro";
}

export function FreemiumGate({ feature, description, requiredPlan = "pro", children, bypass }: FreemiumGateProps) {
  const currentPlan = useUserPlan();

  // Bypass for development or if user has sufficient plan
  if (bypass || currentPlan === "team" || (currentPlan === "pro" && requiredPlan !== "team")) {
    return <>{children}</>;
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Blurred preview of the gated content */}
      <div className="blur-sm pointer-events-none opacity-50 select-none">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px]">
        <div className="text-center p-6 max-w-xs">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mx-auto">
            <Crown className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="font-semibold mt-3">{feature}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {description || `Upgrade to ${requiredPlan === "team" ? "Team" : "Pro"} to unlock this feature`}
          </p>

          <div className="mt-4 space-y-2">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Zap className="w-4 h-4 mr-2" />
              Upgrade to {requiredPlan === "team" ? "Team — $29/mo" : "Pro — $9/mo"}
            </Button>
            <p className="text-[10px] text-muted-foreground">Cancel anytime. 7-day free trial.</p>
          </div>

          <div className="mt-4 text-left space-y-1.5">
            <p className="text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" /> Unlimited AI writing credits
            </p>
            <p className="text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" /> All 8 premium templates
            </p>
            <p className="text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" /> PDF & DOCX export (no watermark)
            </p>
            <p className="text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" /> ATS score checker
            </p>
            <p className="text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" /> Version history & share analytics
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Simple inline lock badge for gated features
 */
export function ProBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
      <Crown className="w-2.5 h-2.5" /> PRO
    </span>
  );
}
