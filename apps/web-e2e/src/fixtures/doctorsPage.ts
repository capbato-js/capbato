import { Page } from '@playwright/test'
import { authenticatedTest } from './authenticatedBase'

type DoctorsPageFixtures = {
  doctorsPage: Page
}

export const doctorsPageTest = authenticatedTest.extend<DoctorsPageFixtures>({
  doctorsPage: async ({ authenticatedPage }, use) => {
    // Navigate to doctors page
    await authenticatedPage.goto('/doctors')
    await authenticatedPage.waitForLoadState('domcontentloaded')
    
    await use(authenticatedPage)
  }
})

export { expect } from '@playwright/test'