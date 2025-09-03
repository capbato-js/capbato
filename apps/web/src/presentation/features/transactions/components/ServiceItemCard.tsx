import React from 'react';
import { Controller, Control, FieldErrors, UseFormWatch } from 'react-hook-form';
import { Box, Group, Text, Stack, ActionIcon, Textarea, NumberInput } from '@mantine/core';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { FormSelect } from '../../../components/ui/FormSelect';
import { Icon } from '../../../components/common';
import { getServiceOptions } from '../config/receiptFormConfig';
import { calculateSubtotal } from '../utils/receiptCalculations';

interface ServiceItemCardProps {
  control: Control<AddTransactionFormData>;
  errors: FieldErrors<AddTransactionFormData>;
  watch: UseFormWatch<AddTransactionFormData>;
  index: number;
  fieldId: string;
  canRemove: boolean;
  onRemove: () => void;
}

export const ServiceItemCard: React.FC<ServiceItemCardProps> = ({
  control,
  errors,
  watch,
  index,
  fieldId,
  canRemove,
  onRemove,
}) => {
  const serviceOptions = getServiceOptions();

  return (
    <Box key={fieldId} p="md" style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Group justify="space-between" align="center" mb="sm">
        <Text size="sm" fw={500}>Item {index + 1}</Text>
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
        <Controller
          name={`items.${index}.serviceName`}
          control={control}
          render={({ field }) => (
            <FormSelect
              {...field}
              label="Service/Item Name"
              placeholder="Select or type service"
              data={serviceOptions}
              searchable
              error={errors.items?.[index]?.serviceName?.message}
            />
          )}
        />

        <Controller
          name={`items.${index}.description`}
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Description (Optional)"
              placeholder="Additional details about the service..."
              minRows={2}
              maxRows={3}
              error={errors.items?.[index]?.description?.message}
            />
          )}
        />

        <Group grow>
          <Controller
            name={`items.${index}.quantity`}
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Quantity"
                placeholder="1"
                min={1}
                max={999}
                value={field.value}
                onChange={(value) => field.onChange(Number(value) || 1)}
                error={errors.items?.[index]?.quantity?.message}
                required
              />
            )}
          />
          <Controller
            name={`items.${index}.unitPrice`}
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Unit Price"
                placeholder="0.00"
                min={0}
                max={999999}
                decimalScale={2}
                fixedDecimalScale
                prefix="₱"
                value={field.value || undefined}
                onChange={(value) => field.onChange(Number(value) || 0)}
                error={errors.items?.[index]?.unitPrice?.message}
              />
            )}
          />
        </Group>

        {/* Subtotal Display */}
        <Box>
          <Text size="sm" fw={500}>
            Subtotal: ₱{calculateSubtotal(
              watch(`items.${index}.quantity`) || 0, 
              watch(`items.${index}.unitPrice`) || 0
            ).toFixed(2)}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};