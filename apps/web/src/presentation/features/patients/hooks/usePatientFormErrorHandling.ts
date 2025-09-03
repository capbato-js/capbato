import { useState, useEffect } from 'react';
import { UseFormSetError, UseFormClearErrors } from 'react-hook-form';
import { classifyError, formatFieldErrorMessage } from '../utils/errorClassification';
import type { CreatePatientCommand } from '@nx-starter/application-shared';

interface UsePatientFormErrorHandlingProps {
  error?: unknown;
  setError: UseFormSetError<CreatePatientCommand>;
  clearErrors: UseFormClearErrors<CreatePatientCommand>;
}

export const usePatientFormErrorHandling = ({ 
  error, 
  setError, 
  clearErrors 
}: UsePatientFormErrorHandlingProps) => {
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) {
      setGeneralError(null);
      return;
    }

    const classification = classifyError(error);
    
    if (classification.type === 'field' && classification.fieldError) {
      // Clear general error and set field error
      setGeneralError(null);
      const { field, message } = classification.fieldError;
      const formattedMessage = formatFieldErrorMessage(field, message);
      
      setError(field as keyof CreatePatientCommand, {
        type: 'server',
        message: formattedMessage
      });
    } else {
      // Clear any field errors and set general error
      clearErrors();
      setGeneralError(classification.generalMessage || 'An unexpected error occurred');
    }
  }, [error, setError, clearErrors]);

  return {
    generalError
  };
};