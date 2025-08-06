import React from 'react';
import { DataTable, TableColumn } from '../DataTable';
import { TableActionButtons, ActionButtonConfig } from '../TableActionButtons';
import { useMantineTheme } from '@mantine/core';

export interface BaseAppointment {
  id: string;
  patientNumber: string;
  patientName: string;
  reasonForVisit: string;
  date: string;
  time: string;
  doctor: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export interface AppointmentsTableConfig {
  showActions?: boolean;
  showContactColumn?: boolean;
  showDateColumn?: boolean;
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
    compactMode = false,
    maxRows,
    useViewportHeight = false,
    bottomPadding = 90,
    emptyStateMessage = "No appointments found"
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
  const columns: TableColumn<BaseAppointment>[] = [
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: compactMode ? '12%' : '10%',
      align: 'center',
      searchable: !compactMode
    },
    {
      key: 'patientName',
      header: 'Patient',
      width: compactMode ? '20%' : '20%',
      align: 'left',
      searchable: !compactMode
    },
    {
      key: 'reasonForVisit',
      header: 'Reason for visit',
      width: compactMode ? '22%' : '18%',
      align: 'left',
      searchable: !compactMode
    }
  ];

  // Add contact column if enabled
  if (showContactColumn) {
    columns.push({
      key: 'contact', // This would need to be added to BaseAppointment interface if used
      header: 'Contact',
      width: '12%',
      align: 'center'
    });
  }

  // Add date column if enabled
  if (showDateColumn) {
    columns.push({
      key: 'date',
      header: 'Date',
      width: compactMode ? '12%' : '12%',
      align: 'center',
      render: (value) => formatDate(value)
    });
  }

  // Add time column
  columns.push({
    key: 'time',
    header: 'Time',
    width: compactMode ? '10%' : '10%',
    align: 'center'
  });

  // Add doctor column
  columns.push({
    key: 'doctor',
    header: 'Doctor',
    width: compactMode ? '16%' : '17%',
    align: 'left',
    searchable: !compactMode
  });

  // Add status column
  columns.push({
    key: 'status',
    header: 'Status',
    width: compactMode ? '13%' : '13%',
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
