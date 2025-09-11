import React from 'react';
import { Box, Text } from '@mantine/core';
import { Icon } from '../../../components/common';

interface ReadOnlyFieldProps {
  label: string;
  value: string;
  icon: string;
  helperText?: string;
  required?: boolean;
}

export const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({
  label,
  value,
  icon,
  helperText,
  required = false
}) => {
  return (
    <Box>
      <Text size="sm" fw={500} mb={8}>
        {label}
        {required && <Text component="span" c="red" ml={4}>*</Text>}
      </Text>
      <Box
        style={{
          padding: '10px 12px',
          border: '1px solid #e9ecef',
          borderRadius: '6px',
          backgroundColor: '#f8f9fa',
          minHeight: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Icon icon={icon} size={16} style={{ color: '#6c757d' }} />
        <Text c="dark" size="sm" fw={500}>
          {value}
        </Text>
      </Box>
      {helperText && (
        <Text size="xs" c="dimmed" mt={4} fs="italic">
          {helperText}
        </Text>
      )}
    </Box>
  );
};