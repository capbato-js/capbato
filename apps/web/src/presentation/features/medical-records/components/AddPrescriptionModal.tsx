import React from 'react';
import { Modal } from '../../../components/common';
import { AddPrescriptionForm } from './AddPrescriptionForm';
import { AddPrescriptionFormData } from '@nx-starter/application-shared';
import { Prescription } from '../types';
import { usePrescriptionFormViewModel } from '../../prescriptions/view-models/usePrescriptionFormViewModel';
import { PrescriptionTypeMapper } from '../../prescriptions/types/FormTypes';

interface AddPrescriptionModalProps {
  opened: boolean;
  onClose: () => void;
  onPrescriptionCreated?: (prescription: Prescription) => void;
  // Edit mode props
  editMode?: boolean;
  prescription?: Prescription | null;
  onPrescriptionUpdated?: () => void;
}

export const AddPrescriptionModal: React.FC<AddPrescriptionModalProps> = ({
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
          const medicationNames = data.medications.map(med => med.name).join(', ');
          const newPrescription: Prescription = {
            id: Date.now().toString(),
            patientId: data.patientId,
            patientName: 'Patient Name', // This would come from the actual patient data
            patientNumber: 'P001', // This would come from the actual patient data
            doctorId: data.doctorId,
            doctor: 'Dr. Name', // This would come from the actual doctor data
            datePrescribed: data.datePrescribed,
            medications: medicationNames, // Show all medication names
            notes: data.notes,
          };
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
  const initialData = editMode && prescription ? {
    patientId: prescription.patientId,
    patientName: prescription.patientName,
    patientNumber: prescription.patientNumber,
    doctorId: prescription.doctorId,
    doctorName: prescription.doctor,
    datePrescribed: prescription.datePrescribed,
    medications: Array.isArray(prescription.medications) 
      ? prescription.medications 
      : [{ name: prescription.medications, dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: prescription.notes,
  } : undefined;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={editMode ? 'Update Prescription' : 'Add New Prescription'}
      size="xl"
    >
      <AddPrescriptionForm
        onSubmit={handleSubmit}
        isLoading={prescriptionViewModel.isSubmitting}
        error={prescriptionViewModel.error}
        onClearError={prescriptionViewModel.clearError}
        editMode={editMode}
        initialData={initialData}
      />
    </Modal>
  );
};
