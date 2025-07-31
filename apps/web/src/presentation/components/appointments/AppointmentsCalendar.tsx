import React, { useState } from 'react';
import { Box, Button, Title } from '@mantine/core';
import { Icon } from '../common';
import { Appointment } from './types';

interface AppointmentsCalendarProps {
  appointments: Appointment[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({ 
  appointments, 
  onDateSelect,
  selectedDate 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(appointment => appointment.date === dateString);
  };

  // Check if a date is selected
  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateString === selectedDate;
  };

  const handleDateClick = (day: number) => {
    if (onDateSelect) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      onDateSelect(dateString);
    }
  };

  return (
    <Box style={{ marginTop: '30px' }}>
      {/* Calendar Title */}
      <Box style={{ marginBottom: '20px' }}>
        <Title
          order={2}
          style={{
            color: '#0b4f6c',
            fontSize: '22px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '8px'
          }}
        >
          Appointments Calendar
        </Title>
      </Box>

      {/* Navigation */}
      <Box 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}
      >
        <Button
          variant="light"
          onClick={goToPreviousMonth}
          style={{
            fontSize: '20px',
            padding: '4px 10px'
          }}
        >
          <Icon icon="fas fa-chevron-left" />
        </Button>
        
        <Box
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#0047ab',
            textTransform: 'uppercase',
            fontSize: '1.25rem',
            flexGrow: 1
          }}
        >
          {MONTHS[currentMonth]} {currentYear}
        </Box>
        
        <Button
          variant="light"
          onClick={goToNextMonth}
          style={{
            fontSize: '20px',
            padding: '4px 10px'
          }}
        >
          <Icon icon="fas fa-chevron-right" />
        </Button>
      </Box>

      {/* Calendar Headers */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#0047ab',
          backgroundColor: '#dbe5ff',
          borderRadius: '12px 12px 0 0',
          overflow: 'hidden'
        }}
      >
        {DAYS.map((day, index) => (
          <Box
            key={day}
            style={{
              padding: '12px 0',
              borderRight: index < DAYS.length - 1 ? '1px solid #c0d6f7' : 'none'
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '12px',
          paddingTop: '12px'
        }}
      >
        {calendarDays.map((day, index) => {
          if (day === null) {
            return (
              <Box
                key={`empty-${index}`}
                style={{
                  background: 'transparent',
                  minHeight: '100px'
                }}
              />
            );
          }

          const dayAppointments = getAppointmentsForDate(day);
          const isSelected = isDateSelected(day);
          
          return (
            <Box
              key={day}
              onClick={() => handleDateClick(day)}
              style={{
                backgroundColor: isSelected ? '#b9f6ca' : '#ecf5ff',
                borderRadius: '12px',
                padding: '10px',
                minHeight: '100px',
                fontWeight: 500,
                color: '#333',
                boxShadow: isSelected ? '0 4px 8px rgba(77, 182, 172, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isSelected ? '2px solid #4db6ac' : '2px solid transparent'
              }}
            >
              <Box
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '6px'
                }}
              >
                {day}
              </Box>
              
              {dayAppointments.length > 0 && (
                <Box
                  style={{
                    fontSize: '11px',
                    backgroundColor: 'transparent',
                    color: '#0047ab',
                    fontWeight: 600,
                    lineHeight: 1.2
                  }}
                >
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <Box
                      key={appointment.id}
                      style={{
                        marginBottom: '2px',
                        padding: '2px 4px',
                        backgroundColor: 
                          appointment.status === 'confirmed' ? '#b9f6ca' :
                          appointment.status === 'pending' ? '#ffcc80' :
                          '#ff8a80',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 
                          appointment.status === 'confirmed' ? '#006400' :
                          appointment.status === 'pending' ? '#8c5000' :
                          '#8b0000',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {appointment.time} - {appointment.patientName.split(' ')[0]}
                    </Box>
                  ))}
                  {dayAppointments.length > 3 && (
                    <Box
                      style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#0b4f6c',
                        textAlign: 'center',
                        marginTop: '2px'
                      }}
                    >
                      +{dayAppointments.length - 3} more
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
