import React from 'react';
import { Modal } from '../../../components/common';
import { AddPrescriptionForm } from './AddPrescriptionForm';
import { AddPrescriptionFormData } from '@nx-starter/application-shared';
import { Prescription } from '../types';

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
  const handleSubmit = async (data: AddPrescriptionFormData): Promise<boolean> => {
    try {
      // For now, just simulate success since we're using dummy data
      console.log('Prescription form data:', data);
      
      if (editMode) {
        console.log('Updating prescription:', prescription?.id);
        // TODO: Implement update prescription functionality
        onPrescriptionUpdated?.();
      } else {
        console.log('Creating new prescription');
        // TODO: Implement create prescription functionality
        // For now, create a dummy prescription
        const newPrescription: Prescription = {
          id: Date.now().toString(),
          patientId: data.patientId,
          patientName: 'Patient Name', // This would come from the actual patient data
          patientNumber: 'P001', // This would come from the actual patient data
          doctorId: data.doctorId,
          doctor: 'Dr. Name', // This would come from the actual doctor data
          datePrescribed: data.datePrescribed,
          medications: data.medications,
          notes: data.notes,
        };
        onPrescriptionCreated?.(newPrescription);
      }
      
      onClose();
      return true;
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
        isLoading={false}
        error={null}
        editMode={editMode}
        initialData={initialData}
      />
    </Modal>
  );
};
