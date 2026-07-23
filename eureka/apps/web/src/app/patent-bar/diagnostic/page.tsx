'use client';

/**
 * Patent Bar — free public diagnostic (WS4 GTM funnel, step 1).
 *
 * 10 questions drawn exclusively from the official USPTO released exams
 * (public domain — safe to show without an account), allocated across the
 * exam blueprint by the same honest waterfall the Real Exam Mode uses.
 * No feedback during the quiz (like the real exam); afterwards: score,
 * per-section readout, full review with the official model-answer
 * explanations, and the signup CTA into the free preview.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, XCircle,
  ShieldCheck, Loader2, RotateCcw,
} from 'lucide-react';
import { buildOfficialMockPool, drawMockForm, mockSectionOf } from '@/lib/patent-bar-mock';
import { PATENT_BAR_BLUEPRINT } from '@/lib/patent-bar-coverage';

const DIAG_SIZE = 10;
const SIGNUP_HREF = '/auth/register?next=/dashboard/test-prep/patent_bar';

export default function PatentBarDiagnosticPage() {
  const [phase, setPhase] = useState<'loading' | 'quiz' | 'results'>('loading');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [idx, setIdx] = useState(0);

  const draw = (pool: Record<string, any[]>) => {
    const { questions: qs } = drawMockForm(pool, DIAG_SIZE);
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(null));
    setIdx(0);
    setPhase('quiz');
  };

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
      draw(buildOfficialMockPool(officials as any));
    })();
  }, []);

  const sectionName = (id: string) =>
    PATENT_BAR_BLUEPRINT.find((s) => s.id === id)?.name ?? id;

  const q = questions[idx];
  const answeredCount = answers.filter((a) => a !== null).length;

  const correct = questions.reduce(
    (n, qq, i) => n + (answers[i] === qq.correct ? 1 : 0), 0,
  );
  const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <nav className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <GraduationCap className="h-6 w-6 text-indigo-600" /> EUREKA
          </Link>
          <Link href="/patent-bar" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            About the Patent Bar program
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {phase === 'loading' && (
          <div className="flex items-center justify-center p-16 text-slate-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading official questions…
          </div>
        )}

        {phase === 'quiz' && q && (
          <div className="space-y-5">
            <div>
              <p className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" /> Free diagnostic — {DIAG_SIZE} official USPTO exam questions. No account needed.
              </p>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Question {idx + 1} of {questions.length}</span>
                <span>{answeredCount} answered</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <p className="text-sm font-medium leading-relaxed">{q.question}</p>
              <div role="radiogroup" aria-label="Answer choices" className="mt-4 space-y-2">
                {q.options.map((opt: string, oi: number) => (
                  <button
                    key={oi} role="radio" aria-checked={answers[idx] === oi}
                    onClick={() => setAnswers((prev) => { const n = [...prev]; n[idx] = oi; return n; })}
                    className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      answers[idx] === oi
                        ? 'border-indigo-600 bg-indigo-50 font-medium dark:bg-indigo-950'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span className="mr-2 font-mono text-xs text-slate-400">{String.fromCharCode(65 + oi)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-40 dark:border-slate-700"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {idx < questions.length - 1 ? (
                <button
                  onClick={() => setIdx((i) => i + 1)}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setPhase('results')}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  See my results <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-center text-xs text-slate-400">
              No feedback until the end — just like the real exam. Unanswered questions score zero.
            </p>
          </div>
        )}

        {phase === 'results' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 p-8 text-center dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Your diagnostic score</p>
              <p className="mt-1 text-6xl font-extrabold">{pct}%</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {correct}/{questions.length} correct on official USPTO questions — the real exam requires ~70%.
              </p>
              <div className="mx-auto mt-6 max-w-sm space-y-1 text-left text-sm">
                {Object.entries(
                  questions.reduce((acc: Record<string, { c: number; t: number }>, qq, i) => {
                    const s = mockSectionOf(qq);
                    acc[s] = acc[s] || { c: 0, t: 0 };
                    acc[s].t++;
                    if (answers[i] === qq.correct) acc[s].c++;
                    return acc;
                  }, {}),
                ).map(([id, s]) => (
                  <div key={id} className="flex justify-between border-b border-slate-100 py-1 last:border-0 dark:border-slate-800">
                    <span>{sectionName(id)}</span>
                    <span className="font-mono">{s.c}/{s.t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-indigo-600 p-6 text-center">
              <p className="font-semibold">Keep going — free</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
                Create a free account for a 20-question QBank preview (half official USPTO
                questions), the lesson library, and your progress tracking.
              </p>
              <Link href={SIGNUP_HREF}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
                Create my free account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <h2 className="text-lg font-semibold">Review — official model answers</h2>
            {questions.map((qq, i) => {
              const right = answers[i] === qq.correct;
              return (
                <div key={qq.id} className={`space-y-2 rounded-xl border p-4 text-sm ${right ? 'border-emerald-300 dark:border-emerald-900' : 'border-red-300 dark:border-red-900'}`}>
                  <p className="flex items-center gap-2 text-xs font-medium">
                    {right ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    Q{i + 1} · Official USPTO
                  </p>
                  <p>{qq.question}</p>
                  <ol className="space-y-1">
                    {qq.options.map((opt: string, oi: number) => (
                      <li key={oi} className={`rounded-md border px-3 py-1.5 ${
                        oi === qq.correct ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                        : oi === answers[i] ? 'border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40'
                        : 'border-slate-200 dark:border-slate-800'}`}>
                        <span className="mr-2 font-mono text-xs text-slate-400">{String.fromCharCode(65 + oi)}</span>
                        {opt}
                        {oi === qq.correct && <span className="ml-2 text-xs text-emerald-600">correct</span>}
                        {oi === answers[i] && oi !== qq.correct && <span className="ml-2 text-xs text-red-500">your answer</span>}
                      </li>
                    ))}
                  </ol>
                  <p className="rounded-md bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-400">{qq.explanation}</p>
                </div>
              );
            })}

            <div className="flex justify-center">
              <button
                onClick={() => { setPhase('loading'); setTimeout(() => window.location.reload(), 50); }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
              >
                <RotateCcw className="h-4 w-4" /> Try a fresh set
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
