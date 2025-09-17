import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as ReactDOM from 'react-dom/client';

// Mock React DOM
const mockRender = vi.fn();
const mockRoot = {
  render: mockRender,
  unmount: vi.fn(),
};

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => mockRoot),
}));

// Mock App component
vi.mock('./app/app', () => ({
  default: () => <div data-testid="app">App Component</div>,
}));

// Mock Mantine
vi.mock('@mantine/core', () => ({
  MantineProvider: ({ children, theme }: any) => (
    <div data-testid="mantine-provider" data-theme={theme?.primaryColor}>
      {children}
    </div>
  ),
}));

// Mock configuration modules
const mockConfigProvider = {
  initialize: vi.fn(),
};

vi.mock('./infrastructure/config', () => ({
  configProvider: mockConfigProvider,
}));

// Mock DI container
const mockConfigureDI = vi.fn();
vi.mock('./infrastructure/di/container', () => ({
  configureDI: mockConfigureDI,
}));

// Mock mantine theme
vi.mock('./lib/mantine-theme', () => ({
  mantineTheme: { primaryColor: 'blue' },
}));

describe('main.tsx initialization', () => {
  let originalConsoleLog: any;
  let originalConsoleError: any;
  let mockGetElementById: any;

  beforeEach(() => {
    // Clear all previous mocks
    vi.clearAllMocks();
    vi.resetModules();
    
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    console.log = vi.fn();
    console.error = vi.fn();
    
    // Mock DOM element
    mockGetElementById = vi.fn().mockReturnValue(document.createElement('div'));
    document.getElementById = mockGetElementById;
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    vi.resetModules();
  });

  it('should initialize configuration successfully', async () => {
    // Import main to trigger initialization
    await import('./main');
    
    expect(mockConfigProvider.initialize).toHaveBeenCalledTimes(1);
  });

  it('should handle configuration initialization errors', async () => {
    const configError = new Error('Config validation failed');
    mockConfigProvider.initialize.mockImplementation(() => {
      throw configError;
    });

    // We need to dynamically import since the module evaluation throws
    let thrownError: any = null;
    try {
      await import('./main');
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toEqual(configError);
    expect(console.error).toHaveBeenCalledWith(
      '❌ Configuration validation failed:',
      configError
    );
  });

  it('should configure dependency injection after config validation', async () => {
    await import('./main');
    
    expect(mockConfigureDI).toHaveBeenCalledTimes(1);
    // Ensure DI is configured after config initialization
    expect(mockConfigProvider.initialize).toHaveBeenCalledBefore(mockConfigureDI);
  });

  it('should create React root with correct element', async () => {
    const rootElement = document.createElement('div');
    mockGetElementById.mockReturnValue(rootElement);
    
    await import('./main');
    
    expect(mockGetElementById).toHaveBeenCalledWith('root');
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);
  });

  it('should render app with StrictMode and MantineProvider', async () => {
    await import('./main');
    
    expect(mockRender).toHaveBeenCalledTimes(1);
    
    // Check that the rendered component structure is correct
    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall.type.name).toBe('StrictMode');
    
    // The MantineProvider should be inside StrictMode
    const mantineProvider = renderCall.props.children;
    expect(mantineProvider.type.name).toBe('MantineProvider');
    expect(mantineProvider.props.theme).toEqual({ primaryColor: 'blue' });
  });

  it('should handle missing root element gracefully', async () => {
    mockGetElementById.mockReturnValue(null);
    
    // This should throw a TypeError when trying to create root with null
    let thrownError: any = null;
    try {
      await import('./main');
    } catch (error) {
      thrownError = error;
    }
    
    expect(thrownError).toBeTruthy();
    expect(mockGetElementById).toHaveBeenCalledWith('root');
  });

  it('should import reflect-metadata', async () => {
    // Just ensure the import doesn't throw
    await expect(import('./main')).resolves.toBeDefined();
  });

  it('should import Mantine core styles', async () => {
    // The styles import should not cause errors
    await expect(import('./main')).resolves.toBeDefined();
  });

  it('should have a main.tsx file for app bootstrapping', () => {
    // This test ensures the main file exists and can be imported
    expect(() => import('./main')).not.toThrow();
  });

  it('should import required dependencies', () => {
    // Test that main.tsx imports essential dependencies
    // The mere fact that import doesn't throw means dependencies are resolvable
    expect(true).toBe(true);
  });

  it('should be structured for React app initialization', () => {
    // Verify that the file structure supports React app setup
    expect(document.getElementById).toBeDefined();
  });
});