import React from 'react';
import { FormTextInput } from '../../../components/ui/FormTextInput';
import { Checkbox, Group, Stack } from '@mantine/core';
import { IconUser, IconLock } from '@tabler/icons-react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { LoginFormData } from '../types';

interface LoginFormFieldsProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  watch: UseFormWatch<LoginFormData>;
  setValue: UseFormSetValue<LoginFormData>;
  isSubmitting: boolean;
  onInputChange: () => void;
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  register,
  errors,
  watch,
  setValue,
  isSubmitting,
  onInputChange,
}) => {
  return (
    <Stack gap="md">
      {/* Username/Email Field */}
      <FormTextInput
        {...register('identifier')}
        type="text"
        label="Username or Email"
        placeholder="Enter your username or email"
        leftSection={<IconUser size={18} />}
        disabled={isSubmitting}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          register('identifier').onChange(e);
          onInputChange();
        }}
        error={errors.identifier}
        data-testid="login-identifier-input"
      />

      {/* Password Field */}
      <FormTextInput
        {...register('password')}
        type="password"
        label="Password"
        placeholder="Enter your password"
        leftSection={<IconLock size={18} />}
        disabled={isSubmitting}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          register('password').onChange(e);
          onInputChange();
        }}
        error={errors.password}
        data-testid="login-password-input"
      />

      {/* Remember Me Checkbox */}
      <Group mt="sm">
        <Checkbox
          checked={watch('rememberMe')}
          onChange={(event) => setValue('rememberMe', event.currentTarget.checked)}
          label="Remember Me"
          disabled={isSubmitting}
          data-testid="login-remember-me-checkbox"
        />
      </Group>
    </Stack>
  );
};