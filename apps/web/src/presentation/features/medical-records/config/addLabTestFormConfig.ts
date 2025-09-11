export const ADD_LAB_TEST_FORM_CONFIG = {
  clinic: {
    name: 'DMYM DIAGNOSTIC & LABORATORY CENTER',
    address: '696 Commonwealth Ave., Litex Rd., Quezon City',
    contact: 'Contact No: (02) 263-1036 / 0927-254-6213',
  },
  form: {
    labels: {
      patient: 'Patient:',
      ageGender: 'Age/Gender:',
      date: 'Date:',
      otherTests: 'OTHERS (Specify):',
    },
    placeholders: {
      patient: 'Search and select patient',
      ageGender: 'Age / Gender',
      date: 'Select date',
      otherTests: 'Write here...',
    },
    submitButton: {
      text: 'Submit Request',
    },
  },
} as const;