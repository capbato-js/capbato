import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Track scroll position to restore after data fetch
  const scrollPositionRef = useRef<number>(0);

  // Calculate date range based on time range selection
  const calculateDateRange = (range: TimeRange): { startDate: string; endDate: string } => {
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
  };

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

  const fetchWeeklyData = useCallback(async (preserveScroll = false) => {
    try {
      // Save scroll position before loading
      if (preserveScroll && typeof window !== 'undefined') {
        scrollPositionRef.current = window.scrollY;
      }

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

      // Restore scroll position after data loads
      if (preserveScroll && typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
      }
    } catch (err) {
      console.error('Failed to fetch weekly appointment data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weekly data');
      setWeeklyData([]);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, granularity, customStartDate, customEndDate]);

  useEffect(() => {
    fetchWeeklyData();
  }, [timeRange, customStartDate, customEndDate]); // Only refetch on time range or custom date changes, NOT on granularity

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    // Auto-adjust granularity
    const suggestedGranularity = autoAdjustGranularity(range);
    setGranularity(suggestedGranularity);
  };

  const handleGranularityChange = (newGranularity: Granularity) => {
    setGranularity(newGranularity);
    // Fetch with scroll preservation
    setTimeout(() => fetchWeeklyData(true), 0);
  };

  const handleCustomDateChange = (startDate: Date, endDate: Date) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  const handleRefresh = () => {
    fetchWeeklyData(true); // Preserve scroll on manual refresh too
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
