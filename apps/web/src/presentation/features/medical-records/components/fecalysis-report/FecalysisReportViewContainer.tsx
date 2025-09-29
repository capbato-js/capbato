import React, { useRef } from 'react';
import {
  FecalysisPatientData,
  formatValue,
  usePrintReport,
} from '../../utils/fecalysisReportUtils';
import { FecalysisReportViewPresenter } from './FecalysisReportViewPresenter';

interface FecalysisReportViewContainerProps {
  patientData?: FecalysisPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
}

export const FecalysisReportViewContainer: React.FC<FecalysisReportViewContainerProps> = ({
  patientData,
  labData,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrintReport(printRef as React.RefObject<HTMLDivElement>, patientData?.patientName);

  return (
    <FecalysisReportViewPresenter
      printRef={printRef as React.RefObject<HTMLDivElement>}
      patientData={patientData}
      labData={labData}
      formatValue={formatValue}
      onPrint={handlePrint}
      onBack={onBack}
    />
  );
};