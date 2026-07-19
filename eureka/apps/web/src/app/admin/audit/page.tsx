"use client";

/**
 * Audit log — org-scoped security event feed with filters + CSV export.
 * The backend now scopes events to the caller's org (super_admin sees all).
 */

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  api,
  formatDate,
  getToken,
  API_URL,
  API_PREFIX,
} from "@/lib/eureka-api";

type AuditEvent = {
  id: number;
  actor_user_id: string | null;
  subject_user_id: string | null;
  org_id: string | null;
  event_name: string;
  severity: string;
  request_ip: string | null;
  user_agent: string | null;
  extra: Record<string, unknown>;
  occurred_at: string;
};

const SEVERITIES = ["info", "warn", "critical"];

export default function AuditPage() {
  const [rows, setRows] = useState<AuditEvent[]>([]);
  const [eventName, setEventName] = useState("");
  const [severity, setSeverity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const query = useCallback(() => {
    const p = new URLSearchParams({ limit: "200" });
    if (eventName.trim()) p.set("event_name", eventName.trim());
    if (severity) p.set("severity", severity);
    return p.toString();
  }, [eventName, severity]);

  const reload = useCallback(async () => {
    setError(null);
    try {
      setRows(await api<AuditEvent[]>(`/admin/audit?${query()}`));
    } catch (e) {
      setError(String((e as Error).message));
    }
  }, [query]);

  useEffect(() => {
    reload();
  }, [reload]);

  // CSV export goes straight to the endpoint (not through api(), which parses
  // JSON) so we can stream the file to a blob download.
  async function downloadCsv() {
    setDownloading(true);
    setError(null);
    try {
      const p = new URLSearchParams();
      if (eventName.trim()) p.set("event_name", eventName.trim());
      if (severity) p.set("severity", severity);
      const res = await fetch(
        `${API_URL}${API_PREFIX}/admin/audit/export?${p.toString()}`,
        { headers: { Authorization: `Bearer ${getToken() || ""}` } },
      );
      if (!res.ok) throw new Error(`Export failed (HTTP ${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "audit-log.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Audit log</h1>
        <p className="text-slate-600">
          Security-relevant events for your organization.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <Input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && reload()}
            placeholder="Filter by event name (e.g. admin.user.role_change)"
            className="max-w-sm"
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All severities</option>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={reload}>
            Apply
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={downloadCsv}
            disabled={downloading}
          >
            {downloading ? "Exporting…" : "Download CSV"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Events{" "}
            <span className="text-sm font-normal text-slate-500">
              ({rows.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 && (
            <p className="text-slate-500 text-sm">No events match.</p>
          )}
          <ul className="divide-y">
            {rows.map((e) => (
              <li key={e.id} className="py-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      e.severity === "critical"
                        ? "destructive"
                        : e.severity === "warn"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {e.severity}
                  </Badge>
                  <code className="text-xs">{e.event_name}</code>
                  <span className="text-xs text-slate-500">
                    {formatDate(e.occurred_at)}
                  </span>
                  {e.request_ip && (
                    <span className="text-xs text-slate-500 ml-auto">
                      from {e.request_ip}
                    </span>
                  )}
                </div>
                {(e.actor_user_id || e.subject_user_id) && (
                  <div className="text-xs text-slate-500 ml-1 mt-0.5">
                    actor {e.actor_user_id?.slice(0, 8) || "—"} · subject{" "}
                    {e.subject_user_id?.slice(0, 8) || "—"}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
