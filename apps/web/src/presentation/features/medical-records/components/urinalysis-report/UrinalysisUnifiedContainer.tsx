import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateLabTestSchema } from '../../constants/labTestFormConfig';
import {
  UrinalysisPatientData,
  formatValue,
  usePrintReport,
} from '../../utils/urinalysisReportUtils';
import { UrinalysisReportViewPresenter } from './UrinalysisReportViewPresenter';

export type UrinalysisFormData = Record<string, string | undefined>;

interface UrinalysisUnifiedContainerProps {
  patientData?: UrinalysisPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
  editable?: boolean;
  enabledFields?: string[];
  onSubmit?: (data: UrinalysisFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  submitButtonText?: string;
}

export const UrinalysisUnifiedContainer: React.FC<UrinalysisUnifiedContainerProps> = ({
  patientData,
  labData,
  onBack,
  editable = false,
  enabledFields = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
  error,
  submitButtonText = 'Submit Result',
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrintReport(printRef as React.RefObject<HTMLDivElement>, patientData?.patientName);

  // Form setup for editable mode
  const schema = generateLabTestSchema('urinalysis');
  const formMethods = useForm<UrinalysisFormData>({
    resolver: zodResolver(schema),
    defaultValues: labData || {},
  });

  const { handleSubmit, setValue, watch, formState: { errors } } = formMethods;

  // Watch all form values to get current state
  const currentFormData = watch();

  // Handle field changes
  const handleFieldChange = (field: string, value: string) => {
    setValue(field, value);
  };

  // Handle form submission
  const handleFormSubmit = handleSubmit((data) => {
    onSubmit?.(data);
  });

  // Convert form errors to simple error object
  const errorMap: Record<string, string> = {};
  Object.keys(errors).forEach(key => {
    const error = errors[key];
    if (error?.message) {
      errorMap[key] = error.message;
    }
  });

  return (
    <UrinalysisReportViewPresenter
      printRef={printRef as React.RefObject<HTMLDivElement>}
      patientData={patientData}
      labData={currentFormData}
      formatValue={formatValue}
      onPrint={handlePrint}
      onBack={onBack}
      editable={editable}
      enabledFields={enabledFields}
      onChange={handleFieldChange}
      errors={errorMap}
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      error={error}
      submitButtonText={submitButtonText}
    />
  );
};