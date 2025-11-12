import React from 'react';
import { DataTable, TableColumn } from '../DataTable';
import { TableActionButtons, ActionButtonConfig } from '../TableActionButtons';
import { useMantineTheme } from '@mantine/core';

export interface BaseAppointment {
  id: string;
  appointmentNumber?: number; // Queue number based on time slot
  patientNumber: string;
  patientName: string;
  reasonForVisit: string | string[];
  date: string;
  time: string;
  doctor: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export interface AppointmentsTableConfig {
  showActions?: boolean;
  showContactColumn?: boolean;
  showDateColumn?: boolean;
  showPatientColumns?: boolean; // Add option to hide Patient # and Patient Name columns
  showAppointmentNumber?: boolean; // Add option to show Appointment # column
  compactMode?: boolean;
  maxRows?: number;
  useViewportHeight?: boolean;
  bottomPadding?: number;
  emptyStateMessage?: string;
}

export interface AppointmentsTableCallbacks {
  onModifyAppointment?: (appointmentId: string) => void;
  onCancelAppointment?: (appointmentId: string) => void;
  onReconfirmAppointment?: (appointmentId: string) => void;
  onCompleteAppointment?: (appointmentId: string) => void;
}

interface BaseAppointmentsTableProps {
  appointments: BaseAppointment[];
  config?: AppointmentsTableConfig;
  callbacks?: AppointmentsTableCallbacks;
}

export const BaseAppointmentsTable: React.FC<BaseAppointmentsTableProps> = ({
  appointments,
  config = {},
  callbacks = {},
}) => {
  const theme = useMantineTheme();

  const {
    showActions = true,
    showContactColumn = false,
    showDateColumn = true,
    showPatientColumns = true, // Default to true for backward compatibility
    showAppointmentNumber = false, // Default to false
    compactMode = false,
    maxRows,
    useViewportHeight = false,
    bottomPadding = 20,
    emptyStateMessage = 'No appointments found',
  } = config;

  const {
    onModifyAppointment,
    onCancelAppointment,
    onReconfirmAppointment,
    onCompleteAppointment,
  } = callbacks;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusBadge = (status: BaseAppointment['status']) => {
    const styles = {
      confirmed: {
        background: theme.colors.green[1],
        color: theme.colors.green[9],
        padding: compactMode ? '3px 8px' : '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: compactMode ? '12px' : '14px'
      },
      completed: {
        background: theme.colors.tableBlue[1],
        color: theme.colors.tableBlue[9], 
        padding: compactMode ? '3px 8px' : '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: compactMode ? '12px' : '14px'
      },
      cancelled: {
        background: theme.colors.red[1],
        color: theme.colors.red[9],
        padding: compactMode ? '3px 8px' : '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: compactMode ? '12px' : '14px'
      }
    };

    return (
      <span style={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getActionsForAppointment = (appointment: BaseAppointment): ActionButtonConfig[] => {
    if (!showActions) return [];

    const actions: ActionButtonConfig[] = [];

    if (onModifyAppointment) {
      actions.push({
        icon: 'fas fa-edit',
        tooltip: 'Modify Appointment',
        onClick: () => onModifyAppointment(appointment.id)
      });
    }

    if (appointment.status === 'confirmed') {
      if (onCompleteAppointment) {
        actions.push({
          icon: 'fas fa-check',
          tooltip: 'Mark Appointment as Completed',
          onClick: () => onCompleteAppointment(appointment.id)
        });
      }
      if (onCancelAppointment) {
        actions.push({
          icon: 'fas fa-times',
          tooltip: 'Cancel Appointment',
          onClick: () => onCancelAppointment(appointment.id)
        });
      }
    } else if (appointment.status === 'cancelled' && onReconfirmAppointment) {
      actions.push({
        icon: 'fas fa-redo',
        tooltip: 'Reconfirm Appointment',
        onClick: () => onReconfirmAppointment(appointment.id)
      });
    }

    return actions;
  };

  // Filter data if maxRows is specified
  const displayData = maxRows ? appointments.slice(0, maxRows) : appointments;

  // Build columns dynamically based on configuration
  const columns: TableColumn<BaseAppointment>[] = [];

  // Add Queue # column if enabled (first column)
  if (showAppointmentNumber) {
    columns.push({
      key: 'appointmentNumber',
      header: 'Queue #',
      width: compactMode ? '8%' : '9%',
      align: 'center',
      searchable: false
    });
  }

  // Conditionally add patient columns only if showPatientColumns is true
  if (showPatientColumns) {
    columns.push(
      {
        key: 'patientNumber',
        header: 'Patient #',
        width: compactMode ? '9%' : '10%',
        align: 'center',
        searchable: !compactMode
      },
      {
        key: 'patientName',
        header: 'Patient',
        width: compactMode ? '13%' : '14%',
        align: 'left',
        searchable: !compactMode
      }
    );
  }

  // Always add reason for visit column
  columns.push({
    key: 'reasonForVisit',
    header: 'Reason for visit',
    width: compactMode ? '22%' : (showPatientColumns ? '20%' : '30%'), // Wider if patient columns are hidden
    align: 'left',
    searchable: !compactMode,
    render: (value) => Array.isArray(value) ? value.join(', ') : value
  });

  // Add contact column if enabled
  if (showContactColumn) {
    columns.push({
      key: 'contact', // This would need to be added to BaseAppointment interface if used
      header: 'Contact',
      width: '10%',
      align: 'center'
    });
  }

  // Add date/time column if date is enabled
  if (showDateColumn) {
    columns.push({
      key: 'date',
      header: 'Date/Time',
      width: compactMode ? '14%' : '15%',
      align: 'center',
      render: (value, appointment) => `${formatDate(value)}, ${appointment.time}`
    });
  } else {
    // If date column is hidden (like in dashboard), just show time
    columns.push({
      key: 'time',
      header: 'Time',
      width: compactMode ? '10%' : '10%',
      align: 'center'
    });
  }

  // Add doctor column
  columns.push({
    key: 'doctor',
    header: 'Doctor',
    width: compactMode ? '12%' : (showPatientColumns ? '13%' : '25%'), // Wider if patient columns are hidden
    align: 'left',
    searchable: !compactMode
  });

  // Add status column
  columns.push({
    key: 'status',
    header: 'Status',
    width: compactMode ? '10%' : '11%',
    align: 'center',
    render: (value) => getStatusBadge(value)
  });

  // Add actions column if enabled
  if (showActions) {
    columns.push({
      key: 'actions',
      header: 'Actions',
      width: '100px',
      align: 'center',
      render: (_, appointment) => (
        <TableActionButtons actions={getActionsForAppointment(appointment)} />
      )
    });
  }

  return (
    <DataTable
      data={displayData}
      columns={columns}
      emptyStateMessage={emptyStateMessage}
      useViewportHeight={useViewportHeight}
      bottomPadding={bottomPadding}
    />
  );
};
