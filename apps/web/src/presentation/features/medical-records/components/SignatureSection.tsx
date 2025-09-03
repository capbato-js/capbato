import React from 'react';
import { Box, Text } from '@mantine/core';

interface SignatureSectionProps {
  technologist: {
    name: string;
    license: string;
    title: string;
  };
  pathologist: {
    name: string;
    license: string;
    title: string;
  };
}

const sectionStyles = {
  display: 'flex',
  justifyContent: 'space-between' as const,
  marginTop: '20px',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  textAlign: 'center' as const
};

export const SignatureSection: React.FC<SignatureSectionProps> = ({
  technologist,
  pathologist,
}) => {
  return (
    <Box style={sectionStyles}>
      <Box>
        <Text size="sm" fw={700}>{technologist.name} {technologist.license}</Text>
        <Text size="sm" fw={700}>{technologist.title}</Text>
      </Box>
      <Box>
        <Text size="sm" fw={700}>{pathologist.name} {pathologist.license}</Text>
        <Text size="sm" fw={700}>{pathologist.title}</Text>
      </Box>
    </Box>
  );
};