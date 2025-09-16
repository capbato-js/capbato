import { expect, test } from '../../fixtures/accountsPage'
import { ACCOUNTS_TEST_DATA } from '../../data/accountsPage/testData'

test.describe('Accounts Page Load', () => {
  test('should display Accounts Management title and Create Account button', async ({
    accountsPage,
  }) => {
    // Check if the page title "Accounts Management" is visible
    await expect(accountsPage.pageTitle).toBeVisible()

    // Check if the Create Account button is visible
    await expect(accountsPage.addNewButton).toBeVisible()
  })

  test('should display correct texts', async ({ accountsPage }) => {
    // Check if the page title has correct text "Accounts Management"
    await expect(accountsPage.pageTitle).toHaveText(
      ACCOUNTS_TEST_DATA.PAGE_ELEMENTS.TITLE,
    )

    // Check if the Create Account button has correct text "Create Account"
    await expect(accountsPage.addNewButton).toHaveText(
      ACCOUNTS_TEST_DATA.PAGE_ELEMENTS.ADD_BUTTON,
    )
  })

  test('should display search input with correct placeholder', async ({ accountsPage }) => {
    // Wait for page to load completely
    await accountsPage.page.waitForLoadState('networkidle')
    
    // Verify the search input is visible
    await expect(accountsPage.searchInput).toBeVisible()

    // Verify the search input has correct placeholder text
    await expect(accountsPage.searchInput).toHaveAttribute('placeholder', ACCOUNTS_TEST_DATA.PAGE_ELEMENTS.SEARCH_PLACEHOLDER)

    // Verify the search input is enabled for user interaction
    await expect(accountsPage.searchInput).toBeEnabled()
  })

  test('should display accounts table', async ({ accountsPage }) => {
    // Wait for page to load completely
    await accountsPage.page.waitForLoadState('networkidle')
    
    // Verify the accounts table is visible using the test ID
    await expect(accountsPage.accountsTable).toBeVisible()
  })
})