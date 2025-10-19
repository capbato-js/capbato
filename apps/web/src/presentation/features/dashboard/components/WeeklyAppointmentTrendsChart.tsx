import React from 'react';
import { Box, Paper } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeeklyAppointmentSummaryDto } from '@nx-starter/application-shared';
import { AppointmentTrendsFilters, type TimeRange, type Granularity } from './AppointmentTrendsFilters';
import dayjs from 'dayjs';

interface WeeklyAppointmentTrendsChartProps {
  data: WeeklyAppointmentSummaryDto[];
  isLoading?: boolean;
  timeRange: TimeRange;
  granularity: Granularity;
  customStartDate?: Date;
  customEndDate?: Date;
  onTimeRangeChange: (range: TimeRange) => void;
  onGranularityChange: (granularity: Granularity) => void;
  onCustomDateChange: (startDate: Date, endDate: Date) => void;
  onRefresh: () => void;
}

export const WeeklyAppointmentTrendsChart: React.FC<WeeklyAppointmentTrendsChartProps> = ({
  data,
  isLoading = false,
  timeRange,
  granularity,
  customStartDate,
  customEndDate,
  onTimeRangeChange,
  onGranularityChange,
  onCustomDateChange,
  onRefresh,
}) => {
  // Format date based on granularity
  const formattedData = data.map(item => ({
    ...item,
    displayDate: formatDateByGranularity(item.date, granularity),
  }));

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        backgroundColor: 'white',
        border: '1px solid #e9ecef'
      }}
    >
      <AppointmentTrendsFilters
        timeRange={timeRange}
        granularity={granularity}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onTimeRangeChange={onTimeRangeChange}
        onGranularityChange={onGranularityChange}
        onCustomDateChange={onCustomDateChange}
        onRefresh={onRefresh}
      />

      {isLoading ? (
        <Box style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading chart data...
        </Box>
      ) : !data || data.length === 0 ? (
        <Box style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#868e96' }}>
          No appointment data available for the selected period
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis
              dataKey="displayDate"
              stroke="#495057"
              style={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#495057"
              style={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: 4
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="totalCount"
              stroke="#228be6"
              strokeWidth={2}
              name="Total Appointments"
              dot={{ fill: '#228be6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="completedCount"
              stroke="#40c057"
              strokeWidth={2}
              name="Completed"
              dot={{ fill: '#40c057', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="cancelledCount"
              stroke="#fa5252"
              strokeWidth={2}
              name="Cancelled"
              dot={{ fill: '#fa5252', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

// Helper function to format date based on granularity
function formatDateByGranularity(dateString: string, granularity: Granularity): string {
  try {
    const date = dayjs(dateString);

    switch (granularity) {
      case 'daily':
        return date.format('MMM D');
      case 'weekly':
        // Show week start date
        return `Week of ${date.format('MMM D')}`;
      case 'monthly':
        return date.format('MMM YYYY');
      default:
        return dateString;
    }
  } catch {
    return dateString;
  }
}
