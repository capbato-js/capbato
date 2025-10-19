/**
 * Authentication Test IDs
 * Test IDs for login, logout, and authentication-related components
 */

export const authTestIds = {
  usernameInput: 'login-identifier-input',
  passwordInput: 'login-password-input', 
  loginButton: 'login-submit-button',
  rememberMeCheckbox: 'login-remember-me-checkbox',
  loginForm: 'login-form',
  loginError: 'login-error-message',
  logoutButton: 'logout-button',
  userProfile: 'user-profile'
} as const

// Type definition
export type AuthTestIds = typeof authTestIds