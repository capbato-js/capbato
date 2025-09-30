export const FIELD_LABELS = {
  ft3: 'FREE TRIIODOTHYRONINE, FT3',
  ft4: 'FREE THYROXINE, FT4',
  tsh: 'THYROID STIMULATING HORMONE, TSH',
} as const;

export const REFERENCE_VALUES = {
  ft3: '2.80 - 7.10 pmol/L',
  ft4: '12 - 22 pmol/L',
  tsh: '0.30 - 4.2 mIU/L',
} as const;

export const SECTION_TITLES = {
  serologyTests: 'SEROLOGY & IMMUNOLOGY',
} as const;

export const LAB_INFO = {
  name: 'DMYM DIAGNOSTIC & LABORATORY CENTER',
  address: '696 Commonwealth Ave. Litex Rd. Quezon City',
  phone: 'Tel. No. 263-1036',
  license: 'LICENSE NUMBER 13-CL-002-QC-F',
} as const;

export const SIGNATURES = {
  technologist: {
    name: 'Mark C. Madriaga, RMT',
    license: 'License No. 42977',
    title: 'Medical Technologist',
  },
  pathologist: {
    name: 'FREDERICK R. LLANERA, MD FPSP',
    license: 'License No. 86333',
    title: 'Pathologist',
  },
} as const;

export const TABLE_HEADERS = {
  test: 'TEST',
  result: 'RESULT',
  referenceRange: 'REFERENCE RANGE',
} as const;