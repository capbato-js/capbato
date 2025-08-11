/**
 * Application Configuration Types and Interfaces
 * Centralized configuration management following Clean Architecture principles
 */

export interface ApiConfiguration {
  baseUrl: string;
  timeout: number;
  endpoints: {
    todos: {
      base: string;
      all: string;
      byId: (id: string) => string;
      active: string;
      completed: string;
    };
    auth?: {
      login: string;
      register: string;
      logout: string;
      refresh: string;
      validate: string;
      me: string;
    };
    patients: {
      base: string;
      all: string;
      create: string;
      update: (id: string) => string;
      byId: (id: string) => string;
      stats: string;
    };
    appointments: {
      base: string;
      all: string;
      create: string;
      byId: (id: string) => string;
      byPatientId: (patientId: string) => string;
      update: (id: string) => string;
      delete: (id: string) => string;
      confirm: (id: string) => string;
      cancel: (id: string) => string;
      complete: (id: string) => string;
      reconfirm: (id: string) => string;
    };
    doctors: {
      base: string;
      all: string;
      byId: (id: string) => string;
      byUserId: (userId: string) => string;
      bySpecialization: (specialization: string) => string;
      check: (userId: string) => string;
    };
    address: {
      base: string;
      provinces: string;
      cities: (provinceCode: string) => string;
      barangays: (cityCode: string) => string;
    };
    prescriptions: {
      base: string;
      all: string;
      byId: (id: string) => string;
      active: string;
      expired: string;
      stats: string;
      byPatientId: (patientId: string) => string;
      byDoctorId: (doctorId: string) => string;
      byMedicationName: (medicationName: string) => string;
    };
    transactions: {
      base: string;
      all: string;
      byId: (id: string) => string;
      create: string;
      delete: (id: string) => string;
    };
  };
}

export interface FeatureFlags {
  useApiBackend: boolean;
  enableAuth: boolean;
  enableOfflineMode: boolean;
  enablePWA: boolean;
  enableAnalytics: boolean;
}

export interface ApplicationSettings {
  appName: string;
  version: string;
  debugMode: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

export interface StorageSettings {
  localStoragePrefix: string;
  sessionStoragePrefix: string;
  cacheTimeout: number;
  maxCacheSize: number;
}

export interface UISettings {
  defaultTheme: 'light' | 'dark' | 'system';
  defaultLanguage: string;
  animationsEnabled: boolean;
  compactMode: boolean;
}

/**
 * Complete application configuration interface
 */
export interface AppConfig {
  api: ApiConfiguration;
  features: FeatureFlags;
  app: ApplicationSettings;
  storage: StorageSettings;
  ui: UISettings;
}

/**
 * Environment-specific configuration overrides
 */
export interface EnvironmentConfig {
  development?: Partial<AppConfig>;
  staging?: Partial<AppConfig>;
  production?: Partial<AppConfig>;
  test?: Partial<AppConfig>;
}