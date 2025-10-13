import React from 'react';
import { CoagulationReportViewContainer } from './CoagulationReportViewContainer';
import { CoagulationUnifiedContainer, CoagulationFormData } from './CoagulationUnifiedContainer';

interface CoagulationReportViewProps {
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
  onSubmit?: (data: CoagulationFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
  error?: string | null
  submitButtonText?: string
}

export const CoagulationReportView: React.FC<CoagulationReportViewProps> = (props) => {
  const { editable, ...otherProps } = props;

  if (editable) {
    return <CoagulationUnifiedContainer {...otherProps} editable={true} />;
  }

  return <CoagulationReportViewContainer {...otherProps} />;
};
