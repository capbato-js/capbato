import { useCallback } from 'react';
import { ILabRequestItemViewModel } from './interfaces/LaboratoryViewModels';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';

/**
 * View Model for Lab Request Item
 * Handles individual lab request operations
 */
export const useLabRequestItemViewModel = (): ILabRequestItemViewModel => {
  const { 
    updateLabRequestResults,
    loadingStates,
    errorStates,
    clearErrors
  } = useLaboratoryStore();

  const isUpdating = loadingStates.updating;
  const updateError = errorStates.updateError;

  const updateResults = useCallback(async (
    patientId: string, 
    requestDate: string, 
    results: Record<string, string>
  ): Promise<boolean> => {
    try {
      const success = await updateLabRequestResults(patientId, requestDate, results);
      return success;
    } catch (error) {
      console.error('Error updating lab request results:', error);
      return false;
    }
  }, [updateLabRequestResults]);

  const clearError = useCallback(() => {
    clearErrors();
  }, [clearErrors]);

  return {
    isUpdating,
    updateError,
    updateResults,
    clearError,
  };
};