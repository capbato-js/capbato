import React from 'react';
import { UrinalysisReportViewContainer } from './UrinalysisReportViewContainer';

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
}

export const UrinalysisReportView: React.FC<UrinalysisReportViewProps> = (props) => {
  return <UrinalysisReportViewContainer {...props} />;
};
