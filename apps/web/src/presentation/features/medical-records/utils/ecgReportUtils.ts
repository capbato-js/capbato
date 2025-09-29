import { useReactToPrint } from 'react-to-print';

export interface EcgPatientData {
  patientNumber?: string;
  patientName?: string;
  name?: string;
  age?: number;
  gender?: string;
  sex?: string;
  dateRequested?: string;
}

export interface EcgLabData {
  av?: string;
  qrs?: string;
  axis?: string;
  pr?: string;
  qt?: string;
  stt?: string;
  rhythm?: string;
  others?: string;
  interpretation?: string;
}

export const formatValue = (value?: string): string => {
  return value || '';
};

export const generatePrintTitle = (patientName?: string): string => {
  const cleanName = patientName?.replace(/\s+/g, '_') || 'Report';
  const date = new Date().toISOString().split('T')[0];
  return `ECG_${cleanName}_${date}`;
};

export const usePrintReport = (printRef: React.RefObject<HTMLDivElement>, patientName?: string) => {
  return useReactToPrint({
    contentRef: printRef,
    documentTitle: generatePrintTitle(patientName),
  });
};