import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Box, Text } from '@mantine/core';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { FormSelect } from '../../../../components/ui/FormSelect';
import { FormattedPatient } from '../../hooks/usePatientData';

interface PatientSelectionFieldProps {
  control: Control<AddTransactionFormData>;
  errors: FieldErrors<AddTransactionFormData>;
  patients: FormattedPatient[];
  selectedPatientNumber: string;
}

export const PatientSelectionField: React.FC<PatientSelectionFieldProps> = ({
  control,
  errors,
  patients,
  selectedPatientNumber,
}) => {
  return (
    <Box>
      <Controller
        name="patientId"
        control={control}
        render={({ field }) => (
          <FormSelect
            {...field}
            label="Patient"
            placeholder="Select a patient"
            data={patients}
            searchable
            clearable
            error={errors.patientId?.message}
          />
        )}
      />
      {selectedPatientNumber && (
        <Text size="sm" c="dimmed" mt={4}>
          Patient Number: {selectedPatientNumber}
        </Text>
      )}
    </Box>
  );
};