import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useDashboardNavigation } from '../hooks/useDashboardNavigation';
import { useWeeklyAppointmentData } from '../hooks/useWeeklyAppointmentData';
import { useTopLabTestsData } from '../hooks/useTopLabTestsData';
import { useAuthStore } from '../../../../infrastructure/state/AuthStore';
import { DashboardPagePresenter } from './DashboardPagePresenter';

export const DashboardPageContainer: React.FC = () => {
  const { stats, todayAppointments, isLoading, isDoctorLoading } = useDashboardData();
  const { handleSeeAllAppointments } = useDashboardNavigation();
  const {
    weeklyData,
    isLoading: isWeeklyDataLoading,
    timeRange,
    granularity,
    customStartDate,
    customEndDate,
    handleTimeRangeChange,
    handleGranularityChange,
    handleCustomDateChange,
    handleRefresh,
  } = useWeeklyAppointmentData();

  const {
    topLabTests,
    isLoading: isTopLabTestsLoading,
    timeRange: topLabTestsTimeRange,
    customStartDate: topLabTestsCustomStartDate,
    customEndDate: topLabTestsCustomEndDate,
    handleTimeRangeChange: handleTopLabTestsTimeRangeChange,
    handleCustomDateChange: handleTopLabTestsCustomDateChange,
    handleRefresh: handleTopLabTestsRefresh,
  } = useTopLabTestsData();

  const user = useAuthStore((state) => state.user);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <DashboardPagePresenter
      stats={stats}
      todayAppointments={todayAppointments}
      isLoading={isLoading}
      isDoctorLoading={isDoctorLoading}
      onSeeAllAppointments={handleSeeAllAppointments}
      weeklyData={weeklyData}
      isWeeklyDataLoading={isWeeklyDataLoading}
      isAdmin={isAdmin}
      timeRange={timeRange}
      granularity={granularity}
      customStartDate={customStartDate}
      customEndDate={customEndDate}
      onTimeRangeChange={handleTimeRangeChange}
      onGranularityChange={handleGranularityChange}
      onCustomDateChange={handleCustomDateChange}
      onRefresh={handleRefresh}
      topLabTests={topLabTests}
      isTopLabTestsLoading={isTopLabTestsLoading}
      topLabTestsTimeRange={topLabTestsTimeRange}
      topLabTestsCustomStartDate={topLabTestsCustomStartDate}
      topLabTestsCustomEndDate={topLabTestsCustomEndDate}
      onTopLabTestsTimeRangeChange={handleTopLabTestsTimeRangeChange}
      onTopLabTestsCustomDateChange={handleTopLabTestsCustomDateChange}
      onTopLabTestsRefresh={handleTopLabTestsRefresh}
    />
  );
};