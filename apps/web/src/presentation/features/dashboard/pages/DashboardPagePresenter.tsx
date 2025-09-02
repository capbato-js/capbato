import React from 'react';
import { Box, Title, Grid } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { DashboardAppointmentsTable } from '../../../components/common';
import { useMantineTheme } from '@mantine/core';
import { getDashboardStatsCards, DashboardStats } from '../config/dashboardConfig';
import { getDashboardStyles } from '../utils/dashboardStyles';

interface DashboardPagePresenterProps {
  stats: DashboardStats;
  todayAppointments: any[];
  isLoading: boolean;
  isDoctorLoading: boolean;
  onSeeAllAppointments: () => void;
}

export const DashboardPagePresenter: React.FC<DashboardPagePresenterProps> = ({
  stats,
  todayAppointments,
  isLoading,
  isDoctorLoading,
  onSeeAllAppointments,
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
      
      {/* Today's Appointments Section - Now scrollable */}
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
    </MedicalClinicLayout>
  );
};