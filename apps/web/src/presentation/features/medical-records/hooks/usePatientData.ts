import { useState, useEffect } from 'react';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';

export const usePatientData = () => {
  const [patients, setPatients] = useState<Array<{ 
    value: string; 
    label: string; 
    patientNumber: string; 
    age: number; 
    gender: string 
  }>>([]);
  
  const patientStore = usePatientStore();

  // Load patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        await patientStore.loadPatients();
      } catch (error) {
        console.error('Failed to load patients:', error);
      }
    };

    loadPatients();
  }, []);

  // Format patients for select component
  useEffect(() => {
    if (patientStore.patients.length > 0) {
      const formattedPatients = patientStore.patients.map(patient => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
        patientNumber: patient.patientNumber,
        age: patient.age,
        gender: patient.gender,
      }));
      setPatients(formattedPatients);
    }
  }, [patientStore.patients]);

  return {
    patients,
    isLoading: patientStore.getIsLoading(),
  };
};