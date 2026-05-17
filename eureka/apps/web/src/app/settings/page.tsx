"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PANELS = [
  {
    href: "/settings/subscription",
    title: "Subscription",
    body: "Plan, trial status, change plan with proration preview.",
  },
  {
    href: "/settings/api-keys",
    title: "API keys",
    body: "Mint personal API keys with scopes + rate limits.",
  },
  {
    href: "/settings/webhooks",
    title: "Webhooks",
    body: "Subscribe to platform events with HMAC-signed delivery.",
  },
  {
    href: "/settings/devices",
    title: "Devices",
    body: "Registered push-notification devices.",
  },
  {
    href: "/settings/support",
    title: "Support",
    body: "Open a ticket or browse the knowledge base.",
  },
];

export default function SettingsIndex() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-slate-600">
          Account preferences, billing, and developer access.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {PANELS.map((p) => (
          <Link key={p.href} href={p.href}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{p.title}</CardTitle>
                <CardDescription>{p.body}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-slate-500">Open →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
