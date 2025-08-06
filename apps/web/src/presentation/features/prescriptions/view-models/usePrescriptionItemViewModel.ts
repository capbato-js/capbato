import { useState, useCallback } from 'react';
import { Prescription } from '@nx-starter/domain';
import { usePrescriptionStore } from '../../../../infrastructure/state/PrescriptionStore';
import { isExpired as checkIsExpired } from '../utils/prescriptionUtils';
import type { PrescriptionItemViewModel } from './interfaces/PrescriptionViewModels';

/**
 * View Model for Prescription Item component
 * Handles individual prescription item presentation logic and operations
 */
export const usePrescriptionItemViewModel = (prescription: Prescription): PrescriptionItemViewModel => {
  const store = usePrescriptionStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const deletePrescription = useCallback(async () => {
    if (!prescription.stringId) return;

    setIsDeleting(true);
    try {
      await store.deletePrescription(prescription.stringId);
    } catch (error) {
      console.error('Failed to delete prescription:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [prescription.stringId, store]);

  const updateStatus = useCallback(
    async (status: 'active' | 'completed' | 'discontinued' | 'on-hold') => {
      if (!prescription.stringId) return;

      setIsUpdating(true);
      try {
        await store.updatePrescription(prescription.stringId, { 
          id: prescription.stringId,
          status 
        });
      } catch (error) {
        console.error('Failed to update prescription status:', error);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [prescription.stringId, store]
  );

  const getFormattedPrescribedDate = useCallback((): string => {
    return prescription.prescribedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [prescription.prescribedDate]);

  const getFormattedExpiryDate = useCallback((): string | null => {
    if (!prescription.expiryDate) return null;
    
    return prescription.expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [prescription.expiryDate]);

  const isExpired = useCallback((): boolean => {
    return checkIsExpired(prescription);
  }, [prescription]);

  const isActive = useCallback((): boolean => {
    return prescription.status === 'active' && !checkIsExpired(prescription);
  }, [prescription]);

  return {
    prescription,
    isDeleting,
    isUpdating,
    deletePrescription,
    updateStatus,
    getFormattedPrescribedDate,
    getFormattedExpiryDate,
    isExpired,
    isActive,
  };
};