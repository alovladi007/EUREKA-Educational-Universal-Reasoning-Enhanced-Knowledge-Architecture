'use client';

import { useState } from 'react';
import { getToken } from '@/lib/api';
import { useAccommodations } from '@/lib/useAccommodations';
import { AppShell } from '@/components/AppShell';
import { SignInScreen } from '@/components/PageShell';

// Self-service accessibility accommodations (Build prompt Section 13). Toggles
// apply immediately via useAccommodations (which persists them and re-applies
// the high-contrast / reduced-motion classes app-wide), so a change takes effect
// on this page and everywhere else, including mid-assessment.

const EXTRA_TIME_OPTIONS = [
  { value: 1.0, label: 'Standard time' },
  { value: 1.5, label: 'Time and a half (1.5x)' },
  { value: 2.0, label: 'Double time (2x)' },
];

export default function AccessibilityPage() {
  const { accommodations, update } = useAccommodations();
  const [saving, setSaving] = useState(false);

  if (typeof window !== 'undefined' && !getToken()) {
    return <SignInScreen />;
  }

  async function toggle(patch: Parameters<typeof update>[0]) {
    setSaving(true);
    try {
      await update(patch);
    } finally {
      setSaving(false);
    }
  }

  const rows: {
    key: 'high_contrast' | 'reduced_motion' | 'text_to_speech';
    label: string;
    help: string;
  }[] = [
    {
      key: 'high_contrast',
      label: 'High contrast',
      help: 'Maximum-contrast colors and bold focus outlines.',
    },
    {
      key: 'reduced_motion',
      label: 'Reduced motion',
      help: 'Minimize animations and transitions.',
    },
    {
      key: 'text_to_speech',
      label: 'Read aloud (text-to-speech)',
      help: 'Show a "Read aloud" button on questions.',
    },
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Accessibility</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          These accommodations apply everywhere, including during an assessment.
        </p>

        <section className="mt-8 space-y-3">
          {rows.map((row) => {
            const on = accommodations[row.key];
            return (
              <div
                key={row.key}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <p className="text-sm font-medium text-card-foreground">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.help}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={row.label}
                  disabled={saving}
                  onClick={() => void toggle({ [row.key]: !on })}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                    on ? 'bg-brand-600' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      on ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-4">
          <label
            htmlFor="extra-time"
            className="block text-sm font-medium text-card-foreground"
          >
            Extra time on timed assessments
          </label>
          <p className="mb-2 text-xs text-muted-foreground">
            A teacher usually grants this, but you can request it here.
          </p>
          <select
            id="extra-time"
            value={accommodations.extra_time_multiplier}
            disabled={saving}
            onChange={(e) =>
              void toggle({ extra_time_multiplier: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {EXTRA_TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </section>
      </main>
    </AppShell>
  );
}
