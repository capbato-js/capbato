import React from 'react';
import { usePatientData } from '../hooks/usePatientData';
import { useLabTestFormState } from '../hooks/useLabTestFormState';
import { useTestSelection } from '../hooks/useTestSelection';
import { usePatientSelection } from '../hooks/usePatientSelection';
import { AddLabTestFormPresenter } from './AddLabTestFormPresenter';
import { ADD_LAB_TEST_FORM_CONFIG } from '../config/addLabTestFormConfig';
import { createFormSubmitHandler } from '../utils/labTestFormUtils';

interface AddLabTestFormContainerProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export const AddLabTestFormContainer: React.FC<AddLabTestFormContainerProps> = ({
  onSubmit,
  isLoading,
  error
}) => {
  // Custom hooks
  const patientData = usePatientData();
  const formState = useLabTestFormState();
  const testSelection = useTestSelection({ setValue: formState.setValue });
  const patientSelection = usePatientSelection({ 
    setValue: formState.setValue, 
    patients: patientData.patients 
  });

  // Create form submit handler
  const handleFormSubmit = formState.handleSubmit(
    createFormSubmitHandler(onSubmit, testSelection.selectedTests)
  );

  return (
    <AddLabTestFormPresenter
      config={ADD_LAB_TEST_FORM_CONFIG}
      formState={formState}
      patientData={patientData}
      testSelection={testSelection}
      patientSelection={patientSelection}
      onFormSubmit={handleFormSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
};