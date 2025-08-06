import { useCallback, useEffect } from 'react';
import { usePrescriptionStore } from '../../../../infrastructure/state/PrescriptionStore';
import type { PrescriptionListViewModel } from './interfaces/PrescriptionViewModels';

/**
 * View Model for Prescription List component
 * Handles list-specific presentation logic and business operations
 */
export const usePrescriptionListViewModel = (): PrescriptionListViewModel => {
  const store = usePrescriptionStore();

  // Load prescriptions on mount
  useEffect(() => {
    if (store.prescriptions.length === 0 && store.status === 'idle') {
      store.loadPrescriptions();
    }
  }, [store]);

  const refreshPrescriptions = useCallback(async () => {
    try {
      await store.loadPrescriptions();
    } catch (error) {
      console.error('Failed to refresh prescriptions:', error);
    }
  }, [store]);

  const loadPrescriptionsByPatientId = useCallback(
    async (patientId: string) => {
      try {
        await store.loadPrescriptionsByPatientId(patientId);
      } catch (error) {
        console.error('Failed to load prescriptions by patient ID:', error);
      }
    },
    [store]
  );

  const loadPrescriptionsByDoctorId = useCallback(
    async (doctorId: string) => {
      try {
        await store.loadPrescriptionsByDoctorId(doctorId);
      } catch (error) {
        console.error('Failed to load prescriptions by doctor ID:', error);
      }
    },
    [store]
  );

  const setFilter = useCallback(
    (filter: 'all' | 'active' | 'completed' | 'discontinued' | 'on-hold' | 'expired') => {
      store.setFilter(filter);
    },
    [store]
  );

  const clearError = useCallback(() => {
    store.clearError();
  }, [store]);

  return {
    prescriptions: store.prescriptions,
    filteredPrescriptions: store.getFilteredPrescriptions(),
    filter: store.filter,
    isLoading: store.getIsLoading(),
    error: store.error,
    stats: store.getStats(),
    setFilter,
    refreshPrescriptions,
    loadPrescriptionsByPatientId,
    loadPrescriptionsByDoctorId,
    clearError,
  };
};