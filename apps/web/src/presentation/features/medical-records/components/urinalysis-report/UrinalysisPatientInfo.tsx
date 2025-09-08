import React from 'react';
import { Box } from '@mantine/core';
import { ReportField } from './ReportField';
import { FIELD_LABELS } from '../../config/urinalysisReportConfig';
import { getReportStyles } from '../../utils/urinalysisReportStyles';

interface UrinalysisPatientInfoProps {
  patientData?: {
    patientName?: string;
    age?: number;
    dateRequested?: string;
    sex?: string;
    gender?: string;
  };
}

export const UrinalysisPatientInfo: React.FC<UrinalysisPatientInfoProps> = ({
  patientData,
}) => {
  const styles = getReportStyles();

  return (
    <Box style={styles.sectionContainer}>
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.patientName}
          value={patientData?.patientName}
          size="xlarge"
        />
        <ReportField
          label={FIELD_LABELS.age}
          value={patientData?.age?.toString()}
          size="small"
          flex={0}
        />
      </Box>

      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.date}
          value={patientData?.dateRequested || new Date().toLocaleDateString()}
          size="xlarge"
        />
        <ReportField
          label={FIELD_LABELS.sex}
          value={patientData?.sex || patientData?.gender}
          size="small"
          flex={0}
        />
      </Box>
    </Box>
  );
};