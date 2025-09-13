import { expect, test } from '../../fixtures/addPatientPage'
import { ADD_PATIENT_TEST_DATA } from '../../data/addPatientPage/testData'

test.describe('Add Patient Page Load', () => {
  test('should display Add Patient title and form elements', async ({
    addPatientPage,
  }) => {
    // Check if the page title "Add Patient" is visible
    await expect(addPatientPage.pageTitle).toBeVisible()

    // Check if the form is visible
    await expect(addPatientPage.form).toBeVisible()

    // Check if the save button is visible
    await expect(addPatientPage.saveButton).toBeVisible()

    // Check if the cancel button is visible
    await expect(addPatientPage.cancelButton).toBeVisible()
  })

  test('should display correct texts for page elements', async ({ addPatientPage }) => {
    // Check if the save button has correct text
    await expect(addPatientPage.saveButton).toHaveText(
      ADD_PATIENT_TEST_DATA.PAGE_ELEMENTS.SAVE_BUTTON,
    )

    // Check if the cancel button has correct text
    await expect(addPatientPage.cancelButton).toHaveText(
      ADD_PATIENT_TEST_DATA.PAGE_ELEMENTS.CANCEL_BUTTON,
    )
  })

  test('should display patient information section with required fields', async ({ addPatientPage }) => {
    // Wait for page to load completely
    await addPatientPage.page.waitForLoadState('networkidle')
    
    // Verify patient information fields are visible
    await expect(addPatientPage.firstNameInput).toBeVisible()
    await expect(addPatientPage.middleNameInput).toBeVisible()
    await expect(addPatientPage.lastNameInput).toBeVisible()
    await expect(addPatientPage.dateOfBirthInput).toBeVisible()
    await expect(addPatientPage.ageInput).toBeVisible()
    await expect(addPatientPage.genderSelect).toBeVisible()
    await expect(addPatientPage.contactNumberInput).toBeVisible()

    // Verify all fields are enabled for user interaction
    await expect(addPatientPage.firstNameInput).toBeEnabled()
    await expect(addPatientPage.lastNameInput).toBeEnabled()
    await expect(addPatientPage.dateOfBirthInput).toBeEnabled()
    await expect(addPatientPage.genderSelect).toBeEnabled()
    await expect(addPatientPage.contactNumberInput).toBeEnabled()
  })

  test('should display patient address section with cascade dropdowns', async ({ addPatientPage }) => {
    // Wait for page to load completely
    await addPatientPage.page.waitForLoadState('networkidle')
    
    // Verify address fields are visible
    await expect(addPatientPage.houseNumberInput).toBeVisible()
    await expect(addPatientPage.streetNameInput).toBeVisible()
    await expect(addPatientPage.patientProvinceSelect).toBeVisible()
    await expect(addPatientPage.patientCitySelect).toBeVisible()
    await expect(addPatientPage.patientBarangaySelect).toBeVisible()

    // Verify province is enabled but city and barangay are initially disabled
    await expect(addPatientPage.patientProvinceSelect).toBeEnabled()
    await expect(addPatientPage.patientCitySelect).toBeDisabled()
    await expect(addPatientPage.patientBarangaySelect).toBeDisabled()
  })

  test('should display guardian information section', async ({ addPatientPage }) => {
    // Wait for page to load completely
    await addPatientPage.page.waitForLoadState('networkidle')
    
    // Verify guardian information fields are visible
    await expect(addPatientPage.guardianNameInput).toBeVisible()
    await expect(addPatientPage.guardianGenderSelect).toBeVisible()
    await expect(addPatientPage.guardianRelationshipInput).toBeVisible()
    await expect(addPatientPage.guardianContactInput).toBeVisible()

    // Verify guardian address fields are visible
    await expect(addPatientPage.guardianHouseNumberInput).toBeVisible()
    await expect(addPatientPage.guardianStreetNameInput).toBeVisible()
    await expect(addPatientPage.guardianProvinceSelect).toBeVisible()
    await expect(addPatientPage.guardianCitySelect).toBeVisible()
    await expect(addPatientPage.guardianBarangaySelect).toBeVisible()

    // Verify guardian fields are enabled
    await expect(addPatientPage.guardianNameInput).toBeEnabled()
    await expect(addPatientPage.guardianGenderSelect).toBeEnabled()
    await expect(addPatientPage.guardianRelationshipInput).toBeEnabled()
    await expect(addPatientPage.guardianContactInput).toBeEnabled()
  })

  test('should display correct form labels', async ({ addPatientPage }) => {
    // Wait for page to load completely
    await addPatientPage.page.waitForLoadState('networkidle')
    
    // Verify field labels are present
    await expect(addPatientPage.page.getByText(ADD_PATIENT_TEST_DATA.FORM_LABELS.FIRST_NAME)).toBeVisible()
    await expect(addPatientPage.page.getByText(ADD_PATIENT_TEST_DATA.FORM_LABELS.LAST_NAME)).toBeVisible()
    await expect(addPatientPage.page.getByText(ADD_PATIENT_TEST_DATA.FORM_LABELS.DATE_OF_BIRTH)).toBeVisible()
    await expect(addPatientPage.page.getByText(ADD_PATIENT_TEST_DATA.FORM_LABELS.GENDER).first()).toBeVisible()
    await expect(addPatientPage.page.getByText(ADD_PATIENT_TEST_DATA.FORM_LABELS.CONTACT_NUMBER).first()).toBeVisible()

    // Verify address labels
    await expect(addPatientPage.page.getByText(ADD_PATIENT_TEST_DATA.FORM_LABELS.PROVINCE).first()).toBeVisible()
    await expect(addPatientPage.page.getByText(ADD_PATIENT_TEST_DATA.FORM_LABELS.CITY).first()).toBeVisible()
    await expect(addPatientPage.page.getByText(ADD_PATIENT_TEST_DATA.FORM_LABELS.BARANGAY).first()).toBeVisible()
  })

  test('should start with empty form fields', async ({ addPatientPage }) => {
    // Wait for page to load completely
    await addPatientPage.page.waitForLoadState('networkidle')
    
    // Verify all text inputs are empty
    await expect(addPatientPage.firstNameInput).toHaveValue('')
    await expect(addPatientPage.middleNameInput).toHaveValue('')
    await expect(addPatientPage.lastNameInput).toHaveValue('')
    await expect(addPatientPage.dateOfBirthInput).toHaveValue('')
    await expect(addPatientPage.contactNumberInput).toHaveValue('')
    await expect(addPatientPage.houseNumberInput).toHaveValue('')
    await expect(addPatientPage.streetNameInput).toHaveValue('')

    // Verify guardian fields are empty
    await expect(addPatientPage.guardianNameInput).toHaveValue('')
    await expect(addPatientPage.guardianRelationshipInput).toHaveValue('')
    await expect(addPatientPage.guardianContactInput).toHaveValue('')
  })

  test('should allow navigation back to patients page', async ({ addPatientPage, patientsPage }) => {
    // Click the back button
    await addPatientPage.backButton.click()

    // Should navigate back to patients page
    await expect(addPatientPage.page).toHaveURL('/patients')
    
    // Should see patients page elements
    await expect(patientsPage.pageTitle).toBeVisible()
    await expect(patientsPage.addNewButton).toBeVisible()
  })

  test('should allow navigation back via cancel button', async ({ addPatientPage, patientsPage }) => {
    // Click the cancel button
    await addPatientPage.cancelButton.click()

    // Should navigate back to patients page
    await expect(addPatientPage.page).toHaveURL('/patients')
    
    // Should see patients page elements
    await expect(patientsPage.pageTitle).toBeVisible()
    await expect(patientsPage.addNewButton).toBeVisible()
  })
})