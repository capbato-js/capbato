import React from 'react';
import { Box } from '@mantine/core';
import { BloodChemistryPatientData } from '../../utils/bloodChemistryReportUtils';
import { getReportStyles } from '../../utils/bloodChemistryReportStyles';
import { BloodChemistryPatientField } from './BloodChemistryPatientField';

interface BloodChemistryPatientInfoProps {
  patientData?: BloodChemistryPatientData;
}

export const BloodChemistryPatientInfo: React.FC<BloodChemistryPatientInfoProps> = ({
  patientData,
}) => {
  const styles = getReportStyles();

  const patientName = patientData?.patientName || patientData?.name || '';
  const age = patientData?.age?.toString() || '';
  const sex = patientData?.sex || patientData?.gender || '';
  const date = patientData?.dateRequested || '';

  return (
    <Box style={styles.patientInfoContainer}>
      <Box style={styles.patientInfoRow}>
        <BloodChemistryPatientField
          label="Patient Name:"
          value={patientName}
          labelWidth="100px"
          underlineWidth="270px"
        />
        <BloodChemistryPatientField
          label="Age:"
          value={age}
          labelWidth="40px"
          underlineWidth="270px"
          extraStyle={{ marginLeft: '30px' }}
        />
      </Box>
      <Box style={styles.patientInfoRow}>
        <BloodChemistryPatientField
          label="Date:"
          value={date}
          labelWidth="100px"
          underlineWidth="270px"
        />
        <BloodChemistryPatientField
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