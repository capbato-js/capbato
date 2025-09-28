import React, { useRef } from 'react';
import {
  BloodChemistryPatientData,
  formatValue,
  usePrintReport,
} from '../../utils/bloodChemistryReportUtils';
import { BloodChemistryReportViewPresenter } from './BloodChemistryReportViewPresenter';

interface BloodChemistryReportViewContainerProps {
  patientData?: BloodChemistryPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
}

export const BloodChemistryReportViewContainer: React.FC<BloodChemistryReportViewContainerProps> = ({
  patientData,
  labData,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrintReport(printRef as React.RefObject<HTMLDivElement>, patientData?.patientName);

  return (
    <BloodChemistryReportViewPresenter
      printRef={printRef as React.RefObject<HTMLDivElement>}
      patientData={patientData}
      labData={labData}
      formatValue={formatValue}
      onPrint={handlePrint}
      onBack={onBack}
    />
  );
};