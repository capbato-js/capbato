import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { configureDI } from '../infrastructure/di/container';
import { configProvider } from '../infrastructure/config';

// Set NODE_ENV to development for React to enable act() functionality
process.env.NODE_ENV = 'development';

// Initialize configuration and DI for tests
beforeAll(async () => {
  // Reset configuration for test environment
  configProvider.reset();
  
  // Initialize configuration
  configProvider.initialize();
  
  // Configure dependency injection
  configureDI();
});

// Configure console error suppression for tests
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  // Suppress React warnings in tests (like act warnings)
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
        args[0].includes('Warning: An invalid form control') ||
        args[0].includes('act(...) is not supported in production builds') ||
        args[0].includes(
          'Warning: When testing, code that causes React state updates'
        ))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is deprecated') ||
        args[0].includes('componentWillMount has been renamed'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterEach(() => {
  console.error = originalError;
  console.warn = originalWarn;
  vi.clearAllMocks();
  
  // Re-configure DI to ensure clean state between tests
  configureDI();
});

// Global test utilities
declare global {
  var vi: typeof import('vitest').vi;
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  root = null;
  rootMargin = '';
  thresholds: number[] = [];
  takeRecords = vi.fn(() => []);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    // Mock implementation
  }
};

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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
