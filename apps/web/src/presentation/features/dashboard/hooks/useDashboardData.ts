import { useEffect } from 'react';
import { useDashboardViewModel } from '../view-models';

export const useDashboardData = () => {
  const { 
    stats, 
    todayAppointments, 
    isLoading, 
    isDoctorLoading, 
    loadDashboardData 
  } = useDashboardViewModel();

  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    stats,
    todayAppointments,
    isLoading,
    isDoctorLoading,
  };
};