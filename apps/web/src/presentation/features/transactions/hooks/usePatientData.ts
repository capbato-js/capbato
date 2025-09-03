import { useState, useEffect } from 'react';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';

export type FormattedPatient = {
  value: string;
  label: string;
  patientNumber: string;
};

export const usePatientData = () => {
  const [patients, setPatients] = useState<FormattedPatient[]>([]);
  const [selectedPatientNumber, setSelectedPatientNumber] = useState<string>('');
  
  const patientStorePatients = usePatientStore((state) => state.patients);
  const patientStoreLoadPatients = usePatientStore((state) => state.loadPatients);

  // Load patients on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await patientStoreLoadPatients();
      } catch (error) {
        console.error('Failed to load patients:', error);
      }
    };

    loadData();
  }, [patientStoreLoadPatients]);

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

  const updateSelectedPatientNumber = (patientId: string) => {
    if (patientId) {
      const selectedPatient = patients.find(p => p.value === patientId);
      if (selectedPatient) {
        setSelectedPatientNumber(selectedPatient.patientNumber);
      }
    } else {
      setSelectedPatientNumber('');
    }
  };

  return {
    patients,
    selectedPatientNumber,
    updateSelectedPatientNumber,
  };
};