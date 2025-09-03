import React from 'react';
import { Box, Image, Group, Title } from '@mantine/core';

interface ClinicLogoProps {
  clinicName: string;
  logoSrc: string;
}

const containerStyles = {
  position: 'absolute' as const,
  top: '24px',
  left: '24px',
  zIndex: 10
};

const groupStyles = {
  textDecoration: 'none'
};

const imageStyles = {
  width: '40px',
  height: '40px',
  objectFit: 'cover' as const,
  borderRadius: '8px'
};

const titleStyles = {
  color: '#0F0F0F',
  fontSize: '18px',
  fontWeight: 600,
  margin: 0,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

export const ClinicLogo: React.FC<ClinicLogoProps> = ({ clinicName, logoSrc }) => {
  const fallbackSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzI1NjNlYiIvPgo8c3ZnIHg9IjEwIiB5PSIxMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHN0cm9rZSBjdXJyZW50Q29sb3I9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNOSAxMmwyIDIgNC00Ii8+CjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiLz4KPC9zdHJva2U+Cjwvc3ZnPgo8L3N2Zz4=";

  return (
    <Box style={containerStyles}>
      <Group gap="md" align="center" style={groupStyles}>
        <Image
          src={logoSrc}
          alt="Logo"
          w={40}
          h={40}
          fit="cover"
          radius="md"
          fallbackSrc={fallbackSrc}
          style={imageStyles}
        />
        <Box>
          <Title order={1} style={titleStyles}>
            {clinicName}
          </Title>
        </Box>
      </Group>
    </Box>
  );
};