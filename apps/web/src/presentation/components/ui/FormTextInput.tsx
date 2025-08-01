import React from 'react';
import { TextInput, type TextInputProps } from '@mantine/core';
import type { FieldError } from 'react-hook-form';

interface FormTextInputProps extends Omit<TextInputProps, 'placeholder' | 'error'> {
  /** The default placeholder text to show when there's no error */
  placeholder?: string;
  /** Error object from react-hook-form */
  error?: FieldError | string;
  /** Optional custom error placeholder (defaults to empty string) */
  errorPlaceholder?: string;
}

/**
 * Enhanced TextInput component that automatically handles error-based placeholder switching.
 * When there's an error, the placeholder is hidden (empty string) to avoid visual conflicts
 * with the error message display.
 * 
 * Built on top of Mantine's TextInput component with automatic error handling.
 * 
 * @example
 * ```tsx
 * <FormTextInput
 *   {...register('email')}
 *   label="Email"
 *   placeholder="Enter your email address"
 *   error={errors.email}
 *   leftSection={<IconMail size={18} />}
 * />
 * ```
 */
export const FormTextInput: React.FC<FormTextInputProps> = ({
  placeholder = '',
  error,
  errorPlaceholder = '',
  ...props
}) => {
  // Determine if there's an error message
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : error?.message;
  
  // Use empty placeholder when there's an error, otherwise use the provided placeholder
  const finalPlaceholder = hasError ? errorPlaceholder : placeholder;
  
  return (
    <TextInput
      {...props}
      placeholder={finalPlaceholder}
      error={errorMessage}
    />
  );
};
