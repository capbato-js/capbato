import { authenticatedTest } from './authenticatedBase'
import { PatientsPage } from '../pages/PatientsPage'

type PatientsPageFixtures = {
  patientsPage: PatientsPage
}

export const test = authenticatedTest.extend<PatientsPageFixtures>({
  patientsPage: async ({ authenticatedPage }, use) => {
    // Create PatientsPage instance (page is already authenticated)
    const patientsPage = new PatientsPage(authenticatedPage)

    await patientsPage.goto()
    
    await use(patientsPage)
  }
})

export { expect } from '@playwright/test'