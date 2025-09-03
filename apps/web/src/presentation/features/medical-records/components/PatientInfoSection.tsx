import React from 'react';
import { Box, Text, Skeleton } from '@mantine/core';
import { 
  formatPatientName, 
  formatPatientSex, 
  formatDate, 
  formatPatientAge,
  getPatientInfoStyles 
} from '../utils/labTestResultFormUtils';

interface PatientInfoSectionProps {
  patientData?: {
    patientName?: string;
    name?: string;
    age?: number;
    sex?: string;
    gender?: string;
    dateRequested?: string;
  };
  isLoadingData: boolean;
}

export const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({
  patientData,
  isLoadingData,
}) => {
  const styles = getPatientInfoStyles();

  return (
    <Box style={styles.container}>
      {/* Left Group */}
      <Box style={styles.leftGroup}>
        <Box style={styles.field}>
          <Text size="sm" fw={700}>Patient Name:</Text>
          <Box style={styles.fieldValue}>
            {isLoadingData ? (
              <Skeleton height={16} width={150} />
            ) : (
              <Text size="sm">{formatPatientName(patientData)}</Text>
            )}
          </Box>
        </Box>

        <Box style={styles.field}>
          <Text size="sm" fw={700}>Date:</Text>
          <Box style={styles.fieldValueWide}>
            {isLoadingData ? (
              <Skeleton height={16} width={100} />
            ) : (
              <Text size="sm">{formatDate(patientData?.dateRequested)}</Text>
            )}
          </Box>
        </Box>
      </Box>

      {/* Right Group */}
      <Box style={styles.rightGroup}>
        <Box style={styles.field}>
          <Text size="sm" fw={700}>Age:</Text>
          <Box style={styles.fieldValueWide}>
            {isLoadingData ? (
              <Skeleton height={16} width={50} />
            ) : (
              <Text size="sm">{formatPatientAge(patientData?.age)}</Text>
            )}
          </Box>
        </Box>

        <Box style={styles.field}>
          <Text size="sm" fw={700}>Sex:</Text>
          <Box style={styles.fieldValueWide}>
            {isLoadingData ? (
              <Skeleton height={16} width={30} />
            ) : (
              <Text size="sm">{formatPatientSex(patientData)}</Text>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};