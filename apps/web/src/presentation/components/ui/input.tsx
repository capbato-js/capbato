import * as React from 'react';

import { cn } from '../../../lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
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
        'focus:outline-none focus:border-primary',
        // Valid state - green border
        'data-[valid=true]:border-green-600',
        // Error state - red border  
        'data-[invalid=true]:border-red-600 aria-invalid:border-red-600',
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
        'dark:focus:border-primary',
        className
      )}
      {...props}
    />
  );
}

export { Input };
