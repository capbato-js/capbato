import React, { useState, useEffect } from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { DataTableHeader, ConfirmationModal } from '../../../components/common';
import { AppointmentsTable, AppointmentsFilterControls, AppointmentCountDisplay, AddAppointmentModal } from '../components';
import { useAppointmentPageViewModel } from '../view-models/useAppointmentPageViewModel';
import { Appointment } from '../types';
import { AppointmentDto } from '@nx-starter/application-shared';

// Helper function to convert AppointmentDto to the component's Appointment type
const mapAppointmentDtoToAppointment = (dto: AppointmentDto): Appointment => ({
  id: dto.id,
  patientNumber: dto.patient?.patientNumber || 'Unknown', // Use nested data only
  patientName: dto.patient?.fullName || 'Unknown Patient', // Use nested data only  
  reasonForVisit: dto.reasonForVisit,
  date: dto.appointmentDate,
  time: dto.appointmentTime,
  doctor: dto.doctor?.fullName || 'Unknown Doctor', // Use nested data only
  status: dto.status === 'confirmed' ? 'confirmed' : dto.status === 'cancelled' ? 'cancelled' : 'confirmed'
});

export const AppointmentsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState<boolean>(false);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
  
  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmColor?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { /* empty */ },
  });
  
  const viewModel = useAppointmentPageViewModel();

  // Load appointments on component mount
  useEffect(() => {
    viewModel.loadAppointments();
  }, []);

  const handleAddAppointment = () => {
    viewModel.openAddModal();
  };

  const handleCloseAddModal = () => {
    viewModel.closeAddModal();
  };

  const handleAppointmentCreated = (appointment: AppointmentDto) => {
    viewModel.handleAppointmentCreated(appointment);
  };

  const handleModifyAppointment = (appointmentId: string) => {
    const appointment = viewModel.appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const appointment = viewModel.appointments.find(apt => apt.id === appointmentId);
    const appointmentName = appointment?.patient?.fullName || 'this appointment';
    
    setConfirmationModal({
      isOpen: true,
      title: 'Cancel Appointment',
      message: `Are you sure you want to cancel the appointment for ${appointmentName}?`,
      confirmText: 'Cancel',
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          await viewModel.cancelAppointment(appointmentId);
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Failed to cancel appointment:', error);
        }
      },
    });
  };

  const handleReconfirmAppointment = (appointmentId: string) => {
    const appointment = viewModel.appointments.find(apt => apt.id === appointmentId);
    const appointmentName = appointment?.patient?.fullName || 'this appointment';
    
    // Check if there are already 4 confirmed appointments for the same date and time
    const sameSlotAppointments = viewModel.appointments.filter(apt => 
      apt.appointmentDate === appointment?.appointmentDate &&
      apt.appointmentTime === appointment?.appointmentTime &&
      apt.status === 'confirmed'
    );
    
    if (sameSlotAppointments.length >= 4) {
      // If slot is full, open edit modal to reschedule
      handleModifyAppointment(appointmentId);
    } else {
      // Otherwise, show confirmation to reconfirm
      setConfirmationModal({
        isOpen: true,
        title: 'Reconfirm Appointment',
        message: `Reconfirm the appointment for ${appointmentName}?`,
        confirmText: 'Reconfirm',
        confirmColor: 'green',
        onConfirm: async () => {
          try {
            await viewModel.confirmAppointment(appointmentId);
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          } catch (error) {
            console.error('Failed to reconfirm appointment:', error);
          }
        },
      });
    }
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleDateChange = (value: string | null) => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  };

  const handleShowAllChange = (checked: boolean) => {
    setShowAll(checked);
  };

  // Convert DTOs to component format and filter appointments based on date and showAll flag
  const appointments = viewModel.appointments.map(mapAppointmentDtoToAppointment);
  const filteredAppointments = showAll 
    ? appointments 
    : appointments.filter(appointment => 
        appointment.date === selectedDate.toISOString().split('T')[0]
      );

  return (
    <MedicalClinicLayout>
      <DataTableHeader
        title="Appointments"
        onAddItem={handleAddAppointment}
        addButtonText="Add Appointment"
        addButtonIcon="fas fa-calendar-plus"
      />
      
      <AppointmentsFilterControls
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        showAll={showAll}
        onShowAllChange={handleShowAllChange}
      />

      <AppointmentCountDisplay count={filteredAppointments.length} />

      {/* Commented out for future reference */}
      {/* {viewModel.error && (
        <div className="text-red-600 text-sm mb-4 text-center">
          {viewModel.error}
          <button 
            onClick={viewModel.clearError}
            className="ml-2 text-blue-600 underline"
          >
            Dismiss
          </button>
        </div>
      )}
       */}
      <AppointmentsTable
        appointments={filteredAppointments}
        onModifyAppointment={handleModifyAppointment}
        onCancelAppointment={handleCancelAppointment}
        onReconfirmAppointment={handleReconfirmAppointment}
      />

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        isOpen={viewModel.isAddModalOpen}
        onClose={handleCloseAddModal}
        onAppointmentCreated={handleAppointmentCreated}
      />

      {/* Edit Appointment Modal */}
      <AddAppointmentModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editMode={true}
        appointment={selectedAppointment}
        onAppointmentUpdated={() => {
          // Refresh the appointments list after update
          viewModel.loadAppointments();
          handleCloseEditModal();
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        confirmColor={confirmationModal.confirmColor}
        isLoading={viewModel.isLoading}
      />
    </MedicalClinicLayout>
  );
};
