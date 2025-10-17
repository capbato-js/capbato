// Hematology Report Configuration
// Based on the DMYM Diagnostic & Laboratory Center form

export const HEMATOLOGY_FIELD_LABELS = {
  hematocrit: 'HEMATOCRIT',
  hemoglobin: 'HEMOGLOBIN',
  rbc: 'RBC',
  wbc: 'WBC',
  segmenters: 'SEGMENTERS',
  lymphocyte: 'LYMPHOCYTE',
  monocyte: 'MONOCYTE',
  basophils: 'BASOPHILS',
  eosinophils: 'EOSINOPHILS',
  platelet: 'PLATELET',
} as const;

// Demographic categories for tests with multiple reference ranges
export const DEMOGRAPHIC_CATEGORIES = {
  male: 'MALE',
  female: 'FEMALE',
  child: 'CHILD',
  newborn: 'NEWBORN',
  pregnant: 'PREGNANT',
} as const;

export type DemographicCategory = keyof typeof DEMOGRAPHIC_CATEGORIES;

// Reference ranges for hematocrit based on demographics
export const HEMATOCRIT_RANGES = {
  male: '0.40 - 0.51',
  female: '0.37 - 0.48',
  child: '0.32 - 0.42',
  newborn: '0.49 - 0.54',
} as const;

// Reference ranges for hemoglobin based on demographics
export const HEMOGLOBIN_RANGES = {
  male: '140 - 170 gm/L',
  female: '120 - 160 gm/L',
  child: '120 - 140 gm/L',
  newborn: '165 - 195 gm/L',
  pregnant: '120 - 140 gm/L',
} as const;

// Reference ranges for RBC based on demographics
export const RBC_RANGES = {
  male: '4.6 - 6.2 x 10¹²/L',
  female: '4.2 - 5.4 x 10¹²/L',
  child: '4.5 - 5.1 x 10¹²/L',
} as const;

// Reference ranges for other hematology tests
export const REFERENCE_VALUES = {
  rbc: {
    male: '4.6 - 6.2 x 10 12/L',
    female: '4.2-5.4 x 10 12/L',
    child: '4.5 - 5.1 x 10 12/L',
  },
  wbc: '4.5 - 11.0 x 10 9/L',
  segmenters: '0.50 - 0.60',
  lymphocyte: '0.20-0.50',
  monocyte: '0.0 - 0.08',
  basophils: '0.01 - 0.03',
  eosinophils: '0.0 - 0.04',
  platelet: '150-400 g x 10L',
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

export const SECTION_TITLE = 'HEMATOLOGY' as const;
