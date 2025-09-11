import { Prescription } from '../types';
import { DisplayPrescription } from '../hooks/usePrescriptionData';

export const transformPrescriptionsForDisplay = (prescriptions: any[]): DisplayPrescription[] => {
  // Group prescriptions by patient, doctor, and date to combine medications
  const groupedPrescriptions = new Map<string, {
    prescriptions: typeof prescriptions;
    medications: string[];
  }>();

  prescriptions.forEach(prescription => {
    const datePrescribed = prescription.prescribedDate.toISOString().split('T')[0];
    const groupKey = `${prescription.patientId}-${prescription.doctorId}-${datePrescribed}`;

    if (!groupedPrescriptions.has(groupKey)) {
      groupedPrescriptions.set(groupKey, {
        prescriptions: [],
        medications: []
      });
    }

    const group = groupedPrescriptions.get(groupKey);
    if (group) {
      group.prescriptions.push(prescription);
      prescription.medications.forEach((medication: any) => {
        group.medications.push(medication.medicationNameValue);
      });
    }
  });

  // Convert grouped prescriptions to display format
  return Array.from(groupedPrescriptions.entries()).map(([, group]) => {
    const firstPrescription = group.prescriptions[0];
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
      id: group.prescriptions.map((p: any) => p.stringId || '').join(','),
      patientNumber: prescriptionWithData._populatedPatient?.patientNumber || `P${firstPrescription.patientId.slice(-3)}`,
      patientName: prescriptionWithData._populatedPatient?.fullName || `Patient ${firstPrescription.patientId.slice(-4)}`,
      patientId: firstPrescription.patientId,
      doctor: prescriptionWithData._populatedDoctor?.fullName || `Dr. ${firstPrescription.doctorId.slice(-4)}`,
      doctorId: firstPrescription.doctorId,
      datePrescribed: firstPrescription.prescribedDate.toISOString().split('T')[0],
      medications: group.medications.join(', '),
      notes: firstPrescription.additionalNotes,
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