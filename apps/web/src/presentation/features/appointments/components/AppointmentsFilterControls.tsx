import React from 'react';
import { Box, Text, Group, Checkbox } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Icon } from '../../../components/common';

interface AppointmentsFilterControlsProps {
  selectedDate: Date;
  onDateChange: (value: string | null) => void;
  showAll: boolean;
  onShowAllChange: (checked: boolean) => void;
}

export const AppointmentsFilterControls: React.FC<AppointmentsFilterControlsProps> = ({
  selectedDate,
  onDateChange,
  showAll,
  onShowAllChange
}) => {
  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
        marginBottom: '15px',
        flexWrap: 'wrap'
      }}
    >
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <Text
          style={{
            fontWeight: 600,
            color: '#0b4f6c',
            fontSize: '14px'
          }}
        >
          Select Date:
        </Text>
        <DateInput
          value={selectedDate.toISOString().split('T')[0]}
          onChange={onDateChange}
          placeholder="Enter date"
          size="sm"
          valueFormat="MMM D, YYYY"
          leftSection={<Icon icon="fas fa-calendar" size={14} />}
          style={{ width: '140px' }}
        />
      </Box>
      
      <Group gap="xs">
        <Checkbox
          checked={showAll}
          onChange={(event) => onShowAllChange(event.currentTarget.checked)}
          style={{
            input: {
              width: '18px',
              height: '18px',
              accentColor: '#4db6ac',
              cursor: 'pointer'
            }
          }}
        />
        <Text
          style={{
            fontWeight: 600,
            color: showAll ? '#4db6ac' : '#0b4f6c',
            fontSize: '14px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={() => onShowAllChange(!showAll)}
        >
          Show All
        </Text>
      </Group>
    </Box>
  );
};
