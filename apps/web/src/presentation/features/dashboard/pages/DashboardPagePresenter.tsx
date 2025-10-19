import React from 'react';
import { Box, Title, Grid } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { DashboardAppointmentsTable } from '../../../components/common';
import { useMantineTheme } from '@mantine/core';
import { getDashboardStatsCards, DashboardStats } from '../config/dashboardConfig';
import { getDashboardStyles } from '../utils/dashboardStyles';
import { WeeklyAppointmentTrendsChart, type TimeRange, type Granularity } from '../components';
import { WeeklyAppointmentSummaryDto } from '@nx-starter/application-shared';

interface DashboardPagePresenterProps {
  stats: DashboardStats;
  todayAppointments: any[];
  isLoading: boolean;
  isDoctorLoading: boolean;
  onSeeAllAppointments: () => void;
  weeklyData: WeeklyAppointmentSummaryDto[];
  isWeeklyDataLoading: boolean;
  isAdmin: boolean;
  timeRange: TimeRange;
  granularity: Granularity;
  customStartDate?: Date;
  customEndDate?: Date;
  onTimeRangeChange: (range: TimeRange) => void;
  onGranularityChange: (granularity: Granularity) => void;
  onCustomDateChange: (startDate: Date, endDate: Date) => void;
  onRefresh: () => void;
}

export const DashboardPagePresenter: React.FC<DashboardPagePresenterProps> = ({
  stats,
  todayAppointments,
  isLoading,
  isDoctorLoading,
  onSeeAllAppointments,
  weeklyData,
  isWeeklyDataLoading,
  isAdmin,
  timeRange,
  granularity,
  customStartDate,
  customEndDate,
  onTimeRangeChange,
  onGranularityChange,
  onCustomDateChange,
  onRefresh,
}) => {
  const theme = useMantineTheme();
  const styles = getDashboardStyles(theme);
  const statsCards = getDashboardStatsCards(stats, isDoctorLoading);

  return (
    <MedicalClinicLayout>
      {/* Stats Cards Section */}
      <Grid style={styles.statsGrid}>
        {statsCards.map((card, index) => (
          <Grid.Col key={index} span={card.span}>
            {card.component}
          </Grid.Col>
        ))}
      </Grid>

      {/* Today's Appointments Section */}
      <Box style={styles.headerContainer}>
        <Title order={2} style={styles.headerTitle}>
          Today's Appointments
        </Title>
        <Box onClick={onSeeAllAppointments} style={styles.seeAllButton}>
          See All
        </Box>
      </Box>

      {/* Today's Appointments Table */}
      <Box style={styles.appointmentsContainer}>
        {isLoading ? (
          <Box style={styles.loadingContainer}>
            Loading appointments...
          </Box>
        ) : (
          <DashboardAppointmentsTable
            appointments={todayAppointments}
            maxRows={10}
          />
        )}
      </Box>

      {/* Appointment Analytics Section - Admin Only */}
      {isAdmin && (
        <>
          <Box style={{ ...styles.headerContainer, marginTop: '2rem' }}>
            <Title order={2} style={styles.headerTitle}>
              Appointment Analytics
            </Title>
          </Box>

          <Box style={{ marginBottom: '2rem', marginTop: '1rem' }}>
            <WeeklyAppointmentTrendsChart
              data={weeklyData}
              isLoading={isWeeklyDataLoading}
              timeRange={timeRange}
              granularity={granularity}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onTimeRangeChange={onTimeRangeChange}
              onGranularityChange={onGranularityChange}
              onCustomDateChange={onCustomDateChange}
              onRefresh={onRefresh}
            />
          </Box>
        </>
      )}
    </MedicalClinicLayout>
  );
};