import { useState, useEffect } from 'react';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import { useDoctorStore } from '../../../../infrastructure/state/DoctorStore';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { doctorAssignmentService } from '../services/DoctorAssignmentService';
import { formatPatientsForSelect } from '../utils/appointmentFormUtils';

/**
 * Custom hook to manage loading and formatting of appointment form data
 */
export const useAppointmentFormData = () => {
  const [patients, setPatients] = useState<Array<{ value: string; label: string; patientNumber: string }>>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);

  // Get stores
  const patientStore = usePatientStore();
  const doctorStore = useDoctorStore();
  const appointmentStore = useAppointmentStore();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        setDataLoadError(null);

        // Clear the doctor assignment cache to ensure fresh data
        doctorAssignmentService.getInstance().clearCache();
        
        // Load patients, doctors, and appointments
        await Promise.all([
          patientStore.loadPatients(),
          doctorStore.getAllDoctors(true, 'summary'),
          appointmentStore.fetchAllAppointments()
        ]);
      } catch (error) {
        console.error('Failed to load data:', error);
        setDataLoadError(error instanceof Error ? error.message : 'Failed to load form data');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []); // Remove store dependencies to prevent infinite loop

  // Format patients for select component
  useEffect(() => {
    if (patientStore.patients.length > 0) {
      const formattedPatients = formatPatientsForSelect(patientStore.patients);
      setPatients(formattedPatients);
    }
  }, [patientStore.patients]);

  return {
    patients,
    isLoadingData,
    dataLoadError,
    stores: {
      patientStore,
      doctorStore,
      appointmentStore
    }
  };
};