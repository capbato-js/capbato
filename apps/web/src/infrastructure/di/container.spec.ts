import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { container } from 'tsyringe';

// Mock all dependencies
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

// Mock config
const mockConfigProvider = {
  initialize: vi.fn(),
};

const mockGetFeatureFlags = vi.fn(() => ({
  useApiBackend: true,
  enableAuth: true,
  enableOfflineMode: false,
  enablePWA: true,
  enableAnalytics: false,
}));

const mockGetApiConfig = vi.fn(() => ({
  baseUrl: 'http://localhost:4000',
  timeout: 5000,
}));

vi.mock('../config', () => ({
  configProvider: mockConfigProvider,
  getFeatureFlags: mockGetFeatureFlags,
  getApiConfig: mockGetApiConfig,
}));

// Mock application-shared
vi.mock('@nx-starter/application-shared', () => ({
  TodoCommandService: class MockTodoCommandService {},
  TodoQueryService: class MockTodoQueryService {},
  PrescriptionCommandService: class MockPrescriptionCommandService {},
  PrescriptionQueryService: class MockPrescriptionQueryService {},
  CreateTodoUseCase: class MockCreateTodoUseCase {},
  UpdateTodoUseCase: class MockUpdateTodoUseCase {},
  DeleteTodoUseCase: class MockDeleteTodoUseCase {},
  ToggleTodoUseCase: class MockToggleTodoUseCase {},
  GetAllTodosQueryHandler: class MockGetAllTodosQueryHandler {},
  GetFilteredTodosQueryHandler: class MockGetFilteredTodosQueryHandler {},
  GetActiveTodosQueryHandler: class MockGetActiveTodosQueryHandler {},
  GetCompletedTodosQueryHandler: class MockGetCompletedTodosQueryHandler {},
  GetTodoStatsQueryHandler: class MockGetTodoStatsQueryHandler {},
  GetTodoByIdQueryHandler: class MockGetTodoByIdQueryHandler {},
  GetAllPatientsQueryHandler: class MockGetAllPatientsQueryHandler {},
  GetPatientByIdQueryHandler: class MockGetPatientByIdQueryHandler {},
  CreatePrescriptionUseCase: class MockCreatePrescriptionUseCase {},
  UpdatePrescriptionUseCase: class MockUpdatePrescriptionUseCase {},
  DeletePrescriptionUseCase: class MockDeletePrescriptionUseCase {},
  GetAllPrescriptionsQueryHandler: class MockGetAllPrescriptionsQueryHandler {},
  GetPrescriptionByIdQueryHandler: class MockGetPrescriptionByIdQueryHandler {},
  GetPrescriptionsByPatientIdQueryHandler: class MockGetPrescriptionsByPatientIdQueryHandler {},
  GetPrescriptionsByDoctorIdQueryHandler: class MockGetPrescriptionsByDoctorIdQueryHandler {},
  GetActivePrescriptionsQueryHandler: class MockGetActivePrescriptionsQueryHandler {},
  GetExpiredPrescriptionsQueryHandler: class MockGetExpiredPrescriptionsQueryHandler {},
  GetPrescriptionsByMedicationNameQueryHandler: class MockGetPrescriptionsByMedicationNameQueryHandler {},
  TOKENS: {
    HttpClient: 'HttpClient',
    TodoApiService: 'TodoApiService',
    PatientApiService: 'PatientApiService',
    UserApiService: 'UserApiService',
    DoctorApiService: 'DoctorApiService',
    AddressApiService: 'AddressApiService',
    LaboratoryApiService: 'LaboratoryApiService',
    PrescriptionApiService: 'PrescriptionApiService',
    AuthApiService: 'AuthApiService',
    TodoRepository: 'TodoRepository',
    PatientRepository: 'PatientRepository',
    PrescriptionRepository: 'PrescriptionRepository',
    CreateTodoUseCase: 'CreateTodoUseCase',
    UpdateTodoUseCase: 'UpdateTodoUseCase',
    DeleteTodoUseCase: 'DeleteTodoUseCase',
    ToggleTodoUseCase: 'ToggleTodoUseCase',
    CreatePrescriptionUseCase: 'CreatePrescriptionUseCase',
    UpdatePrescriptionUseCase: 'UpdatePrescriptionUseCase',
    DeletePrescriptionUseCase: 'DeletePrescriptionUseCase',
    GetAllTodosQueryHandler: 'GetAllTodosQueryHandler',
    GetFilteredTodosQueryHandler: 'GetFilteredTodosQueryHandler',
    GetActiveTodosQueryHandler: 'GetActiveTodosQueryHandler',
    GetCompletedTodosQueryHandler: 'GetCompletedTodosQueryHandler',
    GetTodoStatsQueryHandler: 'GetTodoStatsQueryHandler',
    GetTodoByIdQueryHandler: 'GetTodoByIdQueryHandler',
    GetAllPatientsQueryHandler: 'GetAllPatientsQueryHandler',
    GetPatientByIdQueryHandler: 'GetPatientByIdQueryHandler',
    GetAllPrescriptionsQueryHandler: 'GetAllPrescriptionsQueryHandler',
    GetPrescriptionByIdQueryHandler: 'GetPrescriptionByIdQueryHandler',
    GetPrescriptionsByPatientIdQueryHandler: 'GetPrescriptionsByPatientIdQueryHandler',
    GetPrescriptionsByDoctorIdQueryHandler: 'GetPrescriptionsByDoctorIdQueryHandler',
    GetActivePrescriptionsQueryHandler: 'GetActivePrescriptionsQueryHandler',
    GetExpiredPrescriptionsQueryHandler: 'GetExpiredPrescriptionsQueryHandler',
    GetPrescriptionsByMedicationNameQueryHandler: 'GetPrescriptionsByMedicationNameQueryHandler',
    TodoCommandService: 'TodoCommandService',
    TodoQueryService: 'TodoQueryService',
    AuthCommandService: 'AuthCommandService',
    PatientCommandService: 'PatientCommandService',
    UserCommandService: 'UserCommandService',
    PatientQueryService: 'PatientQueryService',
    PrescriptionCommandService: 'PrescriptionCommandService',
    PrescriptionQueryService: 'PrescriptionQueryService',
    UserQueryService: 'UserQueryService',
  },
}));

describe('DI Container', () => {
  let configureDI: () => void;

  beforeEach(async () => {
    vi.clearAllMocks();
    container.clearInstances();
    
    // Import the configureDI function after mocks are set up
    const module = await import('./container');
    configureDI = module.configureDI;
  });

  afterEach(() => {
    container.clearInstances();
    vi.resetModules();
  });

  describe('Configuration', () => {
    it('should configure DI without throwing', () => {
      expect(() => configureDI()).not.toThrow();
    });

    it('should initialize config provider', () => {
      configureDI();
      expect(mockConfigProvider.initialize).toHaveBeenCalledTimes(1);
    });

    it('should get feature flags', () => {
      configureDI();
      expect(mockGetFeatureFlags).toHaveBeenCalled();
    });
  });

  describe('Service Registration', () => {
    beforeEach(() => {
      configureDI();
    });

    it('should register HTTP client', () => {
      const httpClient = container.resolve('HttpClient');
      expect(httpClient).toBeDefined();
    });

    it('should register API services', () => {
      expect(() => container.resolve('TodoApiService')).not.toThrow();
      expect(() => container.resolve('PatientApiService')).not.toThrow();
      expect(() => container.resolve('UserApiService')).not.toThrow();
      expect(() => container.resolve('DoctorApiService')).not.toThrow();
      expect(() => container.resolve('AddressApiService')).not.toThrow();
      expect(() => container.resolve('LaboratoryApiService')).not.toThrow();
      expect(() => container.resolve('PrescriptionApiService')).not.toThrow();
      expect(() => container.resolve('TransactionApiService')).not.toThrow();
    });

    it('should register auth service based on feature flags', () => {
      expect(() => container.resolve('AuthApiService')).not.toThrow();
    });

    it('should register repositories based on backend flag', () => {
      expect(() => container.resolve('TodoRepository')).not.toThrow();
      expect(() => container.resolve('PatientRepository')).not.toThrow();
      expect(() => container.resolve('PrescriptionRepository')).not.toThrow();
    });

    it('should register use cases', () => {
      expect(() => container.resolve('CreateTodoUseCase')).not.toThrow();
      expect(() => container.resolve('UpdateTodoUseCase')).not.toThrow();
      expect(() => container.resolve('DeleteTodoUseCase')).not.toThrow();
      expect(() => container.resolve('ToggleTodoUseCase')).not.toThrow();
      expect(() => container.resolve('CreatePrescriptionUseCase')).not.toThrow();
      expect(() => container.resolve('UpdatePrescriptionUseCase')).not.toThrow();
      expect(() => container.resolve('DeletePrescriptionUseCase')).not.toThrow();
    });

    it('should register query handlers', () => {
      expect(() => container.resolve('GetAllTodosQueryHandler')).not.toThrow();
      expect(() => container.resolve('GetFilteredTodosQueryHandler')).not.toThrow();
      expect(() => container.resolve('GetActiveTodosQueryHandler')).not.toThrow();
      expect(() => container.resolve('GetCompletedTodosQueryHandler')).not.toThrow();
      expect(() => container.resolve('GetTodoStatsQueryHandler')).not.toThrow();
      expect(() => container.resolve('GetTodoByIdQueryHandler')).not.toThrow();
      expect(() => container.resolve('GetAllPatientsQueryHandler')).not.toThrow();
      expect(() => container.resolve('GetPatientByIdQueryHandler')).not.toThrow();
    });

    it('should register CQRS services', () => {
      expect(() => container.resolve('TodoCommandService')).not.toThrow();
      expect(() => container.resolve('TodoQueryService')).not.toThrow();
      expect(() => container.resolve('AuthCommandService')).not.toThrow();
      expect(() => container.resolve('PatientCommandService')).not.toThrow();
      expect(() => container.resolve('UserCommandService')).not.toThrow();
      expect(() => container.resolve('PatientQueryService')).not.toThrow();
      expect(() => container.resolve('PrescriptionCommandService')).not.toThrow();
      expect(() => container.resolve('PrescriptionQueryService')).not.toThrow();
      expect(() => container.resolve('UserQueryService')).not.toThrow();
    });
  });

  describe('Feature Flag Based Registration', () => {
    it('should use mock auth service when auth is disabled', () => {
      mockGetFeatureFlags.mockReturnValue({
        useApiBackend: true,
        enableAuth: false,
        enableOfflineMode: false,
        enablePWA: true,
        enableAnalytics: false,
      });

      configureDI();
      
      // Should not throw when resolving auth service
      expect(() => container.resolve('AuthApiService')).not.toThrow();
    });

    it('should use mock auth service when API backend is disabled', () => {
      mockGetFeatureFlags.mockReturnValue({
        useApiBackend: false,
        enableAuth: true,
        enableOfflineMode: false,
        enablePWA: true,
        enableAnalytics: false,
      });

      configureDI();
      
      // Should not throw when resolving auth service
      expect(() => container.resolve('AuthApiService')).not.toThrow();
    });

    it('should use local repository when API backend is disabled', () => {
      mockGetFeatureFlags.mockReturnValue({
        useApiBackend: false,
        enableAuth: true,
        enableOfflineMode: false,
        enablePWA: true,
        enableAnalytics: false,
      });

      configureDI();
      
      // Should still be able to resolve repositories
      expect(() => container.resolve('TodoRepository')).not.toThrow();
      expect(() => container.resolve('PatientRepository')).not.toThrow();
      expect(() => container.resolve('PrescriptionRepository')).not.toThrow();
    });
  });

  describe('Container Export', () => {
    it('should export container instance', async () => {
      const module = await import('./container');
      expect(module.container).toBeDefined();
      expect(module.container).toBe(container);
    });

    it('should export TOKENS', async () => {
      const module = await import('./container');
      expect(module.TOKENS).toBeDefined();
      expect(typeof module.TOKENS).toBe('object');
    });
  });

  describe('Error Handling', () => {
    it('should handle config initialization failure gracefully', () => {
      mockConfigProvider.initialize.mockImplementation(() => {
        throw new Error('Config failed');
      });

      expect(() => configureDI()).toThrow('Config failed');
    });

    it('should handle feature flag resolution failure', () => {
      mockGetFeatureFlags.mockImplementation(() => {
        throw new Error('Feature flags failed');
      });

      expect(() => configureDI()).toThrow('Feature flags failed');
    });
  });

  describe('Singleton Registration', () => {
    it('should register services as singletons', () => {
      configureDI();
      
      const service1 = container.resolve('TodoApiService');
      const service2 = container.resolve('TodoApiService');
      
      expect(service1).toBe(service2);
    });

    it('should register use cases as singletons', () => {
      configureDI();
      
      const useCase1 = container.resolve('CreateTodoUseCase');
      const useCase2 = container.resolve('CreateTodoUseCase');
      
      expect(useCase1).toBe(useCase2);
    });

    it('should register query handlers as singletons', () => {
      configureDI();
      
      const handler1 = container.resolve('GetAllTodosQueryHandler');
      const handler2 = container.resolve('GetAllTodosQueryHandler');
      
      expect(handler1).toBe(handler2);
    });
  });
});