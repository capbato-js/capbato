import React from 'react';
import { Box, Group, Title, Button, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { PatientInfo } from '../view-models/useLaboratoryTestsViewModel';

interface LaboratoryTestsPageHeaderProps {
  patientInfo: PatientInfo | null;
  onBackClick: () => void;
}

export const LaboratoryTestsPageHeader: React.FC<LaboratoryTestsPageHeaderProps> = ({
  patientInfo,
  onBackClick
}) => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: `2px solid ${theme.colors.gray[3]}`
      }}
    >
      <Group align="center" gap="lg" mb="md">
        <Button
          variant="filled"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onBackClick}
          size="sm"
          style={{
            fontSize: '14px'
          }}
        >
          Back to Laboratory
        </Button>
        <Title
          order={2}
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0F0F0F',
            margin: 0
          }}
        >
          Lab Tests
        </Title>
      </Group>
      
      {/* Patient Information */}
      {patientInfo && (
        <Box
          style={{
            backgroundColor: theme.colors.blue[0],
            padding: '15px 20px',
            borderRadius: '8px',
            marginTop: '15px'
          }}
        >
          <Group gap="xl">
            <div>
              <strong>Patient #:</strong> {patientInfo.patientNumber}
            </div>
            <div>
              <strong>Patient's Name:</strong> {patientInfo.patientName}
            </div>
          </Group>
        </Box>
      )}
    </Box>
  );
};
