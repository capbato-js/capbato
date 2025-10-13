import React from 'react';
import { DengueReportViewContainer } from './DengueReportViewContainer';
import { DengueUnifiedContainer, DengueFormData } from './DengueUnifiedContainer';

interface DengueReportViewProps {
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
  onSubmit?: (data: DengueFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
  error?: string | null
  submitButtonText?: string
}

export const DengueReportView: React.FC<DengueReportViewProps> = (props) => {
  const { editable, ...otherProps } = props;

  if (editable) {
    return <DengueUnifiedContainer {...otherProps} editable={true} />;
  }

  return <DengueReportViewContainer {...otherProps} />;
};
