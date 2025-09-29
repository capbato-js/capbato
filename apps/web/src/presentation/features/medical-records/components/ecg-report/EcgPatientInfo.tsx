import React from 'react';
import { Box } from '@mantine/core';
import { EcgPatientField } from './EcgPatientField';
import { getReportStyles } from '../../utils/ecgReportStyles';

interface EcgPatientInfoProps {
  patientData?: {
    patientName?: string;
    age?: number;
    dateRequested?: string;
    sex?: string;
    gender?: string;
  };
}

export const EcgPatientInfo: React.FC<EcgPatientInfoProps> = ({
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
        <EcgPatientField
          label="Patient Name:"
          value={patientName}
          labelWidth="100px"
          underlineWidth="270px"
        />
        <EcgPatientField
          label="Age:"
          value={age}
          labelWidth="40px"
          underlineWidth="270px"
          extraStyle={{ marginLeft: '30px' }}
        />
      </Box>
      <Box style={styles.fieldRow}>
        <EcgPatientField
          label="Date:"
          value={date}
          labelWidth="100px"
          underlineWidth="270px"
        />
        <EcgPatientField
          label="Sex:"
          value={sex}
          labelWidth="40px"
          underlineWidth="270px"
          extraStyle={{ marginLeft: '30px' }}
        />
      </Box>
    </Box>
  );
};