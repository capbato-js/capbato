import React from 'react';
import { Box, Text } from '@mantine/core';
import { formatTestPrice, calculateTotalPrice } from '../constants/labTestConstants';

interface TotalPriceDisplayProps {
  selectedTests: string[];
}

const containerStyles = {
  alignSelf: 'center' as const
};

export const TotalPriceDisplay: React.FC<TotalPriceDisplayProps> = ({ selectedTests }) => {
  if (selectedTests.length === 0) return null;

  return (
    <Box style={containerStyles}>
      <Text size="lg" fw={500} ta="center">
        Total: {formatTestPrice(calculateTotalPrice(selectedTests))}
      </Text>
    </Box>
  );
};