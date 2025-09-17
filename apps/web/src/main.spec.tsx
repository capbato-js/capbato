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
  let originalConsoleError: any;
  let mockCreateRoot: any;
  let mockRender: any;
  let mockRoot: any;
  
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
    (ReactDOM.createRoot as any) = mockCreateRoot;
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
  });

  it('should create React root and render app', async () => {
    // Import main to trigger React rendering
    await import('./main');

    expect(mockCreateRoot).toHaveBeenCalledWith(
      expect.any(HTMLElement)
    );
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('should handle configuration errors gracefully', async () => {
    const { configProvider } = await import('./infrastructure/config');
    const error = new Error('Config validation failed');
    configProvider.initialize.mockImplementation(() => {
      throw error;
    });

    // This should throw because configuration failed
    await expect(() => import('./main')).rejects.toThrow('Config validation failed');
    expect(console.error).toHaveBeenCalledWith('❌ Configuration validation failed:', error);
  });

  it('should wrap app with MantineProvider and StrictMode', async () => {
    await import('./main');

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(Function), // StrictMode
        props: expect.objectContaining({
          children: expect.objectContaining({
            type: expect.any(Function), // MantineProvider
          }),
        }),
      })
    );
  });

  it('should find root element correctly', async () => {
    await import('./main');

    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalledWith(
      expect.any(HTMLElement)
    );
  });
});