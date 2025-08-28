import React from 'react';
import { TextInput, TextInputProps } from '@mantine/core';

export interface InputProps extends Omit<TextInputProps, 'ref'> {
  'data-testid'?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <TextInput
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';