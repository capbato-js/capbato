import React from 'react';
import { Alert } from '@mantine/core';

interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <Alert 
      color="red" 
      title="Error"
      mb="md"
      withCloseButton
      onClose={onClose}
    >
      {error}
    </Alert>
  );
};