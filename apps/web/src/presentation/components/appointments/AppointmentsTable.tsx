import React, { useState, useMemo } from 'react';
import { Box, Button, Title, Text, Group, Checkbox, Table } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Icon } from '../common';
import { Appointment } from './types';

interface AppointmentsTableProps {
  appointments: Appointment[];
  selectedDate?: string;
  onAddAppointment: () => void;
  onModifyAppointment: (appointmentId: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onReconfirmAppointment: (appointmentId: string) => void;
  onDateSelect?: (date: string) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  selectedDate: initialSelectedDate,
  onAddAppointment,
  onModifyAppointment,
  onCancelAppointment,
  onReconfirmAppointment,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialSelectedDate ? new Date(initialSelectedDate) : new Date()
  );
  const [showAll, setShowAll] = useState(false);

  // Update local state when prop changes
  React.useEffect(() => {
    if (initialSelectedDate) {
      setSelectedDate(new Date(initialSelectedDate));
    }
  }, [initialSelectedDate]);

  // Filter appointments based on selected date and showAll checkbox
  const filteredAppointments = useMemo(() => {
    if (showAll) {
      return appointments;
    }
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.date === selectedDateString);
  }, [appointments, selectedDate, showAll]);

  const handleDateChange = (value: string | null) => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      if (onDateSelect) {
        onDateSelect(value);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusStyle = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return {
          background: '#ffcc80',
          color: '#8c5000',
          padding: '5px 10px',
          borderRadius: '5px',
          fontWeight: 'bold',
          display: 'inline-block'
        };
      case 'confirmed':
        return {
          background: '#b9f6ca',
          color: '#006400',
          padding: '5px 10px',
          borderRadius: '5px',
          fontWeight: 'bold',
          display: 'inline-block'
        };
      case 'cancelled':
        return {
          background: '#ff8a80',
          color: '#8b0000',
          padding: '5px 10px',
          borderRadius: '5px',
          fontWeight: 'bold',
          display: 'inline-block'
        };
      default:
        return {};
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '25px',
          position: 'relative'
        }}
      >
        <Title
          order={1}
          style={{
            color: '#0b4f6c',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: 0
          }}
        >
          Appointments
        </Title>
        <Button
          onClick={onAddAppointment}
          leftSection={<Icon icon="fas fa-calendar-plus" />}
          style={{
            position: 'absolute',
            right: 0
          }}
        >
          Add Appointment
        </Button>
      </Box>

      {/* Filter Controls */}
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
          marginBottom: '15px',
          flexWrap: 'wrap'
        }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Text
            style={{
              fontWeight: 600,
              color: '#0b4f6c',
              fontSize: '14px'
            }}
          >
            Select Date:
          </Text>
          <DateInput
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            placeholder="Pick date"
            size="sm"
            valueFormat="MM/DD/YYYY"
            rightSection={<Icon icon="fas fa-calendar" size={14} />}
            style={{ width: '140px' }}
          />
        </Box>
        
        <Group gap="xs">
          <Checkbox
            checked={showAll}
            onChange={(event) => setShowAll(event.currentTarget.checked)}
            style={{
              input: {
                width: '18px',
                height: '18px',
                accentColor: '#4db6ac',
                cursor: 'pointer'
              }
            }}
          />
          <Text
            style={{
              fontWeight: 600,
              color: showAll ? '#4db6ac' : '#0b4f6c',
              fontSize: '14px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={() => setShowAll(!showAll)}
          >
            Show All
          </Text>
        </Group>
      </Box>

      {/* Appointment Count */}
      <Text
        style={{
          marginTop: '10px',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}
      >
        Total Appointments: {filteredAppointments.length}
      </Text>

      {/* Appointments Table */}
      <Box style={{ marginTop: '20px' }}>
        <Table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        >
          <Table.Thead>
            <Table.Tr
              style={{
                background: '#dbeeff'
              }}
            >
              <Table.Th
                style={{
                  width: '8%',
                  padding: '14px',
                  textAlign: 'center',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Patient #
              </Table.Th>
              <Table.Th
                style={{
                  width: '17%',
                  padding: '14px 14px 14px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Patient Name
              </Table.Th>
              <Table.Th
                style={{
                  width: '15%',
                  padding: '14px 14px 14px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Reason for Visit
              </Table.Th>
              <Table.Th
                style={{
                  width: '12%',
                  padding: '14px',
                  textAlign: 'center',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Date
              </Table.Th>
              <Table.Th
                style={{
                  width: '10%',
                  padding: '14px',
                  textAlign: 'center',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Time
              </Table.Th>
              <Table.Th
                style={{
                  width: '15%',
                  padding: '14px 14px 14px 20px',
                  textAlign: 'left',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Doctor
              </Table.Th>
              <Table.Th
                style={{
                  width: '10%',
                  padding: '14px',
                  textAlign: 'center',
                  borderBottom: '1px solid #ddd',
                  borderRight: '1px solid #ddd',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Status
              </Table.Th>
              <Table.Th
                style={{
                  width: '13%',
                  padding: '8px 6px',
                  textAlign: 'center',
                  borderBottom: '1px solid #ddd',
                  color: '#0047ab',
                  fontWeight: 600
                }}
              >
                Action
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredAppointments.map((appointment) => (
              <Table.Tr key={appointment.id}>
                <Table.Td
                  style={{
                    padding: '14px',
                    textAlign: 'center',
                    borderBottom: '1px solid #ddd',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {appointment.patientNumber}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: '14px 14px 14px 20px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  {appointment.patientName}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: '14px 14px 14px 20px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {appointment.reasonForVisit}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: '14px',
                    textAlign: 'center',
                    borderBottom: '1px solid #ddd',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {formatDate(appointment.date)}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: '14px',
                    textAlign: 'center',
                    borderBottom: '1px solid #ddd',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {appointment.time}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: '14px 14px 14px 20px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  {appointment.doctor}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: '14px',
                    textAlign: 'center',
                    borderBottom: '1px solid #ddd',
                    borderRight: '1px solid #ddd',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <span style={getStatusStyle(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </Table.Td>
                <Table.Td
                  style={{
                    padding: '8px 6px',
                    textAlign: 'center',
                    borderBottom: '1px solid #ddd',
                    whiteSpace: 'normal'
                  }}
                >
                  <Group gap="xs" justify="center">
                    <Button
                      size="xs"
                      variant="filled"
                      color="cyan"
                      onClick={() => onModifyAppointment(appointment.id)}
                      leftSection={<Icon icon="fas fa-edit" size={12} />}
                    >
                      Modify
                    </Button>
                    {appointment.status === 'cancelled' ? (
                      <Button
                        size="xs"
                        variant="filled"
                        color="teal"
                        onClick={() => onReconfirmAppointment(appointment.id)}
                        leftSection={<Icon icon="fas fa-redo" size={12} />}
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
                      >
                        Cancel
                      </Button>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
};
