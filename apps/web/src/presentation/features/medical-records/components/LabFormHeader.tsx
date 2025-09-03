import React from 'react';
import { Box, Center, Stack, Title, Text } from '@mantine/core';

interface LabFormHeaderProps {
  clinicName: string;
  address: string;
  contact: string;
}

const headerStyles = {
  marginBottom: 'lg' as const
};

const titleStyles = {
  fontWeight: 'bold' as const,
  margin: 0
};

const textStyles = {
  margin: 0
};

export const LabFormHeader: React.FC<LabFormHeaderProps> = ({ 
  clinicName, 
  address, 
  contact 
}) => {
  return (
    <Box mb={headerStyles.marginBottom}>
      <Center>
        <Stack gap="xs" align="center">
          <Title order={3} style={titleStyles}>
            {clinicName}
          </Title>
          <Text size="sm" style={textStyles}>
            {address}
          </Text>
          <Text size="sm" style={textStyles}>
            {contact}
          </Text>
        </Stack>
      </Center>
    </Box>
  );
};