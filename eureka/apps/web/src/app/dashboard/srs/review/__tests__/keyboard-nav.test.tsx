/**
 * Smoke test for the SRS Review page's keyboard navigation.
 *
 * Verifies the keydown handler installed in page.tsx:
 *   - Space reveals the answer
 *   - 1 → handleGrade(0)  (Again)
 *   - 3 → handleGrade(4)  (Good)
 *
 * The page's default export is wrapped in `<ProtectedRoute>` and
 * `<DashboardLayout>`. We mock both as passthroughs so the inner
 * `<SrsReview />` mounts directly. `next/navigation` and the API
 * client are also mocked so the component is fully self-contained.
 *
 * This is intentionally one focused test — the goal is to validate
 * the Vitest scaffolding end-to-end, not exhaustive coverage.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SrsCard } from '@/types';

// ── Mocks ────────────────────────────────────────────────────────────

// next/navigation has no jsdom-compatible implementation; we stub the
// three hooks the page consumes. useSearchParams returns an empty
// URLSearchParams so `params.get('deck')` and `params.get('action')`
// both yield null (the default-path behaviour).
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  usePathname: () => '/dashboard/srs/review',
}));

// ProtectedRoute and DashboardLayout would normally pull in auth
// providers, the global nav, and a bunch of side-effecting hooks.
// For this test we just need the page's keyboard handler to run, so
// we replace both with transparent passthroughs.
vi.mock('@/components/auth/ProtectedRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/layout/DashboardLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// API client — provide stubs for the three SRS methods the review
// page calls (listDueSrsCards on mount, reviewSrsCard on grade,
// deleteSrsCard on the trash-can button).
const reviewSpy = vi.fn();
const listDueSpy = vi.fn();

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    listDueSrsCards: (...args: unknown[]) => listDueSpy(...args),
    reviewSrsCard: (...args: unknown[]) => reviewSpy(...args),
    deleteSrsCard: vi.fn().mockResolvedValue(undefined),
    createSrsCard: vi.fn().mockResolvedValue({}),
  },
}));

// ── Helpers ──────────────────────────────────────────────────────────

function makeCard(overrides: Partial<SrsCard> = {}): SrsCard {
  const now = new Date().toISOString();
  return {
    id: 'card-1',
    user_id: 'user-1',
    deck: 'general',
    front: 'What is the capital of France?',
    back: 'Paris',
    tags: null,
    ease_factor: 2.5,
    interval_days: 0,
    repetitions: 0,
    next_review: now,
    last_review: null,
    total_reviews: 0,
    total_correct: 0,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────

describe('SRS Review — keyboard navigation', () => {
  beforeEach(() => {
    reviewSpy.mockReset();
    listDueSpy.mockReset();
  });

  it('Space reveals the answer and 3 grades the card as Good (quality=4)', async () => {
    const card = makeCard();
    listDueSpy.mockResolvedValue({ cards: [card], total: 1 });
    reviewSpy.mockResolvedValue({ ...card, repetitions: 1 });

    // Import the page after the mocks are registered so the
    // module-graph resolution picks up the stubbed dependencies.
    const { default: SrsReviewPage } = await import('../page');

    const user = userEvent.setup();
    render(<SrsReviewPage />);

    // Wait for the queue to load and the front of the card to render.
    expect(await screen.findByText('What is the capital of France?')).toBeInTheDocument();

    // Before reveal: the "Show answer" button is visible and the
    // back of the card is hidden.
    expect(screen.getByRole('button', { name: /show answer/i })).toBeInTheDocument();
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();

    // Space reveals the answer.
    await user.keyboard(' ');

    expect(await screen.findByText('Paris')).toBeInTheDocument();
    // Grade buttons appear once revealed.
    expect(
      screen.getByRole('button', { name: /grade card good/i }),
    ).toBeInTheDocument();

    // Pressing "3" grades the card as Good → quality 4.
    await user.keyboard('3');

    await waitFor(() => {
      expect(reviewSpy).toHaveBeenCalledWith('card-1', 4);
    });
  });

  it('Space reveals the answer and 1 grades the card as Again (quality=0)', async () => {
    const card = makeCard({ id: 'card-again' });
    listDueSpy.mockResolvedValue({ cards: [card], total: 1 });
    reviewSpy.mockResolvedValue({ ...card, repetitions: 0 });

    const { default: SrsReviewPage } = await import('../page');

    const user = userEvent.setup();
    render(<SrsReviewPage />);

    await screen.findByText('What is the capital of France?');
    await user.keyboard(' ');
    await screen.findByText('Paris');

    await user.keyboard('1');

    await waitFor(() => {
      expect(reviewSpy).toHaveBeenCalledWith('card-again', 0);
    });
  });

  it('Enter also reveals the answer (parity with Space)', async () => {
    const card = makeCard({ id: 'card-enter' });
    listDueSpy.mockResolvedValue({ cards: [card], total: 1 });
    reviewSpy.mockResolvedValue({ ...card });

    const { default: SrsReviewPage } = await import('../page');

    const user = userEvent.setup();
    render(<SrsReviewPage />);

    await screen.findByText('What is the capital of France?');
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();

    await user.keyboard('{Enter}');

    expect(await screen.findByText('Paris')).toBeInTheDocument();
  });
});
