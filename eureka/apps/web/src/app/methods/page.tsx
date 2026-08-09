// /methods — the pedagogy page: the four commitments expanded, plus the
// actual machinery (grading, mastery modeling, spaced review, verification)
// named honestly. Server component; shares the marketing chrome.

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MarketingNav,
  MarketingFooter,
  Kicker,
  PageHero,
  CtaBand,
} from '@/components/marketing/chrome';
import { COMMITMENTS } from '@/lib/marketing';

export const metadata: Metadata = {
  title: 'Methods — how EUREKA teaches',
  description:
    'Graded practice, mastery modeling, spaced repetition, machine-verified mathematics and honestly sourced content — the machinery behind every EUREKA program.',
};

const MACHINERY = [
  {
    title: 'Auto-grading with diagnosis',
    body:
      'Every practice item is graded the moment you answer it, with feedback specific to what went wrong. Mathematics is checked by a computer algebra system (SymPy) for genuine equivalence — 2(x+1) and 2x+2 both pass — and common misconceptions are recognised and named rather than just marked wrong.',
    mono: 'SymPy CAS · 20+ item types',
  },
  {
    title: 'A mastery model, not a progress bar',
    body:
      'Underneath the interface sits Bayesian Knowledge Tracing and Item Response Theory: an estimate, per skill, of whether you actually own it. The adaptive planner sequences work against that estimate — you advance when the model believes you, and you get routed back when it stops believing.',
    mono: 'BKT + IRT · adaptive CAT',
  },
  {
    title: 'Spaced repetition on everything',
    body:
      'Missed items become review cards scheduled by the SM-2 algorithm — the same engine across flashcards, exam drills and course problem sets. Weaknesses get revisited on the forgetting curve, not whenever you happen to scroll past them.',
    mono: 'SM-2 · unified review queue',
  },
  {
    title: 'Proof, formally verified',
    body:
      'The mathematics track grades structured and scaffolded proofs in the app, and its formal track checks submissions against a real Lean 4 kernel. When the platform says a proof is correct, that claim is machine-checked, not pattern-matched.',
    mono: 'Lean 4 kernel · proof ladder',
  },
  {
    title: 'Content with receipts',
    body:
      'Exam banks are anchored on official public-domain questions where they exist — 272 released USPTO items in the Patent Bar program. Course figures in the flagship engineering track are computed from the equations stated in the lesson, with readable source. AI demonstrations state whether they run real inference.',
    mono: 'official items · computed figures',
  },
  {
    title: 'An AI tutor that shows its work',
    body:
      'The tutor works the problem in front of you step by step — hints before answers, Socratic where that helps, direct where it does not. It sits alongside the graded practice rather than replacing it, so help never silently becomes doing it for you.',
    mono: 'step-by-step · on call',
  },
];

const RIGOR = [
  ['Depth gate, flagship courses', '18k words · 60 equations · 20 figures per module'],
  ['Patent Bar question bank', '1,078 items · 272 official USPTO'],
  ['Mathematics lesson standard', '≥20 pages per topic, worked examples + problem sets'],
  ['Exam formats reproduced', 'MCQ, multi-select, PBQ, timed sections'],
  ['Institution controls', 'SSO/SAML · LTI 1.3 · FERPA · COPPA · HIPAA'],
];

export default function MethodsPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <MarketingNav />
      <main id="main">
        <PageHero
          kicker="Methods"
          title="How we teach"
          lead="Most platforms measure watching. EUREKA measures mastery — with graded practice at the centre and real machinery underneath. This page is the honest tour of that machinery."
        />

        {/* The four commitments, expanded */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Commitments</Kicker>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight">
              Four commitments we design against
            </h2>
            <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
              {COMMITMENTS.map((c) => (
                <div key={c.n} className="flex gap-6">
                  <span className="font-mono text-2xl font-medium text-stone-300 dark:text-stone-700">{c.n}</span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">{c.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The machinery */}
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Machinery</Kicker>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight">
              What actually runs when you practice
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 dark:border-stone-800 dark:bg-stone-800 md:grid-cols-2 lg:grid-cols-3">
              {MACHINERY.map((m) => (
                <div key={m.title} className="flex flex-col bg-white p-8 dark:bg-stone-950">
                  <h3 className="text-base font-bold tracking-tight">{m.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-stone-600 dark:text-stone-400">{m.body}</p>
                  <p className="mt-5 font-mono text-xs text-stone-400 dark:text-stone-500">{m.mono}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Standards table */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Standards</Kicker>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight">
              Numbers we hold ourselves to
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-400">
              Depth claims are cheap; gates are not. These are the measurable standards the content is
              built against — enforced by tooling, not by copywriting.
            </p>
            <dl className="mt-10 max-w-3xl divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
              {RIGOR.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="text-sm font-medium text-stone-700 dark:text-stone-300">{k}</dt>
                  <dd className="font-mono text-sm text-stone-500 dark:text-stone-400">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-sm text-stone-500 dark:text-stone-400">
              See the standards applied:{' '}
              <Link
                href="/programs/electronic-photonic-devices"
                className="font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400"
              >
                Electronic &amp; Photonic Devices →
              </Link>
            </p>
          </div>
        </section>

        <CtaBand
          title="Judge the method by the practice"
          desc="Open any program and work three problems. The grading, the feedback, and the review queue will tell you more than this page can."
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
