import React from 'react';
import { DataTable, TableColumn, TableActionButtons, ActionButtonConfig } from '../../../components/common';
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const styles = {
      confirmed: {
        background: '#b9f6ca',
        color: '#006400',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block'
      },
      completed: {
        background: '#c8e6c9',
        color: '#2e7d32',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block'
      },
      cancelled: {
        background: '#ff8a80',
        color: '#8b0000',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block'
      }
    };

    return (
      <span style={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getActionsForAppointment = (appointment: Appointment): ActionButtonConfig[] => {
    const actions: ActionButtonConfig[] = [
      {
        icon: 'fas fa-edit',
        tooltip: 'Modify Appointment',
        onClick: () => onModifyAppointment(appointment.id)
      }
    ];

    if (appointment.status === 'confirmed') {
      // For confirmed appointments: Add "Mark as Completed" and "Cancel"
      if (onCompleteAppointment) {
        actions.push({
          icon: 'fas fa-check',
          tooltip: 'Mark Appointment as Completed',
          onClick: () => onCompleteAppointment(appointment.id)
        });
      }
      actions.push({
        icon: 'fas fa-times',
        tooltip: 'Cancel Appointment',
        onClick: () => onCancelAppointment(appointment.id)
      });
    } else if (appointment.status === 'completed') {
      // For completed appointments: Only show "Reconfirm" to go back to confirmed
      actions.push({
        icon: 'fas fa-redo',
        tooltip: 'Reconfirm Appointment',
        onClick: () => onReconfirmAppointment(appointment.id)
      });
    } else if (appointment.status === 'cancelled') {
      // For cancelled appointments: Only show "Reconfirm"
      actions.push({
        icon: 'fas fa-redo',
        tooltip: 'Reconfirm Appointment',
        onClick: () => onReconfirmAppointment(appointment.id)
      });
    }

    return actions;
  };

  const columns: TableColumn<Appointment>[] = [
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: '10%',
      align: 'center',
      searchable: true
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      width: '20%',
      align: 'left',
      searchable: true
    },
    {
      key: 'reasonForVisit',
      header: 'Reason for Visit',
      width: '18%',
      align: 'left',
      searchable: true
    },
    {
      key: 'date',
      header: 'Date',
      width: '12%',
      align: 'center',
      render: (value) => formatDate(value)
    },
    {
      key: 'time',
      header: 'Time',
      width: '10%',
      align: 'center'
    },
    {
      key: 'doctor',
      header: 'Doctor',
      width: '17%',
      align: 'left',
      searchable: true
    },
    {
      key: 'status',
      header: 'Status',
      width: '13%',
      align: 'center',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      align: 'center',
      render: (_, appointment) => (
        <TableActionButtons actions={getActionsForAppointment(appointment)} />
      )
    }
  ];

  return (
    <DataTable
      data={appointments}
      columns={columns}
      emptyStateMessage="No appointments found"
    />
  );
};
