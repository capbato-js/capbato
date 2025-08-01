import { useCallback, useMemo } from 'react';
import { useDoctorStore } from '../../../../infrastructure/state/DoctorStore';
import { DoctorItemViewModel } from './interfaces/DoctorViewModels';

/**
 * Doctor Item View Model Hook
 * Handles presentation logic for individual doctor items
 */
export const useDoctorItemViewModel = (): DoctorItemViewModel => {
  // Store state
  const {
    currentDoctor: doctor,
    isLoading,
    error,
    getDoctorById,
    getDoctorByUserId,
    clearCurrentDoctor,
    clearError: storeClearError,
  } = useDoctorStore();

  // Actions
  const loadDoctor = useCallback(async (id: string) => {
    try {
      await getDoctorById(id);
    } catch (error) {
      console.error('Error loading doctor:', error);
    }
  }, [getDoctorById]);

  const loadDoctorByUserId = useCallback(async (userId: string) => {
    try {
      await getDoctorByUserId(userId);
    } catch (error) {
      console.error('Error loading doctor by user ID:', error);
    }
  }, [getDoctorByUserId]);

  const clearDoctor = useCallback(() => {
    clearCurrentDoctor();
  }, [clearCurrentDoctor]);

  const clearError = useCallback(() => {
    storeClearError();
  }, [storeClearError]);

  // Computed properties
  const hasDoctor = useMemo(() => {
    return Boolean(doctor);
  }, [doctor]);

  const hasError = useMemo(() => {
    return Boolean(error);
  }, [error]);

  return {
    // State
    doctor,
    isLoading,
    error,

    // Actions
    loadDoctor,
    loadDoctorByUserId,
    clearDoctor,
    clearError,

    // Computed properties
    hasDoctor,
    hasError,
  };
};
