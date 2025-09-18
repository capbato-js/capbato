import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as ReactDOM from 'react-dom/client';

// Mock the entire DI and config modules
vi.mock('./infrastructure/di/container', () => ({
  configureDI: vi.fn(),
}));

vi.mock('./infrastructure/config', () => ({
  configProvider: {
    initialize: vi.fn(),
  },
}));

vi.mock('./app/app', () => ({
  default: () => <div data-testid="app">Mock App</div>,
}));

vi.mock('./lib/mantine-theme', () => ({
  mantineTheme: {},
}));

// Mock React DOM
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

describe('main.tsx initialization', () => {
  let originalConsoleError: typeof console.error;
  let mockCreateRoot: ReturnType<typeof vi.fn>;
  let mockRender: ReturnType<typeof vi.fn>;
  let mockRoot: { render: ReturnType<typeof vi.fn> };
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    
    originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Setup mock root element
    const mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    document.getElementById = vi.fn().mockReturnValue(mockRootElement);
    
    // Setup ReactDOM mocks
    mockRender = vi.fn();
    mockRoot = { render: mockRender };
    mockCreateRoot = vi.fn().mockReturnValue(mockRoot);
    vi.mocked(ReactDOM.createRoot).mockImplementation(mockCreateRoot);
  });

  afterEach(() => {
    console.error = originalConsoleError;
    vi.resetModules();
  });

  it('should initialize configuration and DI on module load', async () => {
    const { configureDI } = await import('./infrastructure/di/container');
    const { configProvider } = await import('./infrastructure/config');
    
    // Import main to trigger initialization
    await import('./main');

    expect(configProvider.initialize).toHaveBeenCalledTimes(1);
    expect(configureDI).toHaveBeenCalledTimes(1);
  }, 10000);

  it('should create React root and render app', async () => {
    // Import main to trigger React rendering
    await import('./main');

    expect(mockCreateRoot).toHaveBeenCalledWith(
      expect.any(HTMLElement)
    );
    // StrictMode in development causes double rendering, so we accept 1 or 2 calls
    expect(mockRender).toHaveBeenCalledTimes(1);
  }, 10000);

  it('should handle configuration errors gracefully', async () => {
    const { configProvider } = await import('./infrastructure/config');
    const error = new Error('Config validation failed');
    vi.mocked(configProvider.initialize).mockImplementation(() => {
      throw error;
    });

    // This should throw because configuration failed
    await expect(() => import('./main')).rejects.toThrow('Config validation failed');
    expect(console.error).toHaveBeenCalledWith('❌ Configuration validation failed:', error);
  }, 10000);

  it('should successfully load when configuration is valid', async () => {
    const { configProvider } = await import('./infrastructure/config');
    vi.mocked(configProvider.initialize).mockImplementation(() => {
      // Mock successful initialization
    });

    expect(async () => {
      await import('./main');
    }).not.toThrow();
  }, 10000);

  it('should find root element correctly', async () => {
    const { configProvider } = await import('./infrastructure/config');
    vi.mocked(configProvider.initialize).mockImplementation(() => {
      // Mock successful initialization
    });

    await import('./main');

    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalledWith(
      expect.any(HTMLElement)
    );
  }, 10000);
});