"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EurekaNav } from "@/components/eureka-nav";

const TABS = [
  { href: "/settings", label: "Overview" },
  { href: "/settings/subscription", label: "Subscription" },
  { href: "/settings/api-keys", label: "API keys" },
  { href: "/settings/webhooks", label: "Webhooks" },
  { href: "/settings/devices", label: "Devices" },
  { href: "/settings/support", label: "Support" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  return (
    <>
      <EurekaNav />
      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[200px_1fr] gap-6">
        <aside className="border rounded-md p-2 h-fit">
          <ul className="space-y-0.5 text-sm">
            {TABS.map((t) => {
              const active =
                pathname === t.href ||
                (t.href !== "/settings" && pathname.startsWith(t.href));
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className={`block px-3 py-1.5 rounded transition-colors ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </>
  );
}
