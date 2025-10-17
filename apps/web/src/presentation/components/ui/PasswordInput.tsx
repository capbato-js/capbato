import React, { useState } from 'react';
import { ActionIcon, TextInput, type TextInputProps } from '@mantine/core';
import type { FieldError } from 'react-hook-form';
import { Icon } from '../common';

interface PasswordInputProps extends Omit<TextInputProps, 'placeholder' | 'error' | 'type' | 'rightSection'> {
  /** The default placeholder text to show when there's no error */
  placeholder?: string;
  /** Error object from react-hook-form */
  error?: FieldError | string;
  /** Optional custom error placeholder (defaults to empty string) */
  errorPlaceholder?: string;
  /** Whether the password should be visible by default */
  defaultVisible?: boolean;
}

/**
 * Enhanced Password Input component with visibility toggle.
 * Automatically handles error-based placeholder switching and includes an eye icon
 * to toggle password visibility.
 * 
 * Built on top of Mantine's TextInput component with automatic error handling.
 * 
 * @example
 * ```tsx
 * <PasswordInput
 *   {...register('password')}
 *   label="Password"
 *   placeholder="Enter your password"
 *   error={errors.password}
 *   leftSection={<IconLock size={18} />}
 * />
 * ```
 */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({
  placeholder = '',
  error,
  errorPlaceholder = '',
  defaultVisible = false,
  ...props
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(defaultVisible);

  // Determine if there's an error message
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : error?.message;
  
  // Use empty placeholder when there's an error, otherwise use the provided placeholder
  const finalPlaceholder = hasError ? errorPlaceholder : placeholder;

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  return (
    <TextInput
      ref={ref}
      {...props}
      type={isPasswordVisible ? 'text' : 'password'}
      placeholder={finalPlaceholder}
      error={errorMessage}
      rightSection={
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={togglePasswordVisibility}
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          size="sm"
        >
          <Icon
            icon={isPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'}
            size={16}
          />
        </ActionIcon>
      }
    />
  );
});

PasswordInput.displayName = 'PasswordInput';