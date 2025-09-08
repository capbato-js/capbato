import React from 'react';
import { Box, Button } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
import { UrinalysisPatientData } from '../../utils/urinalysisReportUtils';
import { getReportStyles } from '../../utils/urinalysisReportStyles';
import { UrinalysisReportHeader } from './UrinalysisReportHeader';
import { UrinalysisPatientInfo } from './UrinalysisPatientInfo';
import { UrinalysisPhysicalProperties } from './UrinalysisPhysicalProperties';
import { UrinalysisMicroscopicFields } from './UrinalysisMicroscopicFields';
import { UrinalysisSignatures } from './UrinalysisSignatures';
import classes from './UrinalysisReportView.module.css';

interface UrinalysisReportViewPresenterProps {
  printRef: React.RefObject<HTMLDivElement>;
  patientData?: UrinalysisPatientData;
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  onPrint: () => void;
  onBack?: () => void;
}

export const UrinalysisReportViewPresenter: React.FC<UrinalysisReportViewPresenterProps> = ({
  printRef,
  patientData,
  labData,
  formatValue,
  onPrint,
  onBack,
}) => {
  const styles = getReportStyles();

  return (
    <Box>
      {/* Report content */}
      <Box
        ref={printRef}
        style={styles.reportContainer}
        className={classes.printArea}
      >
        <UrinalysisReportHeader />
        
        <UrinalysisPatientInfo patientData={patientData} />
        
        <UrinalysisPhysicalProperties 
          labData={labData} 
          formatValue={formatValue} 
        />
        
        <UrinalysisMicroscopicFields 
          labData={labData} 
          formatValue={formatValue} 
        />
        
        <UrinalysisSignatures />
      </Box>

      {/* Print Report button */}
      <Box
        style={styles.printButtonContainer}
        className={classes.noPrint}
      >
        <Button
          variant="filled"
          leftSection={<IconPrinter size={20} />}
          onClick={onPrint}
        >
          Print Report
        </Button>
      </Box>
    </Box>
  );
};