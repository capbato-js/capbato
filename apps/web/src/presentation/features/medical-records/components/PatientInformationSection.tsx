import React from 'react';
import { Box, Grid, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { FormSelect } from '../../../components/ui/FormSelect';
import { Icon } from '../../../components/common';
import { handleDateChange } from '../utils/labTestFormUtils';
import type { AddLabTestFormData } from '../hooks/useLabTestFormState';

interface PatientInformationSectionProps {
  control: Control<AddLabTestFormData>;
  register: any;
  errors: FieldErrors<AddLabTestFormData>;
  patients: Array<{ value: string; label: string; patientNumber: string; age: number; gender: string }>;
  selectedPatientNumber: string;
  selectedPatientAgeGender: string;
  onPatientChange: (patientId: string) => void;
  isLoading: boolean;
  isPatientLoading: boolean;
}

export const PatientInformationSection: React.FC<PatientInformationSectionProps> = ({
  control,
  register,
  errors,
  patients,
  selectedPatientNumber,
  selectedPatientAgeGender,
  onPatientChange,
  isLoading,
  isPatientLoading,
}) => {
  return (
    <Box>
      <Grid gutter="md">
        <Grid.Col span={6}>
          <Controller
            name="patientName"
            control={control}
            render={({ field, fieldState }) => (
              <Box>
                <FormSelect
                  {...field}
                  label="Patient:"
                  placeholder="Search and select patient"
                  data={patients}
                  error={fieldState.error}
                  disabled={isLoading || isPatientLoading}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value) onPatientChange(value);
                  }}
                  leftSection={<Icon icon="fas fa-user" size={16} />}
                />
                {selectedPatientNumber && (
                  <Text size="sm" c="dimmed" mt={4}>
                    Patient #: {selectedPatientNumber}
                  </Text>
                )}
              </Box>
            )}
          />
        </Grid.Col>
        
        <Grid.Col span={3}>
          <FormTextInput
            {...register('ageGender')}
            label="Age/Gender:"
            placeholder="Age / Gender"
            disabled
            required
            error={errors.ageGender}
            value={selectedPatientAgeGender}
            readOnly
          />
        </Grid.Col>
        
        <Grid.Col span={3}>
          <Controller
            name="requestDate"
            control={control}
            render={({ field, fieldState }) => (
              <DateInput
                label="Date:"
                placeholder="Select date"
                error={fieldState.error?.message}
                disabled={isLoading}
                value={field.value ? new Date(field.value) : null}
                popoverProps={{
                  position: 'bottom-end',
                  withinPortal: true,
                }}
                onChange={(value) => handleDateChange(value, field.onChange)}
              />
            )}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};