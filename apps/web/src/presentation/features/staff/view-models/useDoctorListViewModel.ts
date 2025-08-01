import { useEffect, useMemo, useCallback } from 'react';
import { useDoctorStore } from '../../../../infrastructure/state/DoctorStore';
import { DoctorListViewModel } from './interfaces/DoctorViewModels';

/**
 * Simplified Doctor List View Model Hook
 * Handles presentation logic for the doctors list page (no filters)
 */
export const useDoctorListViewModel = (): DoctorListViewModel => {
  // Store state
  const {
    doctors,
    doctorSummaries,
    isLoading,
    error,
    getAllDoctors,
    clearError: storeClearError,
  } = useDoctorStore();

  // Load doctors on component mount (always use full format)
  useEffect(() => {
    void loadDoctors();
  }, []);

  // Actions
  const loadDoctors = useCallback(async () => {
    try {
      await getAllDoctors(true, 'full'); // Always load active doctors in full format
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  }, [getAllDoctors]);

  const retry = useCallback(async () => {
    await loadDoctors();
  }, [loadDoctors]);

  const clearError = useCallback(() => {
    storeClearError();
  }, [storeClearError]);

  // Computed properties
  const isEmpty = useMemo(() => {
    return !isLoading && doctors.length === 0;
  }, [isLoading, doctors]);

  const hasError = useMemo(() => {
    return Boolean(error);
  }, [error]);

  return {
    // State
    doctors,
    doctorSummaries,
    isLoading,
    error,
    selectedSpecialization: '', // Not used but required by interface
    format: 'full' as const, // Always full format

    // Actions
    loadDoctors,
    filterBySpecialization: async () => { 
      // No-op: filtering removed for simplicity
      return Promise.resolve();
    },
    clearFilters: async () => { 
      // No-op: filtering removed for simplicity
      return Promise.resolve();
    },
    setFormat: () => { 
      // No-op: format switching removed for simplicity
    },
    retry,
    clearError,

    // Computed properties
    filteredDoctors: doctors, // Just return doctors directly
    availableSpecializations: [], // Not used
    isEmpty,
    hasError,
  };
};
