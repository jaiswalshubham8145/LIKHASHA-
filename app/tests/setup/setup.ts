import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.useRealTimers();
});
afterAll(() => server.close());

if (typeof window !== 'undefined') {
  // matchMedia stub for jsdom/happy-dom
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  // IntersectionObserver stub
  if (!window.IntersectionObserver) {
    class IO {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn().mockReturnValue([]);
    }
    // @ts-expect-error - test polyfill
    window.IntersectionObserver = IO;
  }

  // ResizeObserver stub
  if (!window.ResizeObserver) {
    class RO {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    // @ts-expect-error - test polyfill
    window.ResizeObserver = RO;
  }
}

// stable IDs for snapshot tests
vi.mock('nanoid', () => ({ nanoid: () => 'test-id' }));
