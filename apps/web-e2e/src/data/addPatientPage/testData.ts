export const ADD_PATIENT_TEST_DATA = {
  PAGE_ELEMENTS: {
    TITLE: 'Add Patient',
    BACK_BUTTON: 'Back',
    SAVE_BUTTON: 'Submit',
    CANCEL_BUTTON: 'Cancel'
  },
  FORM_LABELS: {
    FIRST_NAME: 'First Name',
    MIDDLE_NAME: 'Middle Name',
    LAST_NAME: 'Last Name',
    DATE_OF_BIRTH: 'Date of Birth',
    AGE: 'Age',
    GENDER: 'Gender',
    CONTACT_NUMBER: 'Contact Number',
    HOUSE_NUMBER: 'House No.',
    STREET_NAME: 'Street Name',
    PROVINCE: 'Province',
    CITY: 'City',
    BARANGAY: 'Barangay',
    GUARDIAN_NAME: 'Guardian Name',
    GUARDIAN_GENDER: 'Guardian Gender',
    GUARDIAN_RELATIONSHIP: 'Relationship',
    GUARDIAN_CONTACT: 'Guardian Contact'
  },
  SECTION_HEADERS: {
    PATIENT_INFORMATION: "Patient's Information",
    GUARDIAN_INFORMATION: "Guardian Information"
  },
  GENDER_OPTIONS: {
    MALE: 'Male',
    FEMALE: 'Female'
  },
  SAMPLE_DATA: {
    MINIMAL_PATIENT: {
      firstName: 'Juan',
      lastName: 'Dela Cruz', // Match the capitalized form
      dateOfBirth: '1995-05-15',
      gender: 'Male',
      contactNumber: '09123456789',
      province: 'LEYTE',
      city: 'BURAUEN',
      barangay: 'HAPUNAN'
    },
    COMPLETE_PATIENT: {
      firstName: 'Maria',
      middleName: 'Santos',
      lastName: 'Garcia',
      dateOfBirth: '2010-08-20',
      gender: 'Female',
      contactNumber: '09987654321',
      houseNumber: '123',
      streetName: 'Rizal Street',
      province: 'LEYTE',
      city: 'BURAUEN',
      barangay: 'HAPUNAN',
      guardianName: 'Carmen Garcia',
      guardianGender: 'Female',
      guardianRelationship: 'Mother',
      guardianContact: '09111222333',
      guardianHouseNumber: '456',
      guardianStreetName: 'Jose Street',
      guardianProvince: 'LEYTE',
      guardianCity: 'BURAUEN',
      guardianBarangay: 'HAPUNAN'
    }
  },
  VALIDATION_MESSAGES: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_CONTACT: 'Invalid contact number format',
    FUTURE_DATE: 'Date of birth cannot be in the future',
    INVALID_NAME: 'Name should only contain letters'
  }
} as const

export const ADDRESS_TEST_DATA = {
  STANDARD: {
    province: 'LEYTE',
    city: 'BURAUEN',
    barangay: 'HAPUNAN'
  }
} as const