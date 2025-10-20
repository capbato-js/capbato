import React from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TopVisitReasonDto } from '@nx-starter/application-shared';
import { AnalyticsFilters, type TimeRange } from './AnalyticsFilters';

interface TopVisitReasonsChartProps {
  data: TopVisitReasonDto[];
  isLoading?: boolean;
  timeRange: TimeRange;
  customStartDate?: Date;
  customEndDate?: Date;
  onTimeRangeChange: (range: TimeRange) => void;
  onCustomDateChange: (startDate: Date, endDate: Date) => void;
  onRefresh: () => void;
}

// Simple color scheme for visit reasons
const REASON_COLOR = '#228be6'; // Blue color

export const TopVisitReasonsChart: React.FC<TopVisitReasonsChartProps> = ({
  data,
  isLoading = false,
  timeRange,
  customStartDate,
  customEndDate,
  onTimeRangeChange,
  onCustomDateChange,
  onRefresh,
}) => {
  return (
    <Paper
      p="md"
      radius="md"
      style={{
        backgroundColor: 'white',
        border: '1px solid #e9ecef'
      }}
    >
      <AnalyticsFilters
        timeRange={timeRange}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onTimeRangeChange={onTimeRangeChange}
        onCustomDateChange={onCustomDateChange}
        onRefresh={onRefresh}
      />

      {isLoading ? (
        <Box style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading chart data...
        </Box>
      ) : !data || data.length === 0 ? (
        <Box style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#868e96' }}>
          No visit reason data available for the selected period
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis
              type="number"
              stroke="#495057"
              style={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="reason"
              stroke="#495057"
              style={{ fontSize: 12 }}
              width={200}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: 4
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} appointments (${props.payload.percentage}%)`,
                'Count'
              ]}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar
              dataKey="count"
              fill={REASON_COLOR}
              radius={[0, 4, 4, 0]}
              name="Visit Count"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};
