import React from 'react';
import { AddPrescriptionModalContainer } from './AddPrescriptionModalContainer';
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

export const AddPrescriptionModal: React.FC<AddPrescriptionModalProps> = (props) => {
  return <AddPrescriptionModalContainer {...props} />;
};
