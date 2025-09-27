import React from 'react';
import { UrinalysisReportViewContainer } from './UrinalysisReportViewContainer';
import { UrinalysisUnifiedContainer, UrinalysisFormData } from './UrinalysisUnifiedContainer';

interface UrinalysisReportViewProps {
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
  onSubmit?: (data: UrinalysisFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
  error?: string | null
  submitButtonText?: string
}

export const UrinalysisReportView: React.FC<UrinalysisReportViewProps> = (props) => {
  const { editable, ...otherProps } = props;

  if (editable) {
    return <UrinalysisUnifiedContainer {...otherProps} editable={true} />;
  }

  return <UrinalysisReportViewContainer {...otherProps} />;
};
