// /support — the support hub: routes into help, docs, status, community and
// contact, plus a practical FAQ. Server component.

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MarketingNav,
  MarketingFooter,
  Kicker,
  PageHero,
  CtaPrimary,
  CtaSecondary,
} from '@/components/marketing/chrome';

export const metadata: Metadata = {
  title: 'Support — EUREKA',
  description:
    'Help center, documentation, system status, community and contact — everything for getting unstuck on EUREKA.',
};

const CHANNELS = [
  {
    title: 'Help center',
    desc: 'Guides for accounts, courses, practice, billing and institution setup.',
    href: '/help',
    label: 'Open help center',
  },
  {
    title: 'Contact us',
    desc: 'Questions, feedback, or an institutional inquiry — write to a human.',
    href: '/contact',
    label: 'Contact',
  },
  {
    title: 'System status',
    desc: 'Live service health for the platform and its APIs.',
    href: '/system-status',
    label: 'Check status',
  },
  {
    title: 'Community',
    desc: 'Study groups, discussion, and learners on the same path.',
    href: '/community',
    label: 'Join in',
  },
  {
    title: 'API documentation',
    desc: 'For developers and institutional integrators.',
    href: '/api-docs',
    label: 'Read the docs',
  },
  {
    title: 'For institutions',
    desc: 'Deployment, SSO/LTI configuration, cohorts and compliance.',
    href: '/institutions',
    label: 'Institution support',
  },
];

const FAQ = [
  {
    q: 'How do I get started?',
    a: 'Create a free account, pick a program (or take a free diagnostic — the Patent Bar program has one that requires no account), and the planner takes it from there.',
  },
  {
    q: 'I found a mistake in a question or lesson.',
    a: 'Please tell us — content correctness is the product. Use the report control next to any item, or the contact page with a link to the lesson. Confirmed reports are fixed and credited in the changelog.',
  },
  {
    q: 'Can I use EUREKA on my phone?',
    a: 'Yes. The platform is responsive across phone, tablet and desktop, and your progress follows your account across all of them.',
  },
  {
    q: 'How does billing work?',
    a: 'Individual learners use EUREKA free. Institutions are billed on custom plans by seat count and integrations — talk to us via the institutions page.',
  },
  {
    q: 'How do I connect our school’s SSO / LMS?',
    a: 'EUREKA supports SSO/SAML and LTI 1.3. Institutional onboarding walks your IT team through identity, rostering and gradebook return — start from the institutions page and we will schedule it.',
  },
  {
    q: 'How is my data handled?',
    a: 'Per the privacy policy, with FERPA/COPPA/HIPAA controls available for institutional deployments. You can export your own data and delete your account from settings at any time.',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <MarketingNav />
      <main id="main">
        <PageHero
          kicker="Support"
          title="Get unstuck, fast"
          lead="Six routes to an answer — pick the one that matches your question. Content corrections are treated as bugs and prioritized accordingly."
        />

        {/* Channels */}
        <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 dark:border-stone-800 dark:bg-stone-800 sm:grid-cols-2 lg:grid-cols-3">
              {CHANNELS.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group flex flex-col bg-white p-8 transition-colors hover:bg-stone-50 dark:bg-stone-950 dark:hover:bg-stone-900"
                >
                  <h3 className="text-base font-bold tracking-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                    {c.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-stone-600 dark:text-stone-400">{c.desc}</p>
                  <span className="mt-5 text-sm font-semibold text-indigo-700 dark:text-indigo-400">{c.label} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <Kicker>Common questions</Kicker>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Before you write in</h2>
            <div className="mt-10 grid max-w-5xl gap-x-14 gap-y-10 md:grid-cols-2">
              {FAQ.map((item) => (
                <div key={item.q} className="border-t border-stone-200 pt-5 dark:border-stone-800">
                  <h3 className="text-base font-semibold">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact band */}
        <section className="bg-white dark:bg-stone-950">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight">Still stuck?</h2>
              <p className="mt-4 text-base leading-7 text-stone-600 dark:text-stone-400">
                Write to us with what you were doing, what you expected, and what happened instead —
                we read everything.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CtaPrimary href="/contact">Contact support</CtaPrimary>
                <CtaSecondary href="/help">Browse the help center</CtaSecondary>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
