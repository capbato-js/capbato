import React from 'react';
import { FecalysisReportViewContainer } from './FecalysisReportViewContainer';
import { FecalysisUnifiedContainer, FecalysisFormData } from './FecalysisUnifiedContainer';

interface FecalysisReportViewProps {
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
  onSubmit?: (data: FecalysisFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
  error?: string | null
  submitButtonText?: string
}

export const FecalysisReportView: React.FC<FecalysisReportViewProps> = (props) => {
  const { editable, ...otherProps } = props;

  if (editable) {
    return <FecalysisUnifiedContainer {...otherProps} editable={true} />;
  }

  return <FecalysisReportViewContainer {...otherProps} />;
};