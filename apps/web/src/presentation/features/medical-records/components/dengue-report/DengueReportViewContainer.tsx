import React, { useRef } from 'react';
import { SerologyPatientData, formatValue, usePrintReport } from '../../utils/serologyReportUtils';
import { DengueReportViewPresenter } from './DengueReportViewPresenter';

interface DengueReportViewContainerProps {
  patientData?: SerologyPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
}

export const DengueReportViewContainer: React.FC<DengueReportViewContainerProps> = ({
  patientData,
  labData,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrintReport(printRef as React.RefObject<HTMLDivElement>, patientData?.patientName);

  return (
    <DengueReportViewPresenter
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
