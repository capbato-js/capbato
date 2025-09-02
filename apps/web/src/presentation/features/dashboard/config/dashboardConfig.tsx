import React from 'react';
import { DashboardStatCard } from '../../../components/common';

export interface DashboardStats {
  doctorName: string;
  currentPatient: string;
  totalAppointments: number;
  totalAppointmentsDate: string;
}

export const getDashboardStatsCards = (stats: DashboardStats, isDoctorLoading: boolean) => [
  {
    span: 4,
    component: (
      <DashboardStatCard
        icon="👨‍⚕️"
        title="Doctor"
        value={stats.doctorName}
        iconColor="#fff"
        backgroundColor="#4263EB"
        isLoading={isDoctorLoading}
      />
    )
  },
  {
    span: 4,
    component: (
      <DashboardStatCard
        icon="👥"
        title="Current Patient"
        value={stats.currentPatient}
        subtitle={stats.currentPatient !== 'N/A' ? "Ongoing Now" : undefined}
        iconColor="#fff"
        backgroundColor="#51CF66"
      />
    )
  },
  {
    span: 4,
    component: (
      <DashboardStatCard
        icon="📅"
        title="Total Appointments"
        value={stats.totalAppointments.toString()}
        subtitle={stats.totalAppointmentsDate}
        iconColor="#fff"
        backgroundColor="#4DABF7"
      />
    )
  }
];