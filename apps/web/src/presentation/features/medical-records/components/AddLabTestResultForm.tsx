import React from 'react';
import { AddLabTestResultFormContainer } from './AddLabTestResultFormContainer';
import { LabTestType } from '../constants/labTestFormConfig';

// Re-export types
export type { AddLabTestResultFormData } from '../hooks/useLabTestResultFormState';

interface AddLabTestResultFormProps {
  testType?: LabTestType;
  enabledFields?: string[];
  viewMode?: boolean;
  existingData?: Record<string, string | undefined>;
  isLoadingData?: boolean;
  submitButtonText?: string;
  patientData?: {
    patientNumber?: string;
    patientName?: string;
    name?: string;
    age?: number;
    gender?: string;
    sex?: string;
    address?: string;
    doctorName?: string;
    dateRequested?: string;
  };
  onSubmit: (data: Record<string, string | undefined>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export const AddLabTestResultForm: React.FC<AddLabTestResultFormProps> = (props) => {
  return <AddLabTestResultFormContainer {...props} />;
};
