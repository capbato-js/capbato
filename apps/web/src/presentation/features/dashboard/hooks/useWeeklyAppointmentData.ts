import { useState, useEffect, useCallback } from 'react';
import { container } from '../../../../infrastructure/di/container';
import { AppointmentApiService } from '../../../../infrastructure/api/AppointmentApiService';
import { WeeklyAppointmentSummaryDto } from '@nx-starter/application-shared';
import type { TimeRange, Granularity } from '../components';
import dayjs from 'dayjs';

export const useWeeklyAppointmentData = () => {
  const [weeklyData, setWeeklyData] = useState<WeeklyAppointmentSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default: Last 3 months, weekly granularity
  const [timeRange, setTimeRange] = useState<TimeRange>('3m');
  const [granularity, setGranularity] = useState<Granularity>('weekly');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  // Calculate date range based on time range selection
  const calculateDateRange = useCallback((range: TimeRange): { startDate: string; endDate: string } => {
    const end = dayjs();
    let start: dayjs.Dayjs;

    switch (range) {
      case '1d':
        start = end.subtract(1, 'day');
        break;
      case '3d':
        start = end.subtract(3, 'days');
        break;
      case '1w':
        start = end.subtract(1, 'week');
        break;
      case '1m':
        start = end.subtract(1, 'month');
        break;
      case '3m':
        start = end.subtract(3, 'months');
        break;
      case '6m':
        start = end.subtract(6, 'months');
        break;
      case '1y':
        start = end.subtract(1, 'year');
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            startDate: dayjs(customStartDate).format('YYYY-MM-DD'),
            endDate: dayjs(customEndDate).format('YYYY-MM-DD'),
          };
        }
        start = end.subtract(3, 'months'); // fallback
        break;
      default:
        start = end.subtract(3, 'months');
    }

    return {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
    };
  }, [customStartDate, customEndDate]);

  // Auto-adjust granularity based on time range (with override capability)
  const autoAdjustGranularity = (range: TimeRange): Granularity => {
    switch (range) {
      case '1d':
      case '3d':
        return 'daily';
      case '1w':
      case '1m':
        return 'daily';
      case '3m':
      case '6m':
        return 'weekly';
      case '1y':
        return 'monthly';
      default:
        return 'weekly';
    }
  };

  const fetchWeeklyData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { startDate, endDate } = calculateDateRange(timeRange);
      const appointmentService = container.resolve(AppointmentApiService);
      const data = await appointmentService.getWeeklyAppointmentSummary(
        startDate,
        endDate,
        granularity
      );

      setWeeklyData(data);
    } catch (err) {
      console.error('Failed to fetch weekly appointment data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weekly data');
      setWeeklyData([]);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, granularity, calculateDateRange]);

  useEffect(() => {
    fetchWeeklyData();
  }, [fetchWeeklyData]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    // Auto-adjust granularity
    const suggestedGranularity = autoAdjustGranularity(range);
    setGranularity(suggestedGranularity);
  };

  const handleGranularityChange = (newGranularity: Granularity) => {
    setGranularity(newGranularity);
  };

  const handleCustomDateChange = (startDate: Date, endDate: Date) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  const handleRefresh = () => {
    fetchWeeklyData();
  };

  return {
    weeklyData,
    isLoading,
    error,
    timeRange,
    granularity,
    customStartDate,
    customEndDate,
    handleTimeRangeChange,
    handleGranularityChange,
    handleCustomDateChange,
    handleRefresh,
  };
};
