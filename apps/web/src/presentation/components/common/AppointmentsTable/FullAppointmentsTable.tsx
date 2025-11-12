import React from 'react';
import { BaseAppointmentsTable, BaseAppointment, AppointmentsTableCallbacks } from './BaseAppointmentsTable';

interface FullAppointmentsTableProps {
  appointments: BaseAppointment[];
  callbacks: AppointmentsTableCallbacks;
  showAppointmentNumber?: boolean;
}

export const FullAppointmentsTable: React.FC<FullAppointmentsTableProps> = ({
  appointments,
  callbacks,
  showAppointmentNumber = false
}) => {
  const config = {
    showActions: true, // Full page shows all actions
    showContactColumn: false, // Can be enabled if contact info is available
    showDateColumn: true, // Full page shows dates
    showAppointmentNumber, // Show appointment number based on prop
    compactMode: false, // Full size for appointments page
    useViewportHeight: true, // Use full viewport height
    bottomPadding: 90,
    emptyStateMessage: "No appointments found"
  };

  return (
    <BaseAppointmentsTable
      appointments={appointments}
      config={config}
      callbacks={callbacks}
    />
  );
};
