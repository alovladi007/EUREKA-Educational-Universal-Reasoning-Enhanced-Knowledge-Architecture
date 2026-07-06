'use client';

import { useEffect, useRef, useState } from 'react';
import type { MathfieldElement } from 'mathlive';

// A React wrapper around MathLive's <math-field> web component: a real math
// editor (fractions, exponents, roots, Greek letters) instead of a plain text
// box. The field reports its content as ASCII-math on every change, which is the
// format the SymPy grader parses (with ^ accepted for exponent). LaTeX is also
// reported for anything that wants to render or store it.
//
// MathLive touches window/document at import time, so it is loaded lazily on the
// client only. Its fonts and sounds are served from /public/mathlive so the
// editor is fully self-contained with no CDN dependency.

let mathliveLoader: Promise<void> | null = null;

function ensureMathlive(): Promise<void> {
  if (mathliveLoader) {
    return mathliveLoader;
  }
  mathliveLoader = import('mathlive').then((mod) => {
    const element = mod.MathfieldElement;
    if (element) {
      // Static config: where the web component finds its assets. Set once.
      element.fontsDirectory = '/mathlive/fonts';
      element.soundsDirectory = '/mathlive/sounds';
    }
  });
  return mathliveLoader;
}

export interface MathFieldProps {
  // Initial ASCII-math value. The field is otherwise uncontrolled; give it a
  // React key tied to the item so a new question mounts an empty field.
  value?: string;
  onChange?: (asciiMath: string, latex: string) => void;
  onEnter?: () => void;
  readOnly?: boolean;
  ariaLabel?: string;
  placeholder?: string;
}

export function MathField({
  value = '',
  onChange,
  onEnter,
  readOnly = false,
  ariaLabel,
  placeholder,
}: MathFieldProps) {
  const ref = useRef<MathfieldElement | null>(null);
  const [ready, setReady] = useState(false);
  // Keep the latest callbacks in a ref so the listener effect does not need to
  // re-bind (and lose the element) when a parent re-renders with new closures.
  const handlers = useRef({ onChange, onEnter });
  handlers.current = { onChange, onEnter };

  useEffect(() => {
    let cancelled = false;
    void ensureMathlive().then(() => {
      if (!cancelled) {
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !ready) {
      return;
    }
    if (value) {
      element.setValue(value, { format: 'ascii-math' });
    }
    const onInput = () => {
      handlers.current.onChange?.(
        element.getValue('ascii-math'),
        element.getValue('latex'),
      );
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handlers.current.onEnter?.();
      }
    };
    element.addEventListener('input', onInput);
    element.addEventListener('keydown', onKeyDown);
    return () => {
      element.removeEventListener('input', onInput);
      element.removeEventListener('keydown', onKeyDown);
    };
    // value is intentionally an initial-only prop; see the key-remount note.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    const element = ref.current;
    if (element && ready) {
      element.readOnly = readOnly;
    }
  }, [readOnly, ready]);

  if (!ready) {
    return (
      <div className="h-11 w-full animate-pulse rounded-lg border border-border bg-muted" />
    );
  }

  return (
    <div
      className={`rounded-lg border border-border bg-background px-2 py-1 focus-within:ring-2 focus-within:ring-brand-500 ${
        readOnly ? 'opacity-70' : ''
      }`}
    >
      <math-field
        ref={ref}
        aria-label={ariaLabel}
        placeholder={placeholder}
        style={{ width: '100%', fontSize: '1.125rem', border: 'none' }}
        math-virtual-keyboard-policy="manual"
      />
    </div>
  );
}
