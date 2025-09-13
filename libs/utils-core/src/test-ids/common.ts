/**
 * Common Test IDs
 * Shared UI component test IDs used across the application
 */

export const commonTestIds = {
  pageTitle: 'page-title',
  addNewButton: 'add-new-button',
  editButton: 'edit-button',
  deleteButton: 'delete-button',
  saveButton: 'save-button',
  cancelButton: 'cancel-button',
  confirmButton: 'confirm-button',
  loadingSpinner: 'loading-spinner',
  errorMessage: 'error-message',
  successMessage: 'success-message',
  searchInput: 'search-input',
  filterDropdown: 'filter-dropdown'
} as const

// Form Validation Test IDs
export const validationTestIds = {
  fieldError: 'field-error',
  formError: 'form-error',
  requiredIndicator: 'required-indicator',
  validationMessage: 'validation-message'
} as const

// Modal Test IDs
export const modalTestIds = {
  modal: 'modal',
  modalHeader: 'modal-header',
  modalBody: 'modal-body',
  modalFooter: 'modal-footer',
  modalCloseButton: 'modal-close-button',
  modalBackdrop: 'modal-backdrop',
  confirmModal: 'confirm-modal',
  deleteModal: 'delete-modal'
} as const

// Type definitions
export type CommonTestIds = typeof commonTestIds
export type ValidationTestIds = typeof validationTestIds
export type ModalTestIds = typeof modalTestIds