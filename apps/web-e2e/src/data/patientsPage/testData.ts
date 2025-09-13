export const PATIENTS_TEST_DATA = {
  PAGE_ELEMENTS: {
    TITLE: 'Patient Records',
    ADD_BUTTON: 'Add New Patient',
    SEARCH_PLACEHOLDER: 'Search patients...'
  },
  TABLE_COLUMNS: {
    PATIENT_NUMBER: 'Patient #',
    PATIENT_NAME: "Patient's Name",
    AGE: 'Age',
    GENDER: 'Gender',
    CONTACT_NUMBER: 'Contact Number',
    GUARDIAN_NAME: "Guardian's Name",
    ACTIONS: 'Actions'
  }
} as const

export const AUTH_TEST_DATA = {
  DEFAULT_USER: {
    username: 'test@gmail.com',
    password: 'Password123!'
  },
} as const

export const TEST_MESSAGES = {
  PAGE_LOADED: 'Patients page was loaded successfully',
  TITLE_VISIBLE: 'Page title is visible',
  BUTTON_VISIBLE: 'Add button is visible'
} as const