import { useCallback, useEffect } from 'react';
import { ILabRequestListViewModel } from './interfaces/LaboratoryViewModels';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';

/**
 * View Model for Lab Request List
 * Handles fetching and displaying lab requests
 */
export const useLabRequestListViewModel = (): ILabRequestListViewModel => {
  const { 
    labRequests,
    fetchAllLabRequests,
    fetchCompletedLabRequests,
    loadingStates,
    errorStates,
    clearErrors
  } = useLaboratoryStore();

  const isLoading = loadingStates.fetching;
  const loadError = errorStates.fetchError;

  const loadLabRequests = useCallback(async (): Promise<void> => {
    try {
      await fetchAllLabRequests();
    } catch (error) {
      console.error('Error loading lab requests:', error);
    }
  }, [fetchAllLabRequests]);

  const loadCompletedLabRequests = useCallback(async (): Promise<void> => {
    try {
      await fetchCompletedLabRequests();
    } catch (error) {
      console.error('Error loading completed lab requests:', error);
    }
  }, [fetchCompletedLabRequests]);

  const refreshData = useCallback(async (): Promise<void> => {
    await loadLabRequests();
  }, [loadLabRequests]);

  const clearError = useCallback(() => {
    clearErrors();
  }, [clearErrors]);

  // Load data on component mount
  useEffect(() => {
    loadLabRequests();
  }, [loadLabRequests]);

  return {
    labRequests,
    isLoading,
    loadError,
    loadLabRequests,
    loadCompletedLabRequests,
    refreshData,
    clearError,
  };
};