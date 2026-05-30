import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount React trees and clear DOM between tests so global event
// listeners (e.g. the SRS Review keydown handler) don't leak across
// test cases.
afterEach(() => {
  cleanup();
});
