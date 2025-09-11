import { useReactToPrint } from 'react-to-print';

export interface UrinalysisPatientData {
  patientNumber?: string;
  patientName?: string;
  name?: string;
  age?: number;
  gender?: string;
  sex?: string;
  dateRequested?: string;
}

export interface UrinalysisLabData {
  color?: string;
  transparency?: string;
  specificGravity?: string;
  ph?: string;
  protein?: string;
  glucose?: string;
  epithelialCells?: string;
  redCells?: string;
  mucusThread?: string;
  pusCells?: string;
  amorphousUrates?: string;
  bacteria?: string;
  amorphousPhosphate?: string;
  crystals?: string;
  others?: string;
  pregnancyTest?: string;
}

export const formatValue = (value?: string): string => {
  return value || '';
};

export const generatePrintTitle = (patientName?: string): string => {
  const cleanName = patientName?.replace(/\s+/g, '_') || 'Report';
  const date = new Date().toISOString().split('T')[0];
  return `Urinalysis_${cleanName}_${date}`;
};

export const usePrintReport = (printRef: React.RefObject<HTMLDivElement>, patientName?: string) => {
  return useReactToPrint({
    contentRef: printRef,
    documentTitle: generatePrintTitle(patientName),
  });
};