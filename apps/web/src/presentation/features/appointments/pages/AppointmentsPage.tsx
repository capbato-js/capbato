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
  status: dto.status === 'confirmed' ? 'confirmed' 
    : dto.status === 'cancelled' ? 'cancelled' 
    : dto.status === 'completed' ? 'completed' 
    : 'confirmed' // fallback
});

export const AppointmentsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDto | null>(null);
  const [isRescheduleMode, setIsRescheduleMode] = useState(false);
  
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
      setIsRescheduleMode(false); // Regular edit mode
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAppointment(null);
    setIsRescheduleMode(false); // Reset reschedule mode
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
    
    // Always show the reconfirm modal first
    setConfirmationModal({
      isOpen: true,
      title: 'Reconfirm Appointment',
      message: `Reconfirm the appointment for ${appointmentName}?`,
      confirmText: 'Reconfirm',
      confirmColor: 'green',
      onConfirm: async () => {
        // Check if there are already 4 confirmed appointments for the same date and time
        const sameSlotAppointments = viewModel.appointments.filter(apt => 
          apt.appointmentDate === appointment?.appointmentDate &&
          apt.appointmentTime === appointment?.appointmentTime &&
          apt.status === 'confirmed'
        );
        
        if (sameSlotAppointments.length > 0) {
          // If slot is taken, close confirmation modal and open the reschedule appointment form
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          // Open the Update Appointment modal with the selected appointment in reschedule mode
          if (appointment) {
            setSelectedAppointment(appointment);
            setIsRescheduleMode(true); // Special reschedule mode
            setIsEditModalOpen(true);
          }
        } else {
          // Otherwise, proceed with simple reconfirmation
          try {
            await viewModel.confirmAppointment(appointmentId);
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          } catch (error) {
            console.error('Failed to reconfirm appointment:', error);
          }
        }
      },
    });
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    const appointment = viewModel.appointments.find(apt => apt.id === appointmentId);
    const appointmentName = appointment?.patient?.fullName || 'this appointment';
    
    setConfirmationModal({
      isOpen: true,
      title: 'Complete Appointment',
      message: `Mark the appointment for ${appointmentName} as completed?`,
      confirmText: 'Complete',
      confirmColor: 'blue',
      onConfirm: async () => {
        try {
          await viewModel.completeAppointment(appointmentId);
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Failed to complete appointment:', error);
        }
      },
    });
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleDateChange = (value: string | null) => {
    if (value) {
      setSelectedDate(new Date(value));
      // Reset "Show All" when date is changed while it's checked
      if (showAll) {
        setShowAll(false);
      }
    }
  };

  const handleShowAllChange = (checked: boolean) => {
    setShowAll(checked);
  };

  // Helper function to sort appointments by date and time
  const sortAppointments = (appointments: Appointment[], isShowingAll: boolean): Appointment[] => {
    return [...appointments].sort((a, b) => {
      // Create date objects for comparison
      const dateTimeA = new Date(`${a.date} ${a.time}`);
      const dateTimeB = new Date(`${b.date} ${b.time}`);
      
      if (isShowingAll) {
        // When showing all: latest to oldest (newest first)
        return dateTimeB.getTime() - dateTimeA.getTime();
      } else {
        // When filtering by date: earliest to latest (oldest first)
        return dateTimeA.getTime() - dateTimeB.getTime();
      }
    });
  };

  // Convert DTOs to component format and filter appointments based on date and showAll flag
  const appointments = viewModel.appointments.map(mapAppointmentDtoToAppointment);
  const filteredAppointments = showAll 
    ? appointments 
    : appointments.filter(appointment => 
        appointment.date === selectedDate.toISOString().split('T')[0]
      );
  
  // Apply sorting based on showAll state
  const sortedAppointments = sortAppointments(filteredAppointments, showAll);

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

      <AppointmentCountDisplay count={sortedAppointments.length} />

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
        appointments={sortedAppointments}
        onModifyAppointment={handleModifyAppointment}
        onCancelAppointment={handleCancelAppointment}
        onReconfirmAppointment={handleReconfirmAppointment}
        onCompleteAppointment={handleCompleteAppointment}
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
        isRescheduleMode={isRescheduleMode}
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
