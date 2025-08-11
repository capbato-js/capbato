import React from 'react';
import { Control, FieldErrors, UseFormRegister, Controller } from 'react-hook-form';
import { Stack, Select } from '@mantine/core';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { RegisterUserFormData } from '@nx-starter/application-shared';

interface Step2FieldsProps {
  control: Control<RegisterUserFormData>;
  errors: FieldErrors<RegisterUserFormData>; 
  isLoading: boolean;
  register: UseFormRegister<RegisterUserFormData>;
  onInputChange?: () => void;
  fieldErrors?: Record<string, string>;
}

export const Step2Fields: React.FC<Step2FieldsProps> = ({
  control,
  errors,
  isLoading,
  register,
  onInputChange,
  fieldErrors = {}
}) => {
  return (
    <Stack gap="md">
      <Controller
        name="specialization"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Specialization"
            placeholder="Select specialization"
            error={fieldState.error?.message || fieldErrors.specialization}
            data={[
              { value: 'General Practice', label: 'General Practice' },
              { value: 'Internal Medicine', label: 'Internal Medicine' },
              { value: 'Pediatrics', label: 'Pediatrics' },
              { value: 'Cardiology', label: 'Cardiology' },
              { value: 'Dermatology', label: 'Dermatology' },
              { value: 'Orthopedics', label: 'Orthopedics' },
              { value: 'Neurology', label: 'Neurology' },
              { value: 'Surgery', label: 'Surgery' },
              { value: 'Obstetrics and Gynecology', label: 'Obstetrics and Gynecology' },
              { value: 'Psychiatry', label: 'Psychiatry' },
              { value: 'Ophthalmology', label: 'Ophthalmology' },
              { value: 'ENT', label: 'ENT (Ear, Nose, Throat)' }
            ]}
            disabled={isLoading}
            required
            searchable
            {...field}
          />
        )}
      />
      
      <Controller
        name="schedulePattern"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Schedule Pattern"
            placeholder="Select schedule pattern"
            error={fieldState.error?.message || fieldErrors.schedulePattern}
            data={[
              { value: 'MWF', label: 'MWF (Monday, Wednesday, Friday)' },
              { value: 'TTH', label: 'TTH (Tuesday, Thursday)' }
            ]}
            disabled={isLoading}
            description="Choose the days when this doctor will be available"
            {...field}
          />
        )}
      />
      
      <FormTextInput
        label="License Number"
        placeholder="Enter medical license number"
        error={errors.licenseNumber || fieldErrors.licenseNumber}
        disabled={isLoading}
        {...register('licenseNumber')}
        onChange={(e) => {
          register('licenseNumber').onChange(e);
          onInputChange?.();
        }}
      />
      
      <FormTextInput
        label="Years of Experience"
        type="number"
        placeholder="Enter years of experience"
        error={errors.experienceYears || fieldErrors.experienceYears}
        disabled={isLoading}
        min="0"
        {...register('experienceYears')}
        onChange={(e) => {
          register('experienceYears').onChange(e);
          onInputChange?.();
        }}
      />
    </Stack>
  );
};