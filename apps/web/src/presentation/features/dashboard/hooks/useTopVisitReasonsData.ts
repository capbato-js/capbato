import { useState, useEffect, useCallback } from 'react';
import { container } from '../../../../infrastructure/di/container';
import { AppointmentApiService } from '../../../../infrastructure/api/AppointmentApiService';
import { TopVisitReasonDto } from '@nx-starter/application-shared';
import type { TimeRange } from '../components';
import dayjs from 'dayjs';

export const useTopVisitReasonsData = () => {
  const [topVisitReasons, setTopVisitReasons] = useState<TopVisitReasonDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default: Last 3 months
  const [timeRange, setTimeRange] = useState<TimeRange>('3m');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

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

  const fetchTopVisitReasons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { startDate, endDate } = calculateDateRange(timeRange);
      const appointmentService = container.resolve(AppointmentApiService);
      const data = await appointmentService.getTopVisitReasons(startDate, endDate, 10);

      setTopVisitReasons(data);
    } catch (err) {
      console.error('Failed to fetch top visit reasons:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch top visit reasons');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, customStartDate, customEndDate]);

  useEffect(() => {
    fetchTopVisitReasons();
  }, [fetchTopVisitReasons]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  const handleCustomDateChange = (startDate: Date, endDate: Date) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setTimeRange('custom');
  };

  const handleRefresh = () => {
    fetchTopVisitReasons();
  };

  return {
    topVisitReasons,
    isLoading,
    error,
    timeRange,
    customStartDate,
    customEndDate,
    handleTimeRangeChange,
    handleCustomDateChange,
    handleRefresh,
  };
};
