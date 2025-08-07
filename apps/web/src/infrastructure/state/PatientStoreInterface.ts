import { PatientListDto, PatientDto, CreatePatientCommand, UpdatePatientCommand } from '@nx-starter/application-shared';

export interface PatientStoreState {
  patients: PatientListDto[];
  patientDetails: Record<string, PatientDto>; // Cache patient details by ID
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  patientDetailsStatus: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>; // Status per patient ID
  createPatientStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updatePatientStatus: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>; // Status per patient ID for updates
  error: string | null;
  patientDetailsErrors: Record<string, string | null>; // Errors per patient ID
  createPatientError: unknown; // Changed to support structured errors
  updatePatientErrors: Record<string, unknown>; // Errors per patient ID for updates
}

export interface PatientStoreActions {
  loadPatients(): Promise<void>;
  loadPatientById(id: string): Promise<void>;
  createPatient(command: CreatePatientCommand): Promise<PatientDto | null>;
  updatePatient(command: UpdatePatientCommand): Promise<PatientDto | null>;
  clearError(): void;
  clearPatientDetailsError(id: string): void;
  clearCreatePatientError(): void;
  clearUpdatePatientError(id: string): void;
  getIsLoading(): boolean;
  getIsIdle(): boolean;
  getHasError(): boolean;
  getIsLoadingPatientDetails(id: string): boolean;
  getIsCreatingPatient(): boolean;
  getIsUpdatingPatient(id: string): boolean;
  getPatientDetailsError(id: string): string | null;
  getPatientDetails(id: string): PatientDto | undefined;
  getCreatePatientError(): unknown;
  getUpdatePatientError(id: string): unknown;
}

export interface PatientStore extends PatientStoreState, PatientStoreActions {}