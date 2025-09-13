/**
 * Test IDs Export Module
 * Central export point for all test IDs across the application
 * Use this file to import test IDs from any feature module
 */

// Common UI Component Test IDs
export * from './common'

// Authentication Feature Test IDs  
export * from './auth'

// Patients Feature Test IDs
export * from './patients'

// Appointments Feature Test IDs
export * from './appointments'

// Medical Records Feature Test IDs
export * from './medical-records'

// Navigation Feature Test IDs
export * from './navigation'

// Re-export types for convenience
export type {
  CommonTestIds,
  ValidationTestIds,
  ModalTestIds
} from './common'

export type {
  AuthTestIds
} from './auth'

export type {
  PatientsPageTestIds,
  PatientFormTestIds,
  AddPatientPageTestIds
} from './patients'

export type {
  AppointmentsPageTestIds,
  AppointmentFormTestIds,
  DashboardTestIds
} from './appointments'

export type {
  MedicalRecordsTestIds,
  LabTestFormTestIds,
  PrescriptionFormTestIds
} from './medical-records'

export type {
  SidebarTestIds,
  HeaderTestIds,
  BreadcrumbTestIds,
  MobileNavTestIds
} from './navigation'