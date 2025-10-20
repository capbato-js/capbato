import React, { useState } from 'react';
import { Box, Group, Button, Select, Modal } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconRefresh, IconCalendar } from '@tabler/icons-react';

export type TimeRange = '1d' | '3d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'custom';

interface AnalyticsFiltersProps {
  timeRange: TimeRange;
  customStartDate?: Date;
  customEndDate?: Date;
  onTimeRangeChange: (range: TimeRange) => void;
  onCustomDateChange: (startDate: Date, endDate: Date) => void;
  onRefresh: () => void;
  showGranularity?: boolean; // Optional - only for appointment trends
  granularity?: 'daily' | 'weekly' | 'monthly';
  onGranularityChange?: (granularity: 'daily' | 'weekly' | 'monthly') => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  timeRange,
  customStartDate,
  customEndDate,
  onTimeRangeChange,
  onCustomDateChange,
  onRefresh,
  showGranularity = false,
  granularity,
  onGranularityChange,
}) => {
  const [customDateModalOpened, setCustomDateModalOpened] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(customStartDate || null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(customEndDate || null);

  const timeRangeOptions = [
    { value: '1d', label: 'Last 24 hours' },
    { value: '3d', label: 'Last 3 days' },
    { value: '1w', label: 'Last week' },
    { value: '1m', label: 'Last month' },
    { value: '3m', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' },
  ];

  const granularityOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const handleTimeRangeChange = (value: string | null) => {
    if (value === 'custom') {
      setCustomDateModalOpened(true);
    }
    if (value) {
      onTimeRangeChange(value as TimeRange);
    }
  };

  const handleApplyCustomDates = () => {
    if (tempStartDate && tempEndDate) {
      onCustomDateChange(tempStartDate, tempEndDate);
      setCustomDateModalOpened(false);
    }
  };

  return (
    <>
      <Box mb="md">
        <Group justify="space-between">
          <Group>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              data={timeRangeOptions}
              style={{ width: 200 }}
            />

            {showGranularity && granularity && onGranularityChange && (
              <Select
                value={granularity}
                onChange={(value) => onGranularityChange(value as 'daily' | 'weekly' | 'monthly')}
                data={granularityOptions}
                style={{ width: 150 }}
              />
            )}
          </Group>

          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={onRefresh}
            variant="light"
          >
            Refresh
          </Button>
        </Group>
      </Box>

      <Modal
        opened={customDateModalOpened}
        onClose={() => setCustomDateModalOpened(false)}
        title="Select Custom Date Range"
      >
        <DatePickerInput
          label="Start Date"
          value={tempStartDate}
          onChange={setTempStartDate}
          mb="md"
        />
        <DatePickerInput
          label="End Date"
          value={tempEndDate}
          onChange={setTempEndDate}
          mb="md"
        />
        <Group justify="flex-end">
          <Button variant="subtle" onClick={() => setCustomDateModalOpened(false)}>
            Cancel
          </Button>
          <Button onClick={handleApplyCustomDates} disabled={!tempStartDate || !tempEndDate}>
            Apply
          </Button>
        </Group>
      </Modal>
    </>
  );
};
