import React from 'react';
import { AddPrescriptionFormData } from '@nx-starter/application-shared';
import { Prescription } from '../types';
import { usePrescriptionFormViewModel } from '../../prescriptions/view-models/usePrescriptionFormViewModel';
import { PrescriptionTypeMapper } from '../../prescriptions/types/FormTypes';
import { prepareInitialData, createDummyPrescriptionForCallback } from '../utils/prescriptionModalUtils';
import { AddPrescriptionModalPresenter } from './AddPrescriptionModalPresenter';

interface AddPrescriptionModalContainerProps {
  opened: boolean;
  onClose: () => void;
  onPrescriptionCreated?: (prescription: Prescription) => void;
  // Edit mode props
  editMode?: boolean;
  prescription?: Prescription | null;
  onPrescriptionUpdated?: () => void;
}

export const AddPrescriptionModalContainer: React.FC<AddPrescriptionModalContainerProps> = ({
  opened,
  onClose,
  onPrescriptionCreated,
  editMode = false,
  prescription,
  onPrescriptionUpdated,
}) => {
  const prescriptionViewModel = usePrescriptionFormViewModel();

  const handleSubmit = async (data: AddPrescriptionFormData): Promise<boolean> => {
    try {
      if (editMode && prescription?.id) {
        // Convert form data to update command
        const updateCommand = PrescriptionTypeMapper.toUpdateCommand({
          ...data,
          id: prescription.id,
        });
        
        const success = await prescriptionViewModel.handleUpdateSubmit(prescription.id, updateCommand);
        if (success) {
          onPrescriptionUpdated?.();
          onClose();
        }
        return success;
      } else {
        // Convert form data to create command (single prescription with multiple medications)
        const createCommand = PrescriptionTypeMapper.toCreateCommand(data);
        
        const success = await prescriptionViewModel.handleFormSubmit(createCommand);
        if (success) {
          // For compatibility with existing UI, create a dummy prescription object with all medications
          const newPrescription = createDummyPrescriptionForCallback(data);
          onPrescriptionCreated?.(newPrescription);
          onClose();
        }
        return success;
      }
    } catch (error) {
      console.error('Failed to save prescription:', error);
      return false;
    }
  };

  // Prepare initial data for edit mode
  const initialData = prepareInitialData(editMode, prescription);

  return (
    <AddPrescriptionModalPresenter
      opened={opened}
      onClose={onClose}
      title={editMode ? 'Update Prescription' : 'Add New Prescription'}
      onSubmit={handleSubmit}
      isLoading={prescriptionViewModel.isSubmitting}
      error={prescriptionViewModel.error}
      onClearError={prescriptionViewModel.clearError}
      editMode={editMode}
      initialData={initialData}
    />
  );
};