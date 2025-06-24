import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock Firebase
vi.mock('../firebase/config', () => {
  return {
    auth: {
      onAuthStateChanged: vi.fn(() => vi.fn()),
      signOut: vi.fn(() => Promise.resolve()),
      currentUser: null
    },
    db: {
      collection: vi.fn(() => ({
        doc: vi.fn(() => ({
          get: vi.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
          set: vi.fn(() => Promise.resolve()),
          update: vi.fn(() => Promise.resolve()),
        })),
        where: vi.fn(() => ({
          get: vi.fn(() => Promise.resolve({ empty: false, docs: [] })),
        })),
      })),
    },
    functions: {
      httpsCallable: vi.fn(() => vi.fn(() => Promise.resolve({ data: {} }))),
    },
    storage: {},
  };
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Clean up after each test
afterEach(() => {
  cleanup();
});