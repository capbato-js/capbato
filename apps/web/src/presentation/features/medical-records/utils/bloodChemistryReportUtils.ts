import { useReactToPrint } from 'react-to-print';

export interface BloodChemistryPatientData {
  patientNumber?: string;
  patientName?: string;
  name?: string;
  age?: number;
  gender?: string;
  sex?: string;
  dateRequested?: string;
}

export interface BloodChemistryLabData {
  // Left column fields
  fbs?: string;
  bun?: string;
  creatinine?: string;
  uricAcid?: string;
  cholesterol?: string;
  triglycerides?: string;
  hdl?: string;
  ldl?: string;
  vldl?: string;
  sodium?: string;
  potassium?: string;
  chloride?: string;
  calcium?: string;
  sgot?: string;
  sgpt?: string;
  rbs?: string;

  // Right column fields
  alkPhosphatase?: string;
  totalProtein?: string;
  albumin?: string;
  globulin?: string;
  agRatio?: string;
  totalBilirubin?: string;
  directBilirubin?: string;
  indirectBilirubin?: string;
  ionisedCalcium?: string;
  magnesium?: string;
  hba1c?: string;
  ogtt30mins?: string;
  ogtt1hr?: string;
  ogtt2hr?: string;
  ppbs2hr?: string;
  inorgPhosphorus?: string;
}

export const formatValue = (value?: string): string => {
  return value || '';
};

export const generatePrintTitle = (patientName?: string): string => {
  const cleanName = patientName?.replace(/\s+/g, '_') || 'Report';
  const date = new Date().toISOString().split('T')[0];
  return `BloodChemistry_${cleanName}_${date}`;
};

export const usePrintReport = (printRef: React.RefObject<HTMLDivElement>, patientName?: string) => {
  return useReactToPrint({
    contentRef: printRef,
    documentTitle: generatePrintTitle(patientName),
  });
};