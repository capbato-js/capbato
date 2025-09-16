export const ACCOUNTS_TEST_DATA = {
  PAGE_ELEMENTS: {
    TITLE: 'Accounts Management',
    ADD_BUTTON: 'Create Account',
    SEARCH_PLACEHOLDER: 'Search accounts by name, role, email, or contact number...'
  },
  TABLE_COLUMNS: {
    NAME: 'Name',
    ROLE: 'Role',
    EMAIL: 'Email',
    CONTACT: 'Contact',
    ACTIONS: 'Actions'
  }
} as const

export const TEST_MESSAGES = {
  PAGE_LOADED: 'Accounts page was loaded successfully',
  TITLE_VISIBLE: 'Page title is visible',
  BUTTON_VISIBLE: 'Add button is visible',
  TABLE_VISIBLE: 'Accounts table is visible',
  SEARCH_FUNCTIONAL: 'Search input is functional'
} as const