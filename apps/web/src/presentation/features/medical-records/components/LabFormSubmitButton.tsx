import React from 'react';
import { Box, Button } from '@mantine/core';
import { Icon } from '../../../components/common';

interface LabFormSubmitButtonProps {
  isFormEmpty: boolean;
  isLoading: boolean;
}

const containerStyles = {
  alignSelf: 'center' as const
};

const iconStyles = {
  marginRight: '8px'
};

export const LabFormSubmitButton: React.FC<LabFormSubmitButtonProps> = ({ 
  isFormEmpty, 
  isLoading 
}) => {
  return (
    <Box style={containerStyles}>
      <Button
        type="submit"
        disabled={isFormEmpty || isLoading}
        loading={isLoading}
        size="md"
        mt="lg"
      >
        <Icon icon="fas fa-paper-plane" style={iconStyles} />
        Submit Request
      </Button>
    </Box>
  );
};