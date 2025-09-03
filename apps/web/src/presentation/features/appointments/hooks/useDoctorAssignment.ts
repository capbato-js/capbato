import { useState, useCallback } from 'react';
import { getDoctorForDate, getDoctorIdForDate } from '../utils/appointmentFormUtils';

/**
 * Custom hook to manage doctor assignment based on selected date
 */
export const useDoctorAssignment = (onClearError?: () => void) => {
  const [assignedDoctor, setAssignedDoctor] = useState<string>('');

  const assignDoctorForDate = useCallback(async (selectedDate: Date | null) => {
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      try {
        const [doctor, doctorId] = await Promise.all([
          getDoctorForDate(selectedDate),
          getDoctorIdForDate(selectedDate)
        ]);
        
        setAssignedDoctor(doctor);
        
        // Clear any previous doctor assignment errors
        if (onClearError) {
          onClearError();
        }

        return { doctorName: doctor, doctorId };
      } catch (error) {
        console.error('Error assigning doctor for date:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorDisplay = `Error: ${errorMessage}`;
        setAssignedDoctor(errorDisplay);
        
        return { doctorName: errorDisplay, doctorId: null };
      }
    } else {
      // Clear doctor assignment if no valid date is selected
      setAssignedDoctor('');
      return { doctorName: '', doctorId: null };
    }
  }, [onClearError]);

  const clearDoctorAssignment = useCallback(() => {
    setAssignedDoctor('');
  }, []);

  const isDoctorAssignmentValid = useCallback((doctorName: string) => {
    return !!(
      doctorName && 
      !doctorName.startsWith('Error') && 
      doctorName !== 'No doctor assigned'
    );
  }, []);

  return {
    assignedDoctor,
    assignDoctorForDate,
    clearDoctorAssignment,
    isDoctorAssignmentValid,
    setAssignedDoctor
  };
};