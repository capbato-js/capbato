import React from 'react';
import { PatientFormPresenter } from './PatientFormPresenter';
import { usePatientFormState, PatientFormData } from '../hooks/usePatientFormState';
import { usePatientFormHandlers } from '../hooks/usePatientFormHandlers';
import { usePatientFormSubmission } from '../hooks/usePatientFormSubmission';
import { usePatientFormErrorHandling } from '../hooks/usePatientFormErrorHandling';
import { isFormEmpty as checkFormEmpty } from '../utils/patientFormUtils';
import type { CreatePatientCommand, UpdatePatientCommand } from '@nx-starter/application-shared';

interface PatientFormContainerProps {
  mode: 'create' | 'update';
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: CreatePatientCommand | UpdatePatientCommand) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
  error?: unknown;
}

export const PatientFormContainer: React.FC<PatientFormContainerProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  error
}) => {
  // Form state management
  const form = usePatientFormState({ mode, initialData });
  const { 
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
    isUpdateMode
  } = form;

  // Form handlers
  const handlers = usePatientFormHandlers({ 
    setValue, 
    trigger, 
    watch, 
    clearErrors 
  });

  // Form submission
  const submission = usePatientFormSubmission({ 
    mode, 
    initialData, 
    onSubmit, 
    watch, 
    reset: form.reset 
  });

  // Error handling
  const { generalError } = usePatientFormErrorHandling({ 
    error, 
    setError, 
    clearErrors 
  });

  // Watch form values for button state
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const dateOfBirth = watch('dateOfBirth');
  const gender = watch('gender');
  const contactNumber = watch('contactNumber');

  // Calculate form state
  const isFormEmptyValue = checkFormEmpty(
    isUpdateMode,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    contactNumber
  );

  return (
    <PatientFormPresenter
      mode={mode}
      initialData={initialData}
      onCancel={onCancel}
      isLoading={isLoading}
      generalError={generalError}
      form={{
        register,
        handleSubmit,
        control,
        watch,
        errors
      }}
      handlers={handlers}
      submission={submission}
      formState={{
        firstName,
        lastName,
        dateOfBirth,
        gender,
        contactNumber
      }}
      isFormEmpty={isFormEmptyValue}
    />
  );
};