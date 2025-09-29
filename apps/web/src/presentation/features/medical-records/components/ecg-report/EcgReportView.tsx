import React from 'react';
import { EcgReportViewContainer } from './EcgReportViewContainer';
import { EcgUnifiedContainer, EcgFormData } from './EcgUnifiedContainer';

interface EcgReportViewProps {
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
  onSubmit?: (data: EcgFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
  error?: string | null
  submitButtonText?: string
}

export const EcgReportView: React.FC<EcgReportViewProps> = (props) => {
  const { editable, ...otherProps } = props;

  if (editable) {
    return <EcgUnifiedContainer {...otherProps} editable={true} />;
  }

  return <EcgReportViewContainer {...otherProps} />;
};