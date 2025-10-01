import { useState, useCallback, useRef, useEffect } from 'react';
import { AddAppointmentFormData } from '@nx-starter/application-shared';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { mapFormDataToApiData } from '../utils/AppointmentMapper';
import type { IAppointmentFormViewModel } from './interfaces/AppointmentViewModels';

/**
 * View model for appointment form operations
 * Handles form submission, validation, and state management
 */
export const useAppointmentFormViewModel = (appointmentId?: string): IAppointmentFormViewModel => {
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Store the appointmentId in a ref to prevent it from being lost during re-renders
  const stableAppointmentId = useRef(appointmentId);
  
  // Update the ref when appointmentId changes
  useEffect(() => {
    stableAppointmentId.current = appointmentId;
  }, [appointmentId]);
  
  const {
    createAppointment,
    updateAppointment,
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

      // Validate appointment date is not in the past (only for new appointments)
      if (!appointmentId) {
        // Parse the date and time with simple date handling
        let appointmentDate = formData.date;
        if (typeof appointmentDate === 'string' && appointmentDate.includes('T')) {
          // If it's an ISO string, extract just the date part
          appointmentDate = appointmentDate.split('T')[0];
        }
        
        // Create date-time string and parse it
        const appointmentDateTime = new Date(`${appointmentDate}T${formData.time}:00`);
        const currentDateTime = new Date();
        
        console.log('DEBUG: Time validation - appointmentDateTime:', appointmentDateTime);
        console.log('DEBUG: Time validation - currentDateTime:', currentDateTime);
        
        if (appointmentDateTime <= currentDateTime) {
          setLocalError('Appointment date and time must be in the future');
          return false;
        }
      }

      // Map form data to API format
      const apiData = mapFormDataToApiData(formData);

      const currentAppointmentId = stableAppointmentId.current;
      console.log('DEBUG: Form submission - appointmentId:', appointmentId);
      console.log('DEBUG: Form submission - stableAppointmentId:', currentAppointmentId);
      console.log('DEBUG: Form submission - apiData:', apiData);

      // Create or update the appointment based on mode
      if (currentAppointmentId) {
        // Edit mode - update existing appointment
        console.log('DEBUG: Calling updateAppointment with ID:', currentAppointmentId);
        await updateAppointment(currentAppointmentId, apiData);
      } else {
        // Create mode - create new appointment
        console.log('DEBUG: Calling createAppointment');
        await createAppointment(apiData);
      }

      return true;
    } catch (error) {
      // Error is already handled by the store
      console.error('Failed to create appointment:', error);
      return false;
    }
  }, [createAppointment, updateAppointment, clearStoreError, appointmentId]);

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
