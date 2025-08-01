import { PatientListDto, PatientDto, CreatePatientCommand } from '@nx-starter/application-shared';

export interface PatientStoreState {
  patients: PatientListDto[];
  patientDetails: Record<string, PatientDto>; // Cache patient details by ID
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  patientDetailsStatus: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>; // Status per patient ID
  createPatientStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  patientDetailsErrors: Record<string, string | null>; // Errors per patient ID
  createPatientError: string | null;
}

export interface PatientStoreActions {
  loadPatients(): Promise<void>;
  loadPatientById(id: string): Promise<void>;
  createPatient(command: CreatePatientCommand): Promise<PatientDto | null>;
  clearError(): void;
  clearPatientDetailsError(id: string): void;
  clearCreatePatientError(): void;
  getIsLoading(): boolean;
  getIsIdle(): boolean;
  getHasError(): boolean;
  getIsLoadingPatientDetails(id: string): boolean;
  getIsCreatingPatient(): boolean;
  getPatientDetailsError(id: string): string | null;
  getPatientDetails(id: string): PatientDto | undefined;
  getCreatePatientError(): string | null;
}

export interface PatientStore extends PatientStoreState, PatientStoreActions {}