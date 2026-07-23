'use client';

/**
 * Patent Bar — public product/landing page (WS4 GTM).
 *
 * Conversion page for the Patent Bar vertical: a stranger can learn what the
 * product is, take the free diagnostic, and enter the signup → free preview
 * → checkout funnel. Public route (no auth).
 *
 * HONESTY RULES: every number here is real and traceable (bank composition
 * from docs/monetization/PATENT_BAR_COVERAGE_MATRIX.md; price fetched live
 * from the products API — the same table checkout charges from). No
 * testimonials, student counts, or pass-rate claims: none exist yet. The
 * provenance section states plainly which content is official USPTO and
 * which is original authored material pending expert review.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Timer, BookOpen, Layers, BarChart3, Landmark,
  CheckCircle2, ArrowRight, FileText, GraduationCap,
} from 'lucide-react';

// Real bank composition — see docs/monetization/PATENT_BAR_COVERAGE_MATRIX.md.
const BANK_TOTAL = 980;
const OFFICIAL_COUNT = 174;
const FLASHCARD_COUNT = 511;
const FREE_PREVIEW_COUNT = 20;

const FALLBACK_PRICE = '$599'; // products-table planning price; checkout always charges the live DB price

interface ProductInfo {
  name: string;
  price_cents: number;
  currency: string;
  interval: string;
}

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

const INCLUDED = [
  {
    icon: BookOpen,
    title: `${BANK_TOTAL}-question QBank at exact blueprint proportion`,
    desc: 'Every exam section holds exactly its blueprint weight — 30% prosecution, 20% patentability, 15% post-issuance, 15% ethics, 10% design/plant, 10% PCT. We publish the coverage matrix.',
  },
  {
    icon: Landmark,
    title: `${OFFICIAL_COUNT} official USPTO exam questions`,
    desc: 'Both sessions of the October 2003 and April 2003 released registration exams, transcribed verbatim and graded against the USPTO’s own model answers.',
  },
  {
    icon: Timer,
    title: 'Real Exam Mode',
    desc: 'A timed 100-question simulation in two 3-hour sessions with a break — drawn exclusively from verified questions, scored against the real 70% passing threshold.',
  },
  {
    icon: FileText,
    title: 'MPEP workbench',
    desc: 'Chapter-by-chapter MPEP navigation with a tested-frequency heatmap, mirroring how the open-book real exam actually works.',
  },
  {
    icon: Layers,
    title: `${FLASHCARD_COUNT} flashcards with spaced repetition`,
    desc: 'SM-2 scheduling on rules, deadlines, and doctrine — the memorization layer under the practice layer.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & command center',
    desc: 'Per-topic accuracy, weakness heatmaps, and mock history so you always know where you stand.',
  },
];

const FAQ = [
  {
    q: 'What is the Patent Bar exam?',
    a: 'The USPTO registration examination: 100 multiple-choice questions in two 3-hour sessions, open-book (the MPEP is searchable during the exam). Roughly 70% is required to pass. Passing plus a qualifying technical background registers you to practice in patent matters before the USPTO as a patent agent or attorney.',
  },
  {
    q: 'What do I get for free?',
    a: `The public diagnostic on this page (no account needed), and with a free account, a ${FREE_PREVIEW_COUNT}-question preview of the QBank — half of it official USPTO questions — plus the lesson library preview.`,
  },
  {
    q: 'Where do your questions come from?',
    a: `${OFFICIAL_COUNT} questions are the USPTO’s own released exams (public domain), graded by the official model answers. The remaining questions are original, written to the exam blueprint with statute and MPEP citations, and are clearly labeled in-product until they pass expert review — scored mocks draw only from verified questions.`,
  },
  {
    q: 'Do you guarantee I will pass?',
    a: 'No — and you should be skeptical of anyone who does. We publish our coverage matrix and label the provenance of every question; the diagnostic and mocks tell you honestly where you stand.',
  },
  {
    q: 'How does payment work?',
    a: 'One-time purchase via Stripe checkout. Billing questions: reach us through the contact page.',
  },
];

export default function PatentBarLandingPage() {
  const [product, setProduct] = useState<ProductInfo | null>(null);

  useEffect(() => {
    fetch(`${API}/billing/test-prep/products`)
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: any[]) => {
        const p = rows.find?.((r) => r.exam_code === 'PATENT_BAR');
        if (p) setProduct(p);
      })
      .catch(() => {});
  }, []);

  const price = product
    ? (product.price_cents / 100).toLocaleString('en-US', {
        style: 'currency', currency: product.currency.toUpperCase(), maximumFractionDigits: 0,
      })
    : FALLBACK_PRICE;

  const signupHref = '/auth/register?next=/dashboard/test-prep/patent_bar';

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <GraduationCap className="h-6 w-6 text-indigo-600" /> EUREKA
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/auth/login" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Log in</Link>
            <Link href={signupHref} className="rounded-lg bg-indigo-600 px-4 py-1.5 font-medium text-white hover:bg-indigo-700">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-4 pb-12 pt-16 text-center md:pt-24">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
          <ShieldCheck className="h-3.5 w-3.5" /> Built on {OFFICIAL_COUNT} official USPTO exam questions
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
          Prepare for the Patent Bar with the exam&apos;s own questions.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          A complete USPTO registration exam program for engineers and scientists:
          a {BANK_TOTAL}-question QBank matched exactly to the exam blueprint, timed
          real-exam simulations, and an MPEP workbench that trains the open-book skill
          the exam actually tests.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/patent-bar/diagnostic"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
            Take the free diagnostic <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={signupHref}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900">
            Start the free preview
          </Link>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          No account needed for the diagnostic · {FREE_PREVIEW_COUNT} free QBank questions with an account
        </p>
      </header>

      {/* Stats strip */}
      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center md:grid-cols-4">
          {[
            [`${BANK_TOTAL}`, 'QBank questions, blueprint-exact'],
            [`${OFFICIAL_COUNT}`, 'official USPTO released-exam questions'],
            ['100 Q', 'timed mock — two 3-hour sessions'],
            [`${FLASHCARD_COUNT}`, 'flashcards with spaced repetition'],
          ].map(([n, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{n}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Everything in the program</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INCLUDED.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
              <Icon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Provenance — the honesty section */}
      <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Where every question comes from</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-400">
            Most prep courses won&apos;t tell you. We label every question in the product.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold">{OFFICIAL_COUNT} official USPTO questions</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The October 2003 and April 2003 released registration exams (both sessions),
                  public-domain U.S. government works, transcribed verbatim and keyed to the
                  USPTO&apos;s published model answers. Pre-AIA items are tagged so you know
                  when the law has since changed.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">{BANK_TOTAL - OFFICIAL_COUNT} original questions, written to the blueprint</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Authored against the statutes, rules, and MPEP with citations, and labeled
                  &ldquo;unverified&rdquo; in-product until they pass expert review. Scored mock
                  exams draw only from verified questions — never from the unverified pool.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
              <div>
                <p className="font-semibold">No pass-rate claims</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We don&apos;t publish pass rates or testimonials we can&apos;t back. The
                  diagnostic and the mocks are designed to tell you the truth about your
                  readiness instead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">Simple pricing</h2>
        <div className="mx-auto mt-8 max-w-md rounded-2xl border-2 border-indigo-600 p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Patent Bar Full Access</p>
          <p className="mt-2 text-5xl font-extrabold">{price}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">one-time purchase · no subscription</p>
          <ul className="mt-6 space-y-2 text-left text-sm">
            {[
              `Full ${BANK_TOTAL}-question QBank incl. all ${OFFICIAL_COUNT} official USPTO questions`,
              'Real Exam Mode — unlimited timed 100-question mocks',
              'MPEP workbench, flashcards, analytics, spaced repetition',
              'Every future question added to the Patent Bar bank',
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {f}
              </li>
            ))}
          </ul>
          <Link href={signupHref}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
            Start free, upgrade inside <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Try the {FREE_PREVIEW_COUNT}-question free preview first — upgrade only if it&apos;s right for you.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Questions</h2>
          <div className="mt-8 space-y-6">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-semibold">{q}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} EUREKA ·{' '}
          <Link href="/" className="hover:underline">Home</Link> ·{' '}
          <Link href="/contact" className="hover:underline">Contact</Link>
        </p>
      </footer>
    </div>
  );
}
