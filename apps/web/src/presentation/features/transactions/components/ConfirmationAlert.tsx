import React from 'react';
import { Alert } from '@mantine/core';
import { Icon } from '../../../components/common';

interface ConfirmationAlertProps {
  title?: string;
  message: string;
  color?: string;
  icon?: string;
}

export const ConfirmationAlert: React.FC<ConfirmationAlertProps> = ({
  title = "Warning",
  message,
  color = "red",
  icon = "fas fa-exclamation-triangle"
}) => {
  return (
    <Alert
      variant="light"
      color={color}
      icon={<Icon icon={icon} />}
      title={title}
    >
      {message}
    </Alert>
  );
};