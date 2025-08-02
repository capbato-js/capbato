import React from 'react';
import { Select, type SelectProps } from '@mantine/core';
import type { FieldError } from 'react-hook-form';

interface FormSelectProps extends Omit<SelectProps, 'placeholder' | 'error'> {
  /** The default placeholder text to show when there's no error */
  placeholder?: string;
  /** Error object from react-hook-form */
  error?: FieldError | string;
  /** Optional custom error placeholder (defaults to empty string) */
  errorPlaceholder?: string;
}

/**
 * Enhanced Select component that automatically handles error-based placeholder switching.
 * When there's an error, the placeholder is hidden (empty string) to avoid visual conflicts
 * with the error message display.
 * 
 * Built on top of Mantine's Select component with automatic error handling and 
 * standard configuration for required, searchable, and clearable behavior.
 * 
 * @example
 * ```tsx
 * <FormSelect
 *   label="Patient Name"
 *   placeholder="Search and select patient"
 *   data={patients}
 *   error={fieldState.error}
 *   leftSection={<Icon icon="fas fa-user" size={16} />}
 *   onChange={field.onChange}
 *   value={field.value}
 * />
 * ```
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  placeholder = '',
  error,
  errorPlaceholder = '',
  required = true,
  searchable = true,
  clearable = true,
  comboboxProps = {
    transitionProps: { duration: 200, transition: 'pop' }
  },
  ...props
}) => {
  // Determine if there's an error message
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : error?.message;
  
  // Use empty placeholder when there's an error, otherwise use the provided placeholder
  const finalPlaceholder = hasError ? errorPlaceholder : placeholder;
  
  return (
    <Select
      {...props}
      placeholder={finalPlaceholder}
      error={errorMessage}
      required={required}
      searchable={searchable}
      clearable={clearable}
      comboboxProps={comboboxProps}
    />
  );
};
