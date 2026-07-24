"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/eureka-api";
import { useAuthStore } from "@/stores/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AuditEvent = {
  id?: string;
  actor_user_id?: string | null;
  action?: string | null;
  // The audit API returns `occurred_at`; `created_at` was always undefined
  // here so the timestamp column rendered blank.
  occurred_at?: string | null;
};
type AuditResp = { events: AuditEvent[] } | AuditEvent[] | null | undefined;

type ComplianceItem = {
  id?: string;
  requirement_id?: string | null;
  name?: string | null;
  title?: string | null;
  status?: string | null;
  due_at?: string | null;
};

const RUNBOOKS: { label: string; href: string }[] = [
  {
    label: "docs/SECURITY.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/SECURITY.md",
  },
  {
    label: "docs/SECRETS.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/SECRETS.md",
  },
  {
    label: "docs/OBSERVABILITY.md",
    href: "https://github.com/alovladi007/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture/blob/main/docs/OBSERVABILITY.md",
  },
];

export default function EthicsSecurityPage() {
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === "super_admin" || role === "org_admin";
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // The org audit stream is admin-only (server returns 403 otherwise).
      // Only fetch it for admins, so non-admins get an explicit "requires
      // admin" state instead of a silently-empty card.
      const [auditResp, compResp] = await Promise.all([
        isAdmin
          ? api<AuditResp>("/admin/audit?limit=20").catch(
              () => ({ events: [] }) as AuditResp,
            )
          : Promise.resolve({ events: [] } as AuditResp),
        api<ComplianceItem[]>("/me/compliance").catch(
          () => [] as ComplianceItem[],
        ),
      ]);
      if (cancelled) return;
      const auditList: AuditEvent[] = Array.isArray(auditResp)
        ? auditResp
        : Array.isArray(auditResp?.events)
          ? auditResp!.events
          : [];
      setAudit(auditList);
      setCompliance(Array.isArray(compResp) ? compResp : []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ethics &amp; Security</h1>
        <p className="text-muted-foreground">
          Compliance status, recent audit events, and the runbooks that
          actually describe how EUREKA secures data and handles incidents.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Wired to <code>GET /api/v1/me/compliance</code> and{" "}
          <code>GET /api/v1/admin/audit</code>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My compliance status</CardTitle>
          <CardDescription>
            Requirements assigned to you (workforce + institutional). Pulled
            live from the api-core compliance ledger.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : compliance.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No compliance items.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {compliance.map((c, i) => (
                <li
                  key={c.id ?? c.requirement_id ?? i}
                  className="flex flex-wrap items-center gap-2 border-b pb-2 last:border-b-0"
                >
                  <span className="font-medium">
                    {c.name ?? c.title ?? c.requirement_id ?? "Requirement"}
                  </span>
                  {c.status && <Badge variant="outline">{c.status}</Badge>}
                  {c.due_at && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      due {c.due_at}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent audit events (org)</CardTitle>
          <CardDescription>
            Most recent 20 events from the admin audit stream.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isAdmin ? (
            <p className="text-sm text-muted-foreground">
              The organization audit log is available to administrators.
            </p>
          ) : loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : audit.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit events.</p>
          ) : (
            <ul className="space-y-1.5 text-sm font-mono">
              {audit.map((e, i) => (
                <li
                  key={e.id ?? i}
                  className="flex flex-wrap gap-2 border-b pb-1 last:border-b-0"
                >
                  <span className="text-muted-foreground">
                    {e.actor_user_id ? e.actor_user_id.slice(0, 8) : "—"}
                  </span>
                  <span>·</span>
                  <span>{e.action ?? "—"}</span>
                  <span>·</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {e.occurred_at ? new Date(e.occurred_at).toLocaleString() : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reading: Security runbooks</CardTitle>
          <CardDescription>
            The source-of-truth runbooks in the EUREKA repo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {RUNBOOKS.map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  {r.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
