import React, { useMemo } from 'react';
import { Box, Button, Group } from '@mantine/core';
import { DataTable, TableColumn, Icon } from '../../../components/common';
import { Appointment } from '../types';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onModifyAppointment: (appointmentId: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onReconfirmAppointment: (appointmentId: string) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onModifyAppointment,
  onCancelAppointment,
  onReconfirmAppointment,
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
      pending: {
        background: '#ffcc80',
        color: '#8c5000',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block'
      },
      confirmed: {
        background: '#b9f6ca',
        color: '#006400',
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

  const columns: TableColumn<Appointment>[] = [
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: '8%',
      align: 'center',
      searchable: true
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      width: '17%',
      align: 'left',
      searchable: true
    },
    {
      key: 'reasonForVisit',
      header: 'Reason for Visit',
      width: '15%',
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
      width: '15%',
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
      header: 'Action',
      width: '10%',
      align: 'center',
      render: (_, appointment) => (
        <Group gap="xs" justify="center">
          <Button
            size="xs"
            variant="filled"
            color="cyan"
            onClick={() => onModifyAppointment(appointment.id)}
            leftSection={<Icon icon="fas fa-edit" size={12} />}
            style={{
              fontSize: '10px',
              padding: '4px 8px',
              minWidth: 'auto'
            }}
          >
            Modify
          </Button>
          {appointment.status === 'cancelled' ? (
            <Button
              size="xs"
              variant="filled"
              color="green"
              onClick={() => onReconfirmAppointment(appointment.id)}
              leftSection={<Icon icon="fas fa-check" size={12} />}
              style={{
                fontSize: '10px',
                padding: '4px 8px',
                minWidth: 'auto'
              }}
            >
              Reconfirm
            </Button>
          ) : (
            <Button
              size="xs"
              variant="filled"
              color="red"
              onClick={() => onCancelAppointment(appointment.id)}
              leftSection={<Icon icon="fas fa-times" size={12} />}
              style={{
                fontSize: '10px',
                padding: '4px 8px',
                minWidth: 'auto'
              }}
            >
              Cancel
            </Button>
          )}
        </Group>
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
