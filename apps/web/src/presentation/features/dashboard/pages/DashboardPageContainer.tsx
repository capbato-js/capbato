import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useDashboardNavigation } from '../hooks/useDashboardNavigation';
import { DashboardPagePresenter } from './DashboardPagePresenter';

export const DashboardPageContainer: React.FC = () => {
  const { stats, todayAppointments, isLoading, isDoctorLoading } = useDashboardData();
  const { handleSeeAllAppointments } = useDashboardNavigation();

  return (
    <DashboardPagePresenter
      stats={stats}
      todayAppointments={todayAppointments}
      isLoading={isLoading}
      isDoctorLoading={isDoctorLoading}
      onSeeAllAppointments={handleSeeAllAppointments}
    />
  );
};