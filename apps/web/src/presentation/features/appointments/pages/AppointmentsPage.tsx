import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { DataTableHeader } from '../../../components/common';
import { AppointmentsTable, AppointmentsFilterControls, AppointmentCountDisplay } from '../components';
import { Appointment } from '../types';

// Dummy data for appointments
const dummyAppointments: Appointment[] = [
  {
    id: '1',
    patientNumber: 'P001',
    patientName: 'John Doe',
    reasonForVisit: 'Annual Checkup',
    date: '2025-07-31',
    time: '09:00 AM',
    doctor: 'Dr. Alice Smith',
    status: 'confirmed'
  },
  {
    id: '2',
    patientNumber: 'P002',
    patientName: 'Jane Smith',
    reasonForVisit: 'Flu Symptoms',
    date: '2025-07-31',
    time: '10:30 AM',
    doctor: 'Dr. John Doe',
    status: 'pending'
  },
  {
    id: '3',
    patientNumber: 'P003',
    patientName: 'Robert Johnson',
    reasonForVisit: 'Follow-up Consultation',
    date: '2025-08-01',
    time: '02:00 PM',
    doctor: 'Dr. Alice Smith',
    status: 'confirmed'
  },
  {
    id: '4',
    patientNumber: 'P004',
    patientName: 'Emily Davis',
    reasonForVisit: 'Vaccination',
    date: '2025-08-01',
    time: '03:30 PM',
    doctor: 'Dr. John Doe',
    status: 'cancelled'
  },
  {
    id: '5',
    patientNumber: 'P005',
    patientName: 'Michael Wilson',
    reasonForVisit: 'Blood Pressure Check',
    date: '2025-08-02',
    time: '11:00 AM',
    doctor: 'Dr. Alice Smith',
    status: 'pending'
  },
  {
    id: '6',
    patientNumber: 'P006',
    patientName: 'Sarah Brown',
    reasonForVisit: 'Diabetes Management',
    date: '2025-08-02',
    time: '01:00 PM',
    doctor: 'Dr. John Doe',
    status: 'confirmed'
  }
];

export const AppointmentsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleAddAppointment = () => {
    console.log('Add appointment clicked');
    // TODO: Implement add appointment functionality
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

  // Filter appointments based on date and showAll flag
  const filteredAppointments = showAll 
    ? dummyAppointments 
    : dummyAppointments.filter(appointment => 
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
        
        <AppointmentsTable
          appointments={filteredAppointments}
          onModifyAppointment={handleModifyAppointment}
          onCancelAppointment={handleCancelAppointment}
          onReconfirmAppointment={handleReconfirmAppointment}
        />
      </Box>
    </MedicalClinicLayout>
  );
};
