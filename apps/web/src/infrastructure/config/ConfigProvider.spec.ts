import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { configProvider, ConfigValidationError, getConfig, getApiConfig, getFeatureFlags, getAppSettings, getStorageSettings, getUISettings, isFeatureEnabled } from './ConfigProvider';

// Mock environment config
vi.mock('./EnvironmentConfig', () => ({
  getEnvironmentConfig: vi.fn(() => ({
    api: {
      baseUrl: 'http://localhost:4000',
      timeout: 5000,
      endpoints: {
        todos: {
          base: '/api/todos',
          all: '/api/todos',
          byId: (id: string) => `/api/todos/${id}`,
          active: '/api/todos/active',
          completed: '/api/todos/completed',
        },
        auth: {
          login: '/api/auth/login',
          register: '/api/auth/register',
          logout: '/api/auth/logout',
          refresh: '/api/auth/refresh',
          validate: '/api/auth/validate',
          me: '/api/auth/me',
        },
        patients: {
          base: '/api/patients',
          all: '/api/patients',
          create: '/api/patients',
          update: (id: string) => `/api/patients/${id}`,
          byId: (id: string) => `/api/patients/${id}`,
          stats: '/api/patients/stats',
        },
        appointments: {
          base: '/api/appointments',
          all: '/api/appointments',
          create: '/api/appointments',
          byId: (id: string) => `/api/appointments/${id}`,
          byPatientId: (patientId: string) => `/api/appointments/patient/${patientId}`,
          update: (id: string) => `/api/appointments/${id}`,
          delete: (id: string) => `/api/appointments/${id}`,
          confirm: (id: string) => `/api/appointments/${id}/confirm`,
          cancel: (id: string) => `/api/appointments/${id}/cancel`,
          complete: (id: string) => `/api/appointments/${id}/complete`,
          reconfirm: (id: string) => `/api/appointments/${id}/reconfirm`,
          todayConfirmed: '/api/appointments/today/confirmed',
        },
        doctors: {
          base: '/api/doctors',
          all: '/api/doctors',
          byId: (id: string) => `/api/doctors/${id}`,
          byUserId: (userId: string) => `/api/doctors/user/${userId}`,
          bySpecialization: (specialization: string) => `/api/doctors/specialization/${specialization}`,
          check: (userId: string) => `/api/doctors/check/${userId}`,
        },
        address: {
          base: '/api/address',
          provinces: '/api/address/provinces',
          cities: (provinceCode: string) => `/api/address/cities/${provinceCode}`,
          barangays: (cityCode: string) => `/api/address/barangays/${cityCode}`,
        },
        prescriptions: {
          base: '/api/prescriptions',
          all: '/api/prescriptions',
          byId: (id: string) => `/api/prescriptions/${id}`,
          active: '/api/prescriptions/active',
          expired: '/api/prescriptions/expired',
          stats: '/api/prescriptions/stats',
          byPatientId: (patientId: string) => `/api/prescriptions/patient/${patientId}`,
          byDoctorId: (doctorId: string) => `/api/prescriptions/doctor/${doctorId}`,
          byMedicationName: (medicationName: string) => `/api/prescriptions/medication/${medicationName}`,
        },
        transactions: {
          base: '/api/transactions',
          all: '/api/transactions',
          byId: (id: string) => `/api/transactions/${id}`,
          create: '/api/transactions',
          delete: (id: string) => `/api/transactions/${id}`,
        },
      },
    },
    features: {
      useApiBackend: true,
      enableAuth: true,
      enableOfflineMode: false,
      enablePWA: true,
      enableAnalytics: false,
    },
    app: {
      appName: 'Test App',
      version: '1.0.0',
      debugMode: false,
      logLevel: 'info' as const,
    },
    storage: {
      localStoragePrefix: 'testapp_',
      sessionStoragePrefix: 'testapp_session_',
      cacheTimeout: 300000,
      maxCacheSize: 50,
    },
    ui: {
      defaultTheme: 'light' as const,
      defaultLanguage: 'en',
      animationsEnabled: true,
      compactMode: false,
    },
  })),
  environmentOverrides: {
    development: {},
    staging: {},
    production: {},
    test: {},
  },
}));

describe('ConfigProvider', () => {
  beforeEach(() => {
    configProvider.reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize configuration successfully', () => {
      expect(() => configProvider.initialize()).not.toThrow();
      expect(configProvider.config).toBeDefined();
    });

    it('should not reinitialize if already initialized', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      configProvider.initialize();
      const config1 = configProvider.config;
      
      configProvider.initialize(); // Should not reinitialize
      const config2 = configProvider.config;
      
      expect(config1).toBe(config2);
      consoleSpy.mockRestore();
    });

    it('should handle initialization errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock getEnvironmentConfig to throw
      const { getEnvironmentConfig } = require('./EnvironmentConfig');
      getEnvironmentConfig.mockImplementation(() => {
        throw new Error('Environment config error');
      });

      expect(() => configProvider.initialize()).toThrow('Environment config error');
      expect(consoleSpy).toHaveBeenCalledWith('❌ Configuration initialization failed:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should auto-initialize when accessing config', () => {
      const config = configProvider.config;
      expect(config).toBeDefined();
    });
  });

  describe('Configuration Getters', () => {
    beforeEach(() => {
      configProvider.initialize();
    });

    it('should provide API configuration', () => {
      const apiConfig = configProvider.getApiConfig();
      
      expect(apiConfig).toBeDefined();
      expect(apiConfig.baseUrl).toBe('http://localhost:4000');
      expect(apiConfig.timeout).toBe(5000);
      expect(apiConfig.endpoints).toBeDefined();
      expect(apiConfig.endpoints.todos).toBeDefined();
      expect(apiConfig.endpoints.auth).toBeDefined();
    });

    it('should provide feature flags', () => {
      const features = configProvider.getFeatureFlags();
      
      expect(features).toBeDefined();
      expect(features.useApiBackend).toBe(true);
      expect(features.enableAuth).toBe(true);
      expect(features.enableOfflineMode).toBe(false);
      expect(features.enablePWA).toBe(true);
      expect(features.enableAnalytics).toBe(false);
    });

    it('should provide app settings', () => {
      const appSettings = configProvider.getAppSettings();
      
      expect(appSettings).toBeDefined();
      expect(appSettings.appName).toBe('Test App');
      expect(appSettings.version).toBe('1.0.0');
      expect(appSettings.debugMode).toBe(false);
      expect(appSettings.logLevel).toBe('info');
    });

    it('should provide storage settings', () => {
      const storageSettings = configProvider.getStorageSettings();
      
      expect(storageSettings).toBeDefined();
      expect(storageSettings.localStoragePrefix).toBe('testapp_');
      expect(storageSettings.sessionStoragePrefix).toBe('testapp_session_');
      expect(storageSettings.cacheTimeout).toBe(300000);
      expect(storageSettings.maxCacheSize).toBe(50);
    });

    it('should provide UI settings', () => {
      const uiSettings = configProvider.getUISettings();
      
      expect(uiSettings).toBeDefined();
      expect(uiSettings.defaultTheme).toBe('light');
      expect(uiSettings.defaultLanguage).toBe('en');
      expect(uiSettings.animationsEnabled).toBe(true);
      expect(uiSettings.compactMode).toBe(false);
    });
  });

  describe('Feature Flag Checking', () => {
    beforeEach(() => {
      configProvider.initialize();
    });

    it('should check feature flags correctly', () => {
      expect(configProvider.isFeatureEnabled('useApiBackend')).toBe(true);
      expect(configProvider.isFeatureEnabled('enableAuth')).toBe(true);
      expect(configProvider.isFeatureEnabled('enableOfflineMode')).toBe(false);
      expect(configProvider.isFeatureEnabled('enablePWA')).toBe(true);
      expect(configProvider.isFeatureEnabled('enableAnalytics')).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should validate API base URL', () => {
      const { getEnvironmentConfig } = require('./EnvironmentConfig');
      getEnvironmentConfig.mockReturnValue({
        ...getEnvironmentConfig(),
        api: {
          ...getEnvironmentConfig().api,
          baseUrl: '', // Invalid empty base URL
        },
      });

      expect(() => configProvider.initialize()).toThrow(ConfigValidationError);
      expect(() => configProvider.initialize()).toThrow('API base URL is required');
    });

    it('should validate API timeout', () => {
      const { getEnvironmentConfig } = require('./EnvironmentConfig');
      getEnvironmentConfig.mockReturnValue({
        ...getEnvironmentConfig(),
        api: {
          ...getEnvironmentConfig().api,
          timeout: 0, // Invalid timeout
        },
      });

      expect(() => configProvider.initialize()).toThrow(ConfigValidationError);
      expect(() => configProvider.initialize()).toThrow('API timeout must be positive');
    });

    it('should validate app name', () => {
      const { getEnvironmentConfig } = require('./EnvironmentConfig');
      getEnvironmentConfig.mockReturnValue({
        ...getEnvironmentConfig(),
        app: {
          ...getEnvironmentConfig().app,
          appName: '   ', // Invalid empty app name
        },
      });

      expect(() => configProvider.initialize()).toThrow(ConfigValidationError);
      expect(() => configProvider.initialize()).toThrow('App name cannot be empty');
    });

    it('should validate app version', () => {
      const { getEnvironmentConfig } = require('./EnvironmentConfig');
      getEnvironmentConfig.mockReturnValue({
        ...getEnvironmentConfig(),
        app: {
          ...getEnvironmentConfig().app,
          version: '', // Invalid empty version
        },
      });

      expect(() => configProvider.initialize()).toThrow(ConfigValidationError);
      expect(() => configProvider.initialize()).toThrow('App version cannot be empty');
    });

    it('should validate storage prefix', () => {
      const { getEnvironmentConfig } = require('./EnvironmentConfig');
      getEnvironmentConfig.mockReturnValue({
        ...getEnvironmentConfig(),
        storage: {
          ...getEnvironmentConfig().storage,
          localStoragePrefix: '', // Invalid empty prefix
        },
      });

      expect(() => configProvider.initialize()).toThrow(ConfigValidationError);
      expect(() => configProvider.initialize()).toThrow('Local storage prefix cannot be empty');
    });

    it('should validate cache timeout', () => {
      const { getEnvironmentConfig } = require('./EnvironmentConfig');
      getEnvironmentConfig.mockReturnValue({
        ...getEnvironmentConfig(),
        storage: {
          ...getEnvironmentConfig().storage,
          cacheTimeout: -1, // Invalid negative timeout
        },
      });

      expect(() => configProvider.initialize()).toThrow(ConfigValidationError);
      expect(() => configProvider.initialize()).toThrow('Cache timeout must be positive');
    });

    it('should validate UI theme', () => {
      const { getEnvironmentConfig } = require('./EnvironmentConfig');
      getEnvironmentConfig.mockReturnValue({
        ...getEnvironmentConfig(),
        ui: {
          ...getEnvironmentConfig().ui,
          defaultTheme: 'invalid' as any, // Invalid theme
        },
      });

      expect(() => configProvider.initialize()).toThrow(ConfigValidationError);
      expect(() => configProvider.initialize()).toThrow('Default theme must be one of');
    });

    it('should validate log level', () => {
      const { getEnvironmentConfig } = require('./EnvironmentConfig');
      getEnvironmentConfig.mockReturnValue({
        ...getEnvironmentConfig(),
        app: {
          ...getEnvironmentConfig().app,
          logLevel: 'invalid' as any, // Invalid log level
        },
      });

      expect(() => configProvider.initialize()).toThrow(ConfigValidationError);
      expect(() => configProvider.initialize()).toThrow('Log level must be one of');
    });
  });

  describe('Reset Functionality', () => {
    it('should reset configuration', () => {
      configProvider.initialize();
      expect(configProvider.config).toBeDefined();
      
      configProvider.reset();
      
      // Should reinitialize when accessing config again
      const config = configProvider.config;
      expect(config).toBeDefined();
    });
  });

  describe('Environment Detection', () => {
    beforeEach(() => {
      // Reset any environment mocks
      delete (import.meta as any).env;
    });

    it('should detect development environment', () => {
      (import.meta as any).env = { DEV: true };
      configProvider.reset();
      configProvider.initialize();
      expect(configProvider.config).toBeDefined();
    });

    it('should detect production environment', () => {
      (import.meta as any).env = { PROD: true };
      configProvider.reset();
      configProvider.initialize();
      expect(configProvider.config).toBeDefined();
    });

    it('should detect test environment', () => {
      (import.meta as any).env = { MODE: 'test' };
      configProvider.reset();
      configProvider.initialize();
      expect(configProvider.config).toBeDefined();
    });

    it('should use explicit environment setting', () => {
      (import.meta as any).env = { VITE_ENVIRONMENT: 'staging' };
      configProvider.reset();
      configProvider.initialize();
      expect(configProvider.config).toBeDefined();
    });

    it('should default to development environment', () => {
      (import.meta as any).env = {};
      configProvider.reset();
      configProvider.initialize();
      expect(configProvider.config).toBeDefined();
    });
  });

  describe('Convenience Functions', () => {
    beforeEach(() => {
      configProvider.reset();
    });

    it('should provide global config getter', () => {
      const config = getConfig();
      expect(config).toBeDefined();
      expect(config.api).toBeDefined();
      expect(config.features).toBeDefined();
    });

    it('should provide global API config getter', () => {
      const apiConfig = getApiConfig();
      expect(apiConfig).toBeDefined();
      expect(apiConfig.baseUrl).toBeDefined();
    });

    it('should provide global feature flags getter', () => {
      const features = getFeatureFlags();
      expect(features).toBeDefined();
      expect(typeof features.useApiBackend).toBe('boolean');
    });

    it('should provide global app settings getter', () => {
      const appSettings = getAppSettings();
      expect(appSettings).toBeDefined();
      expect(appSettings.appName).toBeDefined();
    });

    it('should provide global storage settings getter', () => {
      const storageSettings = getStorageSettings();
      expect(storageSettings).toBeDefined();
      expect(storageSettings.localStoragePrefix).toBeDefined();
    });

    it('should provide global UI settings getter', () => {
      const uiSettings = getUISettings();
      expect(uiSettings).toBeDefined();
      expect(uiSettings.defaultTheme).toBeDefined();
    });

    it('should provide global feature enabled checker', () => {
      const isEnabled = isFeatureEnabled('useApiBackend');
      expect(typeof isEnabled).toBe('boolean');
    });
  });

  describe('ConfigValidationError', () => {
    it('should create validation error with correct properties', () => {
      const error = new ConfigValidationError('Test error message', 'test.field');
      
      expect(error.name).toBe('ConfigValidationError');
      expect(error.field).toBe('test.field');
      expect(error.message).toBe("Configuration validation failed for field 'test.field': Test error message");
      expect(error instanceof Error).toBe(true);
    });
  });
});