export const LAB_INFO = {
  name: 'DMYM DIAGNOSTIC & LABORATORY CENTER',
  address: '696 Commonwealth Ave., Litex Rd. Quezon City',
  phone: 'TEL No. 263-1036',
  license: 'LICENSE NUMBER: 1-3-CL-592-06-P',
  reportTitle: 'BLOOD CHEMISTRY',
};

export const SIGNATURES = {
  medicalTechnologist: {
    name: 'MARK C. MADRIAGA, RMT LIC. 42977',
    title: 'Medical Technologist',
  },
  pathologist: {
    name: 'FREDERICK R. LLANERA, MD, FPSP LIC. #86353',
    title: 'Pathologist',
  },
};

export const REFERENCE_VALUES = {
  // Left column
  fbs: '3.3-6.10 mmol/L',
  bun: '2.86-8.20 mmol/L',
  creatinine: '53-115 umol/L',
  uricAcid: '0.15-0.41 mmol/L',
  cholesterol: '3.35-7.37 mmol/L',
  triglycerides: '0.56-1.69 mmol/L',
  hdl: '1.04-1.55 mmol/L',
  ldl: '1.7-4.5 mmol/L',
  vldl: '0.0-1.04 mmol/L',
  sodium: '135 - 145 mmol/L',
  potassium: '3.50-5.50 mmol/L',
  chloride: '95-107 mmol/L',
  calcium: '2.02-2.60 mEq/L',
  sgot: '0-38 U/L',
  sgpt: '0-40 U/L',
  rbs: '7.1-11.1 mmol/L',

  // Right column
  alkPhosphatase: '53 - 90 U/L',
  totalProtein: '66 - 88 g/L',
  albumin: '35-52 g/L',
  globulin: '31-36 g/L',
  agRatio: '1.13-2.10:1',
  totalBilirubin: 'up to 20.40 μmol/L',
  directBilirubin: 'up to 6.80 μmol/L',
  indirectBilirubin: 'up to 13.60 μmol/L',
  ionisedCalcium: '1.13-1.32 mmol/L',
  magnesium: '0.65-1.05mmol/L',
  hba1c: '4.0 - 6.0 %',
  ogtt30mins: '0-10.48 mmol/L',
  ogtt1hr: '0-6.70 mmol/L',
  ogtt2hr: '0-6.10 mmol/L',
  ppbs2hr: '2.3-7.1 mmol/L',
  inorgPhosphorus: '0.83-1.45 mmol/L',
};

export const FIELD_LABELS = {
  // Patient info
  patientName: 'Patient Name:',
  age: 'Age:',
  date: 'Date:',
  sex: 'Sex:',

  // Left column lab fields
  fbs: 'FBS',
  bun: 'BUN',
  creatinine: 'CREATININE',
  uricAcid: 'URIC ACID',
  cholesterol: 'CHOLESTEROL',
  triglycerides: 'TRIGLYCERIDES',
  hdl: 'HDL',
  ldl: 'LDL',
  vldl: 'VLDL',
  sodium: 'SODIUM',
  potassium: 'POTASSIUM',
  chloride: 'CHLORIDE',
  calcium: 'CALCIUM',
  sgot: 'SGOT',
  sgpt: 'SGPT',
  rbs: 'RBS',

  // Right column lab fields
  alkPhosphatase: 'Alk. Phosphatase',
  totalProtein: 'Total Protein',
  albumin: 'Albumin',
  globulin: 'Globulin',
  agRatio: 'A/G Ratio',
  totalBilirubin: 'Total Bilirubin',
  directBilirubin: 'Direct Bilirubin',
  indirectBilirubin: 'Indirect Bilirubin',
  ionisedCalcium: 'Ionised Calcium',
  magnesium: 'Magnesium',
  hba1c: 'HBa1c',
  ogtt30mins: 'OGTT 30mins',
  ogtt1hr: '1st Hour',
  ogtt2hr: '2nd Hour',
  ppbs2hr: '2 Hours PPBS',
  inorgPhosphorus: 'Inor. Phosphorus',
};

// Field groupings for layout
export const LEFT_COLUMN_FIELDS = [
  'fbs', 'bun', 'creatinine', 'uricAcid', 'cholesterol', 'triglycerides',
  'hdl', 'ldl', 'vldl', 'sodium', 'potassium', 'chloride',
  'calcium', 'sgot', 'sgpt', 'rbs'
];

export const RIGHT_COLUMN_FIELDS = [
  'alkPhosphatase', 'totalProtein', 'albumin', 'globulin', 'agRatio',
  'totalBilirubin', 'directBilirubin', 'indirectBilirubin', 'ionisedCalcium',
  'magnesium', 'hba1c', 'ogtt30mins', 'ogtt1hr', 'ogtt2hr', 'ppbs2hr', 'inorgPhosphorus'
];