import React from 'react';
import { Control, FieldErrors, UseFormRegister, Controller } from 'react-hook-form';
import { Stack, Select } from '@mantine/core';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import type { CreateAccountData } from '../view-models/useEnhancedAccountsViewModel';

interface DoctorProfileFieldsProps {
  control: Control<CreateAccountData>;
  errors: FieldErrors<CreateAccountData>; 
  isLoading: boolean;
  register: UseFormRegister<CreateAccountData>;
}

/**
 * DoctorProfileFields component renders additional fields needed for doctor profiles
 * These fields appear when "Doctor" role is selected during account creation
 */
export const DoctorProfileFields: React.FC<DoctorProfileFieldsProps> = ({
  control,
  errors,
  isLoading,
  register
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
            error={fieldState.error?.message}
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
      
      
      <FormTextInput
        label="License Number"
        placeholder="Enter medical license number"
        error={errors.licenseNumber}
        disabled={isLoading}
        {...register('licenseNumber')}
      />
      
      <FormTextInput
        label="Years of Experience"
        type="number"
        placeholder="Enter years of experience"
        error={errors.experienceYears}
        disabled={isLoading}
        min="0"
        {...register('experienceYears')}
      />
    </Stack>
  );
};
