import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as unknown as typeof ResizeObserver;

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

// Suppress known React + library warnings in test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillUpdate'))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
declare global {
  // eslint-disable-next-line no-var
  var testUtils: {
    waitFor: (condition: () => boolean, timeout?: number) => Promise<void>;
    createMockApolloClient: () => Record<string, unknown>;
  };
}

global.testUtils = {
  waitFor: (condition: () => boolean, timeout = 1000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkCondition = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Condition not met within timeout'));
        } else {
          setTimeout(checkCondition, 10);
        }
      };
      checkCondition();
    });
  },

  createMockApolloClient: () => ({
    query: vi.fn(),
    mutate: vi.fn(),
    watchQuery: vi.fn(),
    subscribe: vi.fn(),
    readQuery: vi.fn(),
    readFragment: vi.fn(),
    writeQuery: vi.fn(),
    writeFragment: vi.fn(),
    resetStore: vi.fn(),
    clearStore: vi.fn(),
    onClearStore: vi.fn(),
    onResetStore: vi.fn(),
    cache: {
      readQuery: vi.fn(),
      readFragment: vi.fn(),
      writeQuery: vi.fn(),
      writeFragment: vi.fn(),
      reset: vi.fn(),
      restore: vi.fn(),
      extract: vi.fn(),
      identify: vi.fn(),
      evict: vi.fn(),
      gc: vi.fn(),
      modify: vi.fn(),
      read: vi.fn(),
      write: vi.fn(),
      diff: vi.fn(),
      watch: vi.fn(),
    },
  }),
};
