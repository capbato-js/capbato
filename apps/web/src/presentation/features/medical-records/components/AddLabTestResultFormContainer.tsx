import React from 'react';
import { getLabTestConfig, getFieldsByColumn, LabTestType } from '../constants/labTestFormConfig';
import { useLabTestResultFormState } from '../hooks/useLabTestResultFormState';
import { useFormDataHandling } from '../hooks/useFormDataHandling';
import { AddLabTestResultFormPresenter } from './AddLabTestResultFormPresenter';
import { ADD_LAB_TEST_RESULT_FORM_CONFIG } from '../config/addLabTestResultFormConfig';
import type { AddLabTestResultFormData } from '../hooks/useLabTestResultFormState';

interface AddLabTestResultFormContainerProps {
  testType?: LabTestType;
  enabledFields?: string[];
  viewMode?: boolean;
  existingData?: AddLabTestResultFormData;
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
  onSubmit: (data: AddLabTestResultFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export const AddLabTestResultFormContainer: React.FC<AddLabTestResultFormContainerProps> = ({
  testType = 'BLOOD_CHEMISTRY',
  enabledFields,
  viewMode = false,
  existingData,
  isLoadingData = false,
  submitButtonText = ADD_LAB_TEST_RESULT_FORM_CONFIG.buttons.defaultSubmitText,
  patientData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
}) => {
  // Get test configuration and fields
  const testConfig = getLabTestConfig(testType);
  const leftFields = getFieldsByColumn(testType, 'left');
  const rightFields = getFieldsByColumn(testType, 'right');

  // Use hooks
  const formMethods = useLabTestResultFormState({ testType, existingData });
  const { handleFormSubmit } = useFormDataHandling({ onSubmit });

  return (
    <AddLabTestResultFormPresenter
      config={ADD_LAB_TEST_RESULT_FORM_CONFIG}
      testConfig={testConfig}
      leftFields={leftFields}
      rightFields={rightFields}
      formMethods={formMethods}
      handleFormSubmit={handleFormSubmit}
      enabledFields={enabledFields}
      viewMode={viewMode}
      isLoadingData={isLoadingData}
      submitButtonText={submitButtonText}
      patientData={patientData}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
};