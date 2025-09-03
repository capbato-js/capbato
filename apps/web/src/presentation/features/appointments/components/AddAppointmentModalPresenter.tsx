import React from 'react';
import { Modal } from '../../../components/common';
import { AddAppointmentForm } from './AddAppointmentForm';
import { AddAppointmentFormData } from '@nx-starter/application-shared';

interface AddAppointmentModalPresenterProps {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  onSubmit: (data: AddAppointmentFormData) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
  editMode: boolean;
  currentAppointmentId?: string;
  initialData?: {
    patientId?: string;
    patientName?: string;
    patientNumber?: string;
    reasonForVisit?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    doctorId?: string;
    doctorName?: string;
  };
  isRescheduleMode: boolean;
}

export const AddAppointmentModalPresenter: React.FC<AddAppointmentModalPresenterProps> = ({
  isOpen,
  onClose,
  modalTitle,
  onSubmit,
  isLoading,
  error,
  onClearError,
  editMode,
  currentAppointmentId,
  initialData,
  isRescheduleMode
}) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={modalTitle}
    >
      <AddAppointmentForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        onClearError={onClearError}
        editMode={editMode}
        currentAppointmentId={currentAppointmentId}
        initialData={initialData}
        isRescheduleMode={isRescheduleMode}
      />
    </Modal>
  );
};