import React, { useState } from 'react';
import { Group, Button, Select, Modal, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconRefresh } from '@tabler/icons-react';
import dayjs from 'dayjs';

export type TimeRange = '1d' | '3d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'custom';
export type Granularity = 'daily' | 'weekly' | 'monthly';

interface AppointmentTrendsFiltersProps {
  timeRange: TimeRange;
  granularity: Granularity;
  customStartDate?: Date;
  customEndDate?: Date;
  onTimeRangeChange: (range: TimeRange) => void;
  onGranularityChange: (granularity: Granularity) => void;
  onCustomDateChange: (startDate: Date, endDate: Date) => void;
  onRefresh: () => void;
}

export const AppointmentTrendsFilters: React.FC<AppointmentTrendsFiltersProps> = ({
  timeRange,
  granularity,
  customStartDate,
  customEndDate,
  onTimeRangeChange,
  onGranularityChange,
  onCustomDateChange,
  onRefresh,
}) => {
  const [customModalOpened, setCustomModalOpened] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(customStartDate || dayjs().subtract(3, 'months').toDate());
  const [tempEndDate, setTempEndDate] = useState<Date | null>(customEndDate || new Date());

  const handleTimeRangeClick = (range: TimeRange) => {
    if (range === 'custom') {
      setCustomModalOpened(true);
    } else {
      onTimeRangeChange(range);
    }
  };

  const handleApplyCustomDate = () => {
    if (tempStartDate && tempEndDate) {
      onCustomDateChange(tempStartDate, tempEndDate);
      onTimeRangeChange('custom');
      setCustomModalOpened(false);
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
          <Select
            label="Granularity"
            value={granularity}
            onChange={(value) => {
              if (value) onGranularityChange(value as Granularity);
            }}
            data={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ]}
            size="sm"
            style={{ width: 120 }}
            comboboxProps={{
              withinPortal: true,
              position: 'bottom-start'
            }}
          />

          <Button
            size="sm"
            variant="light"
            onClick={onRefresh}
            leftSection={<IconRefresh size={16} />}
            mt={20}
          >
            Refresh
          </Button>
        </Group>
      </Group>

      {/* Custom Date Range Modal */}
      <Modal
        opened={customModalOpened}
        onClose={() => setCustomModalOpened(false)}
        title="Select Custom Date Range"
        size="md"
      >
        <Stack gap="md">
          <DatePickerInput
            label="Start Date"
            placeholder="Pick start date"
            value={tempStartDate}
            onChange={setTempStartDate}
            maxDate={tempEndDate || undefined}
          />

          <DatePickerInput
            label="End Date"
            placeholder="Pick end date"
            value={tempEndDate}
            onChange={setTempEndDate}
            minDate={tempStartDate || undefined}
            maxDate={new Date()}
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={() => setCustomModalOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyCustomDate} disabled={!tempStartDate || !tempEndDate}>
              Apply
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
