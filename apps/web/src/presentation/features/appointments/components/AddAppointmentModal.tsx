import React from 'react';
import { Modal } from '../../../components/common';
import { AddAppointmentForm } from './AddAppointmentForm';
import { AddAppointmentFormData } from '@nx-starter/application-shared';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddAppointmentFormData) => Promise<boolean>;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = async (data: AddAppointmentFormData): Promise<boolean> => {
    if (onSubmit) {
      return await onSubmit(data);
    }
    console.log('Appointment form submitted:', data);
    // TODO: Implement actual appointment creation
    onClose();
    return true; // Return success
  };

  const handleClearError = () => {
    // Clear error state if needed
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Add New Appointment"
    >
      <AddAppointmentForm
        onSubmit={handleSubmit}
        isLoading={false}
        error=""
        onClearError={handleClearError}
      />
    </Modal>
  );
};
