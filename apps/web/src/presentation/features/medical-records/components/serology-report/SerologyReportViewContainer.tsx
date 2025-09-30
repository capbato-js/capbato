import React, { useRef } from 'react';
import { SerologyPatientData, formatValue, usePrintReport } from '../../utils/serologyReportUtils';
import { SerologyReportViewPresenter } from './SerologyReportViewPresenter';

interface SerologyReportViewContainerProps {
  patientData?: SerologyPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
}

export const SerologyReportViewContainer: React.FC<SerologyReportViewContainerProps> = ({
  patientData,
  labData,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrintReport(printRef as React.RefObject<HTMLDivElement>, patientData?.patientName);

  return (
    <SerologyReportViewPresenter
      printRef={printRef as React.RefObject<HTMLDivElement>}
      patientData={patientData}
      labData={labData}
      formatValue={formatValue}
      onPrint={handlePrint}
      onBack={onBack}
      editable={false}
      enabledFields={[]}
    />
  );
};