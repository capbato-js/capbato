import React from 'react';
import { Box, Group, useMantineTheme } from '@mantine/core';
import { BackButton } from './BackButton';
import { PageTitle } from './PageTitle';

interface PageHeaderProps {
  title: string;
  backButtonText: string;
  onBackClick: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  backButtonText, 
  onBackClick 
}) => {
  const theme = useMantineTheme();

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: `2px solid ${theme.colors.gray[3]}`
  };

  return (
    <Box style={headerStyles}>
      <Group align="center" gap="lg">
        <BackButton onClick={onBackClick} text={backButtonText} />
        <PageTitle title={title} />
      </Group>
    </Box>
  );
};