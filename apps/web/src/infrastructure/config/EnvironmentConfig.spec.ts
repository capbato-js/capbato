import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getEnvironmentConfig, environmentOverrides } from './EnvironmentConfig';

describe('EnvironmentConfig', () => {
  let originalImportMeta: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Store original import.meta to restore later
    originalImportMeta = globalThis.import;
  });

  afterEach(() => {
    // Restore original import.meta
    if (originalImportMeta) {
      globalThis.import = originalImportMeta;
    }
  });

  describe('getEnvironmentConfig', () => {
    it('should return configuration object with all required sections', () => {
      const config = getEnvironmentConfig();
      
      expect(config).toBeDefined();
      expect(config.api).toBeDefined();
      expect(config.features).toBeDefined();
      expect(config.app).toBeDefined();
      expect(config.storage).toBeDefined();
      expect(config.ui).toBeDefined();
    });

    it('should have valid API configuration', () => {
      const config = getEnvironmentConfig();
      
      expect(config.api.baseUrl).toBeDefined();
      expect(typeof config.api.baseUrl).toBe('string');
      expect(config.api.timeout).toBeGreaterThan(0);
      expect(config.api.endpoints).toBeDefined();
    });

    it('should have proper default values when environment variables are not set', () => {
      // Mock import.meta.env to have no custom environment variables
      vi.stubGlobal('import', {
        meta: {
          env: {
            DEV: false,
            PROD: false,
            MODE: 'test',
          },
        },
      });

      const config = getEnvironmentConfig();
      
      // These should be the defaults when no env vars are set
      expect(config.api.baseUrl).toBe('http://localhost:4000');
      expect(config.app.appName).toBe('Nx Starter');
      expect(config.app.version).toBe('1.0.0');
      expect(config.app.logLevel).toBe('info');
      expect(config.storage.localStoragePrefix).toBe('nx-starter');
      expect(config.ui.defaultTheme).toBe('system');
      expect(config.ui.defaultLanguage).toBe('en');
    });

    it('should handle custom environment variables correctly', () => {
      // Mock import.meta.env with custom values
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_API_BASE_URL: 'https://api.custom.com',
            VITE_APP_NAME: 'Custom App',
            VITE_APP_VERSION: '2.0.0',
            VITE_DEFAULT_THEME: 'dark',
            DEV: false,
            PROD: true,
            MODE: 'production',
          },
        },
      });

      const config = getEnvironmentConfig();
      
      expect(config.api.baseUrl).toBe('https://api.custom.com');
      expect(config.app.appName).toBe('Custom App');
      expect(config.app.version).toBe('2.0.0');
      expect(config.ui.defaultTheme).toBe('dark');
    });

    describe('API endpoints', () => {
      it('should generate correct endpoint URLs', () => {
        const config = getEnvironmentConfig();
        
        // Test static endpoints
        expect(config.api.endpoints.todos.base).toBe('/api/todos');
        expect(config.api.endpoints.todos.all).toBe('/api/todos');
        expect(config.api.endpoints.todos.active).toBe('/api/todos/active');
        expect(config.api.endpoints.todos.completed).toBe('/api/todos/completed');
        
        // Test auth endpoints
        expect(config.api.endpoints.auth?.login).toBe('/api/auth/login');
        expect(config.api.endpoints.auth?.register).toBe('/api/auth/register');
        expect(config.api.endpoints.auth?.logout).toBe('/api/auth/logout');
        expect(config.api.endpoints.auth?.me).toBe('/api/auth/me');
      });

      it('should generate dynamic endpoint URLs correctly', () => {
        const config = getEnvironmentConfig();
        
        // Test dynamic endpoints
        expect(config.api.endpoints.todos.byId('123')).toBe('/api/todos/123');
        expect(config.api.endpoints.patients.byId('patient-456')).toBe('/api/patients/patient-456');
        expect(config.api.endpoints.patients.update('789')).toBe('/api/patients/789');
        expect(config.api.endpoints.appointments.byPatientId('patient-123')).toBe('/api/appointments/patient/patient-123');
        expect(config.api.endpoints.appointments.confirm('appt-456')).toBe('/api/appointments/appt-456/confirm');
        expect(config.api.endpoints.doctors.byUserId('user-789')).toBe('/api/doctors/user/user-789');
        expect(config.api.endpoints.doctors.bySpecialization('cardiology')).toBe('/api/doctors/specialization/cardiology');
        expect(config.api.endpoints.address.cities('PH-01')).toBe('/api/address/cities/PH-01');
        expect(config.api.endpoints.address.barangays('PH-01-001')).toBe('/api/address/barangays/PH-01-001');
        expect(config.api.endpoints.prescriptions.byPatientId('patient-123')).toBe('/api/prescriptions/patient/patient-123');
        expect(config.api.endpoints.prescriptions.byDoctorId('doctor-456')).toBe('/api/prescriptions/doctor/doctor-456');
        expect(config.api.endpoints.prescriptions.byMedicationName('aspirin')).toBe('/api/prescriptions/medication/aspirin');
        expect(config.api.endpoints.transactions.byId('txn-789')).toBe('/api/transactions/txn-789');
        expect(config.api.endpoints.transactions.delete('txn-123')).toBe('/api/transactions/txn-123');
      });

      it('should handle special characters in dynamic endpoints', () => {
        const config = getEnvironmentConfig();
        
        expect(config.api.endpoints.todos.byId('todo-with-special-chars-@#$')).toBe('/api/todos/todo-with-special-chars-@#$');
        expect(config.api.endpoints.prescriptions.byMedicationName('aspirin-100mg')).toBe('/api/prescriptions/medication/aspirin-100mg');
      });
    });

    describe('feature flags', () => {
      it('should have boolean feature flag values', () => {
        const config = getEnvironmentConfig();
        
        expect(typeof config.features.useApiBackend).toBe('boolean');
        expect(typeof config.features.enableAuth).toBe('boolean');
        expect(typeof config.features.enableOfflineMode).toBe('boolean');
        expect(typeof config.features.enablePWA).toBe('boolean');
        expect(typeof config.features.enableAnalytics).toBe('boolean');
      });

      it('should handle feature flag environment variables', () => {
        vi.stubGlobal('import', {
          meta: {
            env: {
              VITE_USE_API_BACKEND: 'false',
              VITE_ENABLE_AUTH: 'false',
              VITE_ENABLE_OFFLINE_MODE: 'false',
              VITE_ENABLE_PWA: 'false',
              VITE_ENABLE_ANALYTICS: 'false',
              DEV: false,
              PROD: false,
              MODE: 'test',
            },
          },
        });
        
        const config = getEnvironmentConfig();
        
        expect(config.features.useApiBackend).toBe(false);
        expect(config.features.enableAuth).toBe(false);
        expect(config.features.enableOfflineMode).toBe(false);
        expect(config.features.enablePWA).toBe(false);
        expect(config.features.enableAnalytics).toBe(false);
      });
    });

    describe('boolean and integer parsing', () => {
      it('should parse boolean values correctly', () => {
        vi.stubGlobal('import', {
          meta: {
            env: {
              VITE_USE_API_BACKEND: 'true',
              VITE_ENABLE_AUTH: 'TRUE',
              VITE_ENABLE_OFFLINE_MODE: 'false',
              VITE_ENABLE_PWA: 'False',
              VITE_DEBUG_MODE: 'true',
              VITE_ANIMATIONS_ENABLED: 'false',
              VITE_COMPACT_MODE: 'true',
              DEV: false,
              PROD: false,
              MODE: 'test',
            },
          },
        });
        
        const config = getEnvironmentConfig();
        
        expect(config.features.useApiBackend).toBe(true);
        expect(config.features.enableAuth).toBe(true);
        expect(config.features.enableOfflineMode).toBe(false);
        expect(config.features.enablePWA).toBe(false);
        expect(config.app.debugMode).toBe(true);
        expect(config.ui.animationsEnabled).toBe(false);
        expect(config.ui.compactMode).toBe(true);
      });

      it('should parse integer values correctly', () => {
        vi.stubGlobal('import', {
          meta: {
            env: {
              VITE_API_TIMEOUT: '5000',
              VITE_CACHE_TIMEOUT: '600000',
              VITE_MAX_CACHE_SIZE: '100',
              DEV: false,
              PROD: false,
              MODE: 'test',
            },
          },
        });
        
        const config = getEnvironmentConfig();
        
        expect(config.api.timeout).toBe(5000);
        expect(config.storage.cacheTimeout).toBe(600000);
        expect(config.storage.maxCacheSize).toBe(100);
      });

      it('should handle invalid values gracefully', () => {
        vi.stubGlobal('import', {
          meta: {
            env: {
              VITE_API_TIMEOUT: 'invalid',
              VITE_USE_API_BACKEND: 'maybe',
              VITE_MAX_CACHE_SIZE: 'not-a-number',
              DEV: false,
              PROD: false,
              MODE: 'test',
            },
          },
        });
        
        const config = getEnvironmentConfig();
        
        // Should use defaults for invalid values
        expect(config.api.timeout).toBe(10000); // default
        expect(config.features.useApiBackend).toBe(true); // default for invalid boolean
        expect(config.storage.maxCacheSize).toBe(50); // default
      });
    });
  });

  describe('environmentOverrides', () => {
    it('should have development environment overrides', () => {
      const devOverrides = environmentOverrides.development;
      
      expect(devOverrides.app?.debugMode).toBe(true);
      expect(devOverrides.app?.logLevel).toBe('debug');
      expect(devOverrides.features?.useApiBackend).toBe(true);
      expect(devOverrides.features?.enableAuth).toBe(true);
      expect(devOverrides.features?.enableAnalytics).toBe(false);
    });

    it('should have staging environment overrides', () => {
      const stagingOverrides = environmentOverrides.staging;
      
      expect(stagingOverrides.app?.debugMode).toBe(false);
      expect(stagingOverrides.app?.logLevel).toBe('warn');
      expect(stagingOverrides.features?.useApiBackend).toBe(true);
      expect(stagingOverrides.features?.enableAuth).toBe(true);
      expect(stagingOverrides.features?.enableAnalytics).toBe(true);
    });

    it('should have production environment overrides', () => {
      const prodOverrides = environmentOverrides.production;
      
      expect(prodOverrides.app?.debugMode).toBe(false);
      expect(prodOverrides.app?.logLevel).toBe('error');
      expect(prodOverrides.features?.useApiBackend).toBe(true);
      expect(prodOverrides.features?.enableAuth).toBe(true);
      expect(prodOverrides.features?.enableAnalytics).toBe(true);
      expect(prodOverrides.api?.timeout).toBe(15000);
    });

    it('should have test environment overrides', () => {
      const testOverrides = environmentOverrides.test;
      
      expect(testOverrides.app?.debugMode).toBe(false);
      expect(testOverrides.app?.logLevel).toBe('error');
      expect(testOverrides.features?.useApiBackend).toBe(false);
      expect(testOverrides.features?.enableAuth).toBe(false);
      expect(testOverrides.features?.enableOfflineMode).toBe(false);
      expect(testOverrides.features?.enablePWA).toBe(false);
      expect(testOverrides.features?.enableAnalytics).toBe(false);
      expect(testOverrides.api?.timeout).toBe(5000);
    });

    it('should define all environment types', () => {
      expect(environmentOverrides.development).toBeDefined();
      expect(environmentOverrides.staging).toBeDefined();
      expect(environmentOverrides.production).toBeDefined();
      expect(environmentOverrides.test).toBeDefined();
    });

    it('should have consistent structure across environments', () => {
      const environments = ['development', 'staging', 'production', 'test'] as const;
      
      environments.forEach(env => {
        const override = environmentOverrides[env];
        expect(override).toBeDefined();
        expect(override.app).toBeDefined();
        expect(override.features).toBeDefined();
        expect(typeof override.app?.debugMode).toBe('boolean');
        expect(typeof override.app?.logLevel).toBe('string');
        expect(typeof override.features?.useApiBackend).toBe('boolean');
        expect(typeof override.features?.enableAuth).toBe('boolean');
      });
    });
  });

  describe('configuration completeness', () => {
    it('should provide complete API configuration', () => {
      const config = getEnvironmentConfig();
      
      expect(config.api).toBeDefined();
      expect(config.api.baseUrl).toBeDefined();
      expect(config.api.timeout).toBeGreaterThan(0);
      expect(config.api.endpoints).toBeDefined();
      
      // Verify all major endpoint groups are present
      expect(config.api.endpoints.todos).toBeDefined();
      expect(config.api.endpoints.auth).toBeDefined();
      expect(config.api.endpoints.patients).toBeDefined();
      expect(config.api.endpoints.appointments).toBeDefined();
      expect(config.api.endpoints.doctors).toBeDefined();
      expect(config.api.endpoints.address).toBeDefined();
      expect(config.api.endpoints.prescriptions).toBeDefined();
      expect(config.api.endpoints.transactions).toBeDefined();
    });

    it('should provide complete app configuration', () => {
      const config = getEnvironmentConfig();
      
      expect(config.app).toBeDefined();
      expect(config.app.appName).toBeDefined();
      expect(config.app.version).toBeDefined();
      expect(typeof config.app.debugMode).toBe('boolean');
      expect(config.app.logLevel).toBeDefined();
      expect(['error', 'warn', 'info', 'debug']).toContain(config.app.logLevel);
    });

    it('should provide complete storage configuration', () => {
      const config = getEnvironmentConfig();
      
      expect(config.storage).toBeDefined();
      expect(config.storage.localStoragePrefix).toBeDefined();
      expect(config.storage.sessionStoragePrefix).toBeDefined();
      expect(config.storage.cacheTimeout).toBeGreaterThan(0);
      expect(config.storage.maxCacheSize).toBeGreaterThan(0);
    });

    it('should provide complete UI configuration', () => {
      const config = getEnvironmentConfig();
      
      expect(config.ui).toBeDefined();
      expect(config.ui.defaultTheme).toBeDefined();
      expect(['light', 'dark', 'system']).toContain(config.ui.defaultTheme);
      expect(config.ui.defaultLanguage).toBeDefined();
      expect(typeof config.ui.animationsEnabled).toBe('boolean');
      expect(typeof config.ui.compactMode).toBe('boolean');
    });

    it('should provide complete feature flags', () => {
      const config = getEnvironmentConfig();
      
      expect(config.features).toBeDefined();
      expect(typeof config.features.useApiBackend).toBe('boolean');
      expect(typeof config.features.enableAuth).toBe('boolean');
      expect(typeof config.features.enableOfflineMode).toBe('boolean');
      expect(typeof config.features.enablePWA).toBe('boolean');
      expect(typeof config.features.enableAnalytics).toBe('boolean');
    });
  });

  describe('edge cases and robustness', () => {
    it('should handle missing environment variables gracefully', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            // Most env vars missing, only basic ones present
            DEV: true,
            PROD: false,
            MODE: 'development',
          },
        },
      });
      
      const config = getEnvironmentConfig();
      
      // Should not throw and should have reasonable defaults
      expect(config).toBeDefined();
      expect(config.api.baseUrl).toBeDefined();
      expect(config.app.appName).toBeDefined();
      expect(config.storage.localStoragePrefix).toBeDefined();
    });

    it('should handle zero and empty string values appropriately', () => {
      vi.stubGlobal('import', {
        meta: {
          env: {
            VITE_API_TIMEOUT: '0',
            VITE_MAX_CACHE_SIZE: '0',
            VITE_APP_NAME: '',
            VITE_STORAGE_PREFIX: '',
            DEV: false,
            PROD: false,
            MODE: 'test',
          },
        },
      });
      
      const config = getEnvironmentConfig();
      
      expect(config.api.timeout).toBe(0);
      expect(config.storage.maxCacheSize).toBe(0);
      // Empty strings should use defaults
      expect(config.app.appName).toBe('Nx Starter'); // default when empty
      expect(config.storage.localStoragePrefix).toBe('nx-starter'); // default when empty
    });
  });
});