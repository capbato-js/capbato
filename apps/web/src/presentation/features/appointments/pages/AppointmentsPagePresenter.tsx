import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { DataTableHeader, ConfirmationModal } from '../../../components/common';
import { AppointmentsTable, AppointmentsFilterControls, AppointmentCountDisplay, AddAppointmentModal } from '../components';
import { Appointment } from '../types';
import { AppointmentDto } from '@nx-starter/application-shared';
import { ConfirmationModalState } from '../hooks/useModalState';

type StatusFilter = 'all' | 'confirmed' | 'completed' | 'cancelled';

interface AppointmentsPagePresenterProps {
  // Data
  appointments: Appointment[];
  isLoading: boolean;

  // Filter controls
  selectedDate: Date;
  showAll: boolean;
  selectedStatusFilter: StatusFilter;
  onDateChange: (value: string | null) => void;
  onShowAllChange: (checked: boolean) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  
  // Add modal
  isAddModalOpen: boolean;
  onAddAppointment: () => void;
  onCloseAddModal: () => void;
  onAppointmentCreated: (appointment: AppointmentDto) => void;
  
  // Edit modal
  isEditModalOpen: boolean;
  selectedAppointment: AppointmentDto | null;
  isRescheduleMode: boolean;
  onCloseEditModal: () => void;
  onAppointmentUpdated: () => void;
  
  // Confirmation modal
  confirmationModal: ConfirmationModalState;
  onCloseConfirmationModal: () => void;
  
  // Actions
  onModifyAppointment: (appointmentId: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onReconfirmAppointment: (appointmentId: string) => void;
  onCompleteAppointment: (appointmentId: string) => void;
}

export const AppointmentsPagePresenter: React.FC<AppointmentsPagePresenterProps> = ({
  appointments,
  isLoading,
  selectedDate,
  showAll,
  selectedStatusFilter,
  onDateChange,
  onShowAllChange,
  onStatusFilterChange,
  isAddModalOpen,
  onAddAppointment,
  onCloseAddModal,
  onAppointmentCreated,
  isEditModalOpen,
  selectedAppointment,
  isRescheduleMode,
  onCloseEditModal,
  onAppointmentUpdated,
  confirmationModal,
  onCloseConfirmationModal,
  onModifyAppointment,
  onCancelAppointment,
  onReconfirmAppointment,
  onCompleteAppointment,
}) => {
  // Show appointment number only when:
  // 1. Not showing all appointments
  // 2. Selected date is today or future (regardless of status filter)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const isTodayOrFuture = selected.getTime() >= today.getTime();
  const showAppointmentNumber = !showAll && isTodayOrFuture;

  return (
    <MedicalClinicLayout>
      <DataTableHeader
        title="Appointments"
        onAddItem={onAddAppointment}
        addButtonText="Add Appointment"
        addButtonIcon="fas fa-calendar-plus"
      />

      <AppointmentsFilterControls
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        showAll={showAll}
        onShowAllChange={onShowAllChange}
        selectedStatusFilter={selectedStatusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />

      <AppointmentCountDisplay count={appointments.length} />

      <AppointmentsTable
        appointments={appointments}
        showAppointmentNumber={showAppointmentNumber}
        onModifyAppointment={onModifyAppointment}
        onCancelAppointment={onCancelAppointment}
        onReconfirmAppointment={onReconfirmAppointment}
        onCompleteAppointment={onCompleteAppointment}
      />

      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        onAppointmentCreated={onAppointmentCreated}
      />

      <AddAppointmentModal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        editMode={true}
        appointment={selectedAppointment}
        isRescheduleMode={isRescheduleMode}
        onAppointmentUpdated={onAppointmentUpdated}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={onCloseConfirmationModal}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        confirmColor={confirmationModal.confirmColor}
        isLoading={isLoading}
      />
    </MedicalClinicLayout>
  );
};