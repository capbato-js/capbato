import { expect } from '../../fixtures/doctorsPage'
import { doctorsPageTest } from '../../fixtures/doctorsPage'
import { DOCTORS_TEST_DATA } from '../../data/doctorsPage/testData'
import { DoctorsPage } from '../../pages/DoctorsPage'

doctorsPageTest.describe('Doctors Page Load', () => {
  // Set timeout for all tests in this suite
  doctorsPageTest.setTimeout(60000)

  doctorsPageTest('should navigate to doctors page and load successfully', async ({
    doctorsPage,
  }) => {
    const page = new DoctorsPage(doctorsPage)

    // Wait for the page to load with explicit timeout
    await page.waitForPageLoad()

    // Verify we're on the correct URL
    expect(doctorsPage.url()).toContain(DOCTORS_TEST_DATA.PAGE_ELEMENTS.EXPECTED_URL)

    // Check if the page container is visible
    await expect(page.pageContainer).toBeVisible({ timeout: 10000 })
  })

  doctorsPageTest('should display doctors table header with correct title', async ({
    doctorsPage,
  }) => {
    const page = new DoctorsPage(doctorsPage)

    // Wait for the page to load with explicit timeout
    await page.waitForPageLoad()

    // Check if the page title header is visible
    await expect(page.doctorsTableHeader).toBeVisible({ timeout: 10000 })

    // Check if the title has correct text
    await expect(page.doctorsTableHeader).toHaveText(
      DOCTORS_TEST_DATA.PAGE_ELEMENTS.TITLE,
      { timeout: 5000 }
    )
  })

  doctorsPageTest('should display doctors table or error state', async ({
    doctorsPage,
  }) => {
    const page = new DoctorsPage(doctorsPage)

    // Wait for the page to load with explicit timeout
    await page.waitForPageLoad()

    // The page should display either the doctors table or an error state
    const isTableVisible = await page.isTableVisible()
    const isErrorVisible = await page.isErrorVisible()

    // At least one should be visible (table with data or error message)
    expect(isTableVisible || isErrorVisible).toBe(true)

    // If error is visible, check error elements
    if (isErrorVisible) {
      await expect(page.errorAlert).toBeVisible({ timeout: 5000 })
      await expect(page.errorMessage).toBeVisible({ timeout: 5000 })
      await expect(page.retryButton).toBeVisible({ timeout: 5000 })
      await expect(page.retryButton).toHaveText(DOCTORS_TEST_DATA.BUTTONS.RETRY, { timeout: 5000 })
    }

    // If table is visible, verify it's properly displayed
    if (isTableVisible) {
      await expect(page.doctorsTable).toBeVisible({ timeout: 5000 })
    }
  })

  doctorsPageTest('should display schedule calendar component', async ({
    doctorsPage,
  }) => {
    const page = new DoctorsPage(doctorsPage)

    // Wait for the page to load with explicit timeout
    await page.waitForPageLoad()

    // Wait for page to load completely with timeout
    await doctorsPage.waitForLoadState('networkidle', { timeout: 15000 })

    // Actually test if the schedule calendar is visible
    // If this fails, we need to fix the calendar component or its test IDs
    const isCalendarVisible = await page.isScheduleCalendarVisible()
    
    expect(isCalendarVisible).toBe(true)
  })

  doctorsPageTest('should handle page load within expected timeframe', async ({
    doctorsPage,
  }) => {
    const page = new DoctorsPage(doctorsPage)

    // Record start time
    const startTime = Date.now()

    // Wait for the page to load with explicit timeout
    await page.waitForPageLoad()

    // Calculate load time
    const loadTime = Date.now() - startTime

    // Page should load within reasonable time (10 seconds)
    expect(loadTime).toBeLessThan(10000)

    // Verify core elements are present
    await expect(page.pageContainer).toBeVisible({ timeout: 5000 })
    await expect(page.doctorsTableHeader).toBeVisible({ timeout: 5000 })
  })
})