"use client";

/**
 * Phase 11.1 — Subscription settings.
 *
 * Reads the public plan catalog + the user's current sub. Lets them start
 * (if none), change plan (with proration preview), or cancel at period end.
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatPrice, formatDate } from "@/lib/eureka-api";

type Plan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  interval: string;
  price_cents: number;
  currency: string;
  trial_days: number;
  includes_marketplace_access: boolean;
  includes_unlimited_courses: boolean;
  includes_ai_tutor: boolean;
  includes_mock_exams: boolean;
  perks: string[];
};

type Subscription = {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_end: string | null;
};

type Proration = {
  credit_cents: number;
  new_charge_cents: number;
  net_charge_cents: number;
  period_days: number;
  remaining_days: number;
  description: string;
};

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [msg, setMsg] = useState<{ kind: "info" | "error"; text: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      const [p, s] = await Promise.all([
        api<Plan[]>("/plans", { auth: false }),
        api<Subscription | null>("/me/subscription"),
      ]);
      setPlans(p);
      setSub(s);
    } catch (e) {
      setMsg({ kind: "error", text: String((e as Error).message) });
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function startSub(plan: Plan) {
    setBusy(true);
    setMsg(null);
    try {
      await api(`/me/subscription`, {
        method: "POST",
        body: JSON.stringify({ plan_slug: plan.slug }),
      });
      setMsg({ kind: "info", text: `Started ${plan.name}.` });
      await reload();
    } catch (e) {
      setMsg({ kind: "error", text: String((e as Error).message) });
    } finally {
      setBusy(false);
    }
  }

  async function changePlan(plan: Plan) {
    setBusy(true);
    setMsg(null);
    try {
      const prorate = await api<Proration>(`/me/subscription/change`, {
        method: "POST",
        body: JSON.stringify({ plan_slug: plan.slug, apply_proration: true }),
      });
      setMsg({
        kind: "info",
        text: `Switched to ${plan.name}. Net charge ${formatPrice(
          prorate.net_charge_cents,
          plan.currency,
        )} (credit ${formatPrice(prorate.credit_cents, plan.currency)}).`,
      });
      await reload();
    } catch (e) {
      setMsg({ kind: "error", text: String((e as Error).message) });
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    setMsg(null);
    try {
      await api(`/me/subscription/cancel?at_period_end=true`, { method: "POST" });
      setMsg({ kind: "info", text: "Canceled at period end." });
      await reload();
    } catch (e) {
      setMsg({ kind: "error", text: String((e as Error).message) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Subscription</h1>
        <p className="text-slate-600">
          Manage your plan. Changes prorate against the remainder of the current period.
        </p>
      </div>

      {msg && (
        <Alert variant={msg.kind === "error" ? "destructive" : "default"}>
          <AlertTitle>{msg.kind === "error" ? "Error" : "Done"}</AlertTitle>
          <AlertDescription>{msg.text}</AlertDescription>
        </Alert>
      )}

      {sub && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-3">
              Current subscription
              <Badge>{sub.status}</Badge>
              {sub.cancel_at_period_end && (
                <Badge variant="outline">cancels at period end</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Period: {formatDate(sub.current_period_start)} → {formatDate(sub.current_period_end)}
              {sub.trial_end ? ` · trial ends ${formatDate(sub.trial_end)}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sub.cancel_at_period_end && (
              <Button
                variant="outline"
                onClick={cancel}
                disabled={busy}
              >
                Cancel at period end
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((p) => {
          const current = sub && p.id === sub.plan_id;
          return (
            <Card key={p.id} className={current ? "border-amber-400" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {p.name}
                  {current && <Badge>current</Badge>}
                </CardTitle>
                <CardDescription>{p.description || ""}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-2xl font-bold">
                    {formatPrice(p.price_cents, p.currency)}
                    <span className="text-sm font-normal text-slate-500">
                      {" "}
                      / {p.interval}
                    </span>
                  </div>
                  {p.trial_days > 0 && (
                    <p className="text-xs text-slate-500">
                      {p.trial_days}-day free trial
                    </p>
                  )}
                </div>
                <ul className="text-sm space-y-1 text-slate-700">
                  {p.includes_ai_tutor && <li>· AI tutor</li>}
                  {p.includes_mock_exams && <li>· Full mock exams</li>}
                  {p.includes_marketplace_access && <li>· Marketplace access</li>}
                  {p.includes_unlimited_courses && <li>· Unlimited courses</li>}
                  {p.perks.map((perk) => (
                    <li key={perk}>· {perk}</li>
                  ))}
                </ul>
                {!sub ? (
                  <Button
                    className="w-full"
                    disabled={busy}
                    onClick={() => startSub(p)}
                  >
                    {p.trial_days > 0 ? "Start free trial" : "Subscribe"}
                  </Button>
                ) : current ? (
                  <Button className="w-full" disabled variant="secondary">
                    Current plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant="outline"
                    disabled={busy}
                    onClick={() => changePlan(p)}
                  >
                    Switch to this plan
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
