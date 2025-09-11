import React from 'react';
import { useDoctorScheduleData } from '../hooks/useDoctorScheduleData';
import { useDoctorActions } from '../hooks/useDoctorActions';
import { DoctorsPagePresenter } from './DoctorsPagePresenter';

export const DoctorsPageContainer: React.FC = () => {
  const { scheduleEntries, availableDoctors, error, refreshData } = useDoctorScheduleData();
  const { handleDoctorChange } = useDoctorActions(refreshData);

  return (
    <DoctorsPagePresenter
      scheduleEntries={scheduleEntries}
      availableDoctors={availableDoctors}
      onDoctorChange={handleDoctorChange}
    />
  );
};