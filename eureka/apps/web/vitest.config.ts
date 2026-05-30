import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Vitest config for the Next.js web app.
 *
 * - jsdom for DOM APIs in tests
 * - `@/...` alias mirrors the Next.js tsconfig paths so test files can
 *   import `@/components/...` the same way prod code does
 * - global setup file wires up jest-dom matchers and cleanup
 *
 * Note: the project tsconfig sets `jsx: "preserve"` because Next.js
 * owns JSX transformation at build time. For tests, the
 * `@vitejs/plugin-react` plugin handles JSX → JS conversion in
 * `.tsx` files via its babel pipeline, independent of tsconfig.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist'],
    css: false,
  },
});
