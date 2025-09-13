import React from 'react';
import { Box, Button, Group, Title, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { addPatientPageTestIds } from '@nx-starter/utils-core';

interface PatientPageHeaderProps {
  title: string;
  onBack: () => void;
}

export const PatientPageHeader: React.FC<PatientPageHeaderProps> = ({
  title,
  onBack
}) => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: `2px solid ${theme.colors.gray[3]}`
      }}
    >
      <Group align="center" gap="lg">
        <Button
          variant="filled"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onBack}
          size="sm"
          data-testid={addPatientPageTestIds.backButton}
          style={{
            fontSize: '14px'
          }}
        >
          Back to Patients
        </Button>
        <Title
          order={2}
          data-testid={addPatientPageTestIds.pageTitle}
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0F0F0F',
            margin: 0
          }}
        >
          {title}
        </Title>
      </Group>
    </Box>
  );
};