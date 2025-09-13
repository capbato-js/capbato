import { Page, Locator } from '@playwright/test'
import { patientsPageTestIds } from '@nx-starter/utils-core'

export class PatientsPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly addNewButton: Locator
  readonly patientsTable: Locator
  readonly searchInput: Locator

  constructor(page: Page) {
    this.page = page
    this.pageTitle = page.getByTestId(patientsPageTestIds.pageTitle)
    this.addNewButton = page.getByTestId(patientsPageTestIds.addNewButton)
    this.patientsTable = page.getByTestId(patientsPageTestIds.patientsTable)
    this.searchInput = page.getByTestId(patientsPageTestIds.searchPatients)
  }

  async goto() {
    await this.page.goto('/patients')
  }
}