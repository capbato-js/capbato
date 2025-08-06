import { useState, useCallback } from 'react';
import { usePrescriptionStore } from '../../../../infrastructure/state/PrescriptionStore';
import type { PrescriptionFormViewModel } from './interfaces/PrescriptionViewModels';
import type { CreatePrescriptionCommand, UpdatePrescriptionCommand } from '@nx-starter/application-shared';

/**
 * View Model for Prescription Form component
 * Handles form-specific presentation logic and business operations
 */
export const usePrescriptionFormViewModel = (): PrescriptionFormViewModel => {
  const storeCreatePrescription = usePrescriptionStore((state) => state.createPrescription);
  const storeUpdatePrescription = usePrescriptionStore((state) => state.updatePrescription);
  const storeError = usePrescriptionStore((state) => state.error);
  const storeStatus = usePrescriptionStore((state) => state.status);
  const storeClearError = usePrescriptionStore((state) => state.clearError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPrescription = useCallback(
    async (data: CreatePrescriptionCommand) => {
      setIsSubmitting(true);
      try {
        await storeCreatePrescription(data);
      } catch (error) {
        console.error('Failed to create prescription:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [storeCreatePrescription]
  );

  const updatePrescription = useCallback(
    async (id: string, data: UpdatePrescriptionCommand) => {
      setIsSubmitting(true);
      try {
        await storeUpdatePrescription(id, data);
      } catch (error) {
        console.error('Failed to update prescription:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [storeUpdatePrescription]
  );

  const createMultiplePrescriptions = useCallback(
    async (commands: CreatePrescriptionCommand[]) => {
      setIsSubmitting(true);
      try {
        // Create all prescriptions in parallel
        await Promise.all(commands.map(command => storeCreatePrescription(command)));
      } catch (error) {
        console.error('Failed to create prescriptions:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [storeCreatePrescription]
  );

  const handleMultipleFormSubmit = useCallback(
    async (commands: CreatePrescriptionCommand[]): Promise<boolean> => {
      if (!commands || commands.length === 0) {
        return false;
      }

      // Validate all commands have required fields
      const isValid = commands.every(data => 
        data.patientId && data.doctorId && 
        ((data.medications && data.medications.length > 0) || data.medicationName)
      );

      if (!isValid) {
        return false;
      }

      try {
        await createMultiplePrescriptions(commands);
        return true;
      } catch (error) {
        console.error('Failed to create prescriptions:', error);
        return false;
      }
    },
    [createMultiplePrescriptions]
  );

  const handleFormSubmit = useCallback(
    async (data: CreatePrescriptionCommand): Promise<boolean> => {
      if (!data.patientId || !data.doctorId || 
          (!data.medications || data.medications.length === 0) && !data.medicationName) {
        return false;
      }

      try {
        await createPrescription(data);
        return true;
      } catch (error) {
        console.error('Failed to create prescription:', error);
        return false;
      }
    },
    [createPrescription]
  );

  const handleUpdateSubmit = useCallback(
    async (id: string, data: UpdatePrescriptionCommand): Promise<boolean> => {
      try {
        await updatePrescription(id, data);
        return true;
      } catch (error) {
        console.error('Failed to update prescription:', error);
        return false;
      }
    },
    [updatePrescription]
  );

  const clearError = useCallback(() => {
    storeClearError();
  }, [storeClearError]);

  return {
    isSubmitting,
    isGlobalLoading: storeStatus === 'loading',
    error: storeError,
    createPrescription,
    updatePrescription,
    handleFormSubmit,
    handleMultipleFormSubmit,
    handleUpdateSubmit,
    clearError,
  };
};