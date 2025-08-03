import { useState, useCallback } from 'react';
import { AppointmentDto } from '@nx-starter/application-shared';
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

  const handleAppointmentCreated = useCallback((appointment: AppointmentDto) => {
    // Close the modal after successful creation
    closeAddModal();
    
    // Refresh the appointments list to show the new appointment
    // The store already handles optimistic updates, but this ensures consistency
    listViewModel.loadAppointments();
  }, [closeAddModal, listViewModel]);

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
    clearError: listViewModel.clearError,
  };
};
