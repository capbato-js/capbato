import { useReactToPrint } from 'react-to-print';

export interface SerologyPatientData {
  patientNumber?: string;
  patientName?: string;
  name?: string;
  age?: number;
  gender?: string;
  sex?: string;
  dateRequested?: string;
  doctorId?: string;
  doctorName?: string;
}

export interface SerologyLabData {
  ft3?: string;
  ft4?: string;
  tsh?: string;
}

export const formatValue = (value?: string): string => {
  return value || '';
};

export const generatePrintTitle = (patientName?: string): string => {
  const cleanName = patientName?.replace(/\s+/g, '_') || 'Report';
  const date = new Date().toISOString().split('T')[0];
  return `Serology_${cleanName}_${date}`;
};

export const usePrintReport = (printRef: React.RefObject<HTMLDivElement>, patientName?: string) => {
  return useReactToPrint({
    contentRef: printRef,
    documentTitle: generatePrintTitle(patientName),
  });
};