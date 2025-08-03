import { useState, useCallback } from 'react';
import { AddAppointmentFormData } from '@nx-starter/application-shared';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { mapFormDataToApiData } from '../utils/AppointmentMapper';
import type { IAppointmentFormViewModel } from './interfaces/AppointmentViewModels';

/**
 * View model for appointment form operations
 * Handles form submission, validation, and state management
 */
export const useAppointmentFormViewModel = (): IAppointmentFormViewModel => {
  const [localError, setLocalError] = useState<string | null>(null);
  
  const {
    createAppointment,
    isLoading,
    error: storeError,
    clearError: clearStoreError,
  } = useAppointmentStore();

  const error = localError || storeError;

  const handleFormSubmit = useCallback(async (formData: AddAppointmentFormData): Promise<boolean> => {
    try {
      // Clear any previous errors
      setLocalError(null);
      clearStoreError();

      // Validate required fields
      if (!formData.patientName?.trim()) {
        setLocalError('Patient is required');
        return false;
      }

      if (!formData.reasonForVisit?.trim()) {
        setLocalError('Reason for visit is required');
        return false;
      }

      if (!formData.date) {
        setLocalError('Appointment date is required');
        return false;
      }

      if (!formData.time?.trim()) {
        setLocalError('Appointment time is required');
        return false;
      }

      if (!formData.doctor?.trim()) {
        setLocalError('Doctor is required');
        return false;
      }

            // Validate appointment date is not in the past
      // Parse the date string (assuming YYYY-MM-DD format) and combine with time
      const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
      const currentDateTime = new Date();
      
      if (appointmentDateTime <= currentDateTime) {
        setLocalError('Appointment date and time must be in the future');
        return false;
      }

      // Map form data to API format
      const apiData = mapFormDataToApiData(formData);

      // Create the appointment
      await createAppointment(apiData);

      return true;
    } catch (error) {
      // Error is already handled by the store
      console.error('Failed to create appointment:', error);
      return false;
    }
  }, [createAppointment, clearStoreError]);

  const clearError = useCallback(() => {
    setLocalError(null);
    clearStoreError();
  }, [clearStoreError]);

  return {
    isLoading,
    error,
    handleFormSubmit,
    clearError,
  };
};
