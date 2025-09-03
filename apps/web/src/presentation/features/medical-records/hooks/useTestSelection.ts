import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import type { AddLabTestFormData } from './useLabTestFormState';

interface UseTestSelectionProps {
  setValue: UseFormSetValue<AddLabTestFormData>;
}

export const useTestSelection = ({ setValue }: UseTestSelectionProps) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  // Handle test selection
  const handleTestSelection = (testId: string, checked: boolean) => {
    let updatedTests: string[];
    
    if (checked) {
      updatedTests = [...selectedTests, testId];
    } else {
      updatedTests = selectedTests.filter(id => id !== testId);
    }
    
    setSelectedTests(updatedTests);
    setValue('selectedTests', updatedTests);
  };

  // Check if form is empty (including test selection)
  const isFormEmpty = (patientName: string, ageGender: string, requestDate: string) => {
    return !patientName || !ageGender || !requestDate || selectedTests.length === 0;
  };

  return {
    selectedTests,
    handleTestSelection,
    isFormEmpty,
  };
};