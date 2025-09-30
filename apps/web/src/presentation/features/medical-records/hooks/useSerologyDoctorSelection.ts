import { useState, useEffect, useCallback, useRef } from 'react';
import { useDoctorStore } from '../../../../infrastructure/state/DoctorStore';

export interface FormattedDoctor {
  value: string;
  label: string;
}

export const useSerologyDoctorSelection = () => {
  const [doctors, setDoctors] = useState<FormattedDoctor[]>([]);
  const hasLoadedRef = useRef(false);

  // Get doctor store state
  const doctorSummaries = useDoctorStore((state) => state.doctorSummaries);
  const doctorStoreIsLoading = useDoctorStore((state) => state.isLoading);
  const error = useDoctorStore((state) => state.error);
  const getAllDoctors = useDoctorStore((state) => state.getAllDoctors);

  // Load doctors only once when component mounts
  useEffect(() => {
    const initializeDoctors = async () => {
      if (hasLoadedRef.current) return;
      hasLoadedRef.current = true;

      try {
        if (doctorSummaries.length === 0) {
          await getAllDoctors(true, 'summary');
        }
      } catch (error) {
        console.error('Failed to load doctors:', error);
      }
    };

    initializeDoctors();
  }, []); // Empty dependency array - only run on mount

  // Format doctors when doctorSummaries change
  useEffect(() => {
    if (doctorSummaries.length > 0) {
      const formattedDoctors = doctorSummaries.map(doctor => ({
        value: doctor.id,
        label: doctor.fullName,
      }));
      setDoctors(formattedDoctors);
    } else {
      setDoctors([]);
    }
  }, [doctorSummaries]);

  const getDoctorNameById = useCallback((doctorId: string): string => {
    const doctor = doctorSummaries.find(d => d.id === doctorId);
    return doctor ? doctor.fullName : '';
  }, [doctorSummaries]);

  return {
    doctors,
    isLoading: doctorStoreIsLoading,
    error,
    getDoctorNameById,
  };
};