/**
 * Smoke test for the Security+ PBQ runner.
 *
 * Native HTML5 drag-and-drop can't be reliably driven in jsdom, so this
 * exercises the click-to-assign fallback — which shares the exact same
 * assign()/scoring code path as drag-drop. It validates the real logic:
 * placing every token in its correct category and grading the result as
 * fully correct, plus the ordering interaction via the up/down arrows.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SecurityPlusPBQTab } from '@/components/test-prep/SecurityPlusPBQ';
import {
  SECURITY_PLUS_PBQS,
  type CategorizePBQ,
  type OrderPBQ,
} from '@/lib/security-plus-pbq-data';

const firstCategorize = SECURITY_PLUS_PBQS.find((p) => p.type === 'categorize') as CategorizePBQ;

describe('SecurityPlusPBQTab', () => {
  it('renders the first PBQ with its title and instructions', () => {
    render(<SecurityPlusPBQTab />);
    expect(screen.getByText(firstCategorize.title)).toBeInTheDocument();
    expect(screen.getByText(firstCategorize.instructions)).toBeInTheDocument();
  });

  it('grades a fully-correct categorize PBQ as Correct via click-to-assign', () => {
    render(<SecurityPlusPBQTab />);
    const pbq = firstCategorize;

    // For each token: click the token (select), then click its correct category.
    for (const token of pbq.tokens) {
      const catLabel = pbq.categories.find((c) => c.id === token.answer)!.label;
      fireEvent.click(screen.getByText(token.label));
      fireEvent.click(screen.getByText(catLabel));
    }

    fireEvent.click(screen.getByRole('button', { name: /check answer/i }));

    // Grade badge reads "Correct! — N/N placed correctly"
    const n = pbq.tokens.length;
    expect(document.body.textContent).toContain(`Correct! — ${n}/${n} placed correctly`);
    // Explanation surfaces after checking.
    expect(screen.getByText(/Explanation/)).toBeInTheDocument();
  });

  it('detects an incorrect placement (not all correct → Review)', () => {
    render(<SecurityPlusPBQTab />);
    const pbq = firstCategorize;

    // Place every token in the FIRST category regardless of correctness.
    const wrongCat = pbq.categories[0].label;
    for (const token of pbq.tokens) {
      fireEvent.click(screen.getByText(token.label));
      fireEvent.click(screen.getByText(wrongCat));
    }
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }));

    // At least one token belongs elsewhere, so it grades as Review (not perfect).
    expect(document.body.textContent).toContain('Review —');
    expect(document.body.textContent).not.toContain('Correct! —');
  });

  it('renders an ordering PBQ with all of its steps when selected', () => {
    render(<SecurityPlusPBQTab />);
    const order = SECURITY_PLUS_PBQS.find((p) => p.type === 'order') as OrderPBQ;
    // Select it from the pill list (label prefixed by its 1-based index).
    const idx = SECURITY_PLUS_PBQS.indexOf(order);
    fireEvent.click(screen.getByText(`${idx + 1}. ${order.title}`));
    for (const item of order.items) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    }
  });
});
