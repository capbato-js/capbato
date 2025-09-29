import React from 'react';
import { Box } from '@mantine/core';
import { FecalysisPatientField } from './FecalysisPatientField';
import { getReportStyles } from '../../utils/fecalysisReportStyles';

interface FecalysisPatientInfoProps {
  patientData?: {
    patientName?: string;
    age?: number;
    dateRequested?: string;
    sex?: string;
    gender?: string;
  };
}

export const FecalysisPatientInfo: React.FC<FecalysisPatientInfoProps> = ({
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
        <FecalysisPatientField
          label="Patient Name:"
          value={patientName}
          labelWidth="100px"
          underlineWidth="260px"
        />
        <FecalysisPatientField
          label="Age:"
          value={age}
          labelWidth="40px"
          underlineWidth="260px"
          extraStyle={{ marginLeft: '30px' }}
        />
      </Box>
      <Box style={styles.fieldRow}>
        <FecalysisPatientField
          label="Date:"
          value={date}
          labelWidth="100px"
          underlineWidth="260px"
        />
        <FecalysisPatientField
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