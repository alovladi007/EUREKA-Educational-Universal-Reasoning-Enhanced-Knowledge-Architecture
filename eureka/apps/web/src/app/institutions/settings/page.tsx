"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

const ITEMS = [
  { href: "/settings/subscription", title: "Plan & billing",
    body: "Manage your subscription, view invoices, switch plans with proration preview." },
  { href: "/settings/api-keys", title: "API keys",
    body: "Mint org-owned API keys with scopes and rate limits." },
  { href: "/settings/webhooks", title: "Webhooks",
    body: "Subscribe to platform events for HRIS / LMS integration." },
  { href: "/settings/support", title: "Support tickets + KB",
    body: "Open a ticket or search the knowledge base." },
];

export default function InstitutionSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-slate-600">
          Account-level configuration. These pages live under <code>/settings</code> and
          apply across the whole organization.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {ITEMS.map((it) => (
          <Link key={it.href} href={it.href}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{it.title}</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </div>
                <CardDescription>{it.body}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
