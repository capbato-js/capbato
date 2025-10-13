export const PT_FIELDS = {
  patientPt: 'PATIENT PT',
  controlPt: 'CONTROL',
  inr: 'INR',
  activityPercent: '% ACTIVITY',
} as const;

export const PTT_FIELDS = {
  patientPtt: 'PATIENT PTT',
  controlPtt: 'CONTROL',
} as const;

export const REFERENCE_VALUES = {
  patientPt: '9 - 15 SECS',
  controlPt: '11.5 - 16.5 SECONDS',
  inr: '0.85 - 1.15',
  activityPercent: '70 - 130 %',
  patientPtt: '25 - 38 SECS',
  controlPtt: '28.9 - 41.6 SECS',
} as const;

export const SECTION_TITLES = {
  prothrombinTime: 'PROTHROMBIN TIME',
  partialThromboplastinTime: 'PARTIAL THROMBOPLASTIN-APTT TIME',
  coagulationStudies: 'COAGULATION STUDIES',
} as const;

export const LAB_INFO = {
  name: 'DMYM DIAGNOSTIC & LABORATORY CENTER',
  address: '696 Commonwealth Ave. Litex Rd. Quezon City',
  phone: 'Tel. No. 263-1036',
  license: 'LICENSE NUMBER 13-CL-592-06-P',
} as const;

export const SIGNATURES = {
  technologist: {
    name: 'MARK C. MADRIAGA, RMT LIC. # 42977',
    title: 'Medical Technologist',
  },
  pathologist: {
    name: 'FREDERICK R. LLANERA, MD, FPSP LIC. #86353',
    title: 'Pathologist',
  },
} as const;

export const TABLE_HEADERS = {
  test: 'TEST',
  result: 'RESULT',
  normalValue: 'NORMAL VALUE',
} as const;

export const STATIC_NOTES = {
  note: 'DOUBLE CHECKED',
  remarks: 'PLS. CORRELATE CLINICALLY',
} as const;
