import React from 'react';
import { Box, Button, Group, Title, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { getPageHeaderStyles, PAGE_CONFIG } from '../config/viewLabTestResultConfig';

interface LabTestPageHeaderProps {
  onBack: () => void;
  title?: string;
  backButtonText?: string;
}

export const LabTestPageHeader: React.FC<LabTestPageHeaderProps> = ({
  onBack,
  title = PAGE_CONFIG.title,
  backButtonText = PAGE_CONFIG.backButtonText,
}) => {
  const theme = useMantineTheme();
  const styles = getPageHeaderStyles(theme);

  return (
    <Box style={styles.container}>
      <Group align="center" gap={PAGE_CONFIG.headerGap}>
        <Button
          variant="filled"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onBack}
          size={PAGE_CONFIG.backButtonSize}
          style={styles.backButton}
        >
          {backButtonText}
        </Button>
        <Title
          order={PAGE_CONFIG.titleOrder}
          style={styles.title}
        >
          {title}
        </Title>
      </Group>
    </Box>
  );
};