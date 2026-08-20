'use client';

/**
 * NCLEX-RN QBank on the server item bank (NX-5).
 *
 * Replaces the client-bundled question data, whose answer keys shipped in
 * the browser bundle. Same contract as McatServerQbank, which this mirrors:
 * - No answer key or explanation in the page until an answer is submitted;
 *   the server grades and only its verdict is rendered.
 * - Every response is recorded server-side (attempt_logs source
 *   'nclex_qbank'), so analytics derive from real rows.
 * - Review honesty on screen: the per-item verification badge
 *   (calc-verified dosage vs unverified clinical) and the bank disclaimer
 *   both come from the API.
 *
 * What NCLEX adds: SATA ("select all that apply") items arrive as kind
 * 'mcq_multi'. The UI switches to checkbox selection with an explicit
 * submit, and the server grades ALL-OR-NOTHING (the classic NCLEX SATA
 * standard) while returning an honest per-option breakdown.
 */

import React from 'react';
import toast from 'react-hot-toast';
import {
  ArrowRight, CheckCircle2, Layers, RefreshCw, XCircle,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';

type Overview = Awaited<ReturnType<typeof apiClient.getNclexQbankOverview>>;
type QbankItem = Awaited<
  ReturnType<typeof apiClient.getNclexQbankItems>
>['items'][number];
type Verdict = Awaited<ReturnType<typeof apiClient.submitNclexQbank>>;
type CaseList = Awaited<ReturnType<typeof apiClient.getNclexCaseStudies>>;
type ActiveCase = Awaited<ReturnType<typeof apiClient.getNclexCaseStudy>>['case'];

const COUNTS = [10, 20, 40];

function VerificationBadge({ tier }: { tier: QbankItem['verification'] }) {
  if (tier === 'calc-verified') {
    return (
      <Badge className="text-[10px] bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-600/30" variant="outline">
        calc-verified key
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[10px] text-amber-700 dark:text-amber-400 border-amber-600/30">
      awaiting SME review
    </Badge>
  );
}

export function NclexServerQbank() {
  const [overview, setOverview] = React.useState<Overview | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = React.useState<number[]>([]);
  const [count, setCount] = React.useState(10);

  const [caseStudies, setCaseStudies] = React.useState<CaseList | null>(null);
  // Set while a case session runs: its scenario stays pinned above the
  // questions, whose stems carry the phase updates.
  const [activeCase, setActiveCase] = React.useState<ActiveCase | null>(null);

  const [session, setSession] = React.useState<{
    items: QbankItem[];
    index: number;
    correct: number;
    answered: number;
  } | null>(null);
  const [verdict, setVerdict] = React.useState<Verdict | null>(null);
  // Single items submit on click; SATA items accumulate here until the
  // explicit submit (an accidental click must not grade half an answer).
  const [chosen, setChosen] = React.useState<number | null>(null);
  const [multiChosen, setMultiChosen] = React.useState<number[]>([]);
  const [busy, setBusy] = React.useState(false);
  const startedAt = React.useRef<number>(Date.now());

  const loadOverview = React.useCallback(async () => {
    try {
      setError(null);
      const [ov, cs] = await Promise.all([
        apiClient.getNclexQbankOverview(),
        apiClient.getNclexCaseStudies(),
      ]);
      setOverview(ov);
      setCaseStudies(cs);
    } catch {
      setError('Could not load the question bank from the server.');
    }
  }, []);

  React.useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const start = async () => {
    setBusy(true);
    try {
      // One request per selected category keeps the draw proportional; no
      // category selected = one unfiltered draw.
      const topics = selectedTopics.length ? selectedTopics : [null];
      const per = Math.max(1, Math.floor(count / topics.length));
      const batches = await Promise.all(
        topics.map((t) =>
          apiClient.getNclexQbankItems({ topic_id: t ?? undefined, count: per }),
        ),
      );
      const items = batches.flatMap((b) => b.items).slice(0, count);
      if (!items.length) {
        toast.error('No questions available for that selection.');
        return;
      }
      setActiveCase(null);
      setSession({ items, index: 0, correct: 0, answered: 0 });
      setVerdict(null);
      setChosen(null);
      setMultiChosen([]);
      startedAt.current = Date.now();
    } catch {
      toast.error('Could not start the session.');
    } finally {
      setBusy(false);
    }
  };

  const startCase = async (caseId: string) => {
    setBusy(true);
    try {
      const detail = await apiClient.getNclexCaseStudy(caseId);
      if (!detail.items.length) {
        toast.error('That case study has no questions attached yet.');
        return;
      }
      setActiveCase(detail.case);
      setSession({ items: detail.items, index: 0, correct: 0, answered: 0 });
      setVerdict(null);
      setChosen(null);
      setMultiChosen([]);
      startedAt.current = Date.now();
    } catch {
      toast.error('Could not load the case study.');
    } finally {
      setBusy(false);
    }
  };

  const submit = async (payload: { choice_index?: number; choice_indices?: number[] }) => {
    if (!session || verdict || busy) return;
    const item = session.items[session.index];
    setBusy(true);
    try {
      const out = await apiClient.submitNclexQbank({
        item_id: item.item_id,
        ...payload,
        seconds: Math.min(3600, Math.round((Date.now() - startedAt.current) / 1000)),
      });
      setVerdict(out);
      setSession({
        ...session,
        correct: session.correct + (out.is_correct ? 1 : 0),
        answered: session.answered + 1,
      });
    } catch {
      setChosen(null);
      toast.error('Submission failed - nothing was recorded.');
    } finally {
      setBusy(false);
    }
  };

  const answerSingle = (position: number) => {
    setChosen(position);
    void submit({ choice_index: position });
  };

  const toggleMulti = (position: number) => {
    if (verdict || busy) return;
    setMultiChosen((prev) =>
      prev.includes(position)
        ? prev.filter((p) => p !== position)
        : [...prev, position].sort((a, b) => a - b),
    );
  };

  const next = () => {
    if (!session) return;
    if (session.index + 1 >= session.items.length) {
      setSession(null);
      setActiveCase(null);
    } else {
      setSession({ ...session, index: session.index + 1 });
      startedAt.current = Date.now();
    }
    setVerdict(null);
    setChosen(null);
    setMultiChosen([]);
  };

  const addMissToSrs = async (item: QbankItem, v: Verdict) => {
    const back =
      v.kind === 'mcq_multi'
        ? `${(v.correct_texts ?? []).join('; ')}${v.explanation ? `\n\nWhy: ${v.explanation}` : ''}`
        : `${v.correct_text ?? ''}${v.explanation ? `\n\nWhy: ${v.explanation}` : ''}`;
    try {
      await apiClient.createSrsCard({
        deck: 'NCLEX',
        front: item.stem,
        back,
        tags: {
          source: 'nclex_qbank',
          section: item.section ?? undefined,
          subtopic: item.subtopic ?? undefined,
        },
      });
      toast.success('Added to your review queue (deck NCLEX).');
    } catch {
      toast.error('Could not add the card.');
    }
  };

  if (error) {
    return (
      <Card className="p-6 text-center space-y-2">
        <p className="text-sm text-red-600">{error}</p>
        <Button size="sm" variant="outline" onClick={() => void loadOverview()}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
        </Button>
      </Card>
    );
  }

  if (!session) {
    return (
      <div className="space-y-4" data-testid="nclex-qbank-picker">
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-sm">NCLEX-RN Question Bank</h3>
          <p className="text-xs text-muted-foreground">
            Served and graded server-side; answers and explanations appear
            only after you submit each question, and every response is
            recorded to your practice history. Select-all-that-apply items
            are scored all-or-nothing, as on the exam.
          </p>
          {!overview ? (
            <p className="text-sm text-muted-foreground">Loading categories&hellip;</p>
          ) : (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                {overview.sections.map((s) => {
                  const on = selectedTopics.includes(s.topic_id);
                  return (
                    <button
                      key={s.topic_id}
                      type="button"
                      onClick={() =>
                        setSelectedTopics((prev) =>
                          on
                            ? prev.filter((t) => t !== s.topic_id)
                            : [...prev, s.topic_id],
                        )
                      }
                      className={`text-left rounded-lg border p-3 text-sm transition ${
                        on ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">{s.section}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        {s.items} questions
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Questions:</span>
                {COUNTS.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={count === c ? 'default' : 'outline'}
                    onClick={() => setCount(c)}
                  >
                    {c}
                  </Button>
                ))}
                <Button
                  size="sm"
                  className="ml-auto"
                  disabled={busy}
                  onClick={() => void start()}
                  data-testid="nclex-qbank-start"
                >
                  Start practice <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
              {caseStudies && caseStudies.case_studies.length > 0 && (
                <div className="space-y-2 pt-2 border-t" data-testid="nclex-case-studies">
                  <p className="text-xs font-semibold">Next Gen NCLEX case studies</p>
                  <p className="text-[11px] text-muted-foreground">
                    An evolving clinical scenario with six questions that walk
                    the clinical-judgment steps. Served and graded server-side
                    like everything else here.
                  </p>
                  {caseStudies.case_studies.map((cs) => (
                    <div
                      key={cs.case_id}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{cs.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {cs.section} &middot; {cs.question_count} questions
                          {cs.review_status !== 'approved' && ' · awaiting SME review'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={busy}
                        onClick={() => void startCase(cs.case_id)}
                        data-testid={`nclex-case-start-${cs.topic_id}`}
                      >
                        Begin case
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">{overview.disclaimer}</p>
            </>
          )}
        </Card>
      </div>
    );
  }

  const item = session.items[session.index];
  const isMulti = item.kind === 'mcq_multi';
  const correctSet = new Set(verdict?.correct_indices ?? []);

  return (
    <Card className="p-5 space-y-4" data-testid="nclex-qbank-session">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {session.index + 1} of {session.items.length}
        </span>
        <span>
          {session.correct}/{session.answered} correct so far
        </span>
      </div>
      {activeCase && (
        <div
          className="rounded-md border bg-muted/30 p-4 max-h-72 overflow-y-auto"
          data-testid="nclex-case-scenario"
        >
          <p className="text-sm font-semibold mb-2">{activeCase.title}</p>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {activeCase.scenario}
          </p>
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {item.section && <Badge variant="secondary" className="text-xs">{item.section}</Badge>}
        {item.subtopic && <Badge variant="outline" className="text-xs">{item.subtopic}</Badge>}
        <VerificationBadge tier={item.verification} />
        {isMulti && (
          <Badge variant="outline" className="text-[10px]">
            Select all that apply
          </Badge>
        )}
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.stem}</p>
      <div className="space-y-2">
        {item.options.map((text, i) => {
          const isPicked = isMulti ? multiChosen.includes(i) : chosen === i;
          const showState = verdict !== null;
          const isKey = isMulti ? correctSet.has(i) : verdict?.correct_index === i;
          return (
            <button
              key={i}
              type="button"
              disabled={verdict !== null || busy}
              onClick={() => (isMulti ? toggleMulti(i) : answerSingle(i))}
              className={`w-full text-left rounded-md border px-3 py-2 text-sm transition ${
                showState && isKey
                  ? 'border-green-600 bg-green-50 dark:bg-green-950/30'
                  : showState && isPicked
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    : isPicked
                      ? 'border-primary bg-primary/10'
                      : 'hover:border-primary hover:bg-primary/5'
              }`}
            >
              <span className="font-mono text-xs mr-2">
                {isMulti ? (isPicked ? '☑' : '☐') : `${String.fromCharCode(65 + i)}.`}
              </span>
              {text}
            </button>
          );
        })}
      </div>

      {isMulti && !verdict && (
        <Button
          size="sm"
          disabled={busy || multiChosen.length === 0}
          onClick={() => void submit({ choice_indices: multiChosen })}
          data-testid="nclex-sata-submit"
        >
          Submit answer ({multiChosen.length} selected)
        </Button>
      )}

      {verdict && (
        <div
          className={`rounded-md border p-3 space-y-2 text-sm ${
            verdict.is_correct
              ? 'border-green-600/40 bg-green-50/60 dark:bg-green-950/20'
              : 'border-red-500/40 bg-red-50/60 dark:bg-red-950/20'
          }`}
          data-testid="nclex-qbank-verdict"
        >
          <p className="font-semibold flex items-center gap-1.5">
            {verdict.is_correct ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" /> Correct
              </>
            ) : verdict.kind === 'mcq_multi' ? (
              <>
                <XCircle className="h-4 w-4 text-red-500" /> Incorrect
                (all-or-nothing) &mdash; you selected{' '}
                {verdict.n_correct_selected} of{' '}
                {(verdict.correct_indices ?? []).length} correct options
                {(verdict.n_incorrect_selected ?? 0) > 0 &&
                  ` and ${verdict.n_incorrect_selected} incorrect`}
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" /> Incorrect - the
                answer is{' '}
                {String.fromCharCode(65 + (verdict.correct_index ?? 0))}:{' '}
                {verdict.correct_text}
              </>
            )}
          </p>
          {verdict.explanation && (
            <p className="text-muted-foreground">{verdict.explanation}</p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {!verdict.is_correct && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => void addMissToSrs(item, verdict)}
              >
                <Layers className="h-3.5 w-3.5" /> Add to flashcards
              </Button>
            )}
            <Button size="sm" onClick={next} className="gap-1.5">
              {session.index + 1 >= session.items.length
                ? 'Finish session'
                : 'Next question'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {!verdict && (
        <Button size="sm" variant="ghost" onClick={() => { setSession(null); setActiveCase(null); }}>
          End session
        </Button>
      )}
    </Card>
  );
}
