import React, { useState } from 'react';
import { Card, Text, Button, Stack, Paper, Grid, Box, Group, ActionIcon, Popover, Menu, Alert } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconRefresh, IconEdit, IconAlertCircle } from '@tabler/icons-react';
import { useDoctorScheduleCalendarViewModel } from '../view-models/useDoctorScheduleCalendarViewModel';

interface DoctorScheduleCalendarProps {
  className?: string;
}

/**
 * Doctor Schedule Calendar Component
 * Displays appointments in a monthly calendar grid view
 * Shows doctor names and appointment times on each day
 */
export const DoctorScheduleCalendar: React.FC<DoctorScheduleCalendarProps> = ({ 
  className 
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [editPopoverOpened, setEditPopoverOpened] = useState<{ [key: string]: boolean }>({});
  const [lastError, setLastError] = useState<string | null>(null);
  
  const {
    appointments,
    loading,
    error,
    availableDoctors,
    refreshData,
    getAppointmentsForDate,
    updateAppointmentDoctor,
    isUpdatingDate
  } = useDoctorScheduleCalendarViewModel();

  // Calendar helper functions
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getLastDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const getStartingDayOfWeek = (date: Date) => {
    return getFirstDayOfMonth(date).getDay();
  };

  const getDaysInMonth = (date: Date) => {
    return getLastDayOfMonth(date).getDate();
  };

  const generateCalendarDays = () => {
    const startingDayOfWeek = getStartingDayOfWeek(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    const days = [];

    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      days.push({
        day,
        date,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month's leading days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      days.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Format month/year header
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }).toUpperCase();
  };

  // Format appointment time for display
  const formatTimeForDisplay = (time: string, formattedTime?: string) => {
    if (formattedTime) return formattedTime;
    
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}${minutes !== '00' ? `:${minutes}` : ''} ${ampm}`;
  };

  // Helper function to get popover key for a specific date
  const getPopoverKey = (dayInfo: any) => {
    return `${dayInfo.date.getFullYear()}-${dayInfo.date.getMonth()}-${dayInfo.date.getDate()}`;
  };

  // Handle popover toggle
  const togglePopover = (dayInfo: any) => {
    const key = getPopoverKey(dayInfo);
    setEditPopoverOpened(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle doctor assignment change
  const handleDoctorChange = async (dayInfo: any, newDoctorId: string, newDoctorName: string) => {
    try {
      setLastError(null); // Clear previous errors
      await updateAppointmentDoctor(dayInfo.date, newDoctorId, newDoctorName);
      // Close the popover
      const key = getPopoverKey(dayInfo);
      setEditPopoverOpened(prev => ({
        ...prev,
        [key]: false
      }));
    } catch (error) {
      console.error('Failed to update doctor assignment:', error);
      setLastError('Failed to update doctor assignment. Please try again.');
    }
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (error) {
    return (
      <Card className={className} p="md">
        <Text c="red" size="sm">
          Error loading appointments: {error}
        </Text>
        <Button size="xs" variant="light" onClick={refreshData} mt="sm">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className={className} style={{ width: '100%' }}>
      <Card p="lg" withBorder>
        {/* Header */}
        <Group justify="space-between" mb="md">
          <Group>
            <ActionIcon 
              variant="light" 
              onClick={goToPreviousMonth}
              disabled={loading}
            >
              <IconChevronLeft size={16} />
            </ActionIcon>
            
            <Text size="xl" fw={600} c="blue">
              Doctor's Schedule
            </Text>
            
            <ActionIcon 
              variant="light" 
              onClick={goToNextMonth}
              disabled={loading}
            >
              <IconChevronRight size={16} />
            </ActionIcon>
          </Group>
          
          <Group>
            <ActionIcon 
              variant="light" 
              onClick={refreshData}
              loading={loading}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Month/Year Display */}
        <Text size="lg" fw={500} ta="center" mb="md" c="blue">
          {formatMonthYear(currentDate)}
        </Text>

        {/* Error Alert */}
        {(error || lastError) && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            color="red" 
            mb="md"
            onClose={() => {
              setLastError(null);
            }}
            withCloseButton
          >
            {lastError || error}
          </Alert>
        )}

        {/* Calendar Grid */}
        <Box>
          {/* Week Day Headers */}
          <Grid gutter="xs" mb="xs">
            {weekDays.map((day) => (
              <Grid.Col key={day} span={12/7} style={{ minWidth: 0 }}>
                <Text 
                  ta="center" 
                  fw={600} 
                  size="sm" 
                  c="blue"
                  p="xs"
                >
                  {day}
                </Text>
              </Grid.Col>
            ))}
          </Grid>

          {/* Calendar Days */}
          <Grid gutter="xs">
            {calendarDays.map((dayInfo, index) => {
              const dayAppointments = getAppointmentsForDate(dayInfo.date);
              const popoverKey = getPopoverKey(dayInfo);
              const hasAppointments = dayAppointments.length > 0;
              const isUpdating = isUpdatingDate(dayInfo.date);
              
              return (
                <Grid.Col key={index} span={12/7} style={{ minWidth: 0 }}>
                  <Popover 
                    opened={editPopoverOpened[popoverKey] || false} 
                    onClose={() => setEditPopoverOpened(prev => ({ ...prev, [popoverKey]: false }))}
                    position="bottom"
                    withArrow
                    shadow="md"
                  >
                    <Popover.Target>
                      <Paper
                        p="xs"
                        withBorder
                        style={{
                          minHeight: '100px',
                          backgroundColor: dayInfo.isCurrentMonth 
                            ? (dayInfo.isToday ? '#e7f5ff' : 'white')
                            : '#f8f9fa',
                          opacity: dayInfo.isCurrentMonth ? 1 : 0.6,
                          position: 'relative',
                          cursor: hasAppointments && dayInfo.isCurrentMonth ? 'pointer' : 'default',
                          transition: 'background-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (hasAppointments && dayInfo.isCurrentMonth) {
                            e.currentTarget.style.backgroundColor = dayInfo.isToday ? '#d0ebff' : '#f8f9fa';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (hasAppointments && dayInfo.isCurrentMonth) {
                            e.currentTarget.style.backgroundColor = dayInfo.isToday ? '#e7f5ff' : 'white';
                          }
                        }}
                      >
                        {/* Day Number with Edit Icon */}
                        <Group justify="space-between" align="flex-start" mb="xs">
                          <Text 
                            size="sm" 
                            fw={dayInfo.isToday ? 700 : 400}
                            c={dayInfo.isCurrentMonth ? (dayInfo.isToday ? 'blue' : 'dark') : 'dimmed'}
                          >
                            {dayInfo.day}
                          </Text>
                          
                          {hasAppointments && dayInfo.isCurrentMonth && (
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              c="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePopover(dayInfo);
                              }}
                              style={{
                                opacity: 0.7,
                                transition: 'opacity 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '1';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '0.7';
                              }}
                            >
                              <IconEdit size={12} />
                            </ActionIcon>
                          )}
                        </Group>

                        {/* Appointments for this day */}
                        {hasAppointments && (
                          <Stack gap={4}>
                            {dayAppointments.slice(0, 2).map((appointment) => (
                              <Box
                                key={appointment.id}
                                p={4}
                                style={{
                                  backgroundColor: '#e7f5ff',
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  lineHeight: 1.2,
                                }}
                              >
                                <Text size="xs" fw={500} c="blue" truncate>
                                  Dr. {appointment.doctorName}
                                </Text>
                                <Text size="xs" c="blue" truncate>
                                  {appointment.formattedTime}
                                </Text>
                              </Box>
                            ))}
                            {dayAppointments.length > 2 && (
                              <Text size="xs" c="dimmed" ta="center">
                                +{dayAppointments.length - 2} more
                              </Text>
                            )}
                          </Stack>
                        )}

                        {isUpdating && dayInfo.isCurrentMonth && (
                          <Text size="xs" c="blue" ta="center" mt="xs" fw={500}>
                            Updating...
                          </Text>
                        )}
                      </Paper>
                    </Popover.Target>
                    
                    <Popover.Dropdown>
                      <Stack gap="xs" style={{ minWidth: 200 }}>
                        <Text size="sm" fw={500}>
                          Change Doctor Assignment
                        </Text>
                        
                        {hasAppointments && (
                          <>
                            <Text size="xs" c="dimmed">
                              Currently assigned: Dr. {dayAppointments[0].doctorName}
                            </Text>
                            
                            <Text size="xs" fw={500} mt="xs" mb="xs">
                              Available Doctors:
                            </Text>
                            
                            {availableDoctors
                              .filter(doctor => doctor.id !== dayAppointments[0].doctorId)
                              .map((doctor) => (
                                <Button
                                  key={doctor.id}
                                  variant="light"
                                  size="xs"
                                  onClick={() => handleDoctorChange(dayInfo, doctor.id, doctor.name)}
                                  disabled={loading || isUpdating}
                                  loading={isUpdating}
                                >
                                  Dr. {doctor.name}
                                </Button>
                              ))}
                          </>
                        )}
                      </Stack>
                    </Popover.Dropdown>
                  </Popover>
                </Grid.Col>
              );
            })}
          </Grid>
        </Box>
      </Card>
    </div>
  );
};

export default DoctorScheduleCalendar;
