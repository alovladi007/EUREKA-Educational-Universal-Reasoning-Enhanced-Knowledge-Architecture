"use client";

/**
 * Phase 12.2 — Registered push-notification devices.
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type Device = {
  id: string;
  platform: string;
  app_version: string | null;
  locale: string;
  timezone: string | null;
  last_seen_at: string;
  revoked_at: string | null;
};

export default function DevicesPage() {
  const [rows, setRows] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    try {
      setRows(await api<Device[]>("/me/devices"));
    } catch (e) {
      setError(String((e as Error).message));
    }
  }
  useEffect(() => {
    reload();
  }, []);

  async function revoke(d: Device) {
    if (!confirm(`Revoke device on ${d.platform}?`)) return;
    try {
      await api(`/me/devices/${d.id}`, { method: "DELETE" });
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Devices</h1>
        <p className="text-slate-600">
          Push tokens registered for streak reminders, study-plan nudges, and live-session alerts.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active devices</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 && (
            <p className="text-slate-500 text-sm">
              No devices yet. The mobile app registers automatically on first launch.
            </p>
          )}
          <ul className="divide-y">
            {rows.map((d) => (
              <li key={d.id} className="py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="uppercase">
                      {d.platform}
                    </Badge>
                    <span className="text-sm">
                      {d.app_version || "version unknown"}
                    </span>
                    <span className="text-xs text-slate-500">
                      · {d.locale}
                      {d.timezone ? ` · ${d.timezone}` : ""}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    last seen {formatDate(d.last_seen_at)}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => revoke(d)}>
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
