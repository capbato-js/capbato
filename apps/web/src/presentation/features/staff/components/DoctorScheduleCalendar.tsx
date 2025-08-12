import React, { useState } from 'react';
import { Box, Button, Title, Menu, Text, ActionIcon, Tooltip, useMantineTheme } from '@mantine/core';
import { IconEdit, IconUser } from '@tabler/icons-react';
import { Icon } from '../../../components/common';
import { ScheduleEntry } from '../types';
import { useUserRole } from '../../../../infrastructure/auth';

interface DoctorScheduleCalendarProps {
  schedules: ScheduleEntry[];
  availableDoctors?: Array<{ id: string; name: string; }>;
  onDoctorChange?: (date: string, newDoctorId: string, newDoctorName: string) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DoctorScheduleCalendar: React.FC<DoctorScheduleCalendarProps> = ({ 
  schedules, 
  availableDoctors = [],
  onDoctorChange 
}) => {
  const theme = useMantineTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const { isAdmin } = useUserRole();

  // Debug logging for DoctorScheduleCalendar
  console.log('📅 [DEBUG] DoctorScheduleCalendar render:', {
    schedulesCount: schedules.length,
    availableDoctorsCount: availableDoctors.length,
    currentMonth: currentDate.getMonth() + 1,
    currentYear: currentDate.getFullYear(),
    sampleSchedules: schedules.slice(0, 3),
    hasOnDoctorChange: !!onDoctorChange
  });

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
    const foundSchedule = schedules.find(schedule => schedule.date === dateString);
    
    // Debug logging for schedule lookup
    if (foundSchedule) {
      console.log(`🎯 [DEBUG] Found schedule for ${dateString}:`, foundSchedule);
    } else if (day <= 15) { // Only log for first half of month to reduce noise
      console.log(`❌ [DEBUG] No schedule found for ${dateString}`);
    }
    
    return foundSchedule;
  };

  // Helper function to check if a date is in the past
  const isDateInPast = (day: number) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    const today = new Date();
    
    // Reset time to compare only dates (not time)
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);
    
    return dateToCheck < today;
  };

  // Helper function to check if a date is a weekend (Saturday = 6, Sunday = 0)
  const isWeekend = (day: number) => {
    const dateToCheck = new Date(currentYear, currentMonth, day);
    const dayOfWeek = dateToCheck.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
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
            color: '#0F0F0F',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: 0,
            width: '100%',
            textAlign: 'center'
          }}
        >
          Doctor's Schedule
        </Title>
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
            color: theme.colors.blue[9],
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
          color: theme.colors.tableBlue[9],
          backgroundColor: theme.colors.tableBlue[0],
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
          const hasSchedule = !!schedule;
          const tileIndex = day; // Using day as unique identifier for this month
          const isPastDate = isDateInPast(day);
          const isWeekendDate = isWeekend(day);
          
          return (
            <Box
              key={day}
              style={{
                backgroundColor: hoveredTile === tileIndex ? theme.colors.tableBlue[1] : theme.colors.tableBlue[0],
                borderRadius: '12px',
                padding: '10px',
                minHeight: '100px',
                fontWeight: 500,
                color: isPastDate ? '#999' : '#333', // Dimmed color for past dates
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                transition: 'background-color 0.2s ease',
                opacity: isPastDate ? 0.6 : 1, // Reduce opacity for past dates
                cursor: isPastDate || isWeekendDate || !isAdmin ? 'default' : 'pointer'
              }}
              onMouseEnter={() => !isPastDate && !isWeekendDate && setHoveredTile(tileIndex)}
              onMouseLeave={() => setHoveredTile(null)}
            >
              <Box
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ height: '24px', fontSize: '16px' }}>{day}</span>
                {hasSchedule && (hoveredTile === tileIndex) && !isDateInPast(day) && !isWeekendDate && isAdmin && (
                  <Menu
                    position="bottom-end"
                    withArrow
                    shadow="md"
                  >
                    <Menu.Target>
                      <Tooltip label="Update Assigned Doctor" position="top">
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color={theme.colors.customGray[8]}
                          style={{ cursor: isAdmin ? 'pointer' : 'default', height: '24px' }}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Menu.Target>
                    
                    <Menu.Dropdown
                      style={{
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        border: '1px solid #e0e7ff',
                        minWidth: '200px'
                      }}
                    >
                      {availableDoctors.length > 0 && (
                        <>
                          <Box style={{ padding: '8px 16px 4px' }}>
                            <Text size="xs" c="dimmed" fw={600}>
                              Change to:
                            </Text>
                          </Box>
                          {availableDoctors
                            .filter(doctor => {
                              // Filter out the currently assigned doctor using doctor ID
                              return doctor.id !== schedule?.doctorId;
                            })
                            .map(doctor => (
                              <Menu.Item
                                key={doctor.id}
                                leftSection={<IconUser size={16} />}
                                onClick={() => {
                                  if (onDoctorChange) {
                                    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                                    onDoctorChange(dateStr, doctor.id, doctor.name);
                                  }
                                }}
                                style={{
                                  fontSize: '14px',
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                }}
                              >
                                {doctor.name}
                              </Menu.Item>
                            ))}
                        </>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Box>
              
              {schedule && (
                <Box
                  style={{
                    marginTop: '6px',
                    fontSize: '12px',
                    backgroundColor: 'transparent',
                    color: theme.colors.blue[7],
                    fontWeight: 600,
                    lineHeight: 1.3,
                    wordBreak: 'break-word'
                  }}
                >
                  {/* Show only doctor name, not MWF/TTH/OVERRIDE labels */}
                  {schedule.details && !['MWF', 'TTH', 'OVERRIDE'].includes(schedule.details) && (
                    <Box
                      component="strong"
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        color: theme.colors.blue[9]
                      }}
                    >
                      {schedule.details}
                    </Box>
                  )}
                  {schedule.note && !['MWF', 'TTH', 'OVERRIDE'].includes(schedule.note) && schedule.note}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
