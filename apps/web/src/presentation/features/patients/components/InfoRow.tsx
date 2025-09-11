import React from 'react';
import { Text } from '@mantine/core';

interface InfoRowProps {
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
  isRequired?: boolean;
}

export const InfoRow: React.FC<InfoRowProps> = ({ 
  label, 
  value, 
  fallback, 
  isRequired = false 
}) => {
  const displayValue = (() => {
    // Handle null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
      if (fallback) return fallback;
      if (isRequired) return <Text component="span" c="red" style={{ fontStyle: 'italic' }}>Required</Text>;
      return <Text component="span" c="dimmed" style={{ fontStyle: 'italic' }}>N/A</Text>;
    }
    
    // Handle valid values
    return String(value);
  })();

  return (
    <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
      <strong>{label}:</strong> {typeof displayValue === 'string' ? ` ${displayValue}` : <> {displayValue}</>}
    </Text>
  );
};