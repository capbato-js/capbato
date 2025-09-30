import React from 'react';
import { SerologyReportViewContainer } from './SerologyReportViewContainer';
import { SerologyUnifiedContainer, SerologyFormData } from './SerologyUnifiedContainer';

interface SerologyReportViewProps {
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
  onSubmit?: (data: SerologyFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
  error?: string | null
  submitButtonText?: string
}

export const SerologyReportView: React.FC<SerologyReportViewProps> = (props) => {
  const { editable, ...otherProps } = props;

  if (editable) {
    return <SerologyUnifiedContainer {...otherProps} editable={true} />;
  }

  return <SerologyReportViewContainer {...otherProps} />;
};