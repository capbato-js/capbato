import * as React from 'react';

import { cn } from '../../../lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean;
  valid?: boolean;
}

function Input({ className, type, error, valid, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styling to match legacy form inputs
        'w-full px-2 py-2 text-sm font-normal',
        'border border-gray-300 rounded-md',
        'bg-white text-gray-900',
        'box-border',
        // Focus state - matches legacy #17A589 (teal color)
        'focus:outline-none',
        error ? 'border-red-600 focus:border-red-600' : 
        valid ? 'border-green-600 focus:border-green-600' : 'focus:border-primary',
        // Disabled state
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // File input styling
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        // Placeholder styling
        'placeholder:text-muted-foreground',
        // Selection styling
        'selection:bg-primary selection:text-primary-foreground',
        // Dark mode support
        'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
        error ? 'dark:focus:border-red-600' : 
        valid ? 'dark:focus:border-green-600' : 'dark:focus:border-primary',
        className
      )}
      {...props}
    />
  );
}

export { Input };
