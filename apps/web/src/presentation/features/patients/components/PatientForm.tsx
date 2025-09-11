import React from 'react';
import { PatientFormContainer } from './PatientFormContainer';
import { PatientFormData } from '../hooks/usePatientFormState';
import type { CreatePatientCommand, UpdatePatientCommand } from '@nx-starter/application-shared';

interface PatientFormProps {
  mode: 'create' | 'update';
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: CreatePatientCommand | UpdatePatientCommand) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
  error?: unknown;
}

export const PatientForm: React.FC<PatientFormProps> = (props) => {
  return <PatientFormContainer {...props} />;
};