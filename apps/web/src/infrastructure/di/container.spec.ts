import { describe, it, expect, vi, beforeEach } from 'vitest';
import { container, configureDI, TOKENS } from './container';

// Mock all external dependencies to avoid complex setup
vi.mock('../persistence/TodoRepository');
vi.mock('../api/ApiTodoRepository');
vi.mock('../http/AxiosHttpClient');
vi.mock('../api/TodoApiService');
vi.mock('../api/AuthApiService');
vi.mock('../api/MockAuthApiService');
vi.mock('../api/AuthCommandService');
vi.mock('../services/PatientService');
vi.mock('../api/PatientApiService');
vi.mock('../api/ApiPatientRepository');
vi.mock('../api/UserApiService');
vi.mock('../api/DoctorApiService');
vi.mock('../api/AppointmentApiService');
vi.mock('../api/ScheduleApiService');
vi.mock('../api/AddressApiService');
vi.mock('../api/LaboratoryApiService');
vi.mock('../api/PrescriptionApiService');
vi.mock('../api/ApiPrescriptionRepository');
vi.mock('../api/TransactionApiService');
vi.mock('../services/WebUserQueryService');
vi.mock('../../presentation/features/appointments/services/DoctorAssignmentService');
vi.mock('../services/UserCommandService');
vi.mock('@nx-starter/application-shared');
vi.mock('@nx-starter/domain');

// Mock config with default values
vi.mock('../config', () => ({
  getFeatureFlags: vi.fn().mockReturnValue({
    useApiBackend: true,
    enableAuth: true,
  }),
  configProvider: {
    initialize: vi.fn(),
  },
}));

describe('DI Container', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear container before each test
    container.clearInstances();
  });

  describe('configureDI', () => {
    it('should configure all dependencies without errors', () => {
      expect(() => configureDI()).not.toThrow();
    });

    it('should register HTTP client', () => {
      configureDI();
      expect(() => container.resolve(TOKENS.HttpClient)).not.toThrow();
    });

    it('should register API services', () => {
      configureDI();
      
      expect(() => container.resolve(TOKENS.TodoApiService)).not.toThrow();
      expect(() => container.resolve(TOKENS.PatientApiService)).not.toThrow();
      expect(() => container.resolve(TOKENS.UserApiService)).not.toThrow();
      expect(() => container.resolve(TOKENS.DoctorApiService)).not.toThrow();
      expect(() => container.resolve(TOKENS.AddressApiService)).not.toThrow();
      expect(() => container.resolve(TOKENS.LaboratoryApiService)).not.toThrow();
      expect(() => container.resolve(TOKENS.PrescriptionApiService)).not.toThrow();
      expect(() => container.resolve('TransactionApiService')).not.toThrow();
    });

    it('should register repositories', () => {
      configureDI();
      
      expect(() => container.resolve(TOKENS.TodoRepository)).not.toThrow();
      expect(() => container.resolve(TOKENS.PatientRepository)).not.toThrow();
      expect(() => container.resolve(TOKENS.PrescriptionRepository)).not.toThrow();
    });

    it('should register use cases', () => {
      configureDI();
      
      // Todo use cases
      expect(() => container.resolve(TOKENS.CreateTodoUseCase)).not.toThrow();
      expect(() => container.resolve(TOKENS.UpdateTodoUseCase)).not.toThrow();
      expect(() => container.resolve(TOKENS.DeleteTodoUseCase)).not.toThrow();
      expect(() => container.resolve(TOKENS.ToggleTodoUseCase)).not.toThrow();
      
      // Prescription use cases
      expect(() => container.resolve(TOKENS.CreatePrescriptionUseCase)).not.toThrow();
      expect(() => container.resolve(TOKENS.UpdatePrescriptionUseCase)).not.toThrow();
      expect(() => container.resolve(TOKENS.DeletePrescriptionUseCase)).not.toThrow();
    });

    it('should register query handlers', () => {
      configureDI();
      
      // Todo query handlers
      expect(() => container.resolve(TOKENS.GetAllTodosQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetFilteredTodosQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetActiveTodosQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetCompletedTodosQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetTodoStatsQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetTodoByIdQueryHandler)).not.toThrow();
      
      // Patient query handlers
      expect(() => container.resolve(TOKENS.GetAllPatientsQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetPatientByIdQueryHandler)).not.toThrow();
      
      // Prescription query handlers
      expect(() => container.resolve(TOKENS.GetAllPrescriptionsQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetPrescriptionByIdQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetPrescriptionsByPatientIdQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetPrescriptionsByDoctorIdQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetActivePrescriptionsQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetExpiredPrescriptionsQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetPrescriptionsByMedicationNameQueryHandler)).not.toThrow();
    });

    it('should register CQRS services', () => {
      configureDI();
      
      expect(() => container.resolve(TOKENS.TodoCommandService)).not.toThrow();
      expect(() => container.resolve(TOKENS.TodoQueryService)).not.toThrow();
      expect(() => container.resolve(TOKENS.AuthCommandService)).not.toThrow();
      expect(() => container.resolve(TOKENS.PatientCommandService)).not.toThrow();
      expect(() => container.resolve(TOKENS.UserCommandService)).not.toThrow();
      expect(() => container.resolve(TOKENS.PatientQueryService)).not.toThrow();
      expect(() => container.resolve(TOKENS.PrescriptionCommandService)).not.toThrow();
      expect(() => container.resolve(TOKENS.PrescriptionQueryService)).not.toThrow();
      expect(() => container.resolve(TOKENS.UserQueryService)).not.toThrow();
    });
  });

  describe('container configuration validation', () => {
    it('should have all required TOKENS defined', () => {
      expect(TOKENS).toBeDefined();
      expect(TOKENS.HttpClient).toBeDefined();
      expect(TOKENS.TodoApiService).toBeDefined();
      expect(TOKENS.PatientApiService).toBeDefined();
      expect(TOKENS.UserApiService).toBeDefined();
      expect(TOKENS.TodoRepository).toBeDefined();
      expect(TOKENS.PatientRepository).toBeDefined();
      expect(TOKENS.AuthApiService).toBeDefined();
      expect(TOKENS.TodoCommandService).toBeDefined();
      expect(TOKENS.TodoQueryService).toBeDefined();
    });

    it('should export container instance', () => {
      expect(container).toBeDefined();
      expect(typeof container.register).toBe('function');
      expect(typeof container.resolve).toBe('function');
      expect(typeof container.clearInstances).toBe('function');
    });

    it('should configure DI before resolving dependencies', () => {
      // Ensure that configureDI is called during setup
      expect(() => configureDI()).not.toThrow();
    });
  });

  describe('dependency resolution', () => {
    it('should resolve singleton instances consistently', () => {
      configureDI();
      
      const instance1 = container.resolve(TOKENS.TodoApiService);
      const instance2 = container.resolve(TOKENS.TodoApiService);
      
      expect(instance1).toBe(instance2);
    });

    it('should handle complex dependency graphs', () => {
      configureDI();
      
      // Test that complex dependency graphs don't cause errors
      expect(() => {
        container.resolve(TOKENS.TodoCommandService);
        container.resolve(TOKENS.TodoQueryService);
        container.resolve(TOKENS.CreateTodoUseCase);
      }).not.toThrow();
    });
  });

  describe('feature flag adaptation', () => {
    it('should configure DI correctly regardless of feature flags', () => {
      // Since we mock the config, this tests that the DI setup is resilient
      expect(() => configureDI()).not.toThrow();
      
      // Verify core services are still available
      expect(() => container.resolve(TOKENS.TodoApiService)).not.toThrow();
      expect(() => container.resolve(TOKENS.TodoRepository)).not.toThrow();
      expect(() => container.resolve(TOKENS.AuthApiService)).not.toThrow();
    });

    it('should handle container state cleanup', () => {
      configureDI();
      const firstInstance = container.resolve(TOKENS.TodoApiService);
      
      container.clearInstances();
      configureDI();
      const secondInstance = container.resolve(TOKENS.TodoApiService);
      
      // After clearing instances, new instances should be created
      expect(firstInstance).not.toBe(secondInstance);
    });
  });

  describe('container integration', () => {
    it('should provide access to core infrastructure services', () => {
      configureDI();
      
      // Test that the key infrastructure is accessible
      expect(() => container.resolve(TOKENS.HttpClient)).not.toThrow();
      expect(() => container.resolve(TOKENS.TodoRepository)).not.toThrow();
      expect(() => container.resolve(TOKENS.PatientRepository)).not.toThrow();
    });

    it('should provide access to application services', () => {
      configureDI();
      
      // Test that application layer services are accessible
      expect(() => container.resolve(TOKENS.TodoCommandService)).not.toThrow();
      expect(() => container.resolve(TOKENS.TodoQueryService)).not.toThrow();
      expect(() => container.resolve(TOKENS.PatientCommandService)).not.toThrow();
      expect(() => container.resolve(TOKENS.PatientQueryService)).not.toThrow();
    });

    it('should provide access to use cases', () => {
      configureDI();
      
      // Test that use cases are accessible
      expect(() => container.resolve(TOKENS.CreateTodoUseCase)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetAllTodosQueryHandler)).not.toThrow();
      expect(() => container.resolve(TOKENS.CreatePrescriptionUseCase)).not.toThrow();
      expect(() => container.resolve(TOKENS.GetAllPrescriptionsQueryHandler)).not.toThrow();
    });
  });
});