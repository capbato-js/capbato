import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Box,
  Group,
  Text,
  TextInput,
  Textarea,
  ActionIcon,
  Stack,
} from '@mantine/core';
import { Icon } from '../../../components/common';
import { FormSelect } from '../../../components/ui/FormSelect';
import { FREQUENCY_OPTIONS, DURATION_OPTIONS } from '../config/prescriptionConfig';
import { formatMedicationOptions } from '../utils/prescriptionFormUtils';
import { PrescriptionFormControl, PrescriptionFormErrors } from '../hooks/usePrescriptionFormState';

interface MedicationRowProps {
  index: number;
  fieldId: string;
  control: PrescriptionFormControl;
  errors: PrescriptionFormErrors;
  onRemove: () => void;
  canRemove: boolean;
}

export const MedicationRow: React.FC<MedicationRowProps> = ({
  index,
  fieldId,
  control,
  errors,
  onRemove,
  canRemove,
}) => {
  const medicationOptions = formatMedicationOptions();

  return (
    <Box key={fieldId} p="md" style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Group justify="space-between" align="center" mb="sm">
        <Text size="sm" fw={500}>Medication {index + 1}</Text>
        {canRemove && (
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={onRemove}
          >
            <Icon icon="fas fa-trash" />
          </ActionIcon>
        )}
      </Group>

      <Stack gap="sm">
        <Group grow>
          <Controller
            name={`medications.${index}.name`}
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                label="Medication Name *"
                placeholder="Select or type medication"
                data={medicationOptions}
                searchable
                error={errors.medications?.[index]?.name?.message}
              />
            )}
          />
          <Controller
            name={`medications.${index}.dosage`}
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Dosage *"
                placeholder="e.g., 500mg"
                error={errors.medications?.[index]?.dosage?.message}
              />
            )}
          />
        </Group>

        <Group grow>
          <Controller
            name={`medications.${index}.frequency`}
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                label="Frequency *"
                placeholder="Select frequency"
                data={FREQUENCY_OPTIONS}
                searchable
                error={errors.medications?.[index]?.frequency?.message}
              />
            )}
          />
          <Controller
            name={`medications.${index}.duration`}
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                label="Duration *"
                placeholder="Select duration"
                data={DURATION_OPTIONS}
                searchable
                error={errors.medications?.[index]?.duration?.message}
              />
            )}
          />
        </Group>

        <Controller
          name={`medications.${index}.instructions`}
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Instructions (Optional)"
              placeholder="e.g., Take with food, Avoid alcohol"
              minRows={2}
              maxRows={4}
              error={errors.medications?.[index]?.instructions?.message}
            />
          )}
        />
      </Stack>
    </Box>
  );
};