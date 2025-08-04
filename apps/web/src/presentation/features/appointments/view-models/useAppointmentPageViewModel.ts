import { useState, useCallback } from 'react';
import { AppointmentDto, AddAppointmentFormData } from '@nx-starter/application-shared';
import { useAppointmentListViewModel } from './useAppointmentListViewModel';
import type { IAppointmentPageViewModel } from './interfaces/AppointmentViewModels';

/**
 * View model for appointment page operations
 * Manages the overall appointment page state including modals and appointments
 */
export const useAppointmentPageViewModel = (): IAppointmentPageViewModel => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const listViewModel = useAppointmentListViewModel();

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
    // Clear any existing errors when opening the modal
    listViewModel.clearError();
  }, [listViewModel]);

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleAppointmentCreated = useCallback((_appointment: AppointmentDto) => {
    // Close the modal after successful creation
    closeAddModal();
    
    // Refresh the appointments list to show the new appointment
    // The store already handles optimistic updates, but this ensures consistency
    listViewModel.loadAppointments();
  }, [closeAddModal, listViewModel]);

  const updateAppointment = useCallback(async (id: string, data: Partial<AddAppointmentFormData>): Promise<boolean> => {
    try {
      // Call the store's updateAppointment method
      await listViewModel.updateAppointment(id, data);
      
      // If successful, refresh the appointments list
      await listViewModel.loadAppointments();
      
      return true;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      return false;
    }
  }, [listViewModel]);

  const cancelAppointment = useCallback(async (id: string) => {
    await listViewModel.cancelAppointment(id);
  }, [listViewModel]);

  const confirmAppointment = useCallback(async (id: string) => {
    await listViewModel.confirmAppointment(id);
  }, [listViewModel]);

  const completeAppointment = useCallback(async (id: string) => {
    await listViewModel.completeAppointment(id);
  }, [listViewModel]);

  return {
    // State from list view model
    appointments: listViewModel.appointments,
    isLoading: listViewModel.isLoading,
    error: listViewModel.error,
    
    // Modal state
    isAddModalOpen,
    
    // Actions
    loadAppointments: listViewModel.loadAppointments,
    openAddModal,
    closeAddModal,
    handleAppointmentCreated,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    completeAppointment,
    clearError: listViewModel.clearError,
  };
};
