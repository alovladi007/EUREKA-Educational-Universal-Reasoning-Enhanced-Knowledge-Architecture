"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Entry = {
  href: string;
  title: string;
  description: string;
};

const ENTRIES: Entry[] = [
  {
    href: "/settings/subscription",
    title: "Subscription & billing",
    description: "Manage your plan, payment method, and invoices.",
  },
  {
    href: "/settings/api-keys",
    title: "API keys",
    description: "Create and revoke API keys for programmatic access.",
  },
  {
    href: "/settings/webhooks",
    title: "Webhooks",
    description: "Configure outbound webhook endpoints and signing secrets.",
  },
  {
    href: "/settings/devices",
    title: "Devices",
    description: "Manage push-notification devices registered to your account.",
  },
  {
    href: "/settings/support",
    title: "Support & knowledge base",
    description: "Open a support ticket or browse help articles.",
  },
  {
    href: "/dashboard/profile",
    title: "Profile",
    description: "Update your display name, avatar, and learner profile.",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Account and platform configuration.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ENTRIES.map((e) => (
          <Link key={e.href} href={e.href} className="block">
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle className="text-lg">{e.title}</CardTitle>
                <CardDescription>{e.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs font-mono text-muted-foreground">
                  {e.href}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        These open the real Phase 9-15 settings screens.
      </p>
    </div>
  );
}
