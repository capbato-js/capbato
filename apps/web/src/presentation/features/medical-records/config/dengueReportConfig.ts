export const FIELD_LABELS = {
  igg: 'ANTIBODY (IgG)',
  igm: 'ANTIBODY (IgM)',
  ns1: 'ANTIGEN (NS1)',
} as const;

export const SECTION_TITLES = {
  dengueTest: 'SEROLOGY & IMMUNOLOGY',
  testName: 'DENGUE DUO',
} as const;

export const LAB_INFO = {
  name: 'DMYM DIAGNOSTIC & LABORATORY CENTER',
  address: '696 Commonwealth Ave. Litex Rd. Quezon City',
  phone: 'Tel. No. 263-1036',
  license: 'LICENSE NUMBER 13-CL-592-06-P',
} as const;

export const SIGNATURES = {
  technologist: {
    name: 'Mark C. Madriaga, RMT',
    license: 'License No. 42977',
    title: 'Medical Technologist',
  },
  pathologist: {
    name: 'FREDERICK R. LLANERA, MD FPSP',
    license: 'License No. 86353',
    title: 'Pathologist',
  },
} as const;

export const TABLE_HEADERS = {
  test: 'TEST',
  result: 'RESULT',
} as const;
