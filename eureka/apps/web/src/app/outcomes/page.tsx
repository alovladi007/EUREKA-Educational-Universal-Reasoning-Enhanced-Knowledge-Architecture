// /outcomes — where the platform takes people: exams, disciplines, school,
// clinical skill, institutions, careers. Server component with anchor
// sections so home-page and program links can deep-link.

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MarketingNav,
  MarketingFooter,
  Kicker,
  PageHero,
  CtaBand,
} from '@/components/marketing/chrome';
import { OUTCOMES } from '@/lib/marketing';

export const metadata: Metadata = {
  title: 'Outcomes — where EUREKA takes you',
  description:
    'Pass a licensing exam, master a discipline, finish school strong, build clinical skill, or run the platform for an institution — the destinations EUREKA is built to reach.',
};

const PATHS = [
  {
    step: 'Start',
    title: 'A goal, named',
    desc: 'An exam date, a course you must pass, a subject you want to own. Every EUREKA journey starts by naming the destination, because the planner schedules backwards from it.',
  },
  {
    step: 'Middle',
    title: 'Practice, graded, adapted',
    desc: 'Daily work is graded practice routed by your mastery model, with the AI tutor on call and missed items cycling back through spaced review until they stop being missed.',
  },
  {
    step: 'Finish',
    title: 'Evidence, not vibes',
    desc: 'Timed mocks that predict the real event, certificates earned by demonstrated mastery, and a transcript of what you can actually do.',
  },
];

export default function OutcomesPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <MarketingNav />
      <main id="main">
        <PageHero
          kicker="Outcomes"
          title="Where this platform goes to work"
          lead="A learning platform is judged by what people leave it able to do. These are the destinations EUREKA is engineered to reach — each one backed by a specific program, not a promise."
        />

        {/* The arc */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 dark:border-stone-800 dark:bg-stone-800 md:grid-cols-3">
              {PATHS.map((p) => (
                <div key={p.step} className="bg-white p-8 dark:bg-stone-950">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">{p.step}</p>
                  <h3 className="mt-3 text-lg font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The destinations */}
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Destinations</Kicker>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight">
              Six ways people use EUREKA
            </h2>
            <div className="mt-12 space-y-0 divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
              {OUTCOMES.map((o, i) => (
                <div key={o.id} id={o.id} className="grid gap-4 py-10 scroll-mt-24 md:grid-cols-[80px_1fr_auto] md:items-start md:gap-10">
                  <span className="font-mono text-2xl font-medium text-stone-300 dark:text-stone-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{o.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-400">{o.desc}</p>
                  </div>
                  <Link
                    href={o.href}
                    className="self-center whitespace-nowrap text-sm font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    {o.linkLabel} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaBand
          title="Name the destination"
          desc="Pick the outcome that matches yours, open its program, and take the diagnostic. The distance between where you are and where you are going becomes a plan."
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
