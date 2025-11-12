import { useState, useEffect, useMemo } from 'react';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import { useDoctorStore } from '../../../../infrastructure/state/DoctorStore';
import { usePatientsWithTodayAppointments } from './usePatientsWithTodayAppointments';

export interface FormattedPatient {
  value: string;
  label: string;
  patientNumber: string;
}

export interface FormattedDoctor {
  value: string;
  label: string;
}

export const usePrescriptionFormData = () => {
  const [patients, setPatients] = useState<FormattedPatient[]>([]);
  const [doctors, setDoctors] = useState<FormattedDoctor[]>([]);
  const [selectedPatientNumber, setSelectedPatientNumber] = useState<string>('');

  // Get stores with selectors to prevent unnecessary re-renders
  const patientStorePatients = usePatientStore((state) => state.patients);
  const patientStoreLoadPatients = usePatientStore((state) => state.loadPatients);
  const doctorStoreSummaries = useDoctorStore((state) => state.doctorSummaries);
  const doctorStoreGetAllDoctors = useDoctorStore((state) => state.getAllDoctors);

  // Get patients with appointments today
  const {
    filterPatientsWithAppointmentsToday,
    hasAnyPatientsWithAppointmentsToday,
    isLoading: isLoadingAppointments
  } = usePatientsWithTodayAppointments();

  // Load patients and doctors on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load patients
        await patientStoreLoadPatients();

        // Load doctors
        await doctorStoreGetAllDoctors(true, 'summary');
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, [patientStoreLoadPatients, doctorStoreGetAllDoctors]);

  // Format patients for select component
  useEffect(() => {
    if (patientStorePatients.length > 0) {
      const formattedPatients = patientStorePatients.map(patient => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
        patientNumber: patient.patientNumber,
      }));
      setPatients(formattedPatients);
    }
  }, [patientStorePatients]);

  // Filter patients to only show those with appointments today
  const filteredPatients = useMemo(() => {
    return filterPatientsWithAppointmentsToday(patients);
  }, [patients, filterPatientsWithAppointmentsToday]);

  // Format doctors for select component
  useEffect(() => {
    if (doctorStoreSummaries.length > 0) {
      const formattedDoctors = doctorStoreSummaries.map(doctor => ({
        value: doctor.id,
        label: `${doctor.fullName} - ${doctor.specialization}`,
      }));
      setDoctors(formattedDoctors);
    }
  }, [doctorStoreSummaries]);

  const updateSelectedPatientNumber = (patientId: string) => {
    if (patientId) {
      const selectedPatient = filteredPatients.find(p => p.value === patientId);
      if (selectedPatient) {
        setSelectedPatientNumber(selectedPatient.patientNumber);
      }
    } else {
      setSelectedPatientNumber('');
    }
  };

  return {
    patients: filteredPatients,
    doctors,
    selectedPatientNumber,
    updateSelectedPatientNumber,
    hasAnyPatientsWithAppointmentsToday,
    isLoadingAppointments,
  };
};