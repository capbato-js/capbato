import { useReactToPrint } from 'react-to-print';

export interface FecalysisPatientData {
  patientNumber?: string;
  patientName?: string;
  name?: string;
  age?: number;
  gender?: string;
  sex?: string;
  dateRequested?: string;
}

export interface FecalysisLabData {
  color?: string;
  consistency?: string;
  rbc?: string;
  wbc?: string;
  occultBlood?: string;
  urobilinogen?: string;
  others?: string;
}

export const formatValue = (value?: string): string => {
  return value || '';
};

export const generatePrintTitle = (patientName?: string): string => {
  const cleanName = patientName?.replace(/\s+/g, '_') || 'Report';
  const date = new Date().toISOString().split('T')[0];
  return `Fecalysis_${cleanName}_${date}`;
};

export const usePrintReport = (printRef: React.RefObject<HTMLDivElement>, patientName?: string) => {
  return useReactToPrint({
    contentRef: printRef,
    documentTitle: generatePrintTitle(patientName),
  });
};