import React from 'react';

interface FormErrorMessageProps {
  error: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div 
      className="text-red-600 text-sm mb-4 text-center"
      data-testid="add-appointment-error"
    >
      {error}
    </div>
  );
};