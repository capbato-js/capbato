import { AddPrescriptionFormData } from '@nx-starter/application-shared';
import { COMMON_MEDICATIONS } from '../config/prescriptionConfig';

export const filterValidMedications = (data: AddPrescriptionFormData) => {
  return data.medications.filter(med => 
    med.name.trim() && med.dosage.trim() && med.frequency.trim() && med.duration.trim()
  );
};

export const processFormSubmission = async (
  data: AddPrescriptionFormData,
  onSubmit: (data: AddPrescriptionFormData) => Promise<boolean>
): Promise<boolean> => {
  // Filter out empty medications
  const validMedications = filterValidMedications(data);

  if (validMedications.length === 0) {
    return false;
  }

  const formData = {
    ...data,
    medications: validMedications,
  };

  return await onSubmit(formData);
};

export const addCommonMedication = (
  medicationName: string,
  append: (medication: any) => void
) => {
  const medication = COMMON_MEDICATIONS.find(med => med.name === medicationName);
  if (medication) {
    append({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      duration: medication.duration,
      instructions: '',
    });
  }
};

export const formatMedicationOptions = () => {
  return COMMON_MEDICATIONS.map(med => ({
    value: med.name,
    label: med.name,
  }));
};

export const handleDateChange = (
  date: Date | null,
  onChange: (value: string) => void
) => {
  if (date) {
    // Ensure we have a proper Date object
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (!isNaN(dateObj.getTime())) {
      onChange(dateObj.toISOString().split('T')[0]);
    } else {
      onChange('');
    }
  } else {
    onChange('');
  }
};