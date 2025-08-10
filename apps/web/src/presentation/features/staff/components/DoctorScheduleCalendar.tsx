import React, { useState } from 'react';
import { Card, Text, Button, Stack, Paper, Grid, Box, Group, ActionIcon, Alert, useMantineTheme } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconRefresh, IconAlertCircle } from '@tabler/icons-react';
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
  const theme = useMantineTheme();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const {
    loading,
    error,
    refreshData,
    getScheduleBlocksForDate,
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
        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            color="red" 
            mb="md"
          >
            {error}
          </Alert>
        )}

        {/* Calendar Grid */}
        <Box>
          {/* Week Day Headers */}
          <Grid gutter="xs" mb="xs">
            {weekDays.map((day) => (
              <Grid.Col key={day} span={12/7} style={{ minWidth: 0, backgroundColor: theme.colors.gray[1]  }}>
                <Text 
                  ta="center" 
                  fw={600} 
                  size="sm" 
                  style={{ color: theme.colors.tableBlue[9] }}
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
              const dayScheduleBlocks = getScheduleBlocksForDate(dayInfo.date);
              const hasScheduledDoctors = dayScheduleBlocks.length > 0;
              
              // Debug logging
              if (dayInfo.isCurrentMonth && hasScheduledDoctors) {
                console.log(`Day ${dayInfo.day} has ${dayScheduleBlocks.length} schedule blocks:`, dayScheduleBlocks);
              }
              
              return (
                <Grid.Col key={index} span={12/7} style={{ minWidth: 0 }}>
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
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {/* Day Number */}
                    <Group justify="space-between" align="flex-start" mb="xs">
                      <Text 
                        size="sm" 
                        fw={dayInfo.isToday ? 700 : 400}
                        c={dayInfo.isCurrentMonth ? (dayInfo.isToday ? 'blue' : 'dark') : 'dimmed'}
                      >
                        {dayInfo.day}
                      </Text>
                    </Group>

                    {/* Doctor scheduled blocks for this day */}
                    {hasScheduledDoctors && dayInfo.isCurrentMonth && (
                      <Stack gap={2} mt="xs">
                        {dayScheduleBlocks.slice(0, 2).map((block) => (
                          <Box
                            key={block.id}
                            p={3}
                            style={{
                              backgroundColor: '#f0f9ff',
                              borderRadius: '3px',
                              fontSize: '9px',
                              lineHeight: 1.1,
                              border: '1px solid #e0f2fe',
                            }}
                          >
                            <Text size="xs" fw={500} style={{ color: theme.colors.cyan[8] }} truncate>
                              Dr. {block.doctorName}
                            </Text>
                            <Text size="xs" style={{ color: theme.colors.cyan[6] }} truncate>
                              Scheduled
                            </Text>
                            <Text size="xs" style={{ color: theme.colors.cyan[5] }} truncate>
                              {block.schedulePattern}
                            </Text>
                          </Box>
                        ))}
                        {dayScheduleBlocks.length > 2 && (
                          <Text size="xs" c="dimmed" ta="center">
                            +{dayScheduleBlocks.length - 2} more
                          </Text>
                        )}
                      </Stack>
                    )}
                  </Paper>
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
