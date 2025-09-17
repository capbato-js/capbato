import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getEnvironmentConfig, environmentOverrides } from './EnvironmentConfig';

describe('EnvironmentConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    it('should have proper structure for all configuration sections', () => {
      const config = getEnvironmentConfig();
      
      // API section
      expect(config.api.baseUrl).toBeDefined();
      expect(config.api.timeout).toBeDefined();
      expect(config.api.endpoints).toBeDefined();
      
      // App section
      expect(config.app.appName).toBeDefined();
      expect(config.app.version).toBeDefined();
      expect(typeof config.app.debugMode).toBe('boolean');
      expect(config.app.logLevel).toBeDefined();
      
      // Storage section
      expect(config.storage.localStoragePrefix).toBeDefined();
      expect(config.storage.sessionStoragePrefix).toBeDefined();
      expect(config.storage.cacheTimeout).toBeDefined();
      expect(config.storage.maxCacheSize).toBeDefined();
      
      // UI section
      expect(config.ui.defaultTheme).toBeDefined();
      expect(config.ui.defaultLanguage).toBeDefined();
      expect(typeof config.ui.animationsEnabled).toBe('boolean');
      expect(typeof config.ui.compactMode).toBe('boolean');
      
      // Features section
      expect(typeof config.features.useApiBackend).toBe('boolean');
      expect(typeof config.features.enableAuth).toBe('boolean');
      expect(typeof config.features.enableOfflineMode).toBe('boolean');
      expect(typeof config.features.enablePWA).toBe('boolean');
      expect(typeof config.features.enableAnalytics).toBe('boolean');
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

      it('should provide all required endpoint groups', () => {
        const config = getEnvironmentConfig();
        
        expect(config.api.endpoints.todos).toBeDefined();
        expect(config.api.endpoints.auth).toBeDefined();
        expect(config.api.endpoints.patients).toBeDefined();
        expect(config.api.endpoints.appointments).toBeDefined();
        expect(config.api.endpoints.doctors).toBeDefined();
        expect(config.api.endpoints.address).toBeDefined();
        expect(config.api.endpoints.prescriptions).toBeDefined();
        expect(config.api.endpoints.transactions).toBeDefined();
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

      it('should provide all expected feature flags', () => {
        const config = getEnvironmentConfig();
        
        expect('useApiBackend' in config.features).toBe(true);
        expect('enableAuth' in config.features).toBe(true);
        expect('enableOfflineMode' in config.features).toBe(true);
        expect('enablePWA' in config.features).toBe(true);
        expect('enableAnalytics' in config.features).toBe(true);
      });
    });

    describe('configuration validation', () => {
      it('should have valid numeric values', () => {
        const config = getEnvironmentConfig();
        
        expect(config.api.timeout).toBeGreaterThanOrEqual(0);
        expect(config.storage.cacheTimeout).toBeGreaterThanOrEqual(0);
        expect(config.storage.maxCacheSize).toBeGreaterThanOrEqual(0);
      });

      it('should have valid string values', () => {
        const config = getEnvironmentConfig();
        
        expect(config.api.baseUrl).toBeTruthy();
        expect(config.app.appName).toBeTruthy();
        expect(config.app.version).toBeTruthy();
        expect(config.storage.localStoragePrefix).toBeTruthy();
        expect(config.storage.sessionStoragePrefix).toBeTruthy();
        expect(config.ui.defaultTheme).toBeTruthy();
        expect(config.ui.defaultLanguage).toBeTruthy();
      });

      it('should have valid enum values', () => {
        const config = getEnvironmentConfig();
        
        expect(['error', 'warn', 'info', 'debug']).toContain(config.app.logLevel);
        expect(['light', 'dark', 'system']).toContain(config.ui.defaultTheme);
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

    it('should have appropriate overrides for each environment', () => {
      // Development should have debug enabled
      expect(environmentOverrides.development.app?.debugMode).toBe(true);
      expect(environmentOverrides.development.app?.logLevel).toBe('debug');
      
      // Production should have minimal logging
      expect(environmentOverrides.production.app?.debugMode).toBe(false);
      expect(environmentOverrides.production.app?.logLevel).toBe('error');
      
      // Test environment should have most features disabled
      expect(environmentOverrides.test.features?.useApiBackend).toBe(false);
      expect(environmentOverrides.test.features?.enableAuth).toBe(false);
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
    it('should return consistent configuration on multiple calls', () => {
      const config1 = getEnvironmentConfig();
      const config2 = getEnvironmentConfig();
      
      expect(config1.api.baseUrl).toBe(config2.api.baseUrl);
      expect(config1.app.appName).toBe(config2.app.appName);
      expect(config1.features.useApiBackend).toBe(config2.features.useApiBackend);
    });

    it('should handle function calls in endpoints without errors', () => {
      const config = getEnvironmentConfig();
      
      expect(() => config.api.endpoints.todos.byId('test')).not.toThrow();
      expect(() => config.api.endpoints.patients.update('test')).not.toThrow();
      expect(() => config.api.endpoints.appointments.confirm('test')).not.toThrow();
    });

    it('should have all required endpoint functions', () => {
      const config = getEnvironmentConfig();
      
      // Verify function endpoints exist and are callable
      expect(typeof config.api.endpoints.todos.byId).toBe('function');
      expect(typeof config.api.endpoints.patients.byId).toBe('function');
      expect(typeof config.api.endpoints.patients.update).toBe('function');
      expect(typeof config.api.endpoints.appointments.byPatientId).toBe('function');
      expect(typeof config.api.endpoints.doctors.byUserId).toBe('function');
      expect(typeof config.api.endpoints.address.cities).toBe('function');
      expect(typeof config.api.endpoints.prescriptions.byPatientId).toBe('function');
      expect(typeof config.api.endpoints.transactions.byId).toBe('function');
    });
  });
});