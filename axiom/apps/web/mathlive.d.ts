// JSX typing for MathLive's <math-field> custom element, so it can be used in
// TSX with a typed ref. MathLive registers the element at runtime; this only
// teaches TypeScript about it.
import type { MathfieldElement } from 'mathlive';
import type React from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement> & {
          ref?: React.Ref<MathfieldElement>;
          placeholder?: string;
          'math-virtual-keyboard-policy'?: 'auto' | 'manual' | 'sandboxed';
        },
        MathfieldElement
      >;
    }
  }
}

export {};
