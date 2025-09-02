import { usePatientDetailsViewModel } from '../view-models';

export const usePatientDetailsData = (id: string | undefined) => {
  const { patient, isLoading, error, hasError, clearError } = usePatientDetailsViewModel(id);

  return {
    patient,
    isLoading,
    error,
    hasError,
    clearError,
  };
};