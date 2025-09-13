import { expect, test } from '../../fixtures/patientsPage'
import { PATIENTS_TEST_DATA } from '../../data/patientsPage/testData'

test.describe('Patients Page Load', () => {
  test('should display Patient Records title and Add New Patient Button', async ({
    patientsPage,
  }) => {
    // Check if the page title "Patient Records" is visible
    await expect(patientsPage.pageTitle).toBeVisible()

    // Check if the Add New Patient button is visible
    await expect(patientsPage.addNewButton).toBeVisible()
  })

  test('should display correct texts', async ({ patientsPage }) => {
    // Check if the page title has correct text "Patient Records"
    await expect(patientsPage.pageTitle).toHaveText(
      PATIENTS_TEST_DATA.PAGE_ELEMENTS.TITLE,
    )

    // Check if the Add New Patient button has correct text "Add New Patient"
    await expect(patientsPage.addNewButton).toHaveText(
      PATIENTS_TEST_DATA.PAGE_ELEMENTS.ADD_BUTTON,
    )
  })

  test('should display search input with correct placeholder', async ({ patientsPage }) => {
    // Wait for page to load completely
    await patientsPage.page.waitForLoadState('networkidle')
    
    // Verify the search input is visible
    await expect(patientsPage.searchInput).toBeVisible()

    // Verify the search input has correct placeholder text
    await expect(patientsPage.searchInput).toHaveAttribute('placeholder', PATIENTS_TEST_DATA.PAGE_ELEMENTS.SEARCH_PLACEHOLDER)

    // Verify the search input is enabled for user interaction
    await expect(patientsPage.searchInput).toBeEnabled()
  })

  test('should display patients table with correct column headers', async ({ patientsPage }) => {
    // Wait for page to load completely
    await patientsPage.page.waitForLoadState('networkidle')
    
    // Verify the patients table is visible using the test ID
    await expect(patientsPage.patientsTable).toBeVisible()

    // Verify all required column headers are present within the patients table
    // This approach is more resilient to HTML structure changes
    await expect(patientsPage.patientsTable.getByText(PATIENTS_TEST_DATA.TABLE_COLUMNS.PATIENT_NUMBER)).toBeVisible()
    await expect(patientsPage.patientsTable.getByText(PATIENTS_TEST_DATA.TABLE_COLUMNS.PATIENT_NAME)).toBeVisible()
    await expect(patientsPage.patientsTable.getByText(PATIENTS_TEST_DATA.TABLE_COLUMNS.AGE)).toBeVisible()
    await expect(patientsPage.patientsTable.getByText(PATIENTS_TEST_DATA.TABLE_COLUMNS.GENDER)).toBeVisible()
    await expect(patientsPage.patientsTable.getByText(PATIENTS_TEST_DATA.TABLE_COLUMNS.CONTACT_NUMBER)).toBeVisible()
    await expect(patientsPage.patientsTable.getByText(PATIENTS_TEST_DATA.TABLE_COLUMNS.GUARDIAN_NAME)).toBeVisible()
    await expect(patientsPage.patientsTable.getByText(PATIENTS_TEST_DATA.TABLE_COLUMNS.ACTIONS)).toBeVisible()
  })

  test('should verify table column order', async ({ patientsPage }) => {
    // Wait for page to load
    await patientsPage.page.waitForLoadState('networkidle')
    
    // Verify the patients table is visible
    await expect(patientsPage.patientsTable).toBeVisible()
    
    // Get all table header cells within the patients table
    const headerCells = patientsPage.patientsTable.locator('thead th')
    
    // Verify we have the expected number of columns (7 columns)
    await expect(headerCells).toHaveCount(7)
    
    // Verify the expected text content for each column in order
    const expectedTexts = [
      PATIENTS_TEST_DATA.TABLE_COLUMNS.PATIENT_NUMBER,
      PATIENTS_TEST_DATA.TABLE_COLUMNS.PATIENT_NAME,
      PATIENTS_TEST_DATA.TABLE_COLUMNS.AGE,
      PATIENTS_TEST_DATA.TABLE_COLUMNS.GENDER,
      PATIENTS_TEST_DATA.TABLE_COLUMNS.CONTACT_NUMBER,
      PATIENTS_TEST_DATA.TABLE_COLUMNS.GUARDIAN_NAME,
      PATIENTS_TEST_DATA.TABLE_COLUMNS.ACTIONS
    ]

    // Check each column header in sequence
    for (let i = 0; i < expectedTexts.length; i++) {
      await expect(headerCells.nth(i)).toHaveText(expectedTexts[i])
    }
  })
})
