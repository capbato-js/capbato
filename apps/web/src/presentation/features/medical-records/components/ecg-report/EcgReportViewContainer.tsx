import React, { useRef } from 'react';
import {
  EcgPatientData,
  formatValue,
  usePrintReport,
} from '../../utils/ecgReportUtils';
import { EcgReportViewPresenter } from './EcgReportViewPresenter';

interface EcgReportViewContainerProps {
  patientData?: EcgPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
}

export const EcgReportViewContainer: React.FC<EcgReportViewContainerProps> = ({
  patientData,
  labData,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrintReport(printRef as React.RefObject<HTMLDivElement>, patientData?.patientName);

  return (
    <EcgReportViewPresenter
      printRef={printRef as React.RefObject<HTMLDivElement>}
      patientData={patientData}
      labData={labData}
      formatValue={formatValue}
      onPrint={handlePrint}
      onBack={onBack}
    />
  );
};