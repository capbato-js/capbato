import { Page, Locator } from '@playwright/test'
import { accountsPageTestIds } from '@nx-starter/utils-core'

export class AccountsPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly addNewButton: Locator
  readonly accountsTable: Locator
  readonly searchInput: Locator

  constructor(page: Page) {
    this.page = page
    this.pageTitle = page.getByTestId(accountsPageTestIds.pageTitle)
    this.addNewButton = page.getByTestId(accountsPageTestIds.addNewButton)
    this.accountsTable = page.getByTestId(accountsPageTestIds.accountsTable)
    this.searchInput = page.getByTestId(accountsPageTestIds.searchAccounts)
  }

  async goto() {
    await this.page.goto('/accounts')
  }
}