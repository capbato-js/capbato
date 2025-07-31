import { PatientListDto } from '@nx-starter/application-shared';

export interface PatientStoreState {
  patients: PatientListDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface PatientStoreActions {
  loadPatients(): Promise<void>;
  clearError(): void;
  getIsLoading(): boolean;
  getIsIdle(): boolean;
  getHasError(): boolean;
}

export interface PatientStore extends PatientStoreState, PatientStoreActions {}