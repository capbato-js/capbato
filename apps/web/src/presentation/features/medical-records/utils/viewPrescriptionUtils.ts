import { Prescription } from '../types';

export interface NormalizedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export const normalizeMedications = (prescription: Prescription): NormalizedMedication[] => {
  // Handle both string and array formats for medications
  return Array.isArray(prescription.medications) 
    ? prescription.medications.map(med => {
        // Handle different medication formats:
        // 1. Domain format: { medicationNameValue, dosageValue, ... }
        // 2. DTO format: { medicationName, dosage, ... }
        // 3. UI format: { name, dosage, ... }
        const name = String(med.name || med.medicationName || med.medicationNameValue || '');
        const dosage = String(med.dosage || med.dosageValue || '');
        const frequency = String(med.frequency || '');
        const duration = String(med.duration || '');
        const instructions = String(med.instructions || med.instructionsValue || '');
        
        return {
          id: String(med.id || ''),
          name,
          dosage,
          frequency,
          duration,
          instructions
        };
      })
    : [{ 
        id: '',
        name: String(prescription.medications || ''), 
        dosage: '', 
        frequency: '', 
        duration: '', 
        instructions: '' 
      }];
};

export const formatPrescriptionDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const hasMedicationDetails = (medications: NormalizedMedication[]): boolean => {
  return medications.length > 0 && 
    medications.some(med => med.name && typeof med.name === 'string' && med.name.trim() !== '');
};

export const hasAdditionalMedicationInfo = (medication: NormalizedMedication): boolean => {
  return !!(medication.frequency || medication.duration);
};