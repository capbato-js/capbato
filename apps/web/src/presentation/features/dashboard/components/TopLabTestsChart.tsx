import React from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TopLabTestDto } from '@nx-starter/application-shared';
import { AnalyticsFilters, type TimeRange } from './AnalyticsFilters';

interface TopLabTestsChartProps {
  data: TopLabTestDto[];
  isLoading?: boolean;
  timeRange: TimeRange;
  customStartDate?: Date;
  customEndDate?: Date;
  onTimeRangeChange: (range: TimeRange) => void;
  onCustomDateChange: (startDate: Date, endDate: Date) => void;
  onRefresh: () => void;
}

// Color mapping by category
const categoryColors: Record<string, string> = {
  'Routine': '#228be6',
  'Serology': '#fa5252',
  'Blood Chemistry': '#40c057',
  'Thyroid': '#fd7e14',
  'Coagulation': '#be4bdb',
  'Miscellaneous': '#868e96',
};

export const TopLabTestsChart: React.FC<TopLabTestsChartProps> = ({
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
          No lab test data available for the selected period
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
              dataKey="testName"
              stroke="#495057"
              style={{ fontSize: 12 }}
              width={140}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: 4
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} requests (${props.payload.percentage}%)`,
                'Count'
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
              payload={Object.entries(categoryColors).map(([category, color]) => ({
                value: category,
                type: 'square' as const,
                color: color,
              }))}
            />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={categoryColors[entry.category] || '#868e96'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};
