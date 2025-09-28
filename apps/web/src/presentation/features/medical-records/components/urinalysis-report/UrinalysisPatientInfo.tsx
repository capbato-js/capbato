import React from 'react';
import { Box } from '@mantine/core';
import { UrinalysisPatientField } from './UrinalysisPatientField';
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

  const patientName = patientData?.patientName || '';
  const age = patientData?.age?.toString() || '';
  const sex = patientData?.sex || patientData?.gender || '';
  const date = patientData?.dateRequested || '';

  return (
    <Box style={styles.sectionContainer}>
      <Box style={styles.fieldRow}>
        <UrinalysisPatientField
          label="Patient Name:"
          value={patientName}
          labelWidth="100px"
          underlineWidth="260px"
        />
        <UrinalysisPatientField
          label="Age:"
          value={age}
          labelWidth="40px"
          underlineWidth="260px"
          extraStyle={{ marginLeft: '30px' }}
        />
      </Box>
      <Box style={styles.fieldRow}>
        <UrinalysisPatientField
          label="Date:"
          value={date}
          labelWidth="100px"
          underlineWidth="260px"
        />
        <UrinalysisPatientField
          label="Sex:"
          value={sex}
          labelWidth="40px"
          underlineWidth="260px"
          extraStyle={{ marginLeft: '30px' }}
        />
      </Box>
    </Box>
  );
};