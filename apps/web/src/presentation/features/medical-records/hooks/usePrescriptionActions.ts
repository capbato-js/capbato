import { useCallback } from 'react';
import { usePrescriptionStore } from '../../../../infrastructure/state/PrescriptionStore';
import { Prescription } from '../types';
import { DisplayPrescription } from './usePrescriptionData';
import { transformDomainToUIPrescription, findGroupedPrescriptions } from '../utils/prescriptionUtils';

export const usePrescriptionActions = (
  prescriptions: any[],
  prescriptionListViewModel: any,
  modalActions: {
    openViewModal: (prescription: Prescription) => void;
    openEditModal: (prescription: Prescription) => void;
    openDeleteModal: (prescription: Prescription) => void;
  }
) => {
  const prescriptionStore = usePrescriptionStore();

  const handleViewPrescription = useCallback((prescription: Prescription | DisplayPrescription) => {
    // Handle grouped prescriptions
    const groupedPrescription = findGroupedPrescriptions(prescription.id, prescriptions);
    if (groupedPrescription) {
      modalActions.openViewModal(groupedPrescription);
      return;
    }

    // Handle single prescriptions
    const displayPrescription = prescription as DisplayPrescription;
    const domainPrescription = prescriptions.find(p => p.stringId === displayPrescription.id);
    
    if (domainPrescription) {
      const transformedPrescription = transformDomainToUIPrescription(domainPrescription, displayPrescription);
      modalActions.openViewModal(transformedPrescription);
    } else {
      console.warn('Could not find domain prescription for display prescription:', displayPrescription);
      modalActions.openViewModal(prescription as Prescription);
    }
  }, [prescriptions, modalActions]);

  const handleEditPrescription = useCallback((prescription: DisplayPrescription) => {
    // Cannot edit grouped prescriptions
    if (prescription.id.includes(',')) {
      console.warn('Cannot edit grouped prescriptions. Please edit individual prescriptions.');
      return;
    }
    
    const domainPrescription = prescriptions.find(p => p.stringId === prescription.id);
    if (domainPrescription) {
      const transformedPrescription = transformDomainToUIPrescription(domainPrescription, prescription);
      modalActions.openEditModal(transformedPrescription);
    }
  }, [prescriptions, modalActions]);

  const handleDeletePrescription = useCallback((prescription: DisplayPrescription) => {
    // Cannot delete grouped prescriptions
    if (prescription.id.includes(',')) {
      console.warn('Cannot delete grouped prescriptions. Please delete individual prescriptions.');
      return;
    }
    
    const domainPrescription = prescriptions.find(p => p.stringId === prescription.id);
    if (domainPrescription) {
      const transformedPrescription = transformDomainToUIPrescription(domainPrescription, prescription);
      modalActions.openDeleteModal(transformedPrescription);
    }
  }, [prescriptions, modalActions]);

  const handlePrescriptionCreated = useCallback((newPrescription: Prescription) => {
    console.log('Prescription created successfully:', newPrescription);
    prescriptionListViewModel.refreshPrescriptions();
  }, [prescriptionListViewModel]);

  const handlePrescriptionUpdated = useCallback(() => {
    console.log('Prescription updated successfully');
    prescriptionListViewModel.refreshPrescriptions();
  }, [prescriptionListViewModel]);

  const handleConfirmDelete = useCallback(async (selectedPrescription: Prescription | null) => {
    if (!selectedPrescription?.id) return;

    try {
      const foundPrescription = prescriptions.find(p => p.stringId === selectedPrescription.id);
      if (!foundPrescription || !foundPrescription.stringId) {
        console.error('Prescription not found for deletion:', selectedPrescription.id);
        return;
      }

      await prescriptionStore.deletePrescription(foundPrescription.stringId);
      console.log('Prescription deleted successfully:', selectedPrescription.id);
      prescriptionListViewModel.refreshPrescriptions();
      
      return true; // Success
    } catch (error) {
      console.error('Failed to delete prescription:', error);
      return false; // Failure
    }
  }, [prescriptions, prescriptionStore, prescriptionListViewModel]);

  return {
    handleViewPrescription,
    handleEditPrescription,
    handleDeletePrescription,
    handlePrescriptionCreated,
    handlePrescriptionUpdated,
    handleConfirmDelete,
  };
};