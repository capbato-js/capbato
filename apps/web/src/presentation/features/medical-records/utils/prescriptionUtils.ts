import { Prescription } from '../types';
import { DisplayPrescription } from '../hooks/usePrescriptionData';

export const transformPrescriptionsForDisplay = (prescriptions: any[]): DisplayPrescription[] => {
  // Transform each prescription into display format without grouping
  // Each prescription is its own row, showing all its medications
  return prescriptions.map(prescription => {
    const prescriptionWithData = prescription as unknown as {
      _populatedPatient?: {
        patientNumber: string;
        fullName: string;
      };
      _populatedDoctor?: {
        fullName: string;
      };
    };

    // Get all medication names from this prescription
    const medicationNames = prescription.medications.map((med: any) => med.medicationNameValue);

    return {
      id: prescription.stringId || '',
      patientNumber: prescriptionWithData._populatedPatient?.patientNumber || `P${prescription.patientId.slice(-3)}`,
      patientName: prescriptionWithData._populatedPatient?.fullName || `Patient ${prescription.patientId.slice(-4)}`,
      patientId: prescription.patientId,
      doctor: prescriptionWithData._populatedDoctor?.fullName || `Dr. ${prescription.doctorId.slice(-4)}`,
      doctorId: prescription.doctorId,
      datePrescribed: prescription.prescribedDate.toISOString().split('T')[0],
      medications: medicationNames.join(', '),
      notes: prescription.additionalNotes,
    };
  });
};

export const transformDomainToUIPrescription = (
  domainPrescription: any,
  fallbackData?: Partial<DisplayPrescription>
): Prescription => {
  const prescriptionWithData = domainPrescription as unknown as {
    _populatedPatient?: {
      patientNumber: string;
      fullName: string;
    };
    _populatedDoctor?: {
      fullName: string;
    };
  };

  return {
    id: domainPrescription.stringId || '',
    patientNumber: prescriptionWithData._populatedPatient?.patientNumber || fallbackData?.patientNumber || `P${domainPrescription.patientId.slice(-3)}`,
    patientName: prescriptionWithData._populatedPatient?.fullName || fallbackData?.patientName || `Patient ${domainPrescription.patientId.slice(-4)}`,
    patientId: domainPrescription.patientId,
    doctor: prescriptionWithData._populatedDoctor?.fullName || fallbackData?.doctor || `Dr. ${domainPrescription.doctorId.slice(-4)}`,
    doctorId: domainPrescription.doctorId,
    datePrescribed: domainPrescription.prescribedDate.toISOString().split('T')[0],
    medications: domainPrescription.medications.map((med: any) => ({
      id: med.stringId || '',
      name: med.medicationNameValue,
      medicationName: med.medicationNameValue,
      dosage: med.dosageValue,
      frequency: med.frequency,
      duration: med.duration,
      instructions: med.instructionsValue
    })),
    notes: domainPrescription.additionalNotes || ''
  };
};

export const findGroupedPrescriptions = (
  prescriptionId: string,
  prescriptions: any[]
): Prescription | null => {
  if (prescriptionId.includes(',')) {
    const prescriptionIds = prescriptionId.split(',');
    const groupedPrescriptions = prescriptions.filter(p => 
      prescriptionIds.includes(p.stringId || '')
    );
    
    if (groupedPrescriptions.length === 0) return null;

    const firstPrescription = groupedPrescriptions[0];
    const prescriptionWithData = firstPrescription as unknown as {
      _populatedPatient?: {
        patientNumber: string;
        fullName: string;
      };
      _populatedDoctor?: {
        fullName: string;
      };
    };
    
    return {
      id: prescriptionId,
      patientNumber: prescriptionWithData._populatedPatient?.patientNumber || `P${firstPrescription.patientId.slice(-3)}`,
      patientName: prescriptionWithData._populatedPatient?.fullName || `Patient ${firstPrescription.patientId.slice(-4)}`,
      patientId: firstPrescription.patientId,
      doctor: prescriptionWithData._populatedDoctor?.fullName || `Dr. ${firstPrescription.doctorId.slice(-4)}`,
      doctorId: firstPrescription.doctorId,
      datePrescribed: firstPrescription.prescribedDate.toISOString().split('T')[0],
      medications: groupedPrescriptions.map(p => ({
        id: p.stringId || '',
        name: p.medicationNameValue,
        dosage: p.dosageValue,
        frequency: p.frequency,
        duration: p.duration,
        instructions: p.instructionsValue
      })),
      notes: firstPrescription.additionalNotes || ''
    };
  }
  
  return null;
};