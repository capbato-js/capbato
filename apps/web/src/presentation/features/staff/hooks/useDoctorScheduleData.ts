import { useMemo } from 'react';
import { useDoctorScheduleCalendarViewModel } from '../view-models/useDoctorScheduleCalendarViewModel';
import { convertScheduleBlocksToEntries } from '../utils/doctorScheduleUtils';
import type { ScheduleEntry } from '../types';

export const useDoctorScheduleData = () => {
  const {
    scheduleBlocks,
    error,
    availableDoctors,
    refreshData,
  } = useDoctorScheduleCalendarViewModel();

  const scheduleEntries: ScheduleEntry[] = useMemo(() => {
    return convertScheduleBlocksToEntries(scheduleBlocks);
  }, [scheduleBlocks]);

  return {
    scheduleEntries: error ? [] : scheduleEntries,
    availableDoctors,
    error,
    refreshData,
  };
};