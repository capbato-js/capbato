import React from 'react';
import { FullAppointmentsTable, BaseAppointment, AppointmentsTableCallbacks } from '../../../components/common';
import { Appointment } from '../types';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onModifyAppointment: (appointmentId: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onReconfirmAppointment: (appointmentId: string) => void;
  onCompleteAppointment?: (appointmentId: string) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onModifyAppointment,
  onCancelAppointment,
  onReconfirmAppointment,
  onCompleteAppointment,
}) => {
  // Convert local Appointment type to BaseAppointment
  const baseAppointments: BaseAppointment[] = appointments.map(appointment => ({
    id: appointment.id,
    patientNumber: appointment.patientNumber,
    patientName: appointment.patientName,
    reasonForVisit: appointment.reasonForVisit,
    date: appointment.date,
    time: appointment.time,
    doctor: appointment.doctor,
    status: appointment.status
  }));

  const callbacks: AppointmentsTableCallbacks = {
    onModifyAppointment,
    onCancelAppointment,
    onReconfirmAppointment,
    onCompleteAppointment,
  };

  return (
    <FullAppointmentsTable
      appointments={baseAppointments}
      callbacks={callbacks}
    />
  );
};
