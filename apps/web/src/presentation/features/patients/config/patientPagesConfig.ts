export const PATIENT_PAGE_TITLES = {
  add: 'Add New Patient',
  edit: 'Update Patient Info'
} as const;

export const PATIENT_PAGE_MESSAGES = {
  loadingPatient: 'Loading patient information...',
  patientNotFound: 'Patient not found'
} as const;

export const PATIENT_PAGE_MODES = {
  create: 'create' as const,
  update: 'update' as const
} as const;