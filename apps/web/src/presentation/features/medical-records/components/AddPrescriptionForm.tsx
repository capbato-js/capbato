import React from 'react';
import { AddPrescriptionFormContainer } from './AddPrescriptionFormContainer';
import { AddPrescriptionFormData } from '@nx-starter/application-shared';
import { Medication } from '../types';

export interface AddPrescriptionFormProps {
  onSubmit: (data: AddPrescriptionFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
  // Edit mode props
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

export const AddPrescriptionForm: React.FC<AddPrescriptionFormProps> = (props) => {
  return <AddPrescriptionFormContainer {...props} />;
};
