import React from 'react';
import { Box, Title, Grid } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { DashboardAppointmentsTable } from '../../../components/common';
import { useMantineTheme } from '@mantine/core';
import { getDashboardStatsCards, DashboardStats } from '../config/dashboardConfig';
import { getDashboardStyles } from '../utils/dashboardStyles';
import { WeeklyAppointmentTrendsChart, TopLabTestsChart, TopVisitReasonsChart, type TimeRange, type Granularity } from '../components';
import { WeeklyAppointmentSummaryDto, TopLabTestDto, TopVisitReasonDto } from '@nx-starter/application-shared';

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
  topLabTests: TopLabTestDto[];
  isTopLabTestsLoading: boolean;
  topLabTestsTimeRange: TimeRange;
  topLabTestsCustomStartDate?: Date;
  topLabTestsCustomEndDate?: Date;
  onTopLabTestsTimeRangeChange: (range: TimeRange) => void;
  onTopLabTestsCustomDateChange: (startDate: Date, endDate: Date) => void;
  onTopLabTestsRefresh: () => void;
  topVisitReasons: TopVisitReasonDto[];
  isTopVisitReasonsLoading: boolean;
  topVisitReasonsTimeRange: TimeRange;
  topVisitReasonsCustomStartDate?: Date;
  topVisitReasonsCustomEndDate?: Date;
  onTopVisitReasonsTimeRangeChange: (range: TimeRange) => void;
  onTopVisitReasonsCustomDateChange: (startDate: Date, endDate: Date) => void;
  onTopVisitReasonsRefresh: () => void;
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
  topLabTests,
  isTopLabTestsLoading,
  topLabTestsTimeRange,
  topLabTestsCustomStartDate,
  topLabTestsCustomEndDate,
  onTopLabTestsTimeRangeChange,
  onTopLabTestsCustomDateChange,
  onTopLabTestsRefresh,
  topVisitReasons,
  isTopVisitReasonsLoading,
  topVisitReasonsTimeRange,
  topVisitReasonsCustomStartDate,
  topVisitReasonsCustomEndDate,
  onTopVisitReasonsTimeRangeChange,
  onTopVisitReasonsCustomDateChange,
  onTopVisitReasonsRefresh,
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

          {/* Top Lab Tests Section */}
          <Box style={{ ...styles.headerContainer, marginTop: '2rem' }}>
            <Title order={2} style={styles.headerTitle}>
              Most Requested Lab Tests
            </Title>
          </Box>

          <Box style={{ marginBottom: '2rem', marginTop: '1rem' }}>
            <TopLabTestsChart
              data={topLabTests}
              isLoading={isTopLabTestsLoading}
              timeRange={topLabTestsTimeRange}
              customStartDate={topLabTestsCustomStartDate}
              customEndDate={topLabTestsCustomEndDate}
              onTimeRangeChange={onTopLabTestsTimeRangeChange}
              onCustomDateChange={onTopLabTestsCustomDateChange}
              onRefresh={onTopLabTestsRefresh}
            />
          </Box>

          {/* Most Common Visit Reasons Section */}
          <Box style={{ ...styles.headerContainer, marginTop: '2rem' }}>
            <Title order={2} style={styles.headerTitle}>
              Most Common Visit Reasons
            </Title>
          </Box>

          <Box style={{ marginBottom: '2rem', marginTop: '1rem' }}>
            <TopVisitReasonsChart
              data={topVisitReasons}
              isLoading={isTopVisitReasonsLoading}
              timeRange={topVisitReasonsTimeRange}
              customStartDate={topVisitReasonsCustomStartDate}
              customEndDate={topVisitReasonsCustomEndDate}
              onTimeRangeChange={onTopVisitReasonsTimeRangeChange}
              onCustomDateChange={onTopVisitReasonsCustomDateChange}
              onRefresh={onTopVisitReasonsRefresh}
            />
          </Box>
        </>
      )}
    </MedicalClinicLayout>
  );
};