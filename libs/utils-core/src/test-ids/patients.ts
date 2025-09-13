/**
 * Patients Feature Test IDs
 * Test IDs for patients page, patient forms, and patient-related components
 */

// Patients Page Test IDs
export const patientsPageTestIds = {
  pageTitle: 'page-title',
  addNewButton: 'add-new-button',
  patientsTable: 'patients-table',
  tableHeader: 'table-header',
  patientNumberHeader: 'patient-number-header',
  patientNameHeader: 'patient-name-header',
  ageHeader: 'age-header',
  genderHeader: 'gender-header',
  contactNumberHeader: 'contact-number-header',
  guardianNameHeader: 'guardian-name-header',
  actionsHeader: 'actions-header',
  patientRow: 'patient-row',
  patientName: 'patient-name',
  patientNumber: 'patient-number',
  patientAge: 'patient-age',
  patientGender: 'patient-gender',
  patientContact: 'patient-contact',
  patientGuardian: 'patient-guardian',
  viewPatientButton: 'view-patient-button',
  editPatientButton: 'edit-patient-button',
  searchPatients: 'search-patients'
} as const

// Patient Form Test IDs
export const patientFormTestIds = {
  form: 'patient-form',
  firstNameInput: 'first-name-input',
  middleNameInput: 'middle-name-input',
  lastNameInput: 'last-name-input',
  birthdateInput: 'birthdate-input',
  genderSelect: 'gender-select',
  contactNumberInput: 'contact-number-input',
  emailInput: 'email-input',
  addressInput: 'address-input',
  guardianNameInput: 'guardian-name-input',
  guardianContactInput: 'guardian-contact-input',
  emergencyContactInput: 'emergency-contact-input',
  medicalHistoryTextarea: 'medical-history-textarea',
  savePatientButton: 'save-patient-button',
  cancelPatientButton: 'cancel-patient-button'
} as const

// Type definitions
export type PatientsPageTestIds = typeof patientsPageTestIds
export type PatientFormTestIds = typeof patientFormTestIds