"use client";

/**
 * Data & compliance (DSAR) console — org admins export or schedule deletion of
 * a member's data, and track the org's pending requests. Reuses the same
 * compliance service the self-service flow uses; all actions are audit-logged.
 */

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type Member = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string | null;
  role: string;
};
type ExportRow = {
  id: string;
  user_id: string;
  status: string;
  sections: string[];
  payload_jsonb: Record<string, unknown> | null;
  requested_at: string;
  completed_at: string | null;
};
type DeletionRow = {
  id: string;
  user_id: string;
  status: string;
  reason: string | null;
  scheduled_for: string;
  executed_at: string | null;
  canceled_at: string | null;
};

function memberName(m: Member) {
  return m.display_name || [m.first_name, m.last_name].filter(Boolean).join(" ") || m.email;
}

export default function CompliancePage() {
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<Member[]>([]);
  const [emailById, setEmailById] = useState<Record<string, string>>({});
  const [exports, setExports] = useState<ExportRow[]>([]);
  const [deletions, setDeletions] = useState<DeletionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const [delReason, setDelReason] = useState("");
  const [delDays, setDelDays] = useState(30);

  const reloadRequests = useCallback(async () => {
    try {
      const [ex, de] = await Promise.all([
        api<ExportRow[]>("/admin/compliance/exports"),
        api<DeletionRow[]>("/admin/compliance/deletions"),
      ]);
      setExports(ex);
      setDeletions(de);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await api<{ items: Member[] }>("/users/?limit=200");
        const map: Record<string, string> = {};
        data.items.forEach((m) => (map[m.id] = m.email));
        setEmailById(map);
      } catch {
        /* non-fatal */
      }
    })();
    reloadRequests();
  }, [reloadRequests]);

  async function runSearch() {
    setError(null);
    try {
      const p = new URLSearchParams({ limit: "25" });
      if (search.trim()) p.set("search", search.trim());
      const data = await api<{ items: Member[] }>(`/users/?${p.toString()}`);
      setMatches(data.items);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  async function exportData(m: Member) {
    setBusyId(m.id);
    setError(null);
    try {
      await api(`/admin/compliance/export/${m.id}`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      await reloadRequests();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusyId(null);
    }
  }

  async function scheduleDeletion(m: Member) {
    setBusyId(m.id);
    setError(null);
    try {
      await api(`/admin/compliance/delete/${m.id}`, {
        method: "POST",
        body: JSON.stringify({
          reason: delReason.trim() || null,
          days_until_execution: Math.max(1, Math.min(180, delDays)),
        }),
      });
      setDelId(null);
      setDelReason("");
      setDelDays(30);
      await reloadRequests();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusyId(null);
    }
  }

  async function cancelDeletion(d: DeletionRow) {
    setError(null);
    try {
      await api(`/admin/compliance/deletions/${d.id}/cancel`, { method: "POST" });
      await reloadRequests();
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  function downloadExport(e: ExportRow) {
    const blob = new Blob([JSON.stringify(e.payload_jsonb ?? {}, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${e.user_id.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const subj = (id: string) => emailById[id] || `${id.slice(0, 8)}…`;

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Data &amp; compliance</h1>
        <p className="text-slate-600">
          Fulfil data-subject requests (DSAR) — export or delete a member&apos;s data.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Pick a member */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Act on a member</CardTitle>
          <CardDescription>
            Search a member, then export their data or schedule deletion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="Search by name or email…"
              className="max-w-xs"
            />
            <Button variant="outline" size="sm" onClick={runSearch}>
              Search
            </Button>
          </div>

          <div className="divide-y">
            {matches.length === 0 && (
              <p className="py-2 text-sm text-slate-500">Search to find a member.</p>
            )}
            {matches.map((m) => (
              <div key={m.id} className="py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{memberName(m)}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {m.email} · {m.role}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busyId === m.id}
                    onClick={() => exportData(m)}
                  >
                    Export data
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDelId(delId === m.id ? null : m.id);
                      setDelReason("");
                      setDelDays(30);
                    }}
                  >
                    Schedule deletion
                  </Button>
                </div>
                {delId === m.id && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 pl-1">
                    <Input
                      value={delReason}
                      onChange={(e) => setDelReason(e.target.value)}
                      placeholder="Reason (optional)"
                      className="max-w-sm"
                    />
                    <label className="flex items-center gap-1 text-sm text-slate-600">
                      in
                      <Input
                        type="number"
                        min={1}
                        max={180}
                        value={delDays}
                        onChange={(e) => setDelDays(Number(e.target.value))}
                        className="w-20"
                      />
                      days
                    </label>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={busyId === m.id}
                      onClick={() => scheduleDeletion(m)}
                    >
                      Schedule
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDelId(null)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data exports</CardTitle>
        </CardHeader>
        <CardContent>
          {exports.length === 0 && (
            <p className="text-sm text-slate-500">No exports yet.</p>
          )}
          <ul className="divide-y">
            {exports.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{subj(e.user_id)}</span>
                    <Badge
                      variant={
                        e.status === "ready"
                          ? "secondary"
                          : e.status === "failed"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {e.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    {e.sections.join(", ")} · requested {formatDate(e.requested_at)}
                  </div>
                </div>
                {e.payload_jsonb && (
                  <Button variant="outline" size="sm" onClick={() => downloadExport(e)}>
                    Download JSON
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Deletions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Deletion requests</CardTitle>
        </CardHeader>
        <CardContent>
          {deletions.length === 0 && (
            <p className="text-sm text-slate-500">No deletion requests.</p>
          )}
          <ul className="divide-y">
            {deletions.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{subj(d.user_id)}</span>
                    <Badge
                      variant={
                        d.status === "executed"
                          ? "destructive"
                          : d.status === "canceled"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {d.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    scheduled {formatDate(d.scheduled_for)}
                    {d.reason ? ` · ${d.reason}` : ""}
                  </div>
                </div>
                {(d.status === "scheduled" || d.status === "requested") && (
                  <Button variant="outline" size="sm" onClick={() => cancelDeletion(d)}>
                    Cancel
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
