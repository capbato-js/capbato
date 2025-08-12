import React from 'react';
import { Control, FieldErrors, UseFormRegister, Controller, UseFormSetValue, UseFormWatch, UseFormTrigger } from 'react-hook-form';
import { Stack, Select, Group } from '@mantine/core';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { NameFormattingService } from '@nx-starter/domain';
import { UpdateUserDetailsFormData } from '@nx-starter/application-shared';

interface UpdateStep1FieldsProps {
  control: Control<UpdateUserDetailsFormData>;
  errors: FieldErrors<UpdateUserDetailsFormData>; 
  isLoading: boolean;
  register: UseFormRegister<UpdateUserDetailsFormData>;
  setValue: UseFormSetValue<UpdateUserDetailsFormData>;
  watch: UseFormWatch<UpdateUserDetailsFormData>;
  trigger: UseFormTrigger<UpdateUserDetailsFormData>;
  onInputChange?: () => void;
  fieldErrors?: Record<string, string>;
}

export const UpdateStep1Fields: React.FC<UpdateStep1FieldsProps> = ({
  control,
  errors,
  isLoading,
  register,
  setValue,
  watch,
  trigger,
  onInputChange,
  fieldErrors = {}
}) => {
  
  // Handle name field formatting on blur
  const handleNameFieldBlur = async (fieldName: 'firstName' | 'lastName') => {
    const currentValue = watch(fieldName);
    if (currentValue && typeof currentValue === 'string') {
      const formattedValue = NameFormattingService.formatToProperCase(currentValue);
      if (formattedValue !== currentValue) {
        setValue(fieldName, formattedValue);
      }
    }
    await trigger(fieldName);
  };
  
  return (
    <Stack gap="md">
      <Group grow>
        <FormTextInput
          label="First Name"
          placeholder="Enter first name"
          error={errors.firstName || fieldErrors.firstName}
          disabled={isLoading}
          required
          {...register('firstName', {
            onBlur: () => handleNameFieldBlur('firstName')
          })}
          onChange={(e) => {
            register('firstName').onChange(e);
            onInputChange?.();
          }}
        />
        
        <FormTextInput
          label="Last Name"
          placeholder="Enter last name"
          error={errors.lastName || fieldErrors.lastName}
          disabled={isLoading}
          required
          {...register('lastName', {
            onBlur: () => handleNameFieldBlur('lastName')
          })}
          onChange={(e) => {
            register('lastName').onChange(e);
            onInputChange?.();
          }}
        />
      </Group>
      
      <FormTextInput
        label="Email"
        type="email"
        placeholder="Enter email"
        error={errors.email || fieldErrors.email}
        disabled={isLoading}
        required
        {...register('email')}
        onChange={(e) => {
          register('email').onChange(e);
          onInputChange?.();
        }}
      />
      
      <FormTextInput
        label="Mobile Number"
        placeholder="09XXXXXXXXX"
        error={errors.mobile || fieldErrors.mobile}
        maxLength={11}
        disabled={isLoading}
        {...register('mobile')}
        onChange={(e) => {
          register('mobile').onChange(e);
          onInputChange?.();
        }}
      />
      
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Role"
            placeholder="Select role"
            error={fieldState.error?.message || fieldErrors.role}
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'receptionist', label: 'Receptionist' },
              { value: 'doctor', label: 'Doctor' }
            ]}
            disabled={isLoading}
            required
            {...field}
          />
        )}
      />
    </Stack>
  );
};