"use client";

/**
 * Phase 15 — Partnership detail.
 * Tabs: Overview · Seats · Programs · Compliance · Analytics
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  notes_md: string | null;
};

type SeatUtilisation = {
  contracted_seats: number;
  active_seats: number;
  available_seats: number;
  by_team: Record<string, number>;
  by_role: Record<string, number>;
};

type Program = {
  id: string;
  slug: string;
  name: string;
  target_role: string | null;
  target_skill_codes: string[];
  duration_weeks: number;
  is_mandatory: boolean;
  status: string;
  created_at: string;
};

type ComplianceReq = {
  id: string;
  code: string;
  name: string;
  regulation: string;
  recurrence_months: number;
  is_active: boolean;
  created_at: string;
};

type Analytics = {
  active_seats: number;
  contracted_seats: number;
  programs_active: number;
  assignments_total: number;
  assignments_overdue: number;
  compliance_overdue: number;
  compliance_due_soon: number;
  by_team: { label: string; seat_count: number; in_progress: number; completed: number; overdue: number }[];
  by_role: { label: string; seat_count: number; in_progress: number; completed: number; overdue: number }[];
};

export default function PartnershipDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [p, setP] = useState<Partnership | null>(null);
  const [util, setUtil] = useState<SeatUtilisation | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [compliance, setCompliance] = useState<ComplianceReq[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    try {
      const [pp, uu, pr, cp, an] = await Promise.all([
        api<Partnership>(`/partnerships/${id}`),
        api<SeatUtilisation>(`/partnerships/${id}/seat-utilisation`),
        api<Program[]>(`/partnerships/${id}/programs`),
        api<ComplianceReq[]>(`/partnerships/${id}/compliance`),
        api<Analytics>(`/partnerships/${id}/analytics`),
      ]);
      setP(pp);
      setUtil(uu);
      setPrograms(pr);
      setCompliance(cp);
      setAnalytics(an);
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  useEffect(() => {
    if (id) reload();
  }, [id]);

  async function action(a: "activate" | "pause" | "expire") {
    try {
      await api(`/partnerships/${id}/action`, {
        method: "POST",
        body: JSON.stringify({ action: a }),
      });
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (!p) return <p>Loading…</p>;

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">{p.name}</h1>
        <p className="text-slate-600">
          <Badge variant={p.status === "active" ? "default" : "outline"}>{p.status}</Badge>
          <span className="ml-2">
            {p.contracted_seats} seats · {p.partnership_kind} · created {formatDate(p.created_at)}
          </span>
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => action("activate")}>
          Activate
        </Button>
        <Button variant="outline" size="sm" onClick={() => action("pause")}>
          Pause
        </Button>
        <Button variant="outline" size="sm" onClick={() => action("expire")}>
          Expire
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="seats">Seats</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Active seats" v={util?.active_seats ?? 0} />
            <Stat label="Available" v={util?.available_seats ?? 0} />
            <Stat label="Programs" v={programs.filter((x) => x.status === "active").length} />
            <Stat label="Compliance" v={compliance.filter((x) => x.is_active).length} />
          </div>
        </TabsContent>

        <TabsContent value="seats">
          <SeatsPanel partnershipId={id} util={util} onChange={reload} />
        </TabsContent>

        <TabsContent value="programs">
          <ProgramsPanel partnershipId={id} programs={programs} onChange={reload} />
        </TabsContent>

        <TabsContent value="compliance">
          <CompliancePanel partnershipId={id} requirements={compliance} programs={programs} onChange={reload} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsPanel a={analytics} />
        </TabsContent>
      </Tabs>
    </>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="text-3xl font-bold">{v}</div>
        <div className="text-xs uppercase font-medium text-slate-500">{label}</div>
      </CardContent>
    </Card>
  );
}

function SeatsPanel({
  partnershipId,
  util,
  onChange,
}: {
  partnershipId: string;
  util: SeatUtilisation | null;
  onChange: () => Promise<void>;
}) {
  const [csv, setCsv] = useState("email,role_label,team_label,manager_email\n");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      // Parse the textarea as a tiny CSV. First line is header.
      const lines = csv.trim().split("\n").filter(Boolean);
      const [header, ...rest] = lines;
      const cols = header.split(",").map((c) => c.trim());
      const rows = rest.map((line) => {
        const parts = line.split(",").map((c) => c.trim());
        const r: Record<string, string> = {};
        cols.forEach((c, i) => {
          if (parts[i]) r[c] = parts[i];
        });
        return r;
      });
      const res = await api<{
        assigned: number;
        skipped: number;
        over_capacity: number;
        seat_utilisation: number;
        contracted_seats: number;
      }>(`/partnerships/${partnershipId}/seats/bulk-assign`, {
        method: "POST",
        body: JSON.stringify({ rows }),
      });
      setMsg(
        `Assigned ${res.assigned}, skipped ${res.skipped}, over-capacity ${res.over_capacity}.`,
      );
      await onChange();
    } catch (e) {
      setMsg(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Contracted" v={util?.contracted_seats ?? 0} />
        <Stat label="Active" v={util?.active_seats ?? 0} />
        <Stat label="Available" v={util?.available_seats ?? 0} />
      </div>

      {util && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">By team</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm divide-y">
                {Object.entries(util.by_team).map(([k, v]) => (
                  <li key={k} className="py-1 flex justify-between">
                    <span>{k}</span>
                    <Badge variant="outline">{v}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">By role</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm divide-y">
                {Object.entries(util.by_role).map(([k, v]) => (
                  <li key={k} className="py-1 flex justify-between">
                    <span>{k}</span>
                    <Badge variant="outline">{v}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bulk assign (CSV)</CardTitle>
          <CardDescription>
            Paste a CSV: <code>email,role_label,team_label,manager_email</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={6}
            className="font-mono text-xs"
          />
          <Button onClick={submit} disabled={busy}>
            Submit
          </Button>
          {msg && <p className="text-sm text-slate-600">{msg}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function ProgramsPanel({
  partnershipId,
  programs,
  onChange,
}: {
  partnershipId: string;
  programs: Program[];
  onChange: () => Promise<void>;
}) {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("STEP1.CARD.HF");
  const [weeks, setWeeks] = useState(12);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    setErr(null);
    try {
      await api(`/partnerships/${partnershipId}/programs`, {
        method: "POST",
        body: JSON.stringify({
          slug,
          name,
          target_skill_codes: skills.split(",").map((s) => s.trim()).filter(Boolean),
          duration_weeks: weeks,
          is_mandatory: true,
          target_mastery: 0.8,
        }),
      });
      setSlug("");
      setName("");
      await onChange();
    } catch (e) {
      setErr(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="rn-onboarding-2026" />
            </div>
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Target skill codes (comma-separated)</Label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
          <div>
            <Label>Duration (weeks)</Label>
            <Input
              type="number"
              min={1}
              max={104}
              value={weeks}
              onChange={(e) => setWeeks(parseInt(e.target.value || "12", 10))}
              className="w-32"
            />
          </div>
          <Button onClick={create} disabled={busy || !slug || !name}>
            Create
          </Button>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {programs.length === 0 && <p className="text-slate-500 text-sm">No programs yet.</p>}
          <ul className="divide-y">
            {programs.map((p) => (
              <li key={p.id} className="py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.name}</span>
                  <Badge variant={p.status === "active" ? "default" : "outline"}>{p.status}</Badge>
                  {p.is_mandatory && <Badge variant="destructive">mandatory</Badge>}
                  <code className="text-xs text-slate-500">{p.slug}</code>
                </div>
                <div className="text-xs text-slate-500">
                  {p.duration_weeks} weeks · target: {p.target_skill_codes.join(", ") || "—"}
                  {p.target_role ? ` · role: ${p.target_role}` : ""}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function CompliancePanel({
  partnershipId,
  requirements,
  programs,
  onChange,
}: {
  partnershipId: string;
  requirements: ComplianceReq[];
  programs: Program[];
  onChange: () => Promise<void>;
}) {
  const [code, setCode] = useState("HIPAA-PRIV");
  const [name, setName] = useState("HIPAA Privacy");
  const [regulation, setRegulation] = useState("hipaa");
  const [programId, setProgramId] = useState<string>("");
  const [months, setMonths] = useState(12);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    setErr(null);
    try {
      await api(`/partnerships/${partnershipId}/compliance`, {
        method: "POST",
        body: JSON.stringify({
          code,
          name,
          regulation,
          program_id: programId || null,
          recurrence_months: months,
        }),
      });
      await onChange();
    } catch (e) {
      setErr(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create requirement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            </div>
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Regulation</Label>
              <select
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                value={regulation}
                onChange={(e) => setRegulation(e.target.value)}
              >
                {[
                  "hipaa", "osha", "soc2", "gdpr", "pci_dss", "iso_27001",
                  "sox", "ferpa", "sector_specific", "internal",
                ].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Satisfying program</Label>
              <select
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
              >
                <option value="">— manual attestation —</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Recurrence (months, 0 = one-time)</Label>
              <Input
                type="number"
                min={0}
                max={120}
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value || "12", 10))}
              />
            </div>
          </div>
          <Button onClick={create} disabled={busy || !code || !name}>
            Create
          </Button>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          {requirements.length === 0 && (
            <p className="text-slate-500 text-sm">No requirements yet.</p>
          )}
          <ul className="divide-y">
            {requirements.map((r) => (
              <li key={r.id} className="py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.name}</span>
                  <Badge variant="outline">{r.regulation}</Badge>
                  <Badge variant={r.is_active ? "default" : "outline"}>
                    {r.is_active ? "active" : "paused"}
                  </Badge>
                  <code className="text-xs text-slate-500">{r.code}</code>
                </div>
                <div className="text-xs text-slate-500">
                  Refresh every {r.recurrence_months}{" "}
                  {r.recurrence_months === 1 ? "month" : "months"}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsPanel({ a }: { a: Analytics | null }) {
  if (!a) return <p className="text-slate-500">No analytics yet.</p>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Active seats" v={a.active_seats} />
        <Stat label="Programs" v={a.programs_active} />
        <Stat label="Overdue assignments" v={a.assignments_overdue} />
        <Stat label="Overdue compliance" v={a.compliance_overdue} />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Funnel by team</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase">
                <tr>
                  <th className="text-left">Team</th>
                  <th>Seats</th>
                  <th>In progress</th>
                  <th>Completed</th>
                  <th>Overdue</th>
                </tr>
              </thead>
              <tbody>
                {a.by_team.map((r) => (
                  <tr key={r.label} className="border-t">
                    <td className="py-1">{r.label}</td>
                    <td className="text-center">{r.seat_count}</td>
                    <td className="text-center">{r.in_progress}</td>
                    <td className="text-center">{r.completed}</td>
                    <td className="text-center">{r.overdue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Funnel by role</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase">
                <tr>
                  <th className="text-left">Role</th>
                  <th>Seats</th>
                  <th>In progress</th>
                  <th>Completed</th>
                  <th>Overdue</th>
                </tr>
              </thead>
              <tbody>
                {a.by_role.map((r) => (
                  <tr key={r.label} className="border-t">
                    <td className="py-1">{r.label}</td>
                    <td className="text-center">{r.seat_count}</td>
                    <td className="text-center">{r.in_progress}</td>
                    <td className="text-center">{r.completed}</td>
                    <td className="text-center">{r.overdue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
