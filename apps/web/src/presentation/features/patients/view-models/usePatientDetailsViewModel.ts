import { useEffect, useState } from 'react';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import { mapApiPatientDtoToPatientDetails } from '../mappers/PatientMapper';
import { PatientDetails } from '../types';

/**
 * Patient Details View Model
 * Handles state management for individual patient details page
 * Uses API services through the patient store
 */
export const usePatientDetailsViewModel = (patientId: string | undefined) => {
  const [patient, setPatient] = useState<PatientDetails | undefined>(undefined);
  
  const patientStore = usePatientStore();
  
  // Get computed values from store for this specific patient ID
  const isLoading = patientId ? patientStore.getIsLoadingPatientDetails(patientId) : false;
  const error = patientId ? patientStore.getPatientDetailsError(patientId) : 'Patient ID is required';
  const hasError = !!error;

  useEffect(() => {
    const loadPatientDetails = async () => {
      if (!patientId) {
        setPatient(undefined);
        return;
      }

      // Check if we already have the data in store
      const cachedPatientDto = patientStore.getPatientDetails(patientId);
      if (cachedPatientDto) {
        const mappedPatient = mapApiPatientDtoToPatientDetails(cachedPatientDto);
        setPatient(mappedPatient);
        return;
      }

      // Only load from API if we don't have data and there's no current error
      if (!patientStore.getPatientDetailsError(patientId)) {
        await patientStore.loadPatientById(patientId);
      }
    };

    loadPatientDetails();
  }, [patientId]); // Only depend on patientId to avoid infinite loops

  // Separate effect to update local state when store data changes
  useEffect(() => {
    if (!patientId) {
      setPatient(undefined);
      return;
    }

    const patientDto = patientStore.getPatientDetails(patientId);
    if (patientDto) {
      const mappedPatient = mapApiPatientDtoToPatientDetails(patientDto);
      setPatient(mappedPatient);
    } else if (hasError) {
      setPatient(undefined);
    }
  }, [patientId, patientStore.patientDetails[patientId || ''], error]); // More specific dependencies

  const clearError = () => {
    if (patientId) {
      patientStore.clearPatientDetailsError(patientId);
    }
  };

  const refreshPatientDetails = async () => {
    if (patientId) {
      await patientStore.loadPatientById(patientId);
    }
  };

  return {
    patient,
    isLoading,
    error,
    clearError,
    refreshPatientDetails,
    hasPatient: !!patient,
    hasError
  };
};