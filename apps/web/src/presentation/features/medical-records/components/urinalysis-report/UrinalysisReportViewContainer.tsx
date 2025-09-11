import React, { useRef } from 'react';
import {
  UrinalysisPatientData,
  UrinalysisLabData,
  formatValue,
  usePrintReport,
} from '../../utils/urinalysisReportUtils';
import { UrinalysisReportViewPresenter } from './UrinalysisReportViewPresenter';

interface UrinalysisReportViewContainerProps {
  patientData?: UrinalysisPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
}

export const UrinalysisReportViewContainer: React.FC<UrinalysisReportViewContainerProps> = ({
  patientData,
  labData,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrintReport(printRef, patientData?.patientName);

  return (
    <UrinalysisReportViewPresenter
      printRef={printRef}
      patientData={patientData}
      labData={labData}
      formatValue={formatValue}
      onPrint={handlePrint}
      onBack={onBack}
    />
  );
};