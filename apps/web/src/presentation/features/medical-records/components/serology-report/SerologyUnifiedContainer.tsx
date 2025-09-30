import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateLabTestSchema } from '../../constants/labTestFormConfig';
import {
  SerologyPatientData,
  formatValue,
  usePrintReport,
} from '../../utils/serologyReportUtils';
import { SerologyReportViewPresenter } from './SerologyReportViewPresenter';

export type SerologyFormData = {
  ft3?: string;
  ft4?: string;
  tsh?: string;
  doctorId?: string;
} & Record<string, string | undefined>;

interface SerologyUnifiedContainerProps {
  patientData?: SerologyPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
  editable?: boolean;
  enabledFields?: string[];
  onSubmit?: (data: SerologyFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  submitButtonText?: string;
}

export const SerologyUnifiedContainer: React.FC<SerologyUnifiedContainerProps> = ({
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
  const schema = generateLabTestSchema('serology');
  const formMethods = useForm<SerologyFormData>({
    resolver: zodResolver(schema),
    defaultValues: labData || {},
  });

  const { handleSubmit, setValue, watch, reset, formState: { errors } } = formMethods;

  // Reset form with new data when labData changes (for edit mode)
  useEffect(() => {
    if (editable && labData && Object.keys(labData).length > 0) {
      reset(labData);
    }
  }, [editable, labData, reset]);

  // Watch all form values to get current state
  const currentFormData = watch();

  // Handle field changes
  const handleFieldChange = (field: string, value: string) => {
    setValue(field, value);
  };

  // Handle doctor selection
  const handleDoctorChange = (doctorId: string) => {
    setValue('doctorId', doctorId);
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
    <SerologyReportViewPresenter
      printRef={printRef as React.RefObject<HTMLDivElement>}
      patientData={patientData}
      labData={currentFormData}
      formatValue={formatValue}
      onPrint={handlePrint}
      onBack={onBack}
      editable={editable}
      enabledFields={enabledFields}
      onChange={handleFieldChange}
      onDoctorChange={handleDoctorChange}
      errors={errorMap}
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      error={error}
      submitButtonText={submitButtonText}
    />
  );
};