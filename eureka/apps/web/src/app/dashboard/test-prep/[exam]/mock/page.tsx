'use client';

/**
 * Patent Bar — Real Exam Mode mock (WS4).
 *
 * A timed, scored 100-question simulation of the registration exam,
 * mirroring its structure: two 50-question sessions of 3 hours each with a
 * break between, no feedback until the end, flag-for-review, and a 70%
 * passing threshold.
 *
 * HONESTY MODEL:
 *  - The form draws ONLY verified questions — official USPTO released-exam
 *    items (Oct 2003 + Apr 2003, graded against the USPTO model answers)
 *    plus any SME-verified items (currently zero). Enforcement lives in
 *    patent-bar-mock.ts at pool construction, not in UI logic.
 *  - The official pool cannot fill the exam blueprint in the thin sections
 *    (ethics 2, design 2, PCT 4 available). The intro screen DISCLOSES the
 *    actual section mix vs the blueprint before the user starts; nothing is
 *    silently passed off as blueprint-weighted.
 *  - The 2003 sources predate the AIA; items keyed to pre-AIA law carry
 *    [Pre-AIA] tags in their explanations, and a global caveat is shown.
 *  - Results persist locally (pb_mock_history_v1); server-side result
 *    storage is a WS5 concern alongside entitlements.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, ArrowRight, Timer, Flag, CheckCircle2, XCircle, Coffee, ShieldCheck, AlertTriangle, Loader2,
} from 'lucide-react';
import {
  buildOfficialMockPool, drawMockForm, mockSectionOf,
  MOCK_FORM_SIZE, MOCK_HALF_SIZE, MOCK_HALF_SECONDS, MOCK_PASS_PCT,
  type MockAllocationRow,
} from '@/lib/patent-bar-mock';
import { PATENT_BAR_BLUEPRINT } from '@/lib/patent-bar-coverage';
import { useEntitlements } from '@/hooks/useEntitlements';
import { PaywallCard } from '@/components/test-prep/PaywallCard';
import { apiClient } from '@/lib/api-client';

type Phase = 'loading' | 'intro' | 'exam' | 'break' | 'review';

interface SavedMock {
  v: 1;
  formIds: string[];
  allocation: MockAllocationRow[];
  answers: (number | null)[];
  flagged: boolean[];
  half: 1 | 2;
  phase: Phase;
  secondsLeft: [number, number];
  currentIdx: number;
  startedAt: string;
}

const STATE_KEY = 'pb_mock_state_v1';
const HISTORY_KEY = 'pb_mock_history_v1';

function fmtClock(s: number): string {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function PatentBarMockPage() {
  const params = useParams();
  const exam = ((params.exam as string) || '').toUpperCase();
  // WS5: the mock is paid-tier. Client gate is UX; the server enforces the
  // same rule on POST /me/test-prep/mock-results (402 without entitlement).
  const ent = useEntitlements();

  const [phase, setPhase] = useState<Phase>('loading');
  const [bank, setBank] = useState<Map<string, any>>(new Map());
  const [pool, setPool] = useState<Record<string, any[]> | null>(null);
  const [form, setForm] = useState<any[]>([]);
  const [allocation, setAllocation] = useState<MockAllocationRow[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [half, setHalf] = useState<1 | 2>(1);
  const [secondsLeft, setSecondsLeft] = useState<[number, number]>([MOCK_HALF_SECONDS, MOCK_HALF_SECONDS]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [startedAt, setStartedAt] = useState<string>('');
  const [resumeAvailable, setResumeAvailable] = useState<SavedMock | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const stateRef = useRef<SavedMock | null>(null);

  // Load the official banks once; build the verified-only pool.
  useEffect(() => {
    (async () => {
      const [octAm, octPm, aprAm, aprPm] = await Promise.all([
        import('@/lib/patent-bar-uspto-oct2003-data'),
        import('@/lib/patent-bar-uspto-oct2003-pm-data'),
        import('@/lib/patent-bar-uspto-apr2003-data'),
        import('@/lib/patent-bar-uspto-apr2003-pm-data'),
      ]);
      const officials = [
        ...octAm.USPTO_OCT2003_AM_QUESTIONS,
        ...octPm.USPTO_OCT2003_PM_QUESTIONS,
        ...aprAm.USPTO_APR2003_AM_QUESTIONS,
        ...aprPm.USPTO_APR2003_PM_QUESTIONS,
      ];
      setBank(new Map(officials.map((q: any) => [q.id, q])));
      setPool(buildOfficialMockPool(officials as any));
      try {
        const raw = localStorage.getItem(STATE_KEY);
        if (raw) {
          const saved: SavedMock = JSON.parse(raw);
          if (saved?.v === 1 && saved.phase !== 'review' && saved.formIds?.length === MOCK_FORM_SIZE) {
            setResumeAvailable(saved);
          }
        }
      } catch { /* ignore corrupt state */ }
      setPhase('intro');
    })();
  }, []);

  const persist = useCallback((next: Partial<SavedMock>) => {
    const cur = stateRef.current;
    if (!cur) return;
    const merged = { ...cur, ...next };
    stateRef.current = merged;
    try { localStorage.setItem(STATE_KEY, JSON.stringify(merged)); } catch { /* full/blocked */ }
  }, []);

  const startFresh = () => {
    if (!pool) return;
    const { questions, allocation: alloc } = drawMockForm(pool);
    const now = new Date().toISOString();
    setForm(questions); setAllocation(alloc);
    setAnswers(Array(questions.length).fill(null));
    setFlagged(Array(questions.length).fill(false));
    setHalf(1); setSecondsLeft([MOCK_HALF_SECONDS, MOCK_HALF_SECONDS]);
    setCurrentIdx(0); setStartedAt(now); setPhase('exam');
    stateRef.current = {
      v: 1, formIds: questions.map((q: any) => q.id), allocation: alloc,
      answers: Array(questions.length).fill(null), flagged: Array(questions.length).fill(false),
      half: 1, phase: 'exam', secondsLeft: [MOCK_HALF_SECONDS, MOCK_HALF_SECONDS],
      currentIdx: 0, startedAt: now,
    };
    persist({});
  };

  const resume = () => {
    const s = resumeAvailable;
    if (!s || bank.size === 0) return;
    const qs = s.formIds.map((id) => bank.get(id)).filter(Boolean);
    if (qs.length !== s.formIds.length) { setResumeAvailable(null); return; }
    setForm(qs); setAllocation(s.allocation); setAnswers(s.answers); setFlagged(s.flagged);
    setHalf(s.half); setSecondsLeft(s.secondsLeft); setCurrentIdx(s.currentIdx);
    setStartedAt(s.startedAt); setPhase(s.phase === 'break' ? 'break' : 'exam');
    stateRef.current = s;
  };

  const finishExam = useCallback((finalAnswers: (number | null)[]) => {
    setPhase('review');
    try {
      const correct = form.reduce((n, q, i) => n + (finalAnswers[i] === q.correct ? 1 : 0), 0);
      const perSection: Record<string, { correct: number; total: number }> = {};
      form.forEach((q, i) => {
        const s = mockSectionOf(q);
        perSection[s] = perSection[s] || { correct: 0, total: 0 };
        perSection[s].total++;
        if (finalAnswers[i] === q.correct) perSection[s].correct++;
      });
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      const completedAt = new Date().toISOString();
      history.push({ completedAt, startedAt, correct, total: form.length, perSection });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      localStorage.removeItem(STATE_KEY);
      // Server-side persistence (WS5) — entitlement-gated on the server;
      // best-effort, localStorage above remains the offline record.
      apiClient.post('/me/test-prep/mock-results', {
        exam_type: 'PATENT_BAR', correct, total: form.length,
        per_section: perSection, started_at: startedAt, completed_at: completedAt,
      }).catch(() => {});
    } catch { /* history is best-effort */ }
  }, [form, startedAt]);

  const endHalf = useCallback(() => {
    setConfirmEnd(false);
    if (half === 1) {
      setPhase('break');
      persist({ phase: 'break', half: 1 });
    } else {
      finishExam(stateRef.current?.answers ?? answers);
    }
  }, [half, answers, finishExam, persist]);

  // Countdown for the active half.
  useEffect(() => {
    if (phase !== 'exam') return;
    const t = setInterval(() => {
      setSecondsLeft((prev) => {
        const next: [number, number] = [...prev] as [number, number];
        const hi = half - 1;
        next[hi] = Math.max(0, next[hi] - 1);
        persist({ secondsLeft: next });
        if (next[hi] === 0) setTimeout(endHalf, 0);
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, half, endHalf, persist]);

  const answer = (idx: number, opt: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = opt;
      persist({ answers: next });
      return next;
    });
  };
  const toggleFlag = (idx: number) => {
    setFlagged((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      persist({ flagged: next });
      return next;
    });
  };
  const goTo = (idx: number) => { setCurrentIdx(idx); persist({ currentIdx: idx }); };

  const halfStart = (half - 1) * MOCK_HALF_SIZE;
  const halfEnd = Math.min(halfStart + MOCK_HALF_SIZE, form.length);
  const answeredInHalf = useMemo(
    () => answers.slice(halfStart, halfEnd).filter((a) => a !== null).length,
    [answers, halfStart, halfEnd],
  );

  const sectionName = (id: string) => PATENT_BAR_BLUEPRINT.find((s) => s.id === id)?.name ?? id;

  if (exam !== 'PATENT_BAR') {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Real Exam Mode is currently available for the Patent Bar only.</p>
        <Button asChild variant="ghost" className="mt-4 gap-2">
          <Link href={`/dashboard/test-prep/${(params.exam as string) || ''}`}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center p-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading official question pool…
      </div>
    );
  }

  // ---------- INTRO ----------
  if (phase === 'intro') {
    const available = pool
      ? Object.fromEntries(PATENT_BAR_BLUEPRINT.map((s) => [s.id, pool[s.id]?.length ?? 0]))
      : {};
    const previewAlloc = pool ? drawMockForm(pool).allocation : [];
    const totalVerified = Object.values(available).reduce((n: number, c: any) => n + c, 0);
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-8">
        <Button asChild variant="ghost" className="gap-2 -ml-2">
          <Link href="/dashboard/test-prep/patent_bar"><ArrowLeft className="h-4 w-4" /> Patent Bar</Link>
        </Button>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Timer className="h-6 w-6 text-primary" /> Real Exam Mode</h1>
        <Card className="space-y-3 p-5 text-sm">
          <p>
            A full simulation of the registration exam: <strong>100 questions in two 50-question
            sessions of 3 hours each</strong>, with a break between. No answer feedback until you
            finish; flag questions to revisit within the current session. Passing on the real exam
            is <strong>{MOCK_PASS_PCT}%</strong>.
          </p>
          <p className="flex items-start gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              Every question in a scored mock is <strong>verified</strong>: {totalVerified} official
              USPTO released-exam questions (Oct 2003 + Apr 2003, both sessions), graded against the
              USPTO&apos;s own model answers. AI-authored unverified items are excluded mechanically.
            </span>
          </p>
          <p className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/5 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>Honest section mix:</strong> the official pool is thin in ethics, design/plant,
              and PCT, so this mock cannot match the real exam&apos;s blueprint in those sections —
              the shortfall is reallocated to prosecution and patentability (table below). The 2003
              sources also predate the AIA; answers keyed to pre-AIA law carry [Pre-AIA] tags in the
              post-exam review.
            </span>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-1 pr-2">Section</th>
                  <th className="py-1 pr-2 text-right">Blueprint</th>
                  <th className="py-1 pr-2 text-right">This mock</th>
                  <th className="py-1 text-right">Official pool</th>
                </tr>
              </thead>
              <tbody>
                {previewAlloc.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-1 pr-2">{r.name}</td>
                    <td className="py-1 pr-2 text-right">{r.weightPct}</td>
                    <td className={`py-1 pr-2 text-right font-medium ${r.shortOfBlueprint ? 'text-amber-600' : ''}`}>
                      {r.allocated}{r.shortOfBlueprint ? ' ⚠' : ''}
                    </td>
                    <td className="py-1 text-right text-muted-foreground">{r.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        {ent.loading ? (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking access…
          </div>
        ) : !ent.has('PATENT_BAR') ? (
          <PaywallCard
            product={ent.productFor('PATENT_BAR')}
            feature="Real Exam Mode"
            examSlug="patent_bar"
          />
        ) : (
          <>
            {resumeAvailable && (
              <Card className="flex flex-wrap items-center justify-between gap-3 border-primary/40 p-4 text-sm">
                <span>
                  A mock from {new Date(resumeAvailable.startedAt).toLocaleString()} is in progress
                  (session {resumeAvailable.half}, {resumeAvailable.answers.filter((a) => a !== null).length}/{MOCK_FORM_SIZE} answered).
                </span>
                <span className="flex gap-2">
                  <Button onClick={resume}>Resume</Button>
                  <Button variant="outline" onClick={() => { localStorage.removeItem(STATE_KEY); setResumeAvailable(null); }}>Discard</Button>
                </span>
              </Card>
            )}
            <Button size="lg" className="w-full gap-2" onClick={startFresh} disabled={!pool}>
              <Timer className="h-5 w-5" /> Start Real Exam Mock (Session 1 of 2 — 3:00:00)
            </Button>
          </>
        )}
      </div>
    );
  }

  // ---------- BREAK ----------
  if (phase === 'break') {
    return (
      <div className="mx-auto max-w-xl space-y-4 p-8 text-center">
        <Coffee className="mx-auto h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold">Session 1 complete</h1>
        <p className="text-sm text-muted-foreground">
          You answered {answers.slice(0, MOCK_HALF_SIZE).filter((a) => a !== null).length} of {MOCK_HALF_SIZE} questions.
          Session 1 answers are now locked, as on the real exam. Take a break — Session 2&apos;s 3-hour
          clock starts when you begin.
        </p>
        <Button size="lg" className="gap-2" onClick={() => {
          setHalf(2); setCurrentIdx(MOCK_HALF_SIZE); setPhase('exam');
          persist({ half: 2, currentIdx: MOCK_HALF_SIZE, phase: 'exam' });
        }}>
          Begin Session 2 (3:00:00) <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // ---------- REVIEW ----------
  if (phase === 'review') {
    const correct = form.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
    const pct = form.length ? Math.round((correct / form.length) * 100) : 0;
    const passed = pct >= MOCK_PASS_PCT;
    const perSection: Record<string, { correct: number; total: number }> = {};
    form.forEach((q, i) => {
      const s = mockSectionOf(q);
      perSection[s] = perSection[s] || { correct: 0, total: 0 };
      perSection[s].total++;
      if (answers[i] === q.correct) perSection[s].correct++;
    });
    return (
      <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-8">
        <Button asChild variant="ghost" className="gap-2 -ml-2">
          <Link href="/dashboard/test-prep/patent_bar"><ArrowLeft className="h-4 w-4" /> Patent Bar</Link>
        </Button>
        <Card className="space-y-3 p-6 text-center">
          <p className="text-sm text-muted-foreground">Real Exam Mock — official USPTO questions</p>
          <p className="text-5xl font-bold">{pct}%</p>
          <p className={`font-medium ${passed ? 'text-emerald-600' : 'text-amber-600'}`}>
            {correct}/{form.length} correct — {passed ? 'at or above' : 'below'} the {MOCK_PASS_PCT}% passing threshold
          </p>
          <p className="text-xs text-muted-foreground">
            Scored against the USPTO model answers for the 2003 released exams. Items keyed to
            pre-AIA law are tagged [Pre-AIA] below — verify current law before relying on them.
          </p>
        </Card>
        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold">By section</h2>
          <div className="space-y-1 text-sm">
            {Object.entries(perSection).map(([id, s]) => (
              <div key={id} className="flex items-center justify-between border-b py-1 last:border-0">
                <span>{sectionName(id)}</span>
                <span className="font-mono">{s.correct}/{s.total} ({s.total ? Math.round((s.correct / s.total) * 100) : 0}%)</span>
              </div>
            ))}
          </div>
        </Card>
        <h2 className="text-lg font-semibold">Review</h2>
        {form.map((q, i) => {
          const right = answers[i] === q.correct;
          return (
            <Card key={q.id} className={`space-y-2 p-4 text-sm ${right ? 'border-emerald-400/40' : 'border-red-400/40'}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {right ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-500" />}
                <span className="font-medium">Q{i + 1}</span>
                <Badge variant="outline" className="font-mono">{q.id}</Badge>
                <Badge className="bg-emerald-600 text-white">Official USPTO</Badge>
              </div>
              <p>{q.question}</p>
              <ol className="space-y-1">
                {q.options.map((opt: string, oi: number) => (
                  <li key={oi} className={`rounded-md border px-3 py-1.5 ${oi === q.correct ? 'border-emerald-500/60 bg-emerald-500/10' : oi === answers[i] ? 'border-red-400/60 bg-red-500/10' : ''}`}>
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                    {oi === q.correct && <span className="ml-2 text-xs text-emerald-600">correct</span>}
                    {oi === answers[i] && oi !== q.correct && <span className="ml-2 text-xs text-red-500">your answer</span>}
                    {answers[i] === null && oi === q.correct && <span className="ml-2 text-xs text-muted-foreground">(unanswered)</span>}
                  </li>
                ))}
              </ol>
              <p className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">{q.explanation}</p>
            </Card>
          );
        })}
      </div>
    );
  }

  // ---------- EXAM ----------
  const q = form[currentIdx];
  if (!q) return null;
  const secs = secondsLeft[half - 1];
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary">Session {half} of 2</Badge>
          <span className="text-muted-foreground">
            Question {currentIdx + 1 - halfStart} of {halfEnd - halfStart} · {answeredInHalf} answered
          </span>
        </div>
        <div className={`flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-sm ${secs < 600 ? 'border-red-400 text-red-500' : ''}`}>
          <Timer className="h-4 w-4" /> {fmtClock(secs)}
        </div>
      </div>

      <Card className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium leading-relaxed">{q.question}</p>
          <Button
            size="sm" variant={flagged[currentIdx] ? 'default' : 'outline'}
            className="shrink-0 gap-1" onClick={() => toggleFlag(currentIdx)}
            aria-pressed={flagged[currentIdx]}
          >
            <Flag className="h-4 w-4" /> {flagged[currentIdx] ? 'Flagged' : 'Flag'}
          </Button>
        </div>
        <div role="radiogroup" aria-label="Answer choices" className="space-y-2">
          {q.options.map((opt: string, oi: number) => (
            <button
              key={oi} role="radio" aria-checked={answers[currentIdx] === oi}
              onClick={() => answer(currentIdx, oi)}
              className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                answers[currentIdx] === oi ? 'border-primary bg-primary/10 font-medium' : 'hover:bg-muted/50'
              }`}
            >
              <span className="mr-2 font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + oi)}</span>
              {opt}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" className="gap-1" disabled={currentIdx <= halfStart} onClick={() => goTo(currentIdx - 1)}>
          <ArrowLeft className="h-4 w-4" /> Prev
        </Button>
        {confirmEnd ? (
          <span className="flex items-center gap-2 text-sm">
            End session {half}? Unanswered questions score zero.
            <Button size="sm" variant="destructive" onClick={endHalf}>End session</Button>
            <Button size="sm" variant="outline" onClick={() => setConfirmEnd(false)}>Keep going</Button>
          </span>
        ) : (
          <Button variant="outline" onClick={() => setConfirmEnd(true)}>End Session {half}</Button>
        )}
        <Button variant="outline" className="gap-1" disabled={currentIdx >= halfEnd - 1} onClick={() => goTo(currentIdx + 1)}>
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <Card className="p-3">
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: halfEnd - halfStart }, (_, i) => {
            const idx = halfStart + i;
            const isCur = idx === currentIdx;
            const done = answers[idx] !== null;
            return (
              <button
                key={idx} onClick={() => goTo(idx)}
                aria-label={`Go to question ${i + 1}${done ? ', answered' : ''}${flagged[idx] ? ', flagged' : ''}`}
                className={`relative rounded px-0 py-1 text-xs font-mono transition-colors ${
                  isCur ? 'bg-primary text-primary-foreground'
                  : done ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {i + 1}
                {flagged[idx] && <span className="absolute -right-0.5 -top-0.5 block h-2 w-2 rounded-full bg-amber-500" />}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
