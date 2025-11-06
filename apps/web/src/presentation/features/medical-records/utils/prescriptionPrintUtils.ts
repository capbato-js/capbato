import { useReactToPrint } from 'react-to-print';

export interface PrescriptionPrintData {
  patientName: string;
  patientAddress: string;
  age: number;
  sex: string;
  date: string;
  medications: Array<{
    name?: string;
    medicationName?: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
}

export const generatePrescriptionPrintTitle = (patientName?: string): string => {
  const cleanName = patientName?.replace(/\s+/g, '_') || 'Prescription';
  const date = new Date().toISOString().split('T')[0];
  return `Prescription_${cleanName}_${date}`;
};

export const usePrintPrescription = (
  printRef: React.RefObject<HTMLDivElement>,
  patientName?: string
) => {
  return useReactToPrint({
    contentRef: printRef,
    documentTitle: generatePrescriptionPrintTitle(patientName),
  });
};

export const formatPrescriptionDate = (date: string): string => {
  if (!date) return '';

  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return date;
  }
};

export const formatPatientAddress = (
  address: string | { street: string; city: string; province: string; zipCode: string }
): string => {
  if (typeof address === 'string') {
    return address;
  }

  if (address && typeof address === 'object') {
    const parts = [address.street, address.city, address.province].filter(Boolean);
    return parts.join(', ');
  }

  return '';
};
