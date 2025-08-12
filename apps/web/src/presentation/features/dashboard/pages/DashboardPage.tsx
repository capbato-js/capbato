import React, { useEffect } from 'react';
import { Box, Title, Grid } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { DashboardStatCard, DashboardAppointmentsTable } from '../../../components/common';
import { useDashboardViewModel } from '../view-models';
import { useNavigate } from 'react-router-dom';
import { useMantineTheme } from '@mantine/core';

export const DashboardPage: React.FC = () => {
  const { stats, todayAppointments, isLoading, isDoctorLoading, loadDashboardData } = useDashboardViewModel();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSeeAllAppointments = () => {
    navigate('/appointments');
  };

  return (
    <MedicalClinicLayout>
      {/* Stats Cards Section */}
      <Grid style={{ marginBottom: '32px' }}>
        <Grid.Col span={4}>
          <DashboardStatCard
            icon="👨‍⚕️"
            title="Doctor"
            value={stats.doctorName}
            iconColor="#fff"
            backgroundColor="#4263EB"
            isLoading={isDoctorLoading}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <DashboardStatCard
            icon="👥"
            title="Current Patient"
            value={stats.currentPatient}
            subtitle={stats.currentPatient !== 'N/A' ? "Ongoing Now" : undefined}
            iconColor="#fff"
            backgroundColor="#51CF66"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <DashboardStatCard
            icon="📅"
            title="Total Appointments"
            value={stats.totalAppointments.toString()}
            subtitle={stats.totalAppointmentsDate}
            iconColor="#fff"
            backgroundColor="#4DABF7"
          />
        </Grid.Col>
      </Grid>

      {/* Today's Appointments Section */}
      <Box style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: '0',
        position: 'relative'
      }}>
        <Title 
          order={2}
          style={{
            color: theme.colors.customGray[8],
            fontSize: '18px',
            fontWeight: 600,
            margin: 0,
            textAlign: 'center'
          }}
        >
          Today's Appointments
        </Title>
        <Box
          onClick={handleSeeAllAppointments}
          style={{
            color: theme.colors.blue[7],
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            position: 'absolute',
            right: 0
          }}
        >
          See All
        </Box>
      </Box>
      
      {/* Today's Appointments Section - Now scrollable */}
      <Box style={{ marginBottom: '24px' }}>
        {isLoading ? (
          <Box style={{ textAlign: 'center', marginTop: '40px', color: '#9ca3af' }}>
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
