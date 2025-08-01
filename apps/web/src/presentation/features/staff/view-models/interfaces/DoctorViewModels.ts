import { DoctorDto, DoctorSummaryDto } from '@nx-starter/application-shared';

/**
 * Doctor List View Model Interface
 * Handles the presentation logic for displaying a list of doctors
 */
export interface DoctorListViewModel {
  // State
  doctors: DoctorDto[];
  doctorSummaries: DoctorSummaryDto[];
  isLoading: boolean;
  error: string | null;
  selectedSpecialization: string;
  format: 'full' | 'summary';

  // Actions
  loadDoctors: (activeOnly?: boolean, format?: 'full' | 'summary') => Promise<void>;
  filterBySpecialization: (specialization: string) => Promise<void>;
  clearFilters: () => Promise<void>;
  setFormat: (format: 'full' | 'summary') => void;
  retry: () => Promise<void>;
  clearError: () => void;

  // Computed properties
  filteredDoctors: DoctorDto[] | DoctorSummaryDto[];
  availableSpecializations: string[];
  isEmpty: boolean;
  hasError: boolean;
}

/**
 * Doctor Item View Model Interface
 * Handles the presentation logic for individual doctor items
 */
export interface DoctorItemViewModel {
  // State
  doctor: DoctorDto | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadDoctor: (id: string) => Promise<void>;
  loadDoctorByUserId: (userId: string) => Promise<void>;
  clearDoctor: () => void;
  clearError: () => void;

  // Computed properties
  hasDoctor: boolean;
  hasError: boolean;
}
