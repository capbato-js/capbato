import React from 'react';
import { BaseAppointmentsTable, BaseAppointment, AppointmentsTableCallbacks } from './BaseAppointmentsTable';

interface DashboardAppointmentsTableProps {
  appointments: BaseAppointment[];
  callbacks?: AppointmentsTableCallbacks;
  maxRows?: number;
}

export const DashboardAppointmentsTable: React.FC<DashboardAppointmentsTableProps> = ({
  appointments,
  callbacks = {},
  maxRows = 5
}) => {
  const config = {
    showActions: false, // Dashboard doesn't show actions
    showContactColumn: false, // Dashboard shows simplified view
    showDateColumn: false, // Dashboard is for "today's" appointments, so date is implied
    showAppointmentNumber: true, // Always show appointment number on dashboard (today's appointments)
    compactMode: true, // More compact for dashboard
    maxRows,
    useViewportHeight: false, // Dashboard table should be fixed height
    bottomPadding: 0,
    emptyStateMessage: "No appointments for today"
  };

  return (
    <BaseAppointmentsTable
      appointments={appointments}
      config={config}
      callbacks={callbacks}
    />
  );
};
