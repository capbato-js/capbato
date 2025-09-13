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
  // Form Container
  form: 'patient-form',
  
  // Patient Information Section
  patientSection: 'patient-section',
  firstNameInput: 'first-name-input',
  middleNameInput: 'middle-name-input',
  lastNameInput: 'last-name-input',
  dateOfBirthInput: 'date-of-birth-input',
  ageInput: 'age-input',
  genderSelect: 'gender-select',
  contactNumberInput: 'contact-number-input',
  
  // Patient Address Fields
  houseNumberInput: 'house-number-input',
  streetNameInput: 'street-name-input',
  patientProvinceSelect: 'patient-province-select',
  patientCitySelect: 'patient-city-select',
  patientBarangaySelect: 'patient-barangay-select',
  
  // Guardian Information Section
  guardianSection: 'guardian-section',
  guardianNameInput: 'guardian-name-input',
  guardianGenderSelect: 'guardian-gender-select',
  guardianRelationshipInput: 'guardian-relationship-input',
  guardianContactInput: 'guardian-contact-input',
  
  // Guardian Address Fields
  guardianHouseNumberInput: 'guardian-house-number-input',
  guardianStreetNameInput: 'guardian-street-name-input',
  guardianProvinceSelect: 'guardian-province-select',
  guardianCitySelect: 'guardian-city-select',
  guardianBarangaySelect: 'guardian-barangay-select',
  
  // Form Actions
  savePatientButton: 'save-patient-button',
  cancelPatientButton: 'cancel-patient-button',
  
  // Validation & Errors
  fieldError: 'field-error',
  generalError: 'general-error'
} as const

// Add Patient Page Test IDs
export const addPatientPageTestIds = {
  pageTitle: 'add-patient-page-title',
  backButton: 'add-patient-back-button',
  pageContainer: 'add-patient-page-container',
  loadingSpinner: 'add-patient-loading',
  successMessage: 'add-patient-success',
  errorAlert: 'add-patient-error'
} as const

// Type definitions
export type PatientsPageTestIds = typeof patientsPageTestIds
export type PatientFormTestIds = typeof patientFormTestIds
export type AddPatientPageTestIds = typeof addPatientPageTestIds