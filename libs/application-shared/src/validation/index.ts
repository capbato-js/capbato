// Validation schemas and types
export * from './TodoValidationSchemas';
export * from './PrescriptionValidationSchemas';
export * from './UserValidationSchemas';

// Base validation service and utilities
export * from './ValidationService';

// Concrete validation service implementations
export * from './TodoValidationService';
export * from './UserValidationService';

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
  RegisterUserFormSchema,
  LoginUserCommandSchema,
  LoginFormSchema,
  ChangeUserPasswordCommandSchema,
  UpdateUserDetailsCommandSchema,
  UpdateUserDetailsFormSchema,
  ChangePasswordFormSchema,
  GetAllUsersQuerySchema,
  FirstNameSchema,
  LastNameSchema,
  EmailSchema,
  PasswordSchema,
  NameSchema,
  MobileSchema,
  RoleSchema,
  UserIdSchema,
  UserValidationSchemas,
  USER_VALIDATION_ERRORS,
} from './UserValidationSchemas';

// Note: All validation service tokens are now in centralized TOKENS object from '../di/tokens'

// Export user validation schemas and services
export * from './UserValidationSchemas';
export * from './UserValidationService';

// Export lab validation schemas
export {
  AddLabTestFormSchema,
  LabTestItemSchema,
  LabTestResultSchema,
  LabTestCategory,
  LabValidationSchemas,
} from './LabValidationSchemas';

// Export patient validation schemas and services
export * from './PatientValidationSchemas';
export * from './PatientValidationService';

// Export doctor validation schemas and services
export * from './DoctorValidationSchemas';
export * from './DoctorValidationService';

// Export address validation schemas and services
export * from './AddressValidationSchemas';
export * from './AddressValidationService';

// Export appointment validation schemas
export * from './AppointmentValidationSchemas';


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

// Appointment validation
export * from './AppointmentValidationSchemas';
export * from './AppointmentValidationService';
export {
  type CreateAppointmentCommand,
  type UpdateAppointmentCommand,
  type DeleteAppointmentCommand,
  type ConfirmAppointmentCommand,
  type CancelAppointmentCommand,
  type RescheduleAppointmentCommand,
  type GetAppointmentByIdQuery,
  type GetAppointmentsByPatientIdQuery,
  type GetAppointmentsByDateQuery,
  type GetAppointmentsByDateRangeQuery,
  AppointmentIdSchema,
} from './AppointmentValidationSchemas';


// Export laboratory validation schemas and services
export * from './LaboratoryValidationSchemas'; 
export * from './LaboratoryValidationService';

// Export prescription validation schemas and services
export * from './PrescriptionValidationSchemas';
export * from './PrescriptionValidationService';

// Export transaction validation schemas and services
export * from './TransactionValidationSchemas';
export * from './TransactionValidationService';

// Re-export transaction validation schemas for convenience
export {
  CreateTransactionCommandSchema,
  UpdateTransactionCommandSchema,
  DeleteTransactionCommandSchema,
  GetTransactionByIdQuerySchema,
  GetAllTransactionsQuerySchema,
  AddTransactionFormSchema,
  TransactionItemSchema,
  TransactionIdSchema,
  FlexibleIdSchema,
  PaymentMethodSchema,
  TransactionValidationSchemas,
  TRANSACTION_VALIDATION_ERRORS,
  type CreateTransactionCommand,
  type UpdateTransactionCommand,
  type DeleteTransactionCommand,
  type GetTransactionByIdQuery,
  type GetAllTransactionsQuery,
  type AddTransactionFormData,
  type UpdateTransactionFormData,
  type TransactionItemData,
  type TransactionValidationErrors,
} from './TransactionValidationSchemas';
// Export schedule override validation schemas and services
export * from './ScheduleOverrideValidationSchemas';
export * from './ScheduleOverrideValidationService';
