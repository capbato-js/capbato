import { test as base, Page } from '@playwright/test'
import { authTestIds } from '@nx-starter/utils-core'
import { AUTH_TEST_DATA } from '../data/patientsPage/testData'

type AuthenticatedFixtures = {
  authenticatedPage: Page
}

export const authenticatedTest = base.extend<AuthenticatedFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Perform authentication
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')
    
    // Fill in login credentials
    await page.getByTestId(authTestIds.usernameInput).fill(AUTH_TEST_DATA.DEFAULT_USER.username)
    await page.getByTestId(authTestIds.passwordInput).fill(AUTH_TEST_DATA.DEFAULT_USER.password)
    
    // Click login button
    await page.getByTestId(authTestIds.loginButton).click()
    
    // Wait for navigation away from login page (should redirect to dashboard or home)
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 })
    
    // Wait for authentication state to be established
    await page.waitForFunction(() => {
      return localStorage.getItem('auth_token') !== null
    }, { timeout: 5000 })
    
    // Wait for the initial page to be loaded
    await page.waitForLoadState('domcontentloaded')

    await use(page)
  }
})

export { expect } from '@playwright/test'