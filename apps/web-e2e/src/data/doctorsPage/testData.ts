export const DOCTORS_TEST_DATA = {
  PAGE_ELEMENTS: {
    TITLE: 'Doctors',
    EXPECTED_URL: '/doctors'
  },
  TABLE_COLUMNS: {
    DOCTORS_NAME: "Doctor's Name",
    SPECIALIZATION: 'Specialization',
    CONTACT_NUMBER: 'Contact Number',
    EMAIL: 'Email'
  },
  ERROR_MESSAGES: {
    LOADING_ERROR: 'Error loading doctors',
    NO_DOCTORS_FOUND: 'No doctors found'
  },
  BUTTONS: {
    RETRY: 'Retry'
  }
} as const