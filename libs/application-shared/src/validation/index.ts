// Validation schemas and types
export * from './TodoValidationSchemas';

// Base validation service and utilities
export * from './ValidationService';

// Concrete validation service implementations
export * from './TodoValidationService';

// Validation constants and messages
export * from './constants/ValidationMessages';

// Note: Custom decorators for routing-controllers were removed in favor of manual validation

// Re-export commonly used validation schemas for convenience
export {
  CreateTodoCommandSchema,
  UpdateTodoCommandSchema,
  DeleteTodoCommandSchema,
  ToggleTodoCommandSchema,
  TodoIdSchema,
  TodoValidationSchemas,
} from './TodoValidationSchemas';

// Re-export user validation schemas for convenience
export {
  RegisterUserCommandSchema,
  LoginUserCommandSchema,
  LoginFormSchema,
  ChangeUserPasswordCommandSchema,
  ChangePasswordFormSchema,
  GetAllUsersQuerySchema,
  FirstNameSchema,
  LastNameSchema,
  EmailSchema,
  PasswordSchema,
  NameSchema,
  MobileSchema,
  RoleSchema,
  UserValidationSchemas,
  USER_VALIDATION_ERRORS,
} from './UserValidationSchemas';

// Note: All validation service tokens are now in centralized TOKENS object from '../di/tokens'

// Export user validation schemas and services
export * from './UserValidationSchemas';
export * from './UserValidationService';

// Export patient validation schemas and services
export * from './PatientValidationSchemas';
export * from './PatientValidationService';

// Export doctor validation schemas and services
export * from './DoctorValidationSchemas';
export * from './DoctorValidationService';

// Export address validation schemas and services
export * from './AddressValidationSchemas';
export * from './AddressValidationService';
// Export schedule validation schemas and services (excluding DoctorIdSchema to avoid conflict)
export {
  ScheduleIdSchema,
  ScheduleDateSchema,
  ScheduleTimeSchema,
  CreateScheduleCommandSchema,
  UpdateScheduleCommandSchema,
  DeleteScheduleCommandSchema,
  GetScheduleByIdQuerySchema,
  GetSchedulesByDateQuerySchema,
  GetSchedulesByDoctorQuerySchema,
  ScheduleValidationSchemas,
  type CreateScheduleCommand,
  type UpdateScheduleCommand,
  type DeleteScheduleCommand,
  type GetScheduleByIdQuery,
  type GetSchedulesByDateQuery,
  type GetSchedulesByDoctorQuery,
} from './ScheduleValidationSchemas';
export * from './ScheduleValidationService';
