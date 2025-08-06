import 'reflect-metadata';
import { container } from 'tsyringe';
import { InMemoryTodoRepository } from '../todo/persistence/in-memory/InMemoryTodoRepository';
import { SqliteTodoRepository } from '../todo/persistence/sqlite/SqliteTodoRepository';
import { TypeOrmTodoRepository } from '../todo/persistence/typeorm/TypeOrmTodoRepository';
import { MongooseTodoRepository } from '../todo/persistence/mongoose/MongooseTodoRepository';
import { InMemoryUserRepository, SqliteUserRepository, TypeOrmUserRepository, MongooseUserRepository } from '../user/persistence';
import { InMemoryPatientRepository } from '../patient/persistence/in-memory/InMemoryPatientRepository';
import { TypeOrmPatientRepository } from '../patient/persistence/typeorm/TypeOrmPatientRepository';
import { InMemoryDoctorRepository } from '../doctor/persistence/in-memory/InMemoryDoctorRepository';
import { TypeOrmDoctorRepository } from '../doctor/persistence/typeorm/TypeOrmDoctorRepository';
import { InMemoryAddressRepository } from '../address/persistence';
import { InMemoryScheduleRepository } from '../schedule/persistence/in-memory/InMemoryScheduleRepository';
import { TypeOrmScheduleRepository } from '../schedule/persistence/typeorm/TypeOrmScheduleRepository';
import { SqliteScheduleRepository } from '../schedule/persistence/sqlite/SqliteScheduleRepository';
import { MongooseScheduleRepository } from '../schedule/persistence/mongoose/MongooseScheduleRepository';
import { InMemoryAppointmentRepository } from '../appointment/persistence/in-memory/InMemoryAppointmentRepository';
import { TypeOrmAppointmentRepository } from '../appointment/persistence/typeorm/TypeOrmAppointmentRepository';
import { 
  InMemoryLabRequestRepository, 
  InMemoryBloodChemistryRepository,
  TypeOrmLabRequestRepository,
  TypeOrmBloodChemistryRepository,
  MongooseLabRequestRepository,
  MongooseBloodChemistryRepository,
  SqliteLabRequestRepository,
  SqliteBloodChemistryRepository
} from '../laboratory/persistence';
import {
  InMemoryPrescriptionRepository,
  TypeOrmPrescriptionRepository,
  MongoosePrescriptionRepository,
  SqlitePrescriptionRepository
} from '../prescription/persistence';
import {
  CreateTodoUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
  ToggleTodoUseCase,
  UpdateUserDetailsUseCase,
  GetAllTodosQueryHandler,
  GetActiveTodosQueryHandler,
  GetCompletedTodosQueryHandler,
  GetTodoByIdQueryHandler,
  GetTodoStatsQueryHandler,
  CreatePatientUseCase,
  GetAllPatientsQueryHandler,
  GetPatientByIdQueryHandler,
  GetPatientStatsQueryHandler,
  PatientNumberService,
  PhoneNumberService,
  AgeCalculationService,
  TOKENS,
  TodoValidationService,
  CreateTodoValidationService,
  UpdateTodoValidationService,
  DeleteTodoValidationService,
  ToggleTodoValidationService,
  UserValidationService,
  RegisterUserValidationService,
  LoginUserValidationService,
  UpdateUserDetailsValidationService,
  PatientValidationService,
  CreatePatientValidationService,
  GetPatientByIdValidationService,
  DoctorValidationService,
  GetDoctorByIdValidationService,
  GetDoctorsBySpecializationValidationService,
  GetAllProvincesQueryHandler,
  GetCitiesByProvinceCodeQueryHandler,
  GetBarangaysByCityCodeQueryHandler,
  AddressValidationService,
  GetCitiesValidationService,
  GetBarangaysValidationService,
  // Laboratory Use Cases  
  CreateLabRequestUseCase,
  UpdateLabRequestResultsUseCase,
  CreateBloodChemistryUseCase,
  // Laboratory Query Handlers
  GetAllLabRequestsQueryHandler,
  GetCompletedLabRequestsQueryHandler,
  GetLabRequestByPatientIdQueryHandler,
  // Laboratory Validation Services
  LaboratoryValidationService,
  CreateLabRequestValidationService,
  UpdateLabRequestValidationService,
  DeleteLabRequestValidationService,
  UpdateLabRequestResultsValidationService,
  CreateBloodChemistryValidationService,
  UpdateBloodChemistryValidationService,
  DeleteBloodChemistryValidationService,
  // Prescription Use Cases
  CreatePrescriptionUseCase,
  UpdatePrescriptionUseCase,
  DeletePrescriptionUseCase,
  // Prescription Query Handlers
  GetAllPrescriptionsQueryHandler,
  GetPrescriptionByIdQueryHandler,
  GetPrescriptionsByPatientIdQueryHandler,
  GetPrescriptionsByDoctorIdQueryHandler,
  GetActivePrescriptionsQueryHandler,
  GetExpiredPrescriptionsQueryHandler,
  GetPrescriptionsByMedicationNameQueryHandler,
  GetPrescriptionStatsQueryHandler,
  // Prescription Validation Services
  PrescriptionValidationService,
  CreatePrescriptionValidationService,
  UpdatePrescriptionValidationService,
  DeletePrescriptionValidationService,
} from '@nx-starter/application-shared';
import {
  CreateScheduleUseCase,
  UpdateScheduleUseCase,
  DeleteScheduleUseCase,
  GetAllSchedulesQueryHandler,
  GetScheduleByIdQueryHandler,
  GetSchedulesByDateQueryHandler,
  GetSchedulesByDoctorQueryHandler,
  GetTodaySchedulesQueryHandler,
  GetTodayDoctorQueryHandler,
  GetScheduleStatsQueryHandler,
  ScheduleValidationService,
  CreateScheduleValidationService,
  UpdateScheduleValidationService,
  DeleteScheduleValidationService,
  GetScheduleByIdValidationService,
  GetSchedulesByDateValidationService,
  GetSchedulesByDoctorValidationService,
  ScheduleWithDoctorService,
} from '@nx-starter/application-shared';
import {
  CreateAppointmentUseCase,
  UpdateAppointmentUseCase,
  DeleteAppointmentUseCase,
  ConfirmAppointmentUseCase,
  CancelAppointmentUseCase,
  CompleteAppointmentUseCase,
  RescheduleAppointmentUseCase,
  GetAllAppointmentsQueryHandler,
  GetAppointmentByIdQueryHandler,
  GetAppointmentsByPatientIdQueryHandler,
  GetTodayAppointmentsQueryHandler,
  GetTodayConfirmedAppointmentsQueryHandler,
  GetConfirmedAppointmentsQueryHandler,
  GetWeeklyAppointmentSummaryQueryHandler,
  GetAppointmentStatsQueryHandler,
  AppointmentValidationService,
  CreateAppointmentValidationService,
  UpdateAppointmentValidationService,
  DeleteAppointmentValidationService,
  ConfirmAppointmentValidationService,
  CancelAppointmentValidationService,
  CompleteAppointmentValidationService,
  RescheduleAppointmentValidationService,
  GetAppointmentByIdValidationService,
  GetAppointmentsByPatientIdValidationService,
  GetAppointmentsByDateValidationService,
  GetAppointmentsByDateRangeValidationService,
} from '@nx-starter/application-shared';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  ChangeUserPasswordUseCase,
  BcryptPasswordHashingService,
  JwtService,
  JwtConfig,
  GetAllUsersQueryHandler,
  GetDoctorsBySpecializationQueryHandler,
  CreateDoctorProfileCommandHandler,
} from '@nx-starter/application-api';
import {
  GetAllDoctorsQueryHandler,
  GetDoctorByIdQueryHandler,
  GetDoctorByUserIdQueryHandler,
  CheckDoctorProfileExistsQueryHandler,
} from '@nx-starter/application-shared';
import type { ITodoRepository, IUserRepository, IDoctorRepository, IAddressRepository, IScheduleRepository, IAppointmentRepository, IPrescriptionRepository } from '@nx-starter/domain';
import type { IPatientRepository } from '@nx-starter/application-shared';
import type { ILabRequestRepository, IBloodChemistryRepository } from '@nx-starter/domain';
import { AppointmentDomainService } from '@nx-starter/domain';
import { getTypeOrmDataSource } from '../database/connections/TypeOrmConnection';
import { connectMongoDB } from '../database/connections/MongooseConnection';
import { getDatabaseConfig, getSecurityConfig } from '../../config';

// Register dependencies following Clean Architecture layers
export const configureDI = async () => {
  // Infrastructure Layer - Repository (choose based on config)
  const todoRepositoryImplementation = await getTodoRepositoryImplementation();
  container.registerInstance<ITodoRepository>(
    TOKENS.TodoRepository,
    todoRepositoryImplementation
  );

  const userRepositoryImplementation = await getUserRepositoryImplementation();
  container.registerInstance<IUserRepository>(
    TOKENS.UserRepository,
    userRepositoryImplementation
  );

  const patientRepositoryImplementation = await getPatientRepositoryImplementation();
  container.registerInstance<IPatientRepository>(
    TOKENS.PatientRepository,
    patientRepositoryImplementation
  );

  const doctorRepositoryImplementation = await getDoctorRepositoryImplementation();
  container.registerInstance<IDoctorRepository>(
    TOKENS.DoctorRepository,
    doctorRepositoryImplementation
  );

  // Container registration code
  const addressRepositoryImplementation = await getAddressRepositoryImplementation();
  container.registerInstance<IAddressRepository>(
    TOKENS.AddressRepository,
    addressRepositoryImplementation
  );

  const scheduleRepositoryImplementation = await getScheduleRepositoryImplementation();
  container.registerInstance<IScheduleRepository>(
    TOKENS.ScheduleRepository,
    scheduleRepositoryImplementation
  );

  const appointmentRepositoryImplementation = await getAppointmentRepositoryImplementation();
  container.registerInstance<IAppointmentRepository>(
    TOKENS.AppointmentRepository,
    appointmentRepositoryImplementation
  );

  const labRequestRepositoryImplementation = await getLabRequestRepositoryImplementation();
  container.registerInstance<ILabRequestRepository>(
    TOKENS.LabRequestRepository,
    labRequestRepositoryImplementation
  );

  const bloodChemistryRepositoryImplementation = await getBloodChemistryRepositoryImplementation();
  container.registerInstance<IBloodChemistryRepository>(
    TOKENS.BloodChemistryRepository,
    bloodChemistryRepositoryImplementation
  );

  const prescriptionRepositoryImplementation = await getPrescriptionRepositoryImplementation();
  container.registerInstance<IPrescriptionRepository>(
    TOKENS.PrescriptionRepository,
    prescriptionRepositoryImplementation
  );

  // Infrastructure Layer - Services  
  container.registerSingleton(
    TOKENS.PasswordHashingService,
    BcryptPasswordHashingService
  );
  
  // Register JWT service with configuration
  const securityConfig = getSecurityConfig();
  const jwtConfig: JwtConfig = {
    secret: securityConfig.jwt.secret,
    expiresIn: securityConfig.jwt.expiresIn,
    issuer: securityConfig.jwt.issuer,
    audience: securityConfig.jwt.audience,
  };
  
  container.registerInstance(
    TOKENS.JwtService,
    new JwtService(jwtConfig)
  );

  // Application Layer - Use Cases (Commands)
  container.registerSingleton(TOKENS.CreateTodoUseCase, CreateTodoUseCase);
  container.registerSingleton(TOKENS.UpdateTodoUseCase, UpdateTodoUseCase);
  container.registerSingleton(TOKENS.DeleteTodoUseCase, DeleteTodoUseCase);
  container.registerSingleton(TOKENS.ToggleTodoUseCase, ToggleTodoUseCase);
  container.registerSingleton(TOKENS.RegisterUserUseCase, RegisterUserUseCase);
  container.registerSingleton(TOKENS.LoginUserUseCase, LoginUserUseCase);
  container.registerSingleton(TOKENS.ChangeUserPasswordUseCase, ChangeUserPasswordUseCase);
  container.registerSingleton(TOKENS.UpdateUserDetailsUseCase, UpdateUserDetailsUseCase);
  container.registerSingleton(TOKENS.CreatePatientUseCase, CreatePatientUseCase);
  container.registerSingleton(TOKENS.CreateDoctorProfileCommandHandler, CreateDoctorProfileCommandHandler);

  // Schedule Use Cases
  container.registerSingleton(TOKENS.CreateScheduleUseCase, CreateScheduleUseCase);
  container.registerSingleton(TOKENS.UpdateScheduleUseCase, UpdateScheduleUseCase);
  container.registerSingleton(TOKENS.DeleteScheduleUseCase, DeleteScheduleUseCase);
  
  // Schedule Services
  container.registerSingleton(TOKENS.ScheduleWithDoctorService, ScheduleWithDoctorService);

  // Appointment Use Cases
  container.registerSingleton(TOKENS.CreateAppointmentUseCase, CreateAppointmentUseCase);
  container.registerSingleton(TOKENS.UpdateAppointmentUseCase, UpdateAppointmentUseCase);
  container.registerSingleton(TOKENS.DeleteAppointmentUseCase, DeleteAppointmentUseCase);
  container.registerSingleton(TOKENS.ConfirmAppointmentUseCase, ConfirmAppointmentUseCase);
  container.registerSingleton(TOKENS.CancelAppointmentUseCase, CancelAppointmentUseCase);
  container.registerSingleton(TOKENS.CompleteAppointmentUseCase, CompleteAppointmentUseCase);
  container.registerSingleton(TOKENS.RescheduleAppointmentUseCase, RescheduleAppointmentUseCase);

  // Laboratory Use Cases
  container.registerSingleton(TOKENS.CreateLabRequestUseCase, CreateLabRequestUseCase);
  container.registerSingleton(TOKENS.UpdateLabRequestResultsUseCase, UpdateLabRequestResultsUseCase);
  container.registerSingleton(TOKENS.CreateBloodChemistryUseCase, CreateBloodChemistryUseCase);

  // Prescription Use Cases (Commands)
  container.registerSingleton(TOKENS.CreatePrescriptionUseCase, CreatePrescriptionUseCase);
  container.registerSingleton(TOKENS.UpdatePrescriptionUseCase, UpdatePrescriptionUseCase);
  container.registerSingleton(TOKENS.DeletePrescriptionUseCase, DeletePrescriptionUseCase);

  // Application Layer - Use Cases (Queries)
  container.registerSingleton(
    TOKENS.GetAllTodosQueryHandler,
    GetAllTodosQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetAllUsersQueryHandler,
    GetAllUsersQueryHandler
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
    TOKENS.GetTodoByIdQueryHandler,
    GetTodoByIdQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetTodoStatsQueryHandler,
    GetTodoStatsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetAllPatientsQueryHandler,
    GetAllPatientsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetPatientByIdQueryHandler,
    GetPatientByIdQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetPatientStatsQueryHandler,
    GetPatientStatsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetAllDoctorsQueryHandler,
    GetAllDoctorsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetDoctorByIdQueryHandler,
    GetDoctorByIdQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetDoctorsBySpecializationQueryHandler,
    GetDoctorsBySpecializationQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetDoctorByUserIdQueryHandler,
    GetDoctorByUserIdQueryHandler
  );
  container.registerSingleton(
    TOKENS.CheckDoctorProfileExistsQueryHandler,
    CheckDoctorProfileExistsQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetAllProvincesQueryHandler,
    GetAllProvincesQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetCitiesByProvinceCodeQueryHandler,
    GetCitiesByProvinceCodeQueryHandler
  );
  container.registerSingleton(
    TOKENS.GetBarangaysByCityCodeQueryHandler,
    GetBarangaysByCityCodeQueryHandler
  );

  // Schedule Query Handlers
  container.registerSingleton(TOKENS.GetAllSchedulesQueryHandler, GetAllSchedulesQueryHandler);
  container.registerSingleton(TOKENS.GetScheduleByIdQueryHandler, GetScheduleByIdQueryHandler);
  container.registerSingleton(TOKENS.GetSchedulesByDateQueryHandler, GetSchedulesByDateQueryHandler);
  container.registerSingleton(TOKENS.GetSchedulesByDoctorQueryHandler, GetSchedulesByDoctorQueryHandler);
  container.registerSingleton(TOKENS.GetTodaySchedulesQueryHandler, GetTodaySchedulesQueryHandler);
  container.registerSingleton(TOKENS.GetTodayDoctorQueryHandler, GetTodayDoctorQueryHandler);
  container.registerSingleton(TOKENS.GetScheduleStatsQueryHandler, GetScheduleStatsQueryHandler);

  // Appointment Query Handlers
  container.registerSingleton(TOKENS.GetAllAppointmentsQueryHandler, GetAllAppointmentsQueryHandler);
  container.registerSingleton(TOKENS.GetAppointmentByIdQueryHandler, GetAppointmentByIdQueryHandler);
  container.registerSingleton(TOKENS.GetAppointmentsByPatientIdQueryHandler, GetAppointmentsByPatientIdQueryHandler);
  container.registerSingleton(TOKENS.GetTodayAppointmentsQueryHandler, GetTodayAppointmentsQueryHandler);
  container.registerSingleton(TOKENS.GetTodayConfirmedAppointmentsQueryHandler, GetTodayConfirmedAppointmentsQueryHandler);
  container.registerSingleton(TOKENS.GetConfirmedAppointmentsQueryHandler, GetConfirmedAppointmentsQueryHandler);
  container.registerSingleton(TOKENS.GetWeeklyAppointmentSummaryQueryHandler, GetWeeklyAppointmentSummaryQueryHandler);
  container.registerSingleton(TOKENS.GetAppointmentStatsQueryHandler, GetAppointmentStatsQueryHandler);

  // Laboratory Query Handlers
  container.registerSingleton(TOKENS.GetAllLabRequestsQueryHandler, GetAllLabRequestsQueryHandler);
  container.registerSingleton(TOKENS.GetCompletedLabRequestsQueryHandler, GetCompletedLabRequestsQueryHandler);
  container.registerSingleton(TOKENS.GetLabRequestByPatientIdQueryHandler, GetLabRequestByPatientIdQueryHandler);

  // Prescription Query Handlers
  container.registerSingleton(TOKENS.GetAllPrescriptionsQueryHandler, GetAllPrescriptionsQueryHandler);
  container.registerSingleton(TOKENS.GetPrescriptionByIdQueryHandler, GetPrescriptionByIdQueryHandler);
  container.registerSingleton(TOKENS.GetPrescriptionsByPatientIdQueryHandler, GetPrescriptionsByPatientIdQueryHandler);
  container.registerSingleton(TOKENS.GetPrescriptionsByDoctorIdQueryHandler, GetPrescriptionsByDoctorIdQueryHandler);
  container.registerSingleton(TOKENS.GetActivePrescriptionsQueryHandler, GetActivePrescriptionsQueryHandler);
  container.registerSingleton(TOKENS.GetExpiredPrescriptionsQueryHandler, GetExpiredPrescriptionsQueryHandler);
  container.registerSingleton(TOKENS.GetPrescriptionsByMedicationNameQueryHandler, GetPrescriptionsByMedicationNameQueryHandler);
  container.registerSingleton(TOKENS.GetPrescriptionStatsQueryHandler, GetPrescriptionStatsQueryHandler);

  // Application Layer - Validation Services
  container.registerSingleton(
    TOKENS.CreateTodoValidationService,
    CreateTodoValidationService
  );
  container.registerSingleton(
    TOKENS.UpdateTodoValidationService,
    UpdateTodoValidationService
  );
  container.registerSingleton(
    TOKENS.DeleteTodoValidationService,
    DeleteTodoValidationService
  );
  container.registerSingleton(
    TOKENS.ToggleTodoValidationService,
    ToggleTodoValidationService
  );
  container.registerSingleton(
    TOKENS.TodoValidationService,
    TodoValidationService
  );
  container.registerSingleton(
    TOKENS.RegisterUserValidationService,
    RegisterUserValidationService
  );
  container.registerSingleton(
    TOKENS.LoginUserValidationService,
    LoginUserValidationService
  );
  container.registerSingleton(
    TOKENS.UpdateUserDetailsValidationService,
    UpdateUserDetailsValidationService
  );
  container.registerSingleton(
    TOKENS.UserValidationService,
    UserValidationService
  );
  container.registerSingleton(
    TOKENS.CreatePatientValidationService,
    CreatePatientValidationService
  );
  container.registerSingleton(
    TOKENS.GetPatientByIdValidationService,
    GetPatientByIdValidationService
  );
  container.registerSingleton(
    TOKENS.PatientValidationService,
    PatientValidationService
  );
  container.registerSingleton(
    TOKENS.GetDoctorByIdValidationService,
    GetDoctorByIdValidationService
  );
  container.registerSingleton(
    TOKENS.GetDoctorsBySpecializationValidationService,
    GetDoctorsBySpecializationValidationService
  );
  container.registerSingleton(
    TOKENS.DoctorValidationService,
    DoctorValidationService
  );
  container.registerSingleton(
    TOKENS.GetCitiesValidationService,
    GetCitiesValidationService
  );
  container.registerSingleton(
    TOKENS.GetBarangaysValidationService,
    GetBarangaysValidationService
  );
  container.registerSingleton(
    TOKENS.AddressValidationService,
    AddressValidationService
  );

  // Schedule Validation Services
  container.registerSingleton(TOKENS.CreateScheduleValidationService, CreateScheduleValidationService);
  container.registerSingleton(TOKENS.UpdateScheduleValidationService, UpdateScheduleValidationService);
  container.registerSingleton(TOKENS.DeleteScheduleValidationService, DeleteScheduleValidationService);
  container.registerSingleton(TOKENS.GetScheduleByIdValidationService, GetScheduleByIdValidationService);
  container.registerSingleton(TOKENS.GetSchedulesByDateValidationService, GetSchedulesByDateValidationService);
  container.registerSingleton(TOKENS.GetSchedulesByDoctorValidationService, GetSchedulesByDoctorValidationService);
  container.registerSingleton(TOKENS.ScheduleValidationService, ScheduleValidationService);

  // Appointment Validation Services
  container.registerSingleton(TOKENS.CreateAppointmentValidationService, CreateAppointmentValidationService);
  container.registerSingleton(TOKENS.UpdateAppointmentValidationService, UpdateAppointmentValidationService);
  container.registerSingleton(TOKENS.DeleteAppointmentValidationService, DeleteAppointmentValidationService);
  container.registerSingleton(TOKENS.ConfirmAppointmentValidationService, ConfirmAppointmentValidationService);
  container.registerSingleton(TOKENS.CancelAppointmentValidationService, CancelAppointmentValidationService);
  container.registerSingleton(TOKENS.CompleteAppointmentValidationService, CompleteAppointmentValidationService);
  container.registerSingleton(TOKENS.RescheduleAppointmentValidationService, RescheduleAppointmentValidationService);
  container.registerSingleton(TOKENS.GetAppointmentByIdValidationService, GetAppointmentByIdValidationService);
  container.registerSingleton(TOKENS.GetAppointmentsByPatientIdValidationService, GetAppointmentsByPatientIdValidationService);
  container.registerSingleton(TOKENS.GetAppointmentsByDateValidationService, GetAppointmentsByDateValidationService);
  container.registerSingleton(TOKENS.GetAppointmentsByDateRangeValidationService, GetAppointmentsByDateRangeValidationService);
  container.registerSingleton(TOKENS.AppointmentValidationService, AppointmentValidationService);

  // Laboratory Validation Services
  container.registerSingleton(TOKENS.LaboratoryValidationService, LaboratoryValidationService);
  container.registerSingleton(TOKENS.CreateLabRequestValidationService, CreateLabRequestValidationService);
  container.registerSingleton(TOKENS.UpdateLabRequestValidationService, UpdateLabRequestValidationService);
  container.registerSingleton(TOKENS.DeleteLabRequestValidationService, DeleteLabRequestValidationService);
  container.registerSingleton(TOKENS.UpdateLabRequestResultsValidationService, UpdateLabRequestResultsValidationService);
  container.registerSingleton(TOKENS.CreateBloodChemistryValidationService, CreateBloodChemistryValidationService);
  container.registerSingleton(TOKENS.UpdateBloodChemistryValidationService, UpdateBloodChemistryValidationService);
  container.registerSingleton(TOKENS.DeleteBloodChemistryValidationService, DeleteBloodChemistryValidationService);

  // Prescription Validation Services
  container.registerSingleton(TOKENS.PrescriptionValidationService, PrescriptionValidationService);
  container.registerSingleton(TOKENS.CreatePrescriptionValidationService, CreatePrescriptionValidationService);
  container.registerSingleton(TOKENS.UpdatePrescriptionValidationService, UpdatePrescriptionValidationService);
  container.registerSingleton(TOKENS.DeletePrescriptionValidationService, DeletePrescriptionValidationService);

  // Domain Layer - Domain Services
  // UserDomainService is instantiated manually in use cases (Clean Architecture best practice)
  container.registerSingleton(TOKENS.PatientNumberService, PatientNumberService);
  container.registerSingleton(TOKENS.PhoneNumberService, PhoneNumberService);
  container.registerSingleton(TOKENS.AgeCalculationService, AgeCalculationService);
  container.registerSingleton(TOKENS.AppointmentDomainService, AppointmentDomainService);
};

async function getTodoRepositoryImplementation(): Promise<ITodoRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using ${ormType} ORM with ${dbType} database`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory repository');
    return new InMemoryTodoRepository();
  }

  // Handle MongoDB (always uses Mongoose)
  if (dbType === 'mongodb') {
    await connectMongoDB();
    console.log('📦 Using Mongoose repository with MongoDB');
    return new MongooseTodoRepository();
  }

  // Handle SQL databases with different ORMs
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM repository with ${dbType}`);
      return new TypeOrmTodoRepository(dataSource);
    }


    case 'native':
    default: {
      if (dbType === 'sqlite') {
        console.log('📦 Using native SQLite repository');
        return new SqliteTodoRepository();
      }

      // For other databases without native support, default to TypeORM
      console.log(
        `📦 No native support for ${dbType}, falling back to TypeORM`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmTodoRepository(dataSource);
    }
  }
}

async function getUserRepositoryImplementation(): Promise<IUserRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using ${ormType} ORM with ${dbType} database for User repository`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory user repository');
    return new InMemoryUserRepository();
  }

  // Handle MongoDB (always uses Mongoose)
  if (dbType === 'mongodb') {
    await connectMongoDB();
    console.log('📦 Using Mongoose user repository with MongoDB');
    return new MongooseUserRepository();
  }

  // Handle SQL databases with different ORMs
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM user repository with ${dbType}`);
      return new TypeOrmUserRepository(dataSource);
    }

    case 'native':
    default: {
      if (dbType === 'sqlite') {
        console.log('📦 Using native SQLite user repository');
        return new SqliteUserRepository();
      }

      // For other databases without native support, default to TypeORM
      console.log(
        `📦 No native support for ${dbType}, falling back to TypeORM for user repository`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmUserRepository(dataSource);
    }
  }
}

async function getPatientRepositoryImplementation(): Promise<IPatientRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using ${ormType} ORM with ${dbType} database for Patient repository`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory patient repository');
    return new InMemoryPatientRepository();
  }

  // Handle SQL databases with TypeORM (Patient only supports TypeORM and in-memory)
  // MongoDB support can be added later if needed
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM patient repository with ${dbType}`);
      return new TypeOrmPatientRepository(dataSource);
    }

    case 'native':
    default: {
      // For Patient repository, we only support TypeORM and in-memory
      // Default to TypeORM for all SQL databases
      console.log(
        `📦 Patient repository only supports TypeORM and in-memory. Using TypeORM with ${dbType}`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmPatientRepository(dataSource);
    }
  }
}

async function getDoctorRepositoryImplementation(): Promise<IDoctorRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using Doctor repository: ${ormType} ORM with ${dbType} database`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory doctor repository');
    return new InMemoryDoctorRepository();
  }

  // Handle SQL databases with TypeORM (Doctor supports TypeORM and in-memory like Patient)
  // MongoDB support can be added later if needed
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM doctor repository with ${dbType}`);
      return new TypeOrmDoctorRepository(dataSource);
    }

    case 'native':
    default: {
      // For Doctor repository, we only support TypeORM and in-memory
      // Default to TypeORM for all SQL databases
      console.log(
        `📦 Doctor repository only supports TypeORM and in-memory. Using TypeORM with ${dbType}`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmDoctorRepository(dataSource);
    }
  }
}

async function getAddressRepositoryImplementation(): Promise<IAddressRepository> {
  // Address data is static JSON, so we always use in-memory implementation
  console.log('📦 Using in-memory address repository with Philippine data');
  return new InMemoryAddressRepository();
}

async function getScheduleRepositoryImplementation(): Promise<IScheduleRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using Schedule repository: ${ormType} ORM with ${dbType} database`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory schedule repository');
    return new InMemoryScheduleRepository();
  }

  // Handle MongoDB (always uses Mongoose)
  if (dbType === 'mongodb') {
    await connectMongoDB();
    console.log('📦 Using Mongoose schedule repository with MongoDB');
    return new MongooseScheduleRepository();
  }

  // Handle SQL databases with different ORMs
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM schedule repository with ${dbType}`);
      return new TypeOrmScheduleRepository(dataSource);
    }

    case 'native':
    default: {
      if (dbType === 'sqlite') {
        console.log('📦 Using native SQLite schedule repository');
        return new SqliteScheduleRepository();
      }

      // For other databases without native support, default to TypeORM
      console.log(
        `📦 No native support for ${dbType}, falling back to TypeORM for schedule repository`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmScheduleRepository(dataSource);
    }
  }
}

async function getAppointmentRepositoryImplementation(): Promise<IAppointmentRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using Appointment repository: ${ormType} ORM with ${dbType} database`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    return new InMemoryAppointmentRepository();
  }

  // For other databases, prefer TypeORM unless specified otherwise
  if (ormType === 'typeorm' || ormType === 'native') {
    const dataSource = await getTypeOrmDataSource();
    return new TypeOrmAppointmentRepository(dataSource);
  }

  // Default to in-memory for unsupported combinations
  console.log(
    `📦 Unsupported combination ${ormType}+${dbType}, falling back to in-memory appointment repository`
  );
  return new InMemoryAppointmentRepository();
}

async function getLabRequestRepositoryImplementation(): Promise<ILabRequestRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using ${ormType} ORM with ${dbType} database for lab requests`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory lab request repository');
    return new InMemoryLabRequestRepository();
  }

  // Handle MongoDB (always uses Mongoose)
  if (dbType === 'mongodb') {
    await connectMongoDB();
    console.log('📦 Using Mongoose lab request repository with MongoDB');
    return new MongooseLabRequestRepository();
  }

  // Handle SQL databases with different ORMs
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      const patientRepository = await getPatientRepositoryImplementation();
      console.log(`📦 Using TypeORM lab request repository with ${dbType}`);
      return new TypeOrmLabRequestRepository(dataSource, patientRepository);
    }

    case 'native':
    default: {
      if (dbType === 'sqlite') {
        console.log('📦 Using native SQLite lab request repository');
        return new SqliteLabRequestRepository();
      }

      // For other databases without native support, default to TypeORM
      console.log(
        `📦 No native support for ${dbType}, falling back to TypeORM for lab requests`
      );
      const dataSource = await getTypeOrmDataSource();
      const patientRepository = await getPatientRepositoryImplementation();
      return new TypeOrmLabRequestRepository(dataSource, patientRepository);
    }
  }
}

async function getBloodChemistryRepositoryImplementation(): Promise<IBloodChemistryRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using ${ormType} ORM with ${dbType} database for blood chemistry`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory blood chemistry repository');
    return new InMemoryBloodChemistryRepository();
  }

  // Handle MongoDB (always uses Mongoose)
  if (dbType === 'mongodb') {
    await connectMongoDB();
    console.log('📦 Using Mongoose blood chemistry repository with MongoDB');
    return new MongooseBloodChemistryRepository();
  }

  // Handle SQL databases with different ORMs
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM blood chemistry repository with ${dbType}`);
      return new TypeOrmBloodChemistryRepository(dataSource);
    }

    case 'native':
    default: {
      if (dbType === 'sqlite') {
        console.log('📦 Using native SQLite blood chemistry repository');
        return new SqliteBloodChemistryRepository();
      }

      // For other databases without native support, default to TypeORM
      console.log(
        `📦 No native support for ${dbType}, falling back to TypeORM for blood chemistry`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmBloodChemistryRepository(dataSource);
    }
  }
}

async function getPrescriptionRepositoryImplementation(): Promise<IPrescriptionRepository> {
  const dbConfig = getDatabaseConfig();
  const dbType = dbConfig.type;
  const ormType = dbConfig.orm || 'native';

  console.log(`📦 Using ${ormType} ORM with ${dbType} database for prescriptions`);

  // Handle memory database (always uses in-memory repository)
  if (dbType === 'memory') {
    console.log('📦 Using in-memory prescription repository');
    return new InMemoryPrescriptionRepository();
  }

  // Handle MongoDB (always uses Mongoose)
  if (dbType === 'mongodb') {
    await connectMongoDB();
    console.log('📦 Using Mongoose prescription repository with MongoDB');
    return new MongoosePrescriptionRepository();
  }

  // Handle SQL databases with different ORMs
  switch (ormType) {
    case 'typeorm': {
      const dataSource = await getTypeOrmDataSource();
      console.log(`📦 Using TypeORM prescription repository with ${dbType}`);
      return new TypeOrmPrescriptionRepository(dataSource);
    }

    case 'native':
    default: {
      if (dbType === 'sqlite') {
        console.log('📦 Using native SQLite prescription repository');
        return new SqlitePrescriptionRepository();
      }

      // For other databases without native support, default to TypeORM
      console.log(
        `📦 No native support for ${dbType}, falling back to TypeORM for prescriptions`
      );
      const dataSource = await getTypeOrmDataSource();
      return new TypeOrmPrescriptionRepository(dataSource);
    }
  }
}

// Export container and tokens for use in controllers
export { container, TOKENS };
