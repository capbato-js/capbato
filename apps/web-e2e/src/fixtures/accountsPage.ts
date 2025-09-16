import { authenticatedTest } from './authenticatedBase'
import { AccountsPage } from '../pages/AccountsPage'

type AccountsPageFixtures = {
  accountsPage: AccountsPage
}

export const test = authenticatedTest.extend<AccountsPageFixtures>({
  accountsPage: async ({ authenticatedPage }, use) => {
    // Create AccountsPage instance (page is already authenticated)
    const accountsPage = new AccountsPage(authenticatedPage)

    await accountsPage.goto()
    
    await use(accountsPage)
  }
})

export { expect } from '@playwright/test'