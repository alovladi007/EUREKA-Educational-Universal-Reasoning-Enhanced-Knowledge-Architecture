'use client';

/**
 * Transcript viewer (Phase 4 Session 4.5, 2026-05).
 *
 * Fetches the current signed transcript from /api/v1/transcript/me,
 * verifies its Ed25519 signature against /verify, and renders both
 * a human-readable view AND the raw Open Badges 3.0 JSON-LD payload.
 *
 * Provides a "Re-issue" button that hits /transcript/me/issue and a
 * "Download JSON" link.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';

interface Issuance {
  id: string;
  key_id: string;
  signature_b64: string;
  achievements_count: number;
  tiers_count: number;
  skills_mastered_count: number;
  issued_at: string;
  payload: {
    id: string;
    type: string[];
    issuer: { name: string; id: string };
    credentialSubject: {
      name: string;
      email: string;
      tierEnrollments: Array<{ tier: string; status: string; tierContext: Record<string, unknown> }>;
      achievements: Array<{ name: string; achievementType: string; issuedOn: string }>;
      masteredSkills: Array<{ framework: string; code: string; name: string; mastery: number }>;
    };
  };
}

interface VerifyResult {
  verified: boolean;
  algorithm?: string;
  issuer?: string;
  reason?: string;
}

async function fetchJSON<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} on ${path}`);
  return res.json();
}

export default function TranscriptPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [issuance, setIssuance] = useState<Issuance | null>(null);
  const [verify, setVerify] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reissuing, setReissuing] = useState(false);

  useEffect(() => {
    const t =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token') || localStorage.getItem('accessToken')
        : null;
    if (!t) {
      router.push('/auth/login');
      return;
    }
    setToken(t);
  }, [router]);

  const load = async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const iss = await fetchJSON<Issuance>('/transcript/me', t);
      setIssuance(iss);
      const v = await fetchJSON<VerifyResult>(`/transcript/${iss.id}/verify`, t);
      setVerify(v);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) void load(token);
  }, [token]);

  const reissue = async () => {
    if (!token) return;
    setReissuing(true);
    try {
      await fetchJSON('/transcript/me/issue', token, { method: 'POST' });
      await load(token);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setReissuing(false);
    }
  };

  const download = () => {
    if (!issuance) return;
    const blob = new Blob([JSON.stringify(issuance.payload, null, 2)], {
      type: 'application/ld+json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eureka-transcript-${issuance.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!token || loading) return <div className="container mx-auto p-8">Loading…</div>;
  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertTitle>Couldn&apos;t load transcript</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  if (!issuance) return null;

  const subj = issuance.payload.credentialSubject;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Signed transcript</h1>
          <p className="text-muted-foreground mt-1">
            Open Badges 3.0 JSON-LD, signed with Ed25519. Verifiable by any
            spec-compliant wallet.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={reissue} disabled={reissuing}>
            {reissuing ? 'Re-issuing…' : 'Re-issue'}
          </Button>
          <Button variant="outline" onClick={download}>
            Download JSON
          </Button>
        </div>
      </header>

      {/* Signature status */}
      <Card>
        <CardHeader>
          <CardTitle>Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {verify?.verified ? (
            <Alert>
              <AlertTitle>✓ Signature verified</AlertTitle>
              <AlertDescription>
                Signed by{' '}
                <span className="font-mono">{verify.issuer}</span> using{' '}
                {verify.algorithm}.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertTitle>✗ Signature invalid</AlertTitle>
              <AlertDescription>{verify?.reason}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs uppercase text-muted-foreground">Key ID</div>
              <div className="font-mono text-xs">{issuance.key_id}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Issued at</div>
              <div className="font-mono text-xs">{issuance.issued_at}</div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">Signature (base64url)</div>
            <div className="font-mono text-[10px] break-all opacity-70">
              {issuance.signature_b64}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject */}
      <Card>
        <CardHeader>
          <CardTitle>{subj.name}</CardTitle>
          <CardDescription>{subj.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold">{issuance.tiers_count}</div>
              <div className="text-xs text-muted-foreground">tier enrolments</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {issuance.achievements_count}
              </div>
              <div className="text-xs text-muted-foreground">achievements</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {issuance.skills_mastered_count}
              </div>
              <div className="text-xs text-muted-foreground">skills mastered</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {subj.tierEnrollments?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {subj.tierEnrollments.map((te, i) => (
                <li key={i} className="flex items-center justify-between border-b pb-2">
                  <span>
                    <span className="font-medium">{te.tier}</span>{' '}
                    {te.tierContext?.exam ? `— ${String(te.tierContext.exam)}` : ''}
                  </span>
                  <Badge variant="outline">{te.status}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {subj.achievements?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {subj.achievements.map((a, i) => (
                <li key={i} className="border-b pb-2">
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.achievementType} · {a.issuedOn?.slice(0, 10)}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {subj.masteredSkills?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mastered skills</CardTitle>
            <CardDescription>≥ 85% mastery on the underlying skill node.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {subj.masteredSkills.map((s, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {s.framework}/{s.code}
                    </span>{' '}
                    {s.name}
                  </span>
                  <span className="text-xs tabular-nums">
                    {(s.mastery * 100).toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
