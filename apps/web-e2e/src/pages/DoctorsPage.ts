import { Page, Locator } from '@playwright/test'
import { doctorsPageTestIds } from '@nx-starter/utils-core'

export class DoctorsPage {
  readonly page: Page
  readonly pageContainer: Locator
  readonly doctorsTable: Locator
  readonly doctorsTableHeader: Locator
  readonly scheduleCalendar: Locator
  readonly errorAlert: Locator
  readonly errorMessage: Locator
  readonly retryButton: Locator
  readonly loadingIndicator: Locator
  readonly emptyStateMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.pageContainer = page.getByTestId(doctorsPageTestIds.pageContainer)
    this.doctorsTable = page.getByTestId(doctorsPageTestIds.doctorsTable)
    this.doctorsTableHeader = page.getByTestId('page-title') // Use actual test ID from DataTableHeader
    this.scheduleCalendar = page.getByTestId(doctorsPageTestIds.scheduleCalendar)
    this.errorAlert = page.getByTestId(doctorsPageTestIds.errorAlert)
    this.errorMessage = page.getByTestId(doctorsPageTestIds.errorMessage)
    this.retryButton = page.getByTestId(doctorsPageTestIds.retryButton)
    this.loadingIndicator = page.getByTestId(doctorsPageTestIds.loadingIndicator)
    this.emptyStateMessage = page.getByTestId(doctorsPageTestIds.emptyStateMessage)
  }

  async goto() {
    await this.page.goto('/doctors')
    await this.page.waitForLoadState('domcontentloaded')
  }

  async waitForPageLoad() {
    // Wait for the main page container to be visible with timeout
    await this.pageContainer.waitFor({ state: 'visible', timeout: 15000 })
    
    // Wait for either the table to be visible or an error state with timeout
    await Promise.race([
      this.doctorsTable.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
        // Table not found, continue
      }),
      this.errorAlert.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
        // Error alert not found, continue
      })
    ])
    
    // Additional wait for DOM content to be loaded
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 })
  }

  async isTableVisible() {
    try {
      await this.doctorsTable.waitFor({ state: 'visible', timeout: 5000 })
      return await this.doctorsTable.isVisible()
    } catch {
      return false
    }
  }

  async isErrorVisible() {
    try {
      await this.errorAlert.waitFor({ state: 'visible', timeout: 5000 })
      return await this.errorAlert.isVisible()
    } catch {
      return false
    }
  }

  async isScheduleCalendarVisible() {
    try {
      await this.scheduleCalendar.waitFor({ state: 'visible', timeout: 5000 })
      return await this.scheduleCalendar.isVisible()
    } catch {
      return false
    }
  }

  async getPageTitle() {
    return await this.doctorsTableHeader.textContent()
  }

  async retry() {
    await this.retryButton.click()
  }
}