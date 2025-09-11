import React from 'react';
import { Modal } from '../../../components/common';
import { AddPrescriptionFormContainer } from './AddPrescriptionFormContainer';
import { AddPrescriptionFormData } from '@nx-starter/application-shared';
import { Medication } from '../types';

interface AddPrescriptionModalPresenterProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: AddPrescriptionFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
  editMode?: boolean;
  initialData?: {
    patientId?: string;
    patientName?: string;
    patientNumber?: string;
    doctorId?: string;
    doctorName?: string;
    datePrescribed?: string;
    medications?: Medication[];
    notes?: string;
  };
}

export const AddPrescriptionModalPresenter: React.FC<AddPrescriptionModalPresenterProps> = ({
  opened,
  onClose,
  title,
  onSubmit,
  isLoading,
  error,
  onClearError,
  editMode,
  initialData,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="xl"
    >
      <AddPrescriptionFormContainer
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        onClearError={onClearError}
        editMode={editMode}
        initialData={initialData}
      />
    </Modal>
  );
};