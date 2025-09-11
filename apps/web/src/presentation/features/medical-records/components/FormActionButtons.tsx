import React from 'react';
import { Box, Button } from '@mantine/core';
import { Icon } from '../../../components/common/Icon';

interface FormActionButtonsProps {
  viewMode: boolean;
  isSubmitting: boolean;
  submitButtonText: string;
  onCancel?: () => void;
}

const containerStyles = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center' as const,
  marginTop: '24px'
};

const buttonStyles = {
  minWidth: '100px'
};

export const FormActionButtons: React.FC<FormActionButtonsProps> = ({
  viewMode,
  isSubmitting,
  submitButtonText,
  onCancel,
}) => {
  return (
    <Box style={containerStyles}>
      {onCancel && (
        <Button
          variant="outline"
          onClick={onCancel}
          style={buttonStyles}
          disabled={isSubmitting}
          leftSection={<Icon icon="fas fa-times" size={14} />}
        >
          {viewMode ? 'Close' : 'Cancel'}
        </Button>
      )}
      {!viewMode && (
        <Button
          type="submit"
          style={buttonStyles}
          loading={isSubmitting}
          disabled={isSubmitting}
          leftSection={<Icon icon="fas fa-save" size={14} />}
        >
          {submitButtonText}
        </Button>
      )}
    </Box>
  );
};