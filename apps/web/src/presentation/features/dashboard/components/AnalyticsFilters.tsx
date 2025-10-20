import React, { useState } from 'react';
import { Group, Button, Select, Modal, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconRefresh, IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';

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
  const [tempStartDate, setTempStartDate] = useState<Date | null>(customStartDate || dayjs().subtract(3, 'months').toDate());
  const [tempEndDate, setTempEndDate] = useState<Date | null>(customEndDate || new Date());

  const handleTimeRangeClick = (range: TimeRange) => {
    if (range === 'custom') {
      setCustomDateModalOpened(true);
    } else {
      onTimeRangeChange(range);
    }
  };

  const handleApplyCustomDates = () => {
    if (tempStartDate && tempEndDate) {
      onCustomDateChange(tempStartDate, tempEndDate);
      onTimeRangeChange('custom');
      setCustomDateModalOpened(false);
    }
  };

  const timeRangeButtons: { value: TimeRange; label: string }[] = [
    { value: '1d', label: '1d' },
    { value: '3d', label: '3d' },
    { value: '1w', label: '1w' },
    { value: '1m', label: '1m' },
    { value: '3m', label: '3m' },
    { value: '6m', label: '6m' },
    { value: '1y', label: '1y' },
    { value: 'custom', label: 'Custom' },
  ];

  const granularityOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          {timeRangeButtons.map((btn) => (
            <Button
              key={btn.value}
              size="sm"
              variant={timeRange === btn.value ? 'filled' : 'light'}
              onClick={() => handleTimeRangeClick(btn.value)}
              leftSection={btn.value === 'custom' ? <IconCalendar size={16} /> : undefined}
            >
              {btn.label}
            </Button>
          ))}
        </Group>

        <Group gap="md">
          {showGranularity && granularity && onGranularityChange && (
            <Select
              label="Granularity"
              value={granularity}
              onChange={(value) => {
                if (value) onGranularityChange(value as 'daily' | 'weekly' | 'monthly');
              }}
              data={granularityOptions}
              size="sm"
              style={{ width: 120 }}
              comboboxProps={{
                withinPortal: true,
                position: 'bottom-start'
              }}
            />
          )}

          <Button
            size="sm"
            variant="light"
            onClick={onRefresh}
            leftSection={<IconRefresh size={16} />}
            mt={showGranularity ? 20 : 0}
          >
            Refresh
          </Button>
        </Group>
      </Group>

      {/* Custom Date Range Modal */}
      <Modal
        opened={customDateModalOpened}
        onClose={() => setCustomDateModalOpened(false)}
        title="Select Custom Date Range"
        size="md"
      >
        <Stack gap="md">
          <DatePickerInput
            label="Start Date"
            placeholder="Pick start date"
            value={tempStartDate}
            onChange={(value: Date | null) => setTempStartDate(value)}
            maxDate={tempEndDate || undefined}
          />

          <DatePickerInput
            label="End Date"
            placeholder="Pick end date"
            value={tempEndDate}
            onChange={(value: Date | null) => setTempEndDate(value)}
            minDate={tempStartDate || undefined}
            maxDate={new Date()}
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={() => setCustomDateModalOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyCustomDates} disabled={!tempStartDate || !tempEndDate}>
              Apply
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
