import { PatientListDto, PatientDto } from '@nx-starter/application-shared';

export interface PatientStoreState {
  patients: PatientListDto[];
  patientDetails: Record<string, PatientDto>; // Cache patient details by ID
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  patientDetailsStatus: Record<string, 'idle' | 'loading' | 'succeeded' | 'failed'>; // Status per patient ID
  error: string | null;
  patientDetailsErrors: Record<string, string | null>; // Errors per patient ID
}

export interface PatientStoreActions {
  loadPatients(): Promise<void>;
  loadPatientById(id: string): Promise<void>;
  clearError(): void;
  clearPatientDetailsError(id: string): void;
  getIsLoading(): boolean;
  getIsIdle(): boolean;
  getHasError(): boolean;
  getIsLoadingPatientDetails(id: string): boolean;
  getPatientDetailsError(id: string): string | null;
  getPatientDetails(id: string): PatientDto | undefined;
}

export interface PatientStore extends PatientStoreState, PatientStoreActions {}