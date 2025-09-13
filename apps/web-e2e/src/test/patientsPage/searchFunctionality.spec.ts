import { expect, test } from '../../fixtures/patientsPage'

test.describe('Patients Page Search Functionality', () => {
  test('should allow typing in search input', async ({ patientsPage }) => {
    // Wait for page to load completely
    await patientsPage.page.waitForLoadState('networkidle')
    
    // Verify the search input is visible and enabled
    await expect(patientsPage.searchInput).toBeVisible()
    await expect(patientsPage.searchInput).toBeEnabled()

    // Type in the search input
    const searchTerm = 'test search'
    await patientsPage.searchInput.fill(searchTerm)

    // Verify the search input contains the typed text
    await expect(patientsPage.searchInput).toHaveValue(searchTerm)

    // Clear the search input
    await patientsPage.searchInput.clear()
    await expect(patientsPage.searchInput).toHaveValue('')
  })

  test('should allow typing and clearing search input using keyboard', async ({ patientsPage }) => {
    // Wait for page to load completely
    await patientsPage.page.waitForLoadState('networkidle')
    
    // Focus on the search input
    await patientsPage.searchInput.focus()

    // Type using keyboard
    const searchTerm = 'Maria'
    await patientsPage.searchInput.type(searchTerm)

    // Verify the search input contains the typed text
    await expect(patientsPage.searchInput).toHaveValue(searchTerm)

    // Clear using selectAll and then typing over it
    await patientsPage.searchInput.selectText()
    await patientsPage.searchInput.press('Delete')
    
    // Verify the search input is cleared
    await expect(patientsPage.searchInput).toHaveValue('')
  })

  test('should maintain focus when typing in search input', async ({ patientsPage }) => {
    // Wait for page to load completely
    await patientsPage.page.waitForLoadState('networkidle')
    
    // Click on the search input to focus
    await patientsPage.searchInput.click()

    // Verify the search input is focused
    await expect(patientsPage.searchInput).toBeFocused()

    // Type in the search input
    await patientsPage.searchInput.type('Patient search')

    // Verify the search input still has focus after typing
    await expect(patientsPage.searchInput).toBeFocused()
  })
})