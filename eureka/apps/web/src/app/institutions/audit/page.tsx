"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type AuditEvent = {
  id: number;
  actor_user_id: string | null;
  subject_user_id: string | null;
  event_name: string;
  severity: string;
  request_ip: string | null;
  occurred_at: string;
};

export default function InstitutionAuditPage() {
  const [rows, setRows] = useState<AuditEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<AuditEvent[]>("/admin/audit?limit=200")
      .then(setRows)
      .catch((e) => setError(String((e as Error).message)));
  }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Audit log</h1>
        <p className="text-slate-600">Most recent 200 security-relevant events.</p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader><CardTitle className="text-lg">Events</CardTitle></CardHeader>
        <CardContent>
          {rows.length === 0 && <p className="text-slate-500 text-sm">No events yet.</p>}
          <ul className="divide-y">
            {rows.map((e) => (
              <li key={e.id} className="py-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      e.severity === "critical" ? "destructive" :
                      e.severity === "warn" ? "outline" : "secondary"
                    }
                  >{e.severity}</Badge>
                  <code className="text-xs">{e.event_name}</code>
                  <span className="text-xs text-slate-500">{formatDate(e.occurred_at)}</span>
                  {e.request_ip && (
                    <span className="text-xs text-slate-500 ml-auto">from {e.request_ip}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
