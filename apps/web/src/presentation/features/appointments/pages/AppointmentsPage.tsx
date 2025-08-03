import React, { useState, useEffect } from 'react';
import { Box } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { DataTableHeader } from '../../../components/common';
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
    console.log('Modify appointment:', appointmentId);
    // TODO: Implement modify appointment functionality
  };

  const handleCancelAppointment = (appointmentId: string) => {
    console.log('Cancel appointment:', appointmentId);
    // TODO: Implement cancel appointment functionality
  };

  const handleReconfirmAppointment = (appointmentId: string) => {
    console.log('Reconfirm appointment:', appointmentId);
    // TODO: Implement reconfirm appointment functionality
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
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)'
        }}
      >
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
        
        {viewModel.error && (
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
        
        <AppointmentsTable
          appointments={filteredAppointments}
          onModifyAppointment={handleModifyAppointment}
          onCancelAppointment={handleCancelAppointment}
          onReconfirmAppointment={handleReconfirmAppointment}
        />
      </Box>

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        isOpen={viewModel.isAddModalOpen}
        onClose={handleCloseAddModal}
        onAppointmentCreated={handleAppointmentCreated}
      />
    </MedicalClinicLayout>
  );
};
