import React from 'react';
import { Box, Stack, Title, Checkbox } from '@mantine/core';
import { formatTestLabel } from '../constants/labTestConstants';

interface TestCategoryColumnProps {
  title: string;
  tests: Array<{ id: string; name: string; price: number }>;
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
  return (
    <Box>
      <Title order={5} mb="sm" style={titleStyles}>
        {title}
      </Title>
      <Stack gap="xs">
        {tests.map((test) => (
          <Checkbox
            key={test.id}
            label={formatTestLabel(test.name, test.price)}
            checked={selectedTests.includes(test.id)}
            onChange={(event) => onTestSelection(test.id, event.currentTarget.checked)}
            disabled={isLoading}
            size="sm"
          />
        ))}
      </Stack>
    </Box>
  );
};