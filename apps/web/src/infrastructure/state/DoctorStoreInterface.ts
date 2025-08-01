import { DoctorDto, DoctorSummaryDto } from '@nx-starter/application-shared';

/**
 * Doctor Store Interface
 * Defines the state and actions for doctor management
 */
export interface DoctorStoreInterface {
  // State
  doctors: DoctorDto[];
  doctorSummaries: DoctorSummaryDto[];
  currentDoctor: DoctorDto | null;
  isLoading: boolean;
  error: string | null;

  // Query Actions
  getAllDoctors: (activeOnly?: boolean, format?: 'full' | 'summary') => Promise<void>;
  getDoctorById: (id: string) => Promise<void>;
  getDoctorByUserId: (userId: string) => Promise<void>;
  getDoctorsBySpecialization: (specialization: string, activeOnly?: boolean) => Promise<void>;
  checkDoctorProfileExists: (userId: string) => Promise<boolean>;

  // State Actions
  clearError: () => void;
  clearCurrentDoctor: () => void;
  setLoading: (loading: boolean) => void;
}
