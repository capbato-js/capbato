import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { AppointmentsTable, AppointmentsCalendar, Appointment } from '../../../components/appointments';

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
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

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

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

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
        <AppointmentsTable
          appointments={dummyAppointments}
          selectedDate={selectedDate}
          onAddAppointment={handleAddAppointment}
          onModifyAppointment={handleModifyAppointment}
          onCancelAppointment={handleCancelAppointment}
          onReconfirmAppointment={handleReconfirmAppointment}
          onDateSelect={handleDateSelect}
        />
        
        {/* <AppointmentsCalendar
          appointments={dummyAppointments}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        /> */}
      </Box>
    </MedicalClinicLayout>
  );
};
