import React from 'react';
import { Modal } from '../../../components/common';
import { AddAppointmentForm } from './AddAppointmentForm';
import { useAppointmentFormViewModel } from '../view-models/useAppointmentFormViewModel';
import { AppointmentDto } from '@nx-starter/application-shared';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated?: (appointment: AppointmentDto) => void;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAppointmentCreated,
}) => {
  const viewModel = useAppointmentFormViewModel();

  const handleSubmit = async (data: any): Promise<boolean> => {
    const success = await viewModel.handleFormSubmit(data);
    
    if (success) {
      onClose();
      // Note: We don't have the created appointment object from the view model
      // This could be enhanced to return the created appointment
      if (onAppointmentCreated) {
        // For now, we'll trigger a refresh instead
        // onAppointmentCreated(createdAppointment);
      }
    }
    
    return success;
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Add New Appointment"
    >
      <AddAppointmentForm
        onSubmit={handleSubmit}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
        onClearError={viewModel.clearError}
      />
    </Modal>
  );
};
