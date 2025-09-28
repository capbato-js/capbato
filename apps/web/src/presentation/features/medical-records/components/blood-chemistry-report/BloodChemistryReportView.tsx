import React from 'react';
import { BloodChemistryReportViewContainer } from './BloodChemistryReportViewContainer';
import { BloodChemistryUnifiedContainer, BloodChemistryFormData } from './BloodChemistryUnifiedContainer';

interface BloodChemistryReportViewProps {
  patientData?: {
    patientNumber?: string
    patientName?: string
    name?: string
    age?: number
    gender?: string
    sex?: string
    dateRequested?: string
  }
  labData?: Record<string, string | undefined>
  onBack?: () => void
  editable?: boolean
  enabledFields?: string[]
  onSubmit?: (data: BloodChemistryFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
  error?: string | null
  submitButtonText?: string
}

export const BloodChemistryReportView: React.FC<BloodChemistryReportViewProps> = (props) => {
  const { editable, ...otherProps } = props;

  if (editable) {
    return <BloodChemistryUnifiedContainer {...otherProps} editable={true} />;
  }

  return <BloodChemistryReportViewContainer {...otherProps} />;
};