"use client";

/**
 * Phase 11.5 — Support tickets + KB search.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, formatDate } from "@/lib/eureka-api";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  last_team_reply_at: string | null;
};

type KbHit = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string;
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("normal");
  const [kbQ, setKbQ] = useState("");
  const [kbHits, setKbHits] = useState<KbHit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      setTickets(await api<Ticket[]>("/me/tickets"));
    } catch (e) {
      setError(String((e as Error).message));
    }
  }
  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    const q = kbQ.trim();
    if (q.length < 2) {
      setKbHits([]);
      return;
    }
    api<KbHit[]>(`/kb?q=${encodeURIComponent(q)}&limit=5`, { auth: false })
      .then(setKbHits)
      .catch(() => setKbHits([]));
  }, [kbQ]);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      await api(`/me/tickets`, {
        method: "POST",
        body: JSON.stringify({
          subject,
          body_md: body,
          priority,
          category,
        }),
      });
      setSubject("");
      setBody("");
      await reload();
    } catch (e) {
      setError(String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-1">Support</h1>
        <p className="text-slate-600">
          Open a ticket or search the knowledge base.
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
          <CardTitle className="text-lg">Knowledge base</CardTitle>
          <CardDescription>
            Full-text search across published articles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={kbQ}
            onChange={(e) => setKbQ(e.target.value)}
            placeholder="Try “refund” or “password reset”…"
          />
          {kbHits.length > 0 && (
            <ul className="divide-y border rounded-md">
              {kbHits.map((h) => (
                <li key={h.id} className="px-3 py-2">
                  <Link
                    href={`/kb/${h.slug}`}
                    className="font-medium hover:underline"
                  >
                    {h.title}
                  </Link>
                  <p className="text-sm text-slate-600">{h.summary}</p>
                  <Badge variant="outline" className="mt-1">
                    {h.category}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Open a ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              >
                <option value="billing">Billing</option>
                <option value="account">Account</option>
                <option value="content_issue">Content issue</option>
                <option value="bug">Bug</option>
                <option value="feature_request">Feature request</option>
                <option value="safety">Safety</option>
                <option value="institutional">Institutional</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label>Priority</Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <Button onClick={create} disabled={busy || !subject || !body}>
            Submit
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 && (
            <p className="text-slate-500 text-sm">No tickets yet.</p>
          )}
          <ul className="divide-y">
            {tickets.map((t) => (
              <li key={t.id} className="py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t.subject}</span>
                    <Badge variant="outline">{t.status}</Badge>
                    <Badge variant="secondary">{t.priority}</Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    opened {formatDate(t.created_at)}
                    {t.last_team_reply_at &&
                      ` · team replied ${formatDate(t.last_team_reply_at)}`}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
