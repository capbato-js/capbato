import React from 'react';
import { ConfirmationModal } from '../../../components/common';
import { LabTest } from '../types';

// Define PatientInfo type locally to avoid dependency issues
interface PatientInfo {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
}

interface LaboratoryTestsModalsProps {
  // Cancel Confirmation Modal
  cancelConfirmationModalOpened: boolean;
  onCloseCancelConfirmation: () => void;
  onConfirmCancel: () => void;
  testToCancel: LabTest | null;
  
  // Common data
  patientInfo: PatientInfo | null;
  isLoading: boolean;
  error: string | null;
}

export const LaboratoryTestsModals: React.FC<LaboratoryTestsModalsProps> = ({
  cancelConfirmationModalOpened,
  onCloseCancelConfirmation,
  onConfirmCancel,
  testToCancel,
}) => {
  return (
    <>
      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelConfirmationModalOpened}
        onClose={onCloseCancelConfirmation}
        onConfirm={onConfirmCancel}
        title="Cancel Lab Test"
        message={`Are you sure you want to cancel the lab test "${testToCancel?.testName || 'this test'}"?`}
        confirmText="Cancel Test"
        cancelText="Keep Test"
        confirmColor="red"
      />
    </>
  );
};
