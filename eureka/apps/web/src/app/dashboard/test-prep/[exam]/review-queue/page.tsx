'use client';

/**
 * Patent Bar — SME Review Queue (WS2 tail).
 *
 * Lists every UNVERIFIED (AI-authored) QBank question so a subject-matter
 * expert can review the stem, options, keyed answer, and explanation, then
 * Approve or Flag each item. Decisions persist locally (localStorage) so a
 * reviewer can work across sessions, and export as JSON.
 *
 * HONESTY MODEL — the browser cannot edit source code, so approving here
 * does NOT silently flip anything to "SME-verified" in the product. The
 * exported JSON is applied to the data file by a maintainer via
 * `scripts/apply-sme-reviews.mjs`, which stamps `verified: 'sme'` on
 * approved ids. Until that lands in a commit, items remain labeled
 * Unverified in the QBank.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Flag, Download, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

type Decision = { decision: 'approve' | 'flag'; note?: string; at: string };
type DecisionMap = Record<string, Decision>;

const STORAGE_KEY = 'pb_sme_reviews_v1';
const PAGE_SIZE = 20;

const TOPIC_NAMES: Record<number, string> = {
  0: 'Patentability & Prior Art', 1: 'Application Preparation', 2: 'Filing & Prosecution',
  3: 'Office Action Responses', 4: 'PCT & International', 5: 'Post-Issuance',
  6: 'Design & Plant', 7: 'Ethics & Conduct',
};

function loadDecisions(): DecisionMap {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

export default function PatentBarReviewQueuePage() {
  const params = useParams();
  const exam = ((params.exam as string) || '').toUpperCase();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState<DecisionMap>({});
  const [tab, setTab] = useState<'pending' | 'approved' | 'flagged' | 'all'>('pending');
  const [topicFilter, setTopicFilter] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const [{ PATENT_BAR_QUESTIONS, getPatentBarVerification }, { PATENT_BAR_GAPFILL_ETHICS }, { PATENT_BAR_GAPFILL_DESIGN }, { PATENT_BAR_GAPFILL_PCT }, { PATENT_BAR_GAPFILL_POST_ISSUANCE }, { PATENT_BAR_GAPFILL_TOPUP }] = await Promise.all([
        import('@/lib/patent-bar-qbank-data'),
        import('@/lib/patent-bar-gapfill-ethics-data'),
        import('@/lib/patent-bar-gapfill-design-data'),
        import('@/lib/patent-bar-gapfill-pct-data'),
        import('@/lib/patent-bar-gapfill-postissuance-data'),
        import('@/lib/patent-bar-gapfill-topup-data'),
      ]);
      setQuestions([...PATENT_BAR_QUESTIONS, ...PATENT_BAR_GAPFILL_ETHICS, ...PATENT_BAR_GAPFILL_DESIGN, ...PATENT_BAR_GAPFILL_PCT, ...PATENT_BAR_GAPFILL_POST_ISSUANCE, ...PATENT_BAR_GAPFILL_TOPUP].filter((q) => getPatentBarVerification(q) === 'unverified'));
      setDecisions(loadDecisions());
      setLoading(false);
    })();
  }, []);

  const saveDecision = (id: string, decision: 'approve' | 'flag') => {
    setDecisions((prev) => {
      const next: DecisionMap = { ...prev };
      const note = noteDrafts[id]?.trim();
      next[id] = { decision, ...(note ? { note } : {}), at: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearDecision = (id: string) => {
    setDecisions((prev) => {
      const next = { ...prev };
      delete next[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const exportDecisions = () => {
    const payload = {
      bank: 'PATENT_BAR',
      exportedAt: new Date().toISOString(),
      // Reviewer identity travels with the export so the applied stamp is
      // attributable; the apply script records it in the commit message.
      decisions,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pb-sme-reviews-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Review decisions exported. Apply with scripts/apply-sme-reviews.mjs');
  };

  const counts = useMemo(() => {
    let approved = 0, flagged = 0;
    for (const q of questions) {
      const d = decisions[q.id];
      if (d?.decision === 'approve') approved++;
      else if (d?.decision === 'flag') flagged++;
    }
    return { approved, flagged, pending: questions.length - approved - flagged, total: questions.length };
  }, [questions, decisions]);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (topicFilter !== null && q.topicId !== topicFilter) return false;
      const d = decisions[q.id];
      if (tab === 'pending') return !d;
      if (tab === 'approved') return d?.decision === 'approve';
      if (tab === 'flagged') return d?.decision === 'flag';
      return true;
    });
  }, [questions, decisions, tab, topicFilter]);

  if (exam !== 'PATENT_BAR') {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">The SME review queue currently covers the Patent Bar bank only.</p>
        <Button asChild variant="ghost" className="mt-4 gap-2">
          <Link href={`/dashboard/test-prep/${(params.exam as string) || ''}`}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-8">
      <Button asChild variant="ghost" className="gap-2 -ml-2">
        <Link href="/dashboard/test-prep/patent_bar"><ArrowLeft className="h-4 w-4" /> Patent Bar</Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <ShieldCheck className="h-6 w-6 text-primary" /> SME Review Queue
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            AI-authored questions pending subject-matter-expert review. Approve items whose key,
            distractors, and explanation are accurate; flag anything questionable with a note.
            Decisions save in this browser and export as JSON — they take effect in the QBank only
            after a maintainer applies the export to the data file
            (<code className="text-xs">scripts/apply-sme-reviews.mjs</code>).
          </p>
        </div>
        <Button onClick={exportDecisions} disabled={counts.approved + counts.flagged === 0} className="gap-2">
          <Download className="h-4 w-4" /> Export decisions
        </Button>
      </div>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span><strong>{counts.total}</strong> unverified</span>
          <span className="text-emerald-600"><strong>{counts.approved}</strong> approved</span>
          <span className="text-amber-600"><strong>{counts.flagged}</strong> flagged</span>
          <span className="text-muted-foreground"><strong>{counts.pending}</strong> pending</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${counts.total ? Math.round(((counts.approved + counts.flagged) / counts.total) * 100) : 0}%` }}
          />
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(['pending', 'approved', 'flagged', 'all'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setVisible(PAGE_SIZE); }}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'
            }`}
          >
            {t}
          </button>
        ))}
        <select
          className="ml-auto rounded-md border bg-background px-2 py-1 text-xs"
          value={topicFilter === null ? '' : String(topicFilter)}
          onChange={(e) => { setTopicFilter(e.target.value === '' ? null : Number(e.target.value)); setVisible(PAGE_SIZE); }}
        >
          <option value="">All topics</option>
          {Object.entries(TOPIC_NAMES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading bank…
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">Nothing in this view.</Card>
      ) : (
        <>
          {filtered.slice(0, visible).map((q) => {
            const d = decisions[q.id];
            return (
              <Card key={q.id} className={`p-4 space-y-3 ${d?.decision === 'approve' ? 'border-emerald-400/60' : d?.decision === 'flag' ? 'border-amber-400/60' : ''}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="outline" className="font-mono">{q.id}</Badge>
                  <Badge variant="secondary">{TOPIC_NAMES[q.topicId] || `Topic ${q.topicId}`}</Badge>
                  <Badge variant="outline">{q.subtopic}</Badge>
                  <Badge variant="outline">Difficulty {q.difficulty}</Badge>
                  {d && (
                    <Badge className={d.decision === 'approve' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}>
                      {d.decision === 'approve' ? 'Approved' : 'Flagged'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium">{q.question}</p>
                <ol className="space-y-1 text-sm">
                  {q.options.map((opt: string, i: number) => (
                    <li
                      key={i}
                      className={`rounded-md border px-3 py-1.5 ${i === q.correct ? 'border-emerald-500/60 bg-emerald-500/10 font-medium' : ''}`}
                    >
                      <span className="mr-2 font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                      {opt}
                      {i === q.correct && <span className="ml-2 text-xs text-emerald-600">← keyed answer</span>}
                    </li>
                  ))}
                </ol>
                <p className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">{q.explanation}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Reviewer note (required context for flags)…"
                    className="min-w-0 flex-1 rounded-md border bg-background px-3 py-1.5 text-xs"
                    value={noteDrafts[q.id] ?? d?.note ?? ''}
                    onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  />
                  <Button size="sm" variant="outline" className="gap-1 border-emerald-500 text-emerald-600 hover:bg-emerald-500/10" onClick={() => saveDecision(q.id, 'approve')}>
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 border-amber-500 text-amber-600 hover:bg-amber-500/10" onClick={() => saveDecision(q.id, 'flag')}>
                    <Flag className="h-4 w-4" /> Flag
                  </Button>
                  {d && (
                    <Button size="sm" variant="ghost" className="text-xs text-muted-foreground" onClick={() => clearDecision(q.id)}>
                      Undo
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
          {filtered.length > visible && (
            <Button variant="outline" className="w-full" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Show more ({filtered.length - visible} remaining)
            </Button>
          )}
        </>
      )}
    </div>
  );
}
