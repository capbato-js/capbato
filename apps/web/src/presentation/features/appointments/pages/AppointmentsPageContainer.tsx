import React, { useEffect } from 'react';
import { useAppointmentPageViewModel } from '../view-models/useAppointmentPageViewModel';
import { useModalState } from '../hooks/useModalState';
import { useAppointmentFilters } from '../hooks/useAppointmentFilters';
import { useAppointmentActions } from '../hooks/useAppointmentActions';
import { mapAppointmentDtoToAppointment } from '../utils/appointmentUtils';
import { AppointmentsPagePresenter } from './AppointmentsPagePresenter';
import { useOverflowHidden } from '../../../hooks/useOverflowHidden';

export const AppointmentsPageContainer: React.FC = () => {
  const viewModel = useAppointmentPageViewModel();
  const modalState = useModalState();
  const filters = useAppointmentFilters();
  
  const actions = useAppointmentActions(
    viewModel.appointments,
    modalState.openConfirmationModal,
    modalState.closeConfirmationModal,
    modalState.openEditModal,
    viewModel.loadAppointments
  );

  useOverflowHidden();

  useEffect(() => {
    viewModel.loadAppointments();
  }, []);

  const handleAddAppointment = () => {
    viewModel.openAddModal();
  };

  const handleCloseAddModal = () => {
    viewModel.closeAddModal();
  };

  const handleAppointmentCreated = (appointment: any) => {
    viewModel.handleAppointmentCreated(appointment);
  };

  const handleAppointmentUpdated = () => {
    viewModel.loadAppointments();
    modalState.closeEditModal();
  };

  const appointments = viewModel.appointments.map(mapAppointmentDtoToAppointment);
  const sortedAppointments = filters.getFilteredAndSortedAppointments(appointments);

  return (
    <AppointmentsPagePresenter
      // Data
      appointments={sortedAppointments}
      isLoading={viewModel.isLoading}
      
      // Filter controls
      selectedDate={filters.selectedDate}
      showAll={filters.showAll}
      selectedStatusFilter={filters.selectedStatusFilter}
      onDateChange={filters.handleDateChange}
      onShowAllChange={filters.handleShowAllChange}
      onStatusFilterChange={filters.handleStatusFilterChange}
      
      // Add modal
      isAddModalOpen={viewModel.isAddModalOpen}
      onAddAppointment={handleAddAppointment}
      onCloseAddModal={handleCloseAddModal}
      onAppointmentCreated={handleAppointmentCreated}
      
      // Edit modal
      isEditModalOpen={modalState.isEditModalOpen}
      selectedAppointment={modalState.selectedAppointment}
      isRescheduleMode={modalState.isRescheduleMode}
      onCloseEditModal={modalState.closeEditModal}
      onAppointmentUpdated={handleAppointmentUpdated}
      
      // Confirmation modal
      confirmationModal={modalState.confirmationModal}
      onCloseConfirmationModal={modalState.closeConfirmationModal}
      
      // Actions
      onModifyAppointment={actions.handleModifyAppointment}
      onCancelAppointment={actions.handleCancelAppointment}
      onReconfirmAppointment={actions.handleReconfirmAppointment}
      onCompleteAppointment={actions.handleCompleteAppointment}
    />
  );
};