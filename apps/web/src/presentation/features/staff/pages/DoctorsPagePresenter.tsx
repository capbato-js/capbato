import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { DoctorsTable, DoctorScheduleCalendar } from '../components';
import type { ScheduleEntry } from '../types';

interface DoctorsPagePresenterProps {
  scheduleEntries: ScheduleEntry[];
  availableDoctors: any[];
  onDoctorChange: (date: string, newDoctorId: string, newDoctorName: string) => Promise<void>;
}

export const DoctorsPagePresenter: React.FC<DoctorsPagePresenterProps> = ({
  scheduleEntries,
  availableDoctors,
  onDoctorChange,
}) => {
  return (
    <MedicalClinicLayout>
      {/* Doctors Table */}
      <DoctorsTable />
      
      {/* Doctor's Schedule Calendar - Shows doctor availability based on schedule patterns */}
      <DoctorScheduleCalendar 
        schedules={scheduleEntries}
        availableDoctors={availableDoctors}
        onDoctorChange={onDoctorChange}
      />
    </MedicalClinicLayout>
  );
};