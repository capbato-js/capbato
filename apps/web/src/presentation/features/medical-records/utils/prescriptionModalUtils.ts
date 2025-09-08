import { AddPrescriptionFormData } from '@nx-starter/application-shared';
import { Prescription } from '../types';

export const prepareInitialData = (editMode: boolean, prescription?: Prescription | null) => {
  if (!editMode || !prescription) {
    return undefined;
  }

  return {
    patientId: prescription.patientId,
    patientName: prescription.patientName,
    patientNumber: prescription.patientNumber,
    doctorId: prescription.doctorId,
    doctorName: prescription.doctor,
    datePrescribed: prescription.datePrescribed,
    medications: Array.isArray(prescription.medications) 
      ? prescription.medications 
      : [{ name: prescription.medications, dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: prescription.notes,
  };
};

export const createDummyPrescriptionForCallback = (
  data: AddPrescriptionFormData
): Prescription => {
  const medicationNames = data.medications.map(med => med.name).join(', ');
  
  return {
    id: Date.now().toString(),
    patientId: data.patientId,
    patientName: 'Patient Name', // This would come from the actual patient data
    patientNumber: 'P001', // This would come from the actual patient data
    doctorId: data.doctorId,
    doctor: 'Dr. Name', // This would come from the actual doctor data
    datePrescribed: data.datePrescribed,
    medications: medicationNames, // Show all medication names
    notes: data.notes,
  };
};