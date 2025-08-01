import 'reflect-metadata';
import { container } from 'tsyringe';
import { TodoRepository } from '../persistence/TodoRepository';
import { ApiTodoRepository } from '../api/ApiTodoRepository';
import { IHttpClient } from '../http/IHttpClient';
import { AxiosHttpClient } from '../http/AxiosHttpClient';
import { ITodoApiService } from '../api/ITodoApiService';
import { TodoApiService } from '../api/TodoApiService';
import { IAuthApiService } from '../api/IAuthApiService';
import { AuthApiService } from '../api/AuthApiService';
import { MockAuthApiService } from '../api/MockAuthApiService';
import { AuthCommandService } from '../api/AuthCommandService';
import { IPatientApiService } from '../api/IPatientApiService';
import { PatientApiService } from '../api/PatientApiService';
import { ApiPatientRepository } from '../api/ApiPatientRepository';
import { IUserApiService } from '../api/IUserApiService';
import { UserApiService } from '../api/UserApiService';
import { WebUserQueryService } from '../services/WebUserQueryService';
import { getFeatureFlags, configProvider } from '../config';
import {
  TodoCommandService,
  TodoQueryService,
  PatientQueryService,
  CreateTodoUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
  ToggleTodoUseCase,
  GetAllTodosQueryHandler,
  GetFilteredTodosQueryHandler,
  GetActiveTodosQueryHandler,
  GetCompletedTodosQueryHandler,
  GetTodoStatsQueryHandler,
  GetTodoByIdQueryHandler,
  GetAllPatientsQueryHandler,
  GetPatientByIdQueryHandler,
  TOKENS,
} from '@nx-starter/application-shared';
import type { ITodoRepository } from '@nx-starter/domain';
import type {
  ITodoCommandService,
  ITodoQueryService,
  IAuthCommandService,
  IPatientQueryService,
  IPatientRepository,
  IUserQueryService,
} from '@nx-starter/application-shared';

// Initialize configuration before using it
configProvider.initialize();

// Get feature flags from centralized configuration
const { useApiBackend, enableAuth } = getFeatureFlags(); 

// Register dependencies following Clean Architecture layers
export const configureDI = () => {
  // Infrastructure Layer - HTTP Client (always register for potential future use)
  container.register<IHttpClient>(TOKENS.HttpClient, {
    useFactory: () => new AxiosHttpClient()
  });
  
  // Infrastructure Layer - API Services (always register for potential future use)
  container.registerSingleton<ITodoApiService>(TOKENS.TodoApiService, TodoApiService);
  container.registerSingleton<IPatientApiService>(TOKENS.PatientApiService, PatientApiService);
  container.registerSingleton<IUserApiService>(TOKENS.UserApiService, UserApiService);
  
  // Auth API Service - use mock in development if auth is not enabled
  if (enableAuth && useApiBackend) {
    console.log('🔐 Using real AuthApiService for authentication');
    container.registerSingleton<IAuthApiService>(TOKENS.AuthApiService, AuthApiService);
  } else {
    console.log('🧪 Using MockAuthApiService for development');
    container.registerSingleton<IAuthApiService>(TOKENS.AuthApiService, MockAuthApiService);
  }

  // Infrastructure Layer - Repository (conditionally based on environment)
  if (useApiBackend) {
    console.log('📡 Using API backend for data storage');
    container.registerSingleton<ITodoRepository>(
      TOKENS.TodoRepository,
      ApiTodoRepository
    );
    container.registerSingleton<IPatientRepository>(
      TOKENS.PatientRepository,
      ApiPatientRepository
    );
  } else {
    console.log('💾 Using local Dexie.js for data storage');
    container.registerSingleton<ITodoRepository>(
      TOKENS.TodoRepository,
      TodoRepository
    );
    // For patients, we'll still use API backend even in local mode
    // since there's no local patient repository implementation
    container.registerSingleton<IPatientRepository>(
      TOKENS.PatientRepository,
      ApiPatientRepository
    );
  }

  // Application Layer - Use Cases (Commands)
  container.registerSingleton(TOKENS.CreateTodoUseCase, CreateTodoUseCase);
  container.registerSingleton(TOKENS.UpdateTodoUseCase, UpdateTodoUseCase);
  container.registerSingleton(TOKENS.DeleteTodoUseCase, DeleteTodoUseCase);
  container.registerSingleton(TOKENS.ToggleTodoUseCase, ToggleTodoUseCase);

  // Application Layer - Use Cases (Queries)
  container.registerSingleton(
    TOKENS.GetAllTodosQueryHandler,
    GetAllTodosQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetFilteredTodosQueryHandler,
    GetFilteredTodosQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetActiveTodosQueryHandler,
    GetActiveTodosQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetCompletedTodosQueryHandler,
    GetCompletedTodosQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetTodoStatsQueryHandler,
    GetTodoStatsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetTodoByIdQueryHandler,
    GetTodoByIdQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetAllPatientsQueryHandler,
    GetAllPatientsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetPatientByIdQueryHandler,
    GetPatientByIdQueryHandler
  );

  // Application Layer - CQRS Services
  container.registerSingleton<ITodoCommandService>(
    TOKENS.TodoCommandService,
    TodoCommandService
  );
  container.registerSingleton<ITodoQueryService>(
    TOKENS.TodoQueryService,
    TodoQueryService
  );
  container.registerSingleton<IAuthCommandService>(
    TOKENS.AuthCommandService,
    AuthCommandService
  );
  container.registerSingleton<IPatientQueryService>(
    TOKENS.PatientQueryService,
    PatientQueryService
  );
  container.registerSingleton<IUserQueryService>(
    TOKENS.UserQueryService,
    WebUserQueryService
  );
};

// Export container and tokens for use in components
export { container, TOKENS };
