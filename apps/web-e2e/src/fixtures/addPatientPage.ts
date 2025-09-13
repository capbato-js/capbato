import { authenticatedTest } from './authenticatedBase'
import { PatientsPage } from '../pages/PatientsPage'
import { AddPatientPage } from '../pages/AddPatientPage'

type AddPatientPageFixtures = {
  addPatientPage: AddPatientPage
  patientsPage: PatientsPage
}

export const test = authenticatedTest.extend<AddPatientPageFixtures>({
  patientsPage: async ({ authenticatedPage }, use) => {
    // Create PatientsPage instance (page is already authenticated)
    const patientsPage = new PatientsPage(authenticatedPage)
    await patientsPage.goto()
    await use(patientsPage)
  },
  
  addPatientPage: async ({ authenticatedPage, patientsPage }, use) => {
    // Create AddPatientPage instance and navigate from patients page
    const addPatientPage = new AddPatientPage(authenticatedPage)
    
    // Navigate to add patient page from patients page
    await patientsPage.addNewButton.click()
    await authenticatedPage.waitForURL('/patients/new')
    await authenticatedPage.waitForLoadState('domcontentloaded')
    
    await use(addPatientPage)
  }
})

export { expect } from '@playwright/test'