import React, { useRef } from 'react';
import { SerologyPatientData, formatValue, usePrintReport } from '../../utils/serologyReportUtils';
import { HematologyReportViewPresenter } from './HematologyReportViewPresenter';

interface HematologyReportViewContainerProps {
  patientData?: SerologyPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
}

export const HematologyReportViewContainer: React.FC<HematologyReportViewContainerProps> = ({
  patientData,
  labData,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrintReport(printRef as React.RefObject<HTMLDivElement>, patientData?.patientName);

  return (
    <HematologyReportViewPresenter
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
