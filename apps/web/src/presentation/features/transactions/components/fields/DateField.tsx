import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { DateInput } from '@mantine/dates';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { Icon } from '../../../../components/common';

interface DateFieldProps {
  control: Control<AddTransactionFormData>;
  errors: FieldErrors<AddTransactionFormData>;
}

export const DateField: React.FC<DateFieldProps> = ({ control, errors }) => {
  return (
    <Controller
      name="date"
      control={control}
      render={({ field }) => (
        <DateInput
          {...field}
          label="Date"
          placeholder="Select date"
          value={field.value ? new Date(field.value) : null}
          onChange={(date) => {
            if (date) {
              const dateObj = date instanceof Date ? date : new Date(date);
              
              if (!isNaN(dateObj.getTime())) {
                field.onChange(dateObj.toISOString().split('T')[0]);
              } else {
                field.onChange('');
              }
            } else {
              field.onChange('');
            }
          }}
          maxDate={new Date()}
          error={errors.date?.message}
          required
          leftSection={<Icon icon="fas fa-calendar" />}
        />
      )}
    />
  );
};