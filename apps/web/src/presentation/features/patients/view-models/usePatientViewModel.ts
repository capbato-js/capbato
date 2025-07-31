import { useEffect, useRef } from 'react';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';

/**
 * Main Patient View Model for application-level concerns
 * Handles data initialization on page load
 * Uses PatientListDto directly from the API - no mapping needed
 */
export const usePatientViewModel = () => {
  const store = usePatientStore();
  const hasLoadedInitially = useRef(false);

  // Load patients on mount
  useEffect(() => {
    if (!hasLoadedInitially.current) {
      hasLoadedInitially.current = true;
      store.loadPatients();
    }
  }, [store]);

  return {
    patients: store.patients,
    isLoading: store.getIsLoading(),
    error: store.error,
    clearError: store.clearError,
  };
};