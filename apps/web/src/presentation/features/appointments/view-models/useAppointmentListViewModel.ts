import { useEffect, useCallback } from 'react';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import type { IAppointmentListViewModel } from './interfaces/AppointmentViewModels';

/**
 * View model for appointment list operations
 * Handles appointment list display, actions, and state management
 */
export const useAppointmentListViewModel = (): IAppointmentListViewModel => {
  const {
    appointments,
    isLoading,
    error,
    fetchAllAppointments,
    confirmAppointment,
    cancelAppointment,
    deleteAppointment,
    clearError,
  } = useAppointmentStore();

  // Load appointments on component mount
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = useCallback(async () => {
    try {
      await fetchAllAppointments();
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  }, [fetchAllAppointments]);

  const handleConfirmAppointment = useCallback(async (id: string) => {
    try {
      await confirmAppointment(id);
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
    }
  }, [confirmAppointment]);

  const handleCancelAppointment = useCallback(async (id: string) => {
    try {
      await cancelAppointment(id);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  }, [cancelAppointment]);

  const handleDeleteAppointment = useCallback(async (id: string) => {
    try {
      await deleteAppointment(id);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  }, [deleteAppointment]);

  return {
    appointments,
    isLoading,
    error,
    loadAppointments,
    confirmAppointment: handleConfirmAppointment,
    cancelAppointment: handleCancelAppointment,
    deleteAppointment: handleDeleteAppointment,
    clearError,
  };
};
