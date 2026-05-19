"use client";

/**
 * Phase 15 — Partnerships list (formerly /admin/workforce).
 * Now lives under /institutions and uses the institutional sidebar.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type Partnership = {
  id: string;
  org_id: string;
  name: string;
  partnership_kind: string;
  contracted_seats: number;
  status: string;
  activated_at: string | null;
  created_at: string;
};

export default function PartnershipsPage() {
  const [rows, setRows] = useState<Partnership[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(50);
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      setRows(await api<Partnership[]>("/partnerships"));
    } catch (e) {
      setError(String((e as Error).message));
    }
  }
  useEffect(() => {
    reload();
  }, []);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const me = await api<{ org_id: string }>("/users/me");
      await api(`/partnerships`, {
        method: "POST",
        body: JSON.stringify({
          org_id: me.org_id,
          name,
          contracted_seats: seats,
        }),
      });
      setName("");
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Partnerships</h1>
        <p className="text-slate-600">
          One partnership per organization. Owns contracted seats, programs, and compliance.
        </p>
      </div>

      <Card className="bg-slate-50 border-slate-300">
        <CardHeader>
          <CardTitle className="text-base">How institutions work on EUREKA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <p>
            <strong>Institution</strong> = your organization in EUREKA. When an
            organization becomes a workforce-training partner, it gets{" "}
            <strong>one partnership row</strong>. That row owns the contracted seats
            and is the parent of everything else.
          </p>
          <div>
            <p className="mb-1">Inside a partnership you author:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>Seats</strong> — workers you license; bulk-add via CSV.</li>
              <li><strong>Programs</strong> — role-based curricula with skill targets and weekly study plans.</li>
              <li><strong>Compliance</strong> — HIPAA / OSHA / SOC2 / etc. with self-attestation.</li>
              <li><strong>Analytics</strong> — funnels by team and role.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create partnership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Health Systems" />
          </div>
          <div>
            <Label>Contracted seats</Label>
            <Input
              type="number"
              min={0}
              max={1_000_000}
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value || "0", 10))}
            />
          </div>
          <Button onClick={create} disabled={busy || !name}>Create</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Partnerships</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 && (
            <p className="text-slate-500 text-sm">No partnerships yet — create one above.</p>
          )}
          <ul className="divide-y">
            {rows.map((p) => (
              <li key={p.id} className="py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{p.name}</span>
                    <Badge variant={p.status === "active" ? "default" : "outline"}>{p.status}</Badge>
                    <Badge variant="secondary">{p.partnership_kind}</Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    {p.contracted_seats} contracted seats · created {formatDate(p.created_at)}
                  </div>
                </div>
                <Link href={`/institutions/partnerships/${p.id}`} className="text-sm text-amber-700 hover:underline">
                  Manage →
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
