/**
 * Accounts Feature Test IDs
 * Test IDs for accounts page, account forms, and account-related components
 */

// Accounts Page Test IDs
export const accountsPageTestIds = {
  pageTitle: 'page-title',
  addNewButton: 'add-new-button',
  accountsTable: 'accounts-table',
  searchAccounts: 'search-accounts',
  accountRow: 'account-row',
  accountName: 'account-name',
  accountRole: 'account-role',
  accountEmail: 'account-email',
  accountMobile: 'account-mobile',
  editAccountButton: 'edit-account-button',
  changePasswordButton: 'change-password-button'
} as const

// Account Form Test IDs
export const accountFormTestIds = {
  createForm: 'create-account-form',
  updateForm: 'update-account-form',
  passwordForm: 'change-password-form',
  firstNameInput: 'first-name-input',
  lastNameInput: 'last-name-input',
  emailInput: 'email-input',
  mobileInput: 'mobile-input',
  roleSelect: 'role-select',
  passwordInput: 'password-input',
  confirmPasswordInput: 'confirm-password-input',
  newPasswordInput: 'new-password-input',
  saveAccountButton: 'save-account-button',
  updateAccountButton: 'update-account-button',
  changePasswordSubmitButton: 'change-password-submit-button',
  cancelButton: 'cancel-button'
} as const

// Type definitions
export type AccountsPageTestIds = typeof accountsPageTestIds
export type AccountFormTestIds = typeof accountFormTestIds