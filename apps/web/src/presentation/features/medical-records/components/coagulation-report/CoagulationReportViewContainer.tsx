import React, { useRef } from 'react';
import { SerologyPatientData, formatValue, usePrintReport } from '../../utils/serologyReportUtils';
import { CoagulationReportViewPresenter } from './CoagulationReportViewPresenter';

interface CoagulationReportViewContainerProps {
  patientData?: SerologyPatientData;
  labData?: Record<string, string | undefined>;
  onBack?: () => void;
}

export const CoagulationReportViewContainer: React.FC<CoagulationReportViewContainerProps> = ({
  patientData,
  labData,
  onBack,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = usePrintReport(printRef as React.RefObject<HTMLDivElement>, patientData?.patientName);

  return (
    <CoagulationReportViewPresenter
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
