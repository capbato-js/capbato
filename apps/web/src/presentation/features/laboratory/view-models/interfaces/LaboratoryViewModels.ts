import { LabRequestDto, CreateLabRequestCommand } from '@nx-starter/application-shared';

/**
 * Interface for Lab Request Form View Model
 */
export interface ILabRequestFormViewModel {
  // Form state
  isSubmitting: boolean;
  submitError: string | null;

  // Actions
  handleFormSubmit: (data: CreateLabRequestCommand) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Interface for Lab Request List View Model
 */
export interface ILabRequestListViewModel {
  // List state
  labRequests: LabRequestDto[];
  isLoading: boolean;
  loadError: string | null;

  // Actions
  loadLabRequests: () => Promise<void>;
  loadCompletedLabRequests: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

/**
 * Interface for Lab Request Item View Model
 */
export interface ILabRequestItemViewModel {
  // Item state
  isUpdating: boolean;
  updateError: string | null;

  // Actions
  updateResults: (
    patientId: string, 
    requestDate: string, 
    results: Record<string, string>
  ) => Promise<boolean>;
  clearError: () => void;
}