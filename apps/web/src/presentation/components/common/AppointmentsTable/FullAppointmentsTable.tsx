import React from 'react';
import { BaseAppointmentsTable, BaseAppointment, AppointmentsTableCallbacks } from './BaseAppointmentsTable';

interface FullAppointmentsTableProps {
  appointments: BaseAppointment[];
  callbacks: AppointmentsTableCallbacks;
}

export const FullAppointmentsTable: React.FC<FullAppointmentsTableProps> = ({
  appointments,
  callbacks
}) => {
  const config = {
    showActions: true, // Full page shows all actions
    showContactColumn: false, // Can be enabled if contact info is available
    showDateColumn: true, // Full page shows dates
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
