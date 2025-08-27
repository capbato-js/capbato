import React from 'react';
import { Box, Text, Group, Checkbox, useMantineTheme } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Icon } from '../../../components/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Configure dayjs plugins for timezone handling
dayjs.extend(utc);
dayjs.extend(timezone);

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
  const theme = useMantineTheme();
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
            color: theme.colors.blue[9],
            fontSize: '14px'
          }}
        >
          Select Date:
        </Text>
        <DateInput
          value={dayjs(selectedDate).tz('Asia/Manila').format('YYYY-MM-DD')}
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
              cursor: 'pointer'
            }
          }}
        />
        <Text
          style={{
            fontWeight: 600,
            color: showAll ? theme.colors.blue[7] : theme.colors.blue[9],
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
