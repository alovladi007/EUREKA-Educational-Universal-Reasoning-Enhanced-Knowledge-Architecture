'use client';

/**
 * MCAT chemistry practice — generated-and-verified items from the OCTET
 * engine, served through api-core (Phase B of the OCTET x MCAT wiring).
 *
 * Honesty rules carried into the UI:
 * - Categories that cannot serve generated items today are labeled so up
 *   front and are not clickable into an empty session (4B/5C/5D ship empty
 *   until real content maps in - no padding).
 * - A 3-option item shows 3 options. Distractors are misconception-keyed;
 *   nothing is invented to reach the exam's usual four.
 * - The answer key never reaches this page before submission. Grading is
 *   server-side; this page renders the verdict it is given, and the client
 *   gate below is UX only - the server enforces the same 402 rule.
 * - The weakness panel shows this account's attempt counts beside every
 *   accuracy figure. No percentile, no predicted score, no cohort claims.
 *
 * A missed item can be added to the ONE review queue (/dashboard/srs,
 * deck MCAT) and deep-links into the OCTET lesson for its node with the
 * same signed-in token the sidebar handoff uses.
 */

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowRight, BookOpen, CheckCircle2, FlaskRound, Layers, RefreshCw,
  XCircle,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useEntitlements } from '@/hooks/useEntitlements';
import { PaywallCard } from '@/components/test-prep/PaywallCard';

const EXAM = 'MCAT';
const OCTET_WEB_URL =
  process.env.NEXT_PUBLIC_OCTET_WEB_URL || 'http://localhost:4200';

const CATEGORY_LABELS: Record<string, string> = {
  '4B': 'Gas phase',
  '4E': 'Atoms, electronic structure, stoichiometry, redox',
  '5A': 'Water, acid-base, solubility, titration',
  '5B': 'Molecules, intermolecular forces, stereochemistry',
  '5C': 'Separations and purifications',
  '5D': 'Biologically relevant molecules',
  '5E': 'Thermodynamics and kinetics',
};

type Categories = Awaited<ReturnType<typeof apiClient.getMcatChemistryCategories>>;
type ItemsOut = Awaited<ReturnType<typeof apiClient.getMcatChemistryItems>>;
type ChemItem = ItemsOut['items'][number];
type Verdict = Awaited<ReturnType<typeof apiClient.submitMcatChemistry>>;
type Weakness = Awaited<ReturnType<typeof apiClient.getMcatChemistryWeakness>>;

/** OCTET lesson deep link with the signed-in token handed over (same
 *  mechanism as the sidebar's Chemistry entry). */
function octetLessonUrl(node: string): string {
  const base = `${OCTET_WEB_URL}/learn/${encodeURIComponent(node)}`;
  if (typeof window === 'undefined') return base;
  const token = window.localStorage.getItem('access_token');
  return token ? `${base}#access_token=${encodeURIComponent(token)}` : base;
}

export default function McatChemistryPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();

  React.useEffect(() => {
    if (exam && exam !== EXAM) {
      router.replace(`/dashboard/test-prep/${params.exam}`);
    }
  }, [exam, params.exam, router]);

  const { has, productFor, loading: entLoading } = useEntitlements();

  const [cats, setCats] = React.useState<Categories | null>(null);
  const [catsError, setCatsError] = React.useState<string | null>(null);
  const [weakness, setWeakness] = React.useState<Weakness | null>(null);

  const [session, setSession] = React.useState<{
    category: string;
    items: ChemItem[];
    index: number;
    correct: number;
    answered: number;
  } | null>(null);
  const [verdict, setVerdict] = React.useState<Verdict | null>(null);
  const [chosen, setChosen] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const startedAt = React.useRef<number>(Date.now());

  const entitled = has('MCAT') || has('OCTET');

  const loadCats = React.useCallback(async () => {
    try {
      setCatsError(null);
      setCats(await apiClient.getMcatChemistryCategories());
    } catch {
      setCatsError('Could not load the category map from the server.');
    }
  }, []);

  const loadWeakness = React.useCallback(async () => {
    try {
      setWeakness(await apiClient.getMcatChemistryWeakness());
    } catch {
      /* the weakness panel simply stays empty; it never shows stale data */
    }
  }, []);

  React.useEffect(() => {
    if (!entitled) return;
    void loadCats();
    void loadWeakness();
  }, [entitled, loadCats, loadWeakness]);

  const startSession = async (category: string) => {
    setBusy(true);
    try {
      const out = await apiClient.getMcatChemistryItems(category, 10);
      if (!out.items.length) {
        toast.error(`No generated items are available for ${category} yet.`);
        return;
      }
      setSession({ category, items: out.items, index: 0, correct: 0, answered: 0 });
      setVerdict(null);
      setChosen(null);
      startedAt.current = Date.now();
    } catch {
      toast.error('Could not start the session - the chemistry engine may be unreachable.');
    } finally {
      setBusy(false);
    }
  };

  const answer = async (position: number) => {
    if (!session || verdict || busy) return;
    const item = session.items[session.index];
    setBusy(true);
    setChosen(position);
    try {
      const out = await apiClient.submitMcatChemistry({
        template_id: item.template_id,
        seed: item.seed,
        choice_index: position,
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

  const next = () => {
    if (!session) return;
    if (session.index + 1 >= session.items.length) {
      void loadWeakness();
      setSession(null);
    } else {
      setSession({ ...session, index: session.index + 1 });
      startedAt.current = Date.now();
    }
    setVerdict(null);
    setChosen(null);
  };

  const addMissToSrs = async (item: ChemItem, v: Verdict) => {
    try {
      await apiClient.createSrsCard({
        deck: 'MCAT',
        front: item.prompt,
        back:
          `${v.correct_text}` +
          (v.rationale ? `\n\nWhy: ${v.rationale.description}` : ''),
        tags: {
          source: 'octet_chemistry',
          octet_node: v.node,
          mcat_category: v.mcat_category,
          misconception: v.misconception ?? undefined,
        },
      });
      toast.success('Added to your review queue (deck MCAT).');
    } catch {
      toast.error('Could not add the card.');
    }
  };

  if (exam !== EXAM) return null;

  // Client-side gate is UX only; every endpoint enforces the same rule with 402.
  if (!entLoading && !entitled) {
    return (
      <div className="p-6 space-y-4 max-w-3xl">
        <Header />
        <p className="text-sm text-muted-foreground">
          Generated chemistry practice is part of MCAT Full Access (it is also
          included with the standalone OCTET Chemistry product).
        </p>
        <PaywallCard
          product={productFor('MCAT')}
          feature="Generated chemistry practice"
          examSlug="mcat"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <Header />

      {!session && (
        <>
          <Card className="p-4 space-y-3" data-testid="chem-categories">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Practice by AAMC content category</h2>
              <Button size="sm" variant="ghost" onClick={() => void loadCats()} className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </Button>
            </div>
            {catsError && <p className="text-sm text-red-600">{catsError}</p>}
            {!cats && !catsError && (
              <p className="text-sm text-muted-foreground">Loading categories&hellip;</p>
            )}
            {cats && (
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(cats.summary).map(([cat, s]) => {
                  const servable = s.servable_nodes;
                  const disabled = servable === 0 || s.mapped_nodes === 0;
                  return (
                    <button
                      key={cat}
                      type="button"
                      disabled={disabled || busy}
                      onClick={() => void startSession(cat)}
                      data-testid={`chem-cat-${cat}`}
                      className={`text-left rounded-lg border p-3 transition ${
                        disabled
                          ? 'opacity-55 cursor-not-allowed'
                          : 'hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{cat}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {servable === null
                            ? `${s.mapped_nodes} topics mapped`
                            : disabled
                              ? 'no generated items yet'
                              : `${servable} of ${s.mapped_nodes} topics serve items`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {CATEGORY_LABELS[cat] ?? cat}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">
              Every item&apos;s answer key is machine-verified through an
              independent second computation before it is served. Categories
              without generated items say so instead of padding, and the topic
              map itself is under subject-matter-expert review.
            </p>
          </Card>

          <WeaknessPanel weakness={weakness} />
        </>
      )}

      {session && (
        <Card className="p-5 space-y-4" data-testid="chem-session">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Category {session.category} &middot; item {session.index + 1} of{' '}
              {session.items.length}
            </span>
            <span>
              {session.correct}/{session.answered} correct so far
            </span>
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid="chem-prompt">
            {session.items[session.index].prompt}
          </p>

          <div className="space-y-2">
            {session.items[session.index].options.map((o) => {
              const isChosen = chosen === o.position;
              const isCorrect = verdict?.correct_position === o.position;
              const showState = verdict !== null;
              return (
                <button
                  key={o.position}
                  type="button"
                  disabled={verdict !== null || busy}
                  onClick={() => void answer(o.position)}
                  data-testid={`chem-option-${o.position}`}
                  className={`w-full text-left rounded-md border px-3 py-2 text-sm transition ${
                    showState && isCorrect
                      ? 'border-green-600 bg-green-50 dark:bg-green-950/30'
                      : showState && isChosen
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                        : 'hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <span className="font-mono text-xs mr-2">
                    {String.fromCharCode(65 + o.position)}.
                  </span>
                  {o.text}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {session.items[session.index].option_count} options - each keyed to
            a named misconception; none invented to pad the count.
          </p>

          {verdict && (
            <div
              className={`rounded-md border p-3 space-y-2 text-sm ${
                verdict.is_correct
                  ? 'border-green-600/40 bg-green-50/60 dark:bg-green-950/20'
                  : 'border-red-500/40 bg-red-50/60 dark:bg-red-950/20'
              }`}
              data-testid="chem-verdict"
            >
              <p className="font-semibold flex items-center gap-1.5">
                {verdict.is_correct ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" /> Correct
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" /> Incorrect - the
                    answer is {String.fromCharCode(65 + verdict.correct_position)}:{' '}
                    {verdict.correct_text}
                  </>
                )}
              </p>
              {!verdict.is_correct && verdict.rationale && (
                <div className="space-y-1.5" data-testid="chem-rationale">
                  <p>
                    <span className="font-medium">{verdict.rationale.name}.</span>{' '}
                    {verdict.rationale.description}
                  </p>
                  {verdict.rationale.counterexample && (
                    <p className="text-muted-foreground">
                      Counterexample: {verdict.rationale.counterexample}
                    </p>
                  )}
                </div>
              )}
              {!verdict.is_correct && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={octetLessonUrl(verdict.rationale?.review_node || verdict.node)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="chem-octet-link"
                  >
                    <Button size="sm" variant="secondary" className="gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" /> Review this topic in OCTET
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    data-testid="chem-add-srs"
                    onClick={() =>
                      void addMissToSrs(session.items[session.index], verdict)
                    }
                  >
                    <Layers className="h-3.5 w-3.5" /> Add to flashcards
                  </Button>
                </div>
              )}
              <Button size="sm" onClick={next} className="gap-1.5" data-testid="chem-next">
                {session.index + 1 >= session.items.length ? 'Finish session' : 'Next item'}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {!verdict && (
            <Button size="sm" variant="ghost" onClick={() => setSession(null)}>
              End session
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}

function Header() {
  const params = useParams();
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <FlaskRound className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold">MCAT chemistry - generated practice</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Items are generated fresh per session by the OCTET chemistry engine and
        every answer key is independently machine-verified before serving.
        Wrong answers diagnose the misconception behind them and link into the
        full OCTET course.{' '}
        <Link
          href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}`}
          className="underline"
        >
          Back to the MCAT dashboard
        </Link>
      </p>
    </div>
  );
}

function WeaknessPanel({ weakness }: { weakness: Weakness | null }) {
  return (
    <Card className="p-4 space-y-3" data-testid="chem-weakness">
      <h2 className="font-semibold text-sm">Your chemistry weakness map</h2>
      {!weakness || weakness.categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No recorded attempts yet. Finish a session and this panel shows your
          accuracy per AAMC category - your own attempts only, with the counts
          shown; there is no percentile because there is no cohort.
        </p>
      ) : (
        <div className="space-y-2">
          {weakness.categories.map((c) => (
            <div key={c.category} className="rounded-md border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {c.category}
                  <span className="font-normal text-muted-foreground">
                    {' '}&middot; {CATEGORY_LABELS[c.category] ?? ''}
                  </span>
                </span>
                <span
                  className="text-xs text-muted-foreground"
                  data-testid={`chem-weak-${c.category}`}
                >
                  {c.correct}/{c.attempts} correct
                  {c.accuracy !== null && ` (${Math.round(c.accuracy * 100)}%)`}
                </span>
              </div>
              {c.review_nodes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {c.review_nodes.map((n) => (
                    <a
                      key={n.octet_node}
                      href={octetLessonUrl(n.octet_node)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs rounded-full border px-2 py-0.5 hover:border-primary hover:text-primary transition"
                    >
                      {n.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <p className="text-[11px] text-muted-foreground">{weakness.note}</p>
        </div>
      )}
    </Card>
  );
}
