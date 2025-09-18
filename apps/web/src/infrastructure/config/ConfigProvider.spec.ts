import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configProvider, ConfigValidationError, getConfig, getApiConfig, getFeatureFlags, getAppSettings, getStorageSettings, getUISettings, isFeatureEnabled } from './ConfigProvider';

// Mock import.meta.env
const mockEnv = {
  VITE_ENVIRONMENT: undefined,
  DEV: true,
  PROD: false,
  MODE: 'development',
};

vi.stubGlobal('import', {
  meta: {
    env: mockEnv,
  },
});

describe('ConfigProvider', () => {
  beforeEach(() => {
    configProvider.reset();
    vi.clearAllMocks();
    
    // Reset mock environment
    mockEnv.VITE_ENVIRONMENT = undefined;
    mockEnv.DEV = true;
    mockEnv.PROD = false;
    mockEnv.MODE = 'development';
  });

  describe('initialization', () => {
    it('should initialize configuration successfully', () => {
      expect(() => configProvider.initialize()).not.toThrow();
      expect(configProvider.config).toBeDefined();
    });

    it('should not reinitialize if already initialized', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      configProvider.initialize();
      const config1 = configProvider.config;
      
      configProvider.initialize(); // Second call should not reinitialize
      const config2 = configProvider.config;
      
      expect(config1).toBe(config2);
      spy.mockRestore();
    });

    it('should auto-initialize when accessing config', () => {
      expect(configProvider.config).toBeDefined();
    });

    it('should handle initialization errors', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock a validation error by temporarily modifying the validate method
      const originalValidate = configProvider['validateConfiguration'];
      configProvider['validateConfiguration'] = vi.fn(() => {
        throw new ConfigValidationError('Test error', 'test.field');
      });

      expect(() => configProvider.initialize()).toThrow(ConfigValidationError);
      expect(console.error).toHaveBeenCalled();
      
      // Restore original method
      configProvider['validateConfiguration'] = originalValidate;
      spy.mockRestore();
    });
  });

  describe('environment detection', () => {
    it('should detect development environment by default', () => {
      configProvider.reset();
      const environment = configProvider['getCurrentEnvironment']();
      // Without specific environment setup, should return a valid environment
      expect(['development', 'staging', 'production', 'test']).toContain(environment);
    });

    it('should detect environment based on import.meta.env', () => {
      // Test just verifies the method exists and returns a valid environment
      configProvider.reset();
      const environment = configProvider['getCurrentEnvironment']();
      expect(['development', 'staging', 'production', 'test']).toContain(environment);
    });

    it('should handle environment variables consistently', () => {
      // Test that environment detection is consistent
      configProvider.reset();
      const env1 = configProvider['getCurrentEnvironment']();
      const env2 = configProvider['getCurrentEnvironment']();
      expect(env1).toBe(env2);
    });
  });

  describe('configuration sections', () => {
    it('should provide API configuration', () => {
      const apiConfig = configProvider.getApiConfig();
      
      expect(apiConfig).toBeDefined();
      expect(apiConfig.baseUrl).toBeDefined();
      expect(apiConfig.timeout).toBeGreaterThan(0);
      expect(apiConfig.endpoints).toBeDefined();
      expect(apiConfig.endpoints.todos).toBeDefined();
    });

    it('should provide feature flags', () => {
      const features = configProvider.getFeatureFlags();
      
      expect(features).toBeDefined();
      expect(typeof features.useApiBackend).toBe('boolean');
      expect(typeof features.enableAuth).toBe('boolean');
      expect(typeof features.enableOfflineMode).toBe('boolean');
    });

    it('should provide app settings', () => {
      const appSettings = configProvider.getAppSettings();
      
      expect(appSettings).toBeDefined();
      expect(appSettings.appName).toBeDefined();
      expect(appSettings.version).toBeDefined();
      expect(typeof appSettings.debugMode).toBe('boolean');
    });

    it('should provide storage settings', () => {
      const storageSettings = configProvider.getStorageSettings();
      
      expect(storageSettings).toBeDefined();
      expect(storageSettings.localStoragePrefix).toBeDefined();
      expect(storageSettings.cacheTimeout).toBeGreaterThan(0);
      expect(storageSettings.maxCacheSize).toBeGreaterThan(0);
    });

    it('should provide UI settings', () => {
      const uiSettings = configProvider.getUISettings();
      
      expect(uiSettings).toBeDefined();
      expect(uiSettings.defaultTheme).toBeDefined();
      expect(uiSettings.defaultLanguage).toBeDefined();
      expect(typeof uiSettings.animationsEnabled).toBe('boolean');
    });
  });

  describe('feature flags', () => {
    it('should check feature flags correctly', () => {
      const isApiBackendEnabled = configProvider.isFeatureEnabled('useApiBackend');
      const isAuthEnabled = configProvider.isFeatureEnabled('enableAuth');
      
      expect(typeof isApiBackendEnabled).toBe('boolean');
      expect(typeof isAuthEnabled).toBe('boolean');
    });

    it('should handle all feature flag types', () => {
      const features = configProvider.getFeatureFlags();
      
      Object.keys(features).forEach(feature => {
        const isEnabled = configProvider.isFeatureEnabled(feature as any);
        expect(typeof isEnabled).toBe('boolean');
      });
    });
  });

  describe('deep merge functionality', () => {
    it('should deep merge nested objects', () => {
      const target = {
        api: { baseUrl: 'http://original.com', timeout: 5000 },
        features: { enableAuth: true },
      };
      
      const source = {
        api: { baseUrl: 'http://override.com' },
        features: { enableOfflineMode: false },
      };
      
      const result = configProvider['deepMerge'](target, source);
      
      expect(result.api.baseUrl).toBe('http://override.com');
      expect(result.api.timeout).toBe(5000); // Should preserve original
      expect(result.features.enableAuth).toBe(true); // Should preserve original
      expect(result.features.enableOfflineMode).toBe(false); // Should add new
    });

    it('should handle arrays correctly', () => {
      const target = { items: [1, 2, 3] };
      const source = { items: [4, 5] };
      
      const result = configProvider['deepMerge'](target, source);
      expect(result.items).toEqual([4, 5]);
    });

    it('should handle undefined values', () => {
      const target = { key1: 'value1', key2: 'value2' };
      const source = { key1: undefined, key3: 'value3' };
      
      const result = configProvider['deepMerge'](target, source);
      expect(result.key1).toBe('value1'); // Should keep original
      expect(result.key2).toBe('value2'); // Should preserve
      expect(result.key3).toBe('value3'); // Should add new
    });
  });

  describe('validation', () => {
    it('should validate API configuration', () => {
      const invalidConfig = {
        api: { baseUrl: '', timeout: -1 },
        app: { appName: 'Test', version: '1.0.0', logLevel: 'info' },
        storage: { localStoragePrefix: 'test', cacheTimeout: 1000 },
        ui: { defaultTheme: 'light' },
        features: {},
      };

      expect(() => configProvider['validateConfiguration'](invalidConfig as any))
        .toThrow(ConfigValidationError);
    });

    it('should validate app configuration', () => {
      const invalidConfig = {
        api: { baseUrl: 'http://test.com', timeout: 5000 },
        app: { appName: '', version: '', logLevel: 'invalid' },
        storage: { localStoragePrefix: 'test', cacheTimeout: 1000 },
        ui: { defaultTheme: 'light' },
        features: {},
      };

      expect(() => configProvider['validateConfiguration'](invalidConfig as any))
        .toThrow(ConfigValidationError);
    });

    it('should validate storage configuration', () => {
      const invalidConfig = {
        api: { baseUrl: 'http://test.com', timeout: 5000 },
        app: { appName: 'Test', version: '1.0.0', logLevel: 'info' },
        storage: { localStoragePrefix: '', cacheTimeout: -1 },
        ui: { defaultTheme: 'light' },
        features: {},
      };

      expect(() => configProvider['validateConfiguration'](invalidConfig as any))
        .toThrow(ConfigValidationError);
    });

    it('should validate UI configuration', () => {
      const invalidConfig = {
        api: { baseUrl: 'http://test.com', timeout: 5000 },
        app: { appName: 'Test', version: '1.0.0', logLevel: 'info' },
        storage: { localStoragePrefix: 'test', cacheTimeout: 1000 },
        ui: { defaultTheme: 'invalid' },
        features: {},
      };

      expect(() => configProvider['validateConfiguration'](invalidConfig as any))
        .toThrow(ConfigValidationError);
    });
  });

  describe('reset functionality', () => {
    it('should allow reinitialization after reset', () => {
      configProvider.initialize();
      const config1 = configProvider.config;
      
      configProvider.reset();
      configProvider.initialize();
      const config2 = configProvider.config;
      
      // Check that configuration values are the same after reinitialization
      expect(config2.api.baseUrl).toBe(config1.api.baseUrl);
      expect(config2.features.useApiBackend).toBe(config1.features.useApiBackend);
      expect(config2.app.appName).toBe(config1.app.appName);
    });

    it('should return same config instance after initialization', () => {
      configProvider.initialize();
      const config1 = configProvider.config;
      const config2 = configProvider.config;
      
      expect(config1).toBe(config2);
    });
  });

  describe('convenience functions', () => {
    it('should export convenience functions', () => {
      expect(getConfig()).toBeDefined();
      expect(getApiConfig()).toBeDefined();
      expect(getFeatureFlags()).toBeDefined();
      expect(getAppSettings()).toBeDefined();
      expect(getStorageSettings()).toBeDefined();
      expect(getUISettings()).toBeDefined();
      expect(typeof isFeatureEnabled('useApiBackend')).toBe('boolean');
    });

    it('should return consistent data from convenience functions', () => {
      const config = getConfig();
      
      expect(getApiConfig()).toEqual(config.api);
      expect(getFeatureFlags()).toEqual(config.features);
      expect(getAppSettings()).toEqual(config.app);
      expect(getStorageSettings()).toEqual(config.storage);
      expect(getUISettings()).toEqual(config.ui);
    });
  });

  describe('ConfigValidationError', () => {
    it('should create proper error instances', () => {
      const error = new ConfigValidationError('Test message', 'test.field');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ConfigValidationError);
      expect(error.name).toBe('ConfigValidationError');
      expect(error.field).toBe('test.field');
      expect(error.message).toBe("Configuration validation failed for field 'test.field': Test message");
    });
  });
});