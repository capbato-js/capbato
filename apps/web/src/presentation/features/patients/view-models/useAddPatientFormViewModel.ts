import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreatePatientCommand } from '@nx-starter/application-shared';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';

/**
 * Add Patient Form View Model Interface
 * Defines the contract for the Add Patient form presentation logic
 */
export interface IAddPatientFormViewModel {
  // State
  isLoading: boolean;
  error: unknown; // Changed to support structured errors
  
  // Actions
  handleFormSubmit: (data: CreatePatientCommand) => Promise<boolean>;
  handleCancel: () => void;
  clearError: () => void;
}

/**
 * Add Patient Form View Model Implementation
 * Handles presentation logic for creating new patient records
 * Coordinates between form submission and state management
 * 
 * Following MVVM pattern:
 * - View Model handles presentation logic
 * - Coordinates with application/infrastructure layers
 * - Manages form-specific state and navigation
 * - Provides clean interface for React components
 */
export const useAddPatientFormViewModel = (): IAddPatientFormViewModel => {
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<unknown>(null);
  
  // Get store actions and state
  const createPatient = usePatientStore((state) => state.createPatient);
  const isCreatingPatient = usePatientStore((state) => state.getIsCreatingPatient());
  const storeError = usePatientStore((state) => state.getCreatePatientError());
  const clearStoreError = usePatientStore((state) => state.clearCreatePatientError);
  
  // Combined error from local state and store
  const error = localError || storeError;
  
  /**
   * Handle form submission
   * Processes the patient creation command and handles success/error states
   */
  const handleFormSubmit = useCallback(async (data: CreatePatientCommand): Promise<boolean> => {
    setLocalError(null);
    
    try {
      const result = await createPatient(data);
      
      if (result) {
        // Success - navigate back to patients list
        navigate('/patients');
        return true;
      } else {
        // Failed - error should be in store state
        return false;
      }
    } catch (error) {
      // Handle unexpected errors - preserve error object for classification
      setLocalError(error);
      return false;
    }
  }, [createPatient, navigate]);
  
  /**
   * Handle form cancellation
   * Navigates back to patients list without saving
   */
  const handleCancel = useCallback(() => {
    navigate('/patients');
  }, [navigate]);
  
  /**
   * Clear all errors
   * Clears both local and store errors
   */
  const clearError = useCallback(() => {
    setLocalError(null);
    clearStoreError();
  }, [clearStoreError]);
  
  return {
    // State
    isLoading: isCreatingPatient,
    error,
    
    // Actions
    handleFormSubmit,
    handleCancel,
    clearError,
  };
};
