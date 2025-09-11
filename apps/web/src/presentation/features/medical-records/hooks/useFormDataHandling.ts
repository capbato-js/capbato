import type { AddLabTestResultFormData } from './useLabTestResultFormState';

interface UseFormDataHandlingProps {
  onSubmit: (data: AddLabTestResultFormData) => void;
}

export const useFormDataHandling = ({ onSubmit }: UseFormDataHandlingProps) => {
  
  const handleFormSubmit = (data: AddLabTestResultFormData) => {
    // Remove empty/undefined values to clean the form data
    const cleanedData = Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== '' && value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    onSubmit(cleanedData);
  };

  return {
    handleFormSubmit,
  };
};