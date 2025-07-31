import React, { useState } from 'react';
import { Box, Button, Title } from '@mantine/core';
import { Icon } from '../../../components/common';
import { ScheduleEntry } from '../types';

interface CustomCalendarProps {
  schedules: ScheduleEntry[];
  onEdit?: () => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CustomCalendar: React.FC<CustomCalendarProps> = ({ schedules, onEdit }) => {
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

  const getScheduleForDate = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.find(schedule => schedule.date === dateString);
  };

  return (
    <Box style={{ marginTop: '30px' }}>
      {/* Top Row: Title + Edit */}
      <Box 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '8px',
          position: 'relative'
        }}
      >
        <Title 
          order={2}
          style={{
            color: '#0b4f6c',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: 0,
            width: '100%',
            textAlign: 'center'
          }}
        >
          Doctor's Schedule
        </Title>
        {onEdit && (
          <Button
            size="sm"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              backgroundColor: '#007bff',
              border: 'none'
            }}
            onClick={onEdit}
          >
            <Icon icon="fas fa-edit" style={{ marginRight: '5px' }} />
            Edit
          </Button>
        )}
      </Box>

      {/* Second Row: Arrows + Month */}
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

          const schedule = getScheduleForDate(day);
          
          return (
            <Box
              key={day}
              style={{
                backgroundColor: '#ecf5ff',
                borderRadius: '12px',
                padding: '10px',
                minHeight: '100px',
                fontWeight: 500,
                color: '#333',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                position: 'relative'
              }}
            >
              <Box
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {day}
              </Box>
              
              {schedule && (
                <Box
                  style={{
                    marginTop: '6px',
                    fontSize: '12px',
                    backgroundColor: 'transparent',
                    color: '#0047ab',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    wordBreak: 'break-word'
                  }}
                >
                  {schedule.details && (
                    <Box
                      component="strong"
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        color: '#0b4f6c'
                      }}
                    >
                      {schedule.details}
                    </Box>
                  )}
                  {schedule.note}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
