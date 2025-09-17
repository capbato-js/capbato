import { describe, it, expect, vi } from 'vitest';
import { getEnvironmentConfig, environmentOverrides } from './EnvironmentConfig';

describe('EnvironmentConfig', () => {
  describe('getEnvironmentConfig', () => {
    it('should return a valid configuration object', () => {
      const config = getEnvironmentConfig();
      
      expect(config).toHaveProperty('api');
      expect(config).toHaveProperty('features');
      expect(config).toHaveProperty('app');
      expect(config).toHaveProperty('storage');
      expect(config).toHaveProperty('ui');
      
      // API section
      expect(config.api).toHaveProperty('baseUrl');
      expect(config.api).toHaveProperty('timeout');
      expect(config.api).toHaveProperty('endpoints');
      expect(typeof config.api.baseUrl).toBe('string');
      expect(typeof config.api.timeout).toBe('number');
      
      // Features section
      expect(config.features).toHaveProperty('useApiBackend');
      expect(config.features).toHaveProperty('enableAuth');
      expect(config.features).toHaveProperty('enableOfflineMode');
      expect(config.features).toHaveProperty('enablePWA');
      expect(config.features).toHaveProperty('enableAnalytics');
      expect(typeof config.features.useApiBackend).toBe('boolean');
      expect(typeof config.features.enableAuth).toBe('boolean');
      
      // App section
      expect(config.app).toHaveProperty('appName');
      expect(config.app).toHaveProperty('version');
      expect(config.app).toHaveProperty('debugMode');
      expect(config.app).toHaveProperty('logLevel');
      expect(typeof config.app.appName).toBe('string');
      expect(typeof config.app.version).toBe('string');
      expect(typeof config.app.debugMode).toBe('boolean');
      expect(['error', 'warn', 'info', 'debug']).toContain(config.app.logLevel);
      
      // Storage section
      expect(config.storage).toHaveProperty('localStoragePrefix');
      expect(config.storage).toHaveProperty('sessionStoragePrefix');
      expect(config.storage).toHaveProperty('cacheTimeout');
      expect(config.storage).toHaveProperty('maxCacheSize');
      expect(typeof config.storage.localStoragePrefix).toBe('string');
      expect(typeof config.storage.cacheTimeout).toBe('number');
      expect(config.storage.cacheTimeout).toBeGreaterThan(0);
      
      // UI section
      expect(config.ui).toHaveProperty('defaultTheme');
      expect(config.ui).toHaveProperty('defaultLanguage');
      expect(config.ui).toHaveProperty('animationsEnabled');
      expect(config.ui).toHaveProperty('compactMode');
      expect(['light', 'dark', 'system']).toContain(config.ui.defaultTheme);
      expect(typeof config.ui.defaultLanguage).toBe('string');
      expect(typeof config.ui.animationsEnabled).toBe('boolean');
    });

    it('should generate correct endpoint functions', () => {
      const config = getEnvironmentConfig();
      const { endpoints } = config.api;
      
      // Test todos endpoints
      expect(endpoints.todos.byId('123')).toBe('/api/todos/123');
      expect(endpoints.todos.all).toBe('/api/todos');
      expect(endpoints.todos.active).toBe('/api/todos/active');
      expect(endpoints.todos.completed).toBe('/api/todos/completed');
      
      // Test patients endpoints
      expect(endpoints.patients.byId('patient-1')).toBe('/api/patients/patient-1');
      expect(endpoints.patients.update('patient-2')).toBe('/api/patients/patient-2');
      expect(endpoints.patients.all).toBe('/api/patients');
      expect(endpoints.patients.create).toBe('/api/patients');
      
      // Test appointments endpoints
      expect(endpoints.appointments.byId('apt-1')).toBe('/api/appointments/apt-1');
      expect(endpoints.appointments.byPatientId('patient-1')).toBe('/api/appointments/patient/patient-1');
      expect(endpoints.appointments.confirm('apt-1')).toBe('/api/appointments/apt-1/confirm');
      expect(endpoints.appointments.cancel('apt-1')).toBe('/api/appointments/apt-1/cancel');
      expect(endpoints.appointments.complete('apt-1')).toBe('/api/appointments/apt-1/complete');
      expect(endpoints.appointments.reconfirm('apt-1')).toBe('/api/appointments/apt-1/reconfirm');
      expect(endpoints.appointments.todayConfirmed).toBe('/api/appointments/today/confirmed');
      
      // Test doctors endpoints
      expect(endpoints.doctors.byId('doc-1')).toBe('/api/doctors/doc-1');
      expect(endpoints.doctors.byUserId('user-1')).toBe('/api/doctors/user/user-1');
      expect(endpoints.doctors.bySpecialization('cardiology')).toBe('/api/doctors/specialization/cardiology');
      expect(endpoints.doctors.check('user-1')).toBe('/api/doctors/check/user-1');
      
      // Test address endpoints
      expect(endpoints.address.provinces).toBe('/api/address/provinces');
      expect(endpoints.address.cities('PH-01')).toBe('/api/address/cities/PH-01');
      expect(endpoints.address.barangays('CITY-01')).toBe('/api/address/barangays/CITY-01');
      
      // Test prescriptions endpoints
      expect(endpoints.prescriptions.byId('rx-1')).toBe('/api/prescriptions/rx-1');
      expect(endpoints.prescriptions.byPatientId('patient-1')).toBe('/api/prescriptions/patient/patient-1');
      expect(endpoints.prescriptions.byDoctorId('doc-1')).toBe('/api/prescriptions/doctor/doc-1');
      expect(endpoints.prescriptions.byMedicationName('aspirin')).toBe('/api/prescriptions/medication/aspirin');
      expect(endpoints.prescriptions.active).toBe('/api/prescriptions/active');
      expect(endpoints.prescriptions.expired).toBe('/api/prescriptions/expired');
      
      // Test transactions endpoints
      expect(endpoints.transactions.byId('tx-1')).toBe('/api/transactions/tx-1');
      expect(endpoints.transactions.delete('tx-1')).toBe('/api/transactions/tx-1');
      expect(endpoints.transactions.create).toBe('/api/transactions');
    });

    it('should have consistent endpoint structure', () => {
      const config = getEnvironmentConfig();
      const { endpoints } = config.api;
      
      // Verify all endpoint categories exist
      expect(endpoints).toHaveProperty('todos');
      expect(endpoints).toHaveProperty('auth');
      expect(endpoints).toHaveProperty('patients');
      expect(endpoints).toHaveProperty('appointments');
      expect(endpoints).toHaveProperty('doctors');
      expect(endpoints).toHaveProperty('address');
      expect(endpoints).toHaveProperty('prescriptions');
      expect(endpoints).toHaveProperty('transactions');
      
      // Verify endpoint functions are functions
      expect(typeof endpoints.todos.byId).toBe('function');
      expect(typeof endpoints.patients.byId).toBe('function');
      expect(typeof endpoints.appointments.byPatientId).toBe('function');
      expect(typeof endpoints.doctors.bySpecialization).toBe('function');
      expect(typeof endpoints.address.cities).toBe('function');
      expect(typeof endpoints.prescriptions.byMedicationName).toBe('function');
      expect(typeof endpoints.transactions.delete).toBe('function');
    });

    it('should have valid auth endpoints', () => {
      const config = getEnvironmentConfig();
      const { auth } = config.api.endpoints;
      
      expect(auth).toHaveProperty('login');
      expect(auth).toHaveProperty('register');
      expect(auth).toHaveProperty('logout');
      expect(auth).toHaveProperty('refresh');
      expect(auth).toHaveProperty('validate');
      expect(auth).toHaveProperty('me');
      
      expect(auth.login).toBe('/api/auth/login');
      expect(auth.register).toBe('/api/auth/register');
      expect(auth.logout).toBe('/api/auth/logout');
      expect(auth.refresh).toBe('/api/auth/refresh');
      expect(auth.validate).toBe('/api/auth/validate');
      expect(auth.me).toBe('/api/auth/me');
    });

    it('should have sensible default values', () => {
      const config = getEnvironmentConfig();
      
      // API defaults
      expect(config.api.timeout).toBeGreaterThan(0);
      expect(config.api.baseUrl).toMatch(/^https?:\/\//);
      
      // App defaults
      expect(config.app.appName).toBeTruthy();
      expect(config.app.version).toMatch(/^\d+\.\d+\.\d+/);
      
      // Storage defaults
      expect(config.storage.localStoragePrefix).toBeTruthy();
      expect(config.storage.sessionStoragePrefix).toBeTruthy();
      expect(config.storage.cacheTimeout).toBeGreaterThan(0);
      expect(config.storage.maxCacheSize).toBeGreaterThan(0);
      
      // UI defaults
      expect(config.ui.defaultLanguage).toBeTruthy();
      expect(['light', 'dark', 'system']).toContain(config.ui.defaultTheme);
    });
  });

  describe('environmentOverrides', () => {
    it('should export environment overrides object', () => {
      expect(environmentOverrides).toBeDefined();
      expect(typeof environmentOverrides).toBe('object');
      
      expect(environmentOverrides).toHaveProperty('development');
      expect(environmentOverrides).toHaveProperty('staging');
      expect(environmentOverrides).toHaveProperty('production');
      expect(environmentOverrides).toHaveProperty('test');
    });

    it('should have correct structure for each environment', () => {
      // Development overrides
      expect(environmentOverrides.development).toHaveProperty('features');
      expect(environmentOverrides.development?.features?.enableAnalytics).toBe(false);
      expect(environmentOverrides.development?.app?.debugMode).toBe(true);
      expect(environmentOverrides.development?.app?.logLevel).toBe('debug');
      
      // Production overrides
      expect(environmentOverrides.production).toHaveProperty('features');
      expect(environmentOverrides.production?.features?.enableAnalytics).toBe(true);
      expect(environmentOverrides.production?.app?.debugMode).toBe(false);
      expect(environmentOverrides.production?.app?.logLevel).toBe('error');
      expect(environmentOverrides.production?.api?.timeout).toBe(15000);
      
      // Test overrides
      expect(environmentOverrides.test).toHaveProperty('features');
      expect(environmentOverrides.test?.features?.useApiBackend).toBe(false);
      expect(environmentOverrides.test?.features?.enableAuth).toBe(false);
      expect(environmentOverrides.test?.app?.debugMode).toBe(false);
      expect(environmentOverrides.test?.app?.logLevel).toBe('error');
    });

    it('should have valid configuration types', () => {
      Object.values(environmentOverrides).forEach(override => {
        if (override) {
          // Verify override has proper structure
          if (override.features) {
            if (override.features.hasOwnProperty('useApiBackend')) {
              expect(typeof override.features.useApiBackend).toBe('boolean');
            }
            if (override.features.hasOwnProperty('enableAuth')) {
              expect(typeof override.features.enableAuth).toBe('boolean');
            }
            if (override.features.hasOwnProperty('enableAnalytics')) {
              expect(typeof override.features.enableAnalytics).toBe('boolean');
            }
          }
          
          if (override.app) {
            if (override.app.hasOwnProperty('debugMode')) {
              expect(typeof override.app.debugMode).toBe('boolean');
            }
            if (override.app.hasOwnProperty('logLevel')) {
              expect(['error', 'warn', 'info', 'debug']).toContain(override.app.logLevel);
            }
          }
          
          if (override.api) {
            if (override.api.hasOwnProperty('timeout')) {
              expect(typeof override.api.timeout).toBe('number');
              expect(override.api.timeout).toBeGreaterThan(0);
            }
          }
        }
      });
    });

    it('should have different log levels for different environments', () => {
      expect(environmentOverrides.development?.app?.logLevel).toBe('debug');
      expect(environmentOverrides.staging?.app?.logLevel).toBe('warn');
      expect(environmentOverrides.production?.app?.logLevel).toBe('error');
      expect(environmentOverrides.test?.app?.logLevel).toBe('error');
    });

    it('should have analytics disabled in development', () => {
      expect(environmentOverrides.development?.features?.enableAnalytics).toBe(false);
      expect(environmentOverrides.staging?.features?.enableAnalytics).toBe(true);
      expect(environmentOverrides.production?.features?.enableAnalytics).toBe(true);
    });

    it('should have debug mode enabled only in development', () => {
      expect(environmentOverrides.development?.app?.debugMode).toBe(true);
      expect(environmentOverrides.staging?.app?.debugMode).toBe(false);
      expect(environmentOverrides.production?.app?.debugMode).toBe(false);
      expect(environmentOverrides.test?.app?.debugMode).toBe(false);
    });
  });

  describe('function consistency', () => {
    it('should return the same configuration on multiple calls', () => {
      const config1 = getEnvironmentConfig();
      const config2 = getEnvironmentConfig();
      
      expect(config1.api.baseUrl).toBe(config2.api.baseUrl);
      expect(config1.api.timeout).toBe(config2.api.timeout);
      expect(config1.app.appName).toBe(config2.app.appName);
      expect(config1.features.useApiBackend).toBe(config2.features.useApiBackend);
    });

    it('should have working endpoint functions', () => {
      const config = getEnvironmentConfig();
      
      // Test that endpoint functions work with different inputs
      expect(config.api.endpoints.todos.byId('test-1')).toBe('/api/todos/test-1');
      expect(config.api.endpoints.todos.byId('test-2')).toBe('/api/todos/test-2');
      
      expect(config.api.endpoints.patients.update('patient-1')).toBe('/api/patients/patient-1');
      expect(config.api.endpoints.patients.update('patient-2')).toBe('/api/patients/patient-2');
      
      expect(config.api.endpoints.doctors.bySpecialization('cardiology')).toBe('/api/doctors/specialization/cardiology');
      expect(config.api.endpoints.doctors.bySpecialization('neurology')).toBe('/api/doctors/specialization/neurology');
    });
  });
});