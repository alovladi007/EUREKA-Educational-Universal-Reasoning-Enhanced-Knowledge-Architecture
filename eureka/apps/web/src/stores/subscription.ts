import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PlanType = "free" | "pro" | "team";

interface SubscriptionStore {
  plan: PlanType;
  aiCreditsUsed: number;
  aiCreditsMax: number;
  exportsUsed: number;
  exportsMax: number;
  atsChecksUsed: number;
  atsChecksMax: number;
  resetDate: string; // ISO date of next reset

  // Actions
  setPlan: (plan: PlanType) => void;
  useAICredit: () => boolean; // returns false if limit reached
  useExportCredit: () => boolean;
  useATSCredit: () => boolean;
  canUseAI: () => boolean;
  canExport: () => boolean;
  canUseATS: () => boolean;
  resetMonthlyCredits: () => void;
  isFeatureAvailable: (feature: string) => boolean;
}

const PLAN_LIMITS = {
  free: { ai: 5, exports: 3, ats: 1, templates: 3, versions: 3 },
  pro: { ai: Infinity, exports: Infinity, ats: Infinity, templates: 8, versions: Infinity },
  team: { ai: Infinity, exports: Infinity, ats: Infinity, templates: 8, versions: Infinity },
};

const FREE_TEMPLATES = ["meridian", "atlas", "scholar"];

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      plan: "free" as PlanType,
      aiCreditsUsed: 0,
      aiCreditsMax: PLAN_LIMITS.free.ai,
      exportsUsed: 0,
      exportsMax: PLAN_LIMITS.free.exports,
      atsChecksUsed: 0,
      atsChecksMax: PLAN_LIMITS.free.ats,
      resetDate: getNextResetDate(),

      setPlan: (plan) => {
        const limits = PLAN_LIMITS[plan];
        set({
          plan,
          aiCreditsMax: limits.ai,
          exportsMax: limits.exports,
          atsChecksMax: limits.ats,
        });
      },

      useAICredit: () => {
        const { plan, aiCreditsUsed } = get();
        const max = PLAN_LIMITS[plan].ai;
        if (aiCreditsUsed >= max) return false;
        set({ aiCreditsUsed: aiCreditsUsed + 1 });
        return true;
      },

      useExportCredit: () => {
        const { plan, exportsUsed } = get();
        const max = PLAN_LIMITS[plan].exports;
        if (exportsUsed >= max) return false;
        set({ exportsUsed: exportsUsed + 1 });
        return true;
      },

      useATSCredit: () => {
        const { plan, atsChecksUsed } = get();
        const max = PLAN_LIMITS[plan].ats;
        if (atsChecksUsed >= max) return false;
        set({ atsChecksUsed: atsChecksUsed + 1 });
        return true;
      },

      canUseAI: () => {
        const { plan, aiCreditsUsed } = get();
        return aiCreditsUsed < PLAN_LIMITS[plan].ai;
      },

      canExport: () => {
        const { plan, exportsUsed } = get();
        return exportsUsed < PLAN_LIMITS[plan].exports;
      },

      canUseATS: () => {
        const { plan, atsChecksUsed } = get();
        return atsChecksUsed < PLAN_LIMITS[plan].ats;
      },

      resetMonthlyCredits: () => {
        set({ aiCreditsUsed: 0, exportsUsed: 0, atsChecksUsed: 0, resetDate: getNextResetDate() });
      },

      isFeatureAvailable: (feature) => {
        const { plan } = get();
        const gatedFeatures: Record<string, PlanType> = {
          ai: "free", // Available but limited
          ats: "free",
          docx_export: "pro",
          custom_slug: "pro",
          share_analytics: "pro",
          version_history: "pro",
          photo_upload: "pro",
          all_templates: "pro",
          team_sharing: "team",
        };
        const required = gatedFeatures[feature];
        if (!required) return true;
        if (required === "free") return true;
        if (required === "pro") return plan === "pro" || plan === "team";
        if (required === "team") return plan === "team";
        return false;
      },
    }),
    {
      name: "eureka-resume-subscription",
      partialize: (state) => ({
        plan: state.plan,
        aiCreditsUsed: state.aiCreditsUsed,
        exportsUsed: state.exportsUsed,
        atsChecksUsed: state.atsChecksUsed,
        resetDate: state.resetDate,
      }),
    }
  )
);

function getNextResetDate(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toISOString();
}

export { FREE_TEMPLATES };
