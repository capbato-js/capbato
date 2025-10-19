import React from 'react';
import { Box, Stack, Title, Checkbox } from '@mantine/core';
import { formatTestLabel } from '../constants/labTestConstants';
import { isFeatureEnabled } from '../../../../infrastructure/config/ConfigProvider';

interface TestCategoryColumnProps {
  title: string;
  tests: Array<{ id: string; name: string; price?: number; disabled?: boolean; disabledReason?: string }>;
  selectedTests: string[];
  onTestSelection: (testId: string, checked: boolean) => void;
  isLoading: boolean;
}

const titleStyles = {
  textDecoration: 'underline' as const,
  fontSize: '16px'
};

export const TestCategoryColumn: React.FC<TestCategoryColumnProps> = ({
  title,
  tests,
  selectedTests,
  onTestSelection,
  isLoading,
}) => {
  // Check if the feature to disable unsupported lab tests is enabled
  const shouldDisableUnsupportedTests = isFeatureEnabled('disableUnsupportedLabTests');

  return (
    <Box>
      <Title order={5} mb="sm" style={titleStyles}>
        {title}
      </Title>
      <Stack gap="xs">
        {tests.map((test) => {
          // Only apply test.disabled if the feature flag is enabled
          const isTestDisabled = isLoading || (shouldDisableUnsupportedTests && test.disabled);

          return (
            <Checkbox
              key={test.id}
              label={formatTestLabel(test.name, test.price)}
              checked={selectedTests.includes(test.id)}
              onChange={(event) => onTestSelection(test.id, event.currentTarget.checked)}
              disabled={isTestDisabled}
              size="sm"
              title={shouldDisableUnsupportedTests && test.disabled ? test.disabledReason : undefined}
            />
          );
        })}
      </Stack>
    </Box>
  );
};