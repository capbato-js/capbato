import React from 'react';
import { HematologyReportViewContainer } from './HematologyReportViewContainer';
import { HematologyUnifiedContainer, HematologyFormData } from './HematologyUnifiedContainer';

interface HematologyReportViewProps {
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
  onSubmit?: (data: HematologyFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
  error?: string | null
  submitButtonText?: string
}

export const HematologyReportView: React.FC<HematologyReportViewProps> = (props) => {
  const { editable, ...otherProps } = props;

  if (editable) {
    return <HematologyUnifiedContainer {...otherProps} editable={true} />;
  }

  return <HematologyReportViewContainer {...otherProps} />;
};
