/**
 * Medical Records Feature Test IDs
 * Test IDs for lab tests, prescriptions, and medical records components
 */

// Medical Records Page Test IDs
export const medicalRecordsTestIds = {
  pageTitle: 'page-title',
  addNewButton: 'add-new-button',
  labTestsTab: 'lab-tests-tab',
  prescriptionsTab: 'prescriptions-tab',
  labTestForm: 'lab-test-form',
  prescriptionForm: 'prescription-form',
  testTypeSelect: 'test-type-select',
  testDateInput: 'test-date-input',
  testResultsTextarea: 'test-results-textarea',
  medicationInput: 'medication-input',
  dosageInput: 'dosage-input',
  instructionsTextarea: 'instructions-textarea'
} as const

// Lab Test Form Test IDs
export const labTestFormTestIds = {
  form: 'lab-test-form',
  patientSelect: 'patient-select',
  testTypeSelect: 'test-type-select',
  testDateInput: 'test-date-input',
  requestedByInput: 'requested-by-input',
  testResultsTextarea: 'test-results-textarea',
  remarksTextarea: 'remarks-textarea',
  saveLabTestButton: 'save-lab-test-button',
  cancelLabTestButton: 'cancel-lab-test-button'
} as const

// Prescription Form Test IDs
export const prescriptionFormTestIds = {
  form: 'prescription-form',
  patientSelect: 'patient-select',
  doctorSelect: 'doctor-select',
  medicationInput: 'medication-input',
  dosageInput: 'dosage-input',
  frequencySelect: 'frequency-select',
  durationInput: 'duration-input',
  instructionsTextarea: 'instructions-textarea',
  savePrescriptionButton: 'save-prescription-button',
  cancelPrescriptionButton: 'cancel-prescription-button'
} as const

// Type definitions
export type MedicalRecordsTestIds = typeof medicalRecordsTestIds
export type LabTestFormTestIds = typeof labTestFormTestIds
export type PrescriptionFormTestIds = typeof prescriptionFormTestIds