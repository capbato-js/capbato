import React from 'react';
import { Box, Title, Text, Skeleton } from '@mantine/core';

interface LabResultFormHeaderProps {
  clinicName: string;
  address: string;
  phone: string;
  license: string;
  testTitle: string;
  isLoadingData: boolean;
}

const headerStyles = {
  textAlign: 'center' as const
};

const titleStyles = {
  margin: '0',
  fontSize: '20px'
};

const textStyles = {
  margin: '0'
};

const testTitleStyles = {
  margin: '10px 0',
  color: '#cc0000',
  letterSpacing: '3px',
  fontSize: '18px'
};

const skeletonStyles = {
  margin: '10px auto',
  borderRadius: '4px'
};

export const LabResultFormHeader: React.FC<LabResultFormHeaderProps> = ({
  clinicName,
  address,
  phone,
  license,
  testTitle,
  isLoadingData,
}) => {
  return (
    <Box style={headerStyles}>
      <Title order={2} size="h3" style={titleStyles}>
        {clinicName}
      </Title>
      <Text size="sm" style={textStyles}>
        {address}
      </Text>
      <Text size="sm" style={textStyles}>
        {phone}
      </Text>
      <Text size="sm" fw={700} style={textStyles}>
        {license}
      </Text>
      {isLoadingData ? (
        <Skeleton height={24} width={300} style={skeletonStyles} />
      ) : (
        <Title order={3} style={testTitleStyles}>
          {testTitle}
        </Title>
      )}
    </Box>
  );
};