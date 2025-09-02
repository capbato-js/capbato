import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { DataTableHeader, ConfirmationModal } from '../../../components/common';
import { AppointmentsTable, AppointmentsFilterControls, AppointmentCountDisplay, AddAppointmentModal } from '../components';
import { Appointment } from '../types';
import { AppointmentDto } from '@nx-starter/application-shared';
import { ConfirmationModalState } from '../hooks/useModalState';

interface AppointmentsPagePresenterProps {
  // Data
  appointments: Appointment[];
  isLoading: boolean;
  
  // Filter controls
  selectedDate: Date;
  showAll: boolean;
  onDateChange: (value: string | null) => void;
  onShowAllChange: (checked: boolean) => void;
  
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
  onDateChange,
  onShowAllChange,
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
      />

      <AppointmentCountDisplay count={appointments.length} />

      <AppointmentsTable
        appointments={appointments}
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