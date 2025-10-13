import React from 'react';
import { Box, Text, Select } from '@mantine/core';
import { useSerologyDoctorSelection } from '../../hooks/useSerologyDoctorSelection';
import { getReportStyles } from '../../utils/serologyReportStyles';

interface DengueDoctorFieldProps {
  label: string;
  editable?: boolean;
  doctorId?: string;
  doctorName?: string;
  onChange?: (doctorId: string) => void;
  error?: string;
}

export const DengueDoctorField: React.FC<DengueDoctorFieldProps> = ({
  label,
  editable = false,
  doctorId,
  doctorName,
  onChange,
  error,
}) => {
  const styles = getReportStyles();
  const { doctors, isLoading, getDoctorNameById } = useSerologyDoctorSelection();

  const displayValue = editable
    ? (doctorId || '')
    : (doctorName || (doctorId ? getDoctorNameById(doctorId) : ''));

  return (
    <Box style={styles.patientInfoField}>
      <Text style={styles.patientLabel}>{label}</Text>
      {editable ? (
        <Select
          value={doctorId || ''}
          onChange={(value) => onChange?.(value || '')}
          data={doctors}
          placeholder="Select a doctor"
          searchable
          clearable
          loading={isLoading}
          error={error}
          style={{ minWidth: '250px' }}
          size="sm"
        />
      ) : (
        <Box style={styles.patientValue}>
          {displayValue}
        </Box>
      )}
    </Box>
  );
};
