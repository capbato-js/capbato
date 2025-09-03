import React from 'react';
import { Box, Grid } from '@mantine/core';
import { TestCategoryColumn } from './TestCategoryColumn';
import { categorizeTests } from '../utils/labTestFormUtils';

interface TestSelectionGridProps {
  selectedTests: string[];
  onTestSelection: (testId: string, checked: boolean) => void;
  isLoading: boolean;
}

export const TestSelectionGrid: React.FC<TestSelectionGridProps> = ({
  selectedTests,
  onTestSelection,
  isLoading,
}) => {
  const {
    routineTests,
    serologyTests,
    bloodChemistryTests,
    miscellaneousTests,
    thyroidTests,
  } = categorizeTests();

  return (
    <Box>
      <Grid gutter="lg">
        {/* Column 1: BLOOD CHEMISTRY */}
        <Grid.Col span={4}>
          <TestCategoryColumn
            title="BLOOD CHEMISTRY"
            tests={bloodChemistryTests}
            selectedTests={selectedTests}
            onTestSelection={onTestSelection}
            isLoading={isLoading}
          />
        </Grid.Col>

        {/* Column 2: SEROLOGY & IMMUNOLOGY */}
        <Grid.Col span={4}>
          <TestCategoryColumn
            title="SEROLOGY & IMMUNOLOGY"
            tests={serologyTests}
            selectedTests={selectedTests}
            onTestSelection={onTestSelection}
            isLoading={isLoading}
          />
        </Grid.Col>

        {/* Column 3: ROUTINE, THYROID FUNCTION TEST, MISCELLANEOUS TEST */}
        <Grid.Col span={4}>
          <Box mb="lg">
            <TestCategoryColumn
              title="ROUTINE"
              tests={routineTests}
              selectedTests={selectedTests}
              onTestSelection={onTestSelection}
              isLoading={isLoading}
            />
          </Box>

          <Box mb="lg">
            <TestCategoryColumn
              title="THYROID FUNCTION TEST"
              tests={thyroidTests}
              selectedTests={selectedTests}
              onTestSelection={onTestSelection}
              isLoading={isLoading}
            />
          </Box>

          <Box>
            <TestCategoryColumn
              title="MISCELLANEOUS TEST"
              tests={miscellaneousTests}
              selectedTests={selectedTests}
              onTestSelection={onTestSelection}
              isLoading={isLoading}
            />
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
};