import { Prescription } from '@nx-starter/domain';
import { isExpired } from '../utils/prescriptionUtils';

/**
 * Form types specific to prescription UI components
 * These handle the mapping between UI forms and domain/API types
 */

// Frontend form medication structure (multiple medications per prescription in UI)
export interface MedicationFormData {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// Frontend form data structure
export interface PrescriptionFormData {
  patientId: string;
  patientName?: string;
  patientNumber?: string;
  doctorId: string;
  doctorName?: string;
  datePrescribed: string;
  medications: MedicationFormData[];
  notes?: string;
}

// Update form data structure
export interface UpdatePrescriptionFormData extends PrescriptionFormData {
  id: string;
}

// Helper functions to convert between UI and domain/API types
export class PrescriptionTypeMapper {
  /**
   * Convert domain Prescription to UI form data
   * Since backend handles single medication per prescription, 
   * we wrap it in an array for UI consistency
   */
  static toFormData(prescription: Prescription): PrescriptionFormData {
    return {
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      datePrescribed: prescription.prescribedDate.toISOString().split('T')[0], // YYYY-MM-DD format
      medications: [
        {
          id: '1',
          name: prescription.medicationNameValue,
          dosage: prescription.dosageValue,
          frequency: prescription.frequency,
          duration: prescription.duration,
          instructions: prescription.instructionsValue,
        }
      ],
      notes: prescription.additionalNotes,
    };
  }

  /**
   * Convert UI form data to backend CreatePrescriptionCommand
   * Now supports multiple medications in a single prescription
   */
  static toCreateCommand(formData: PrescriptionFormData) {
    if (!formData.medications || formData.medications.length === 0) {
      throw new Error('At least one medication is required');
    }

    return {
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      medications: formData.medications.map(medication => ({
        medicationName: medication.name,
        dosage: medication.dosage,
        instructions: medication.instructions?.trim() || '',
        frequency: medication.frequency,
        duration: medication.duration,
      })),
      prescribedDate: new Date(formData.datePrescribed).toISOString(),
      additionalNotes: formData.notes,
      status: 'active' as const,
    };
  }

  /**
   * Convert UI form data to backend CreatePrescriptionCommand(s)
   * Creates separate commands for each medication since backend handles single medication per prescription
   * @deprecated Use toCreateCommand for multiple medications support in a single prescription
   */
  static toCreateCommands(formData: PrescriptionFormData) {
    if (!formData.medications || formData.medications.length === 0) {
      throw new Error('At least one medication is required');
    }

    return formData.medications.map(medication => {
      const instructions = medication.instructions?.trim() || '';

      return {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        medicationName: medication.name,
        dosage: medication.dosage,
        instructions,
        frequency: medication.frequency,
        duration: medication.duration,
        prescribedDate: new Date(formData.datePrescribed).toISOString(),
        additionalNotes: formData.notes,
        status: 'active' as const,
      };
    });
  }

  /**
   * Convert UI form data to backend CreatePrescriptionCommand
   * Takes the first medication from the array since backend handles single medication
   * @deprecated Use the updated toCreateCommand for multiple medications support
   */
  static toCreateCommandLegacy(formData: PrescriptionFormData) {
    const medication = formData.medications[0]; // Take first medication
    if (!medication) {
      throw new Error('At least one medication is required');
    }

    const instructions = medication.instructions?.trim() || '';

    return {
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      medicationName: medication.name,
      dosage: medication.dosage,
      instructions,
      frequency: medication.frequency,
      duration: medication.duration,
      prescribedDate: new Date(formData.datePrescribed).toISOString(),
      additionalNotes: formData.notes,
      status: 'active' as const,
    };
  }

  /**
   * Convert UI form data to backend UpdatePrescriptionCommand
   * Takes the first medication from the array since backend handles single medication
   */
  static toUpdateCommand(formData: UpdatePrescriptionFormData) {
    const medication = formData.medications[0]; // Take first medication
    if (!medication) {
      throw new Error('At least one medication is required');
    }

    const instructions = medication.instructions?.trim() || '';

    return {
      id: formData.id,
      medicationName: medication.name,
      dosage: medication.dosage,
      instructions,
      frequency: medication.frequency,
      duration: medication.duration,
      additionalNotes: formData.notes,
    };
  }

  /**
   * Convert domain Prescription to display format for UI tables
   */
  static toDisplayData(prescription: Prescription) {
    return {
      id: prescription.stringId || '',
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medication: prescription.medicationNameValue,
      dosage: prescription.dosageValue,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructionsValue,
      prescribedDate: prescription.prescribedDate.toLocaleDateString(),
      expiryDate: prescription.expiryDate?.toLocaleDateString() || '',
      status: prescription.status,
      notes: prescription.additionalNotes || '',
      isExpired: isExpired(prescription),
      isActive: prescription.status === 'active' && !isExpired(prescription),
    };
  }
}