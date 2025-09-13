import { Page, Locator } from '@playwright/test'
import { patientFormTestIds, addPatientPageTestIds } from '@nx-starter/utils-core'

export class AddPatientPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly backButton: Locator
  readonly form: Locator
  
  // Patient Information Fields
  readonly firstNameInput: Locator
  readonly middleNameInput: Locator
  readonly lastNameInput: Locator
  readonly dateOfBirthInput: Locator
  readonly ageInput: Locator
  readonly genderSelect: Locator
  readonly contactNumberInput: Locator
  
  // Patient Address Fields
  readonly houseNumberInput: Locator
  readonly streetNameInput: Locator
  readonly patientProvinceSelect: Locator
  readonly patientCitySelect: Locator
  readonly patientBarangaySelect: Locator
  
  // Guardian Information Fields
  readonly guardianNameInput: Locator
  readonly guardianGenderSelect: Locator
  readonly guardianRelationshipInput: Locator
  readonly guardianContactInput: Locator
  
  // Guardian Address Fields
  readonly guardianHouseNumberInput: Locator
  readonly guardianStreetNameInput: Locator
  readonly guardianProvinceSelect: Locator
  readonly guardianCitySelect: Locator
  readonly guardianBarangaySelect: Locator
  
  // Action Buttons
  readonly saveButton: Locator
  readonly cancelButton: Locator

  constructor(page: Page) {
    this.page = page
    
    // Page Elements
    this.pageTitle = page.getByTestId(addPatientPageTestIds.pageTitle)
    this.backButton = page.getByTestId(addPatientPageTestIds.backButton)
    this.form = page.getByTestId(patientFormTestIds.form)
    
    // Patient Information
    this.firstNameInput = page.getByTestId(patientFormTestIds.firstNameInput)
    this.middleNameInput = page.getByTestId(patientFormTestIds.middleNameInput)
    this.lastNameInput = page.getByTestId(patientFormTestIds.lastNameInput)
    this.dateOfBirthInput = page.getByTestId(patientFormTestIds.dateOfBirthInput)
    this.ageInput = page.getByTestId(patientFormTestIds.ageInput)
    this.genderSelect = page.getByTestId(patientFormTestIds.genderSelect)
    this.contactNumberInput = page.getByTestId(patientFormTestIds.contactNumberInput)
    
    // Patient Address
    this.houseNumberInput = page.getByTestId(patientFormTestIds.houseNumberInput)
    this.streetNameInput = page.getByTestId(patientFormTestIds.streetNameInput)
    this.patientProvinceSelect = page.getByTestId(patientFormTestIds.patientProvinceSelect)
    this.patientCitySelect = page.getByTestId(patientFormTestIds.patientCitySelect)
    this.patientBarangaySelect = page.getByTestId(patientFormTestIds.patientBarangaySelect)
    
    // Guardian Information
    this.guardianNameInput = page.getByTestId(patientFormTestIds.guardianNameInput)
    this.guardianGenderSelect = page.getByTestId(patientFormTestIds.guardianGenderSelect)
    this.guardianRelationshipInput = page.getByTestId(patientFormTestIds.guardianRelationshipInput)
    this.guardianContactInput = page.getByTestId(patientFormTestIds.guardianContactInput)
    
    // Guardian Address
    this.guardianHouseNumberInput = page.getByTestId(patientFormTestIds.guardianHouseNumberInput)
    this.guardianStreetNameInput = page.getByTestId(patientFormTestIds.guardianStreetNameInput)
    this.guardianProvinceSelect = page.getByTestId(patientFormTestIds.guardianProvinceSelect)
    this.guardianCitySelect = page.getByTestId(patientFormTestIds.guardianCitySelect)
    this.guardianBarangaySelect = page.getByTestId(patientFormTestIds.guardianBarangaySelect)
    
    // Actions
    this.saveButton = page.getByTestId(patientFormTestIds.savePatientButton)
    this.cancelButton = page.getByTestId(patientFormTestIds.cancelPatientButton)
  }

  async goto() {
    await this.page.goto('/patients/new')
  }

  // Helper methods for Mantine Select components
  async selectGender(value: string) {
    await this.genderSelect.click()
    // Wait for dropdown to open
    await this.page.waitForTimeout(500)
    // Use a simpler approach: find the visible dropdown and select the option
    await this.page.locator('[role="option"]').filter({ hasText: value }).first().click()
  }

  async selectPatientProvince(value: string) {
    await this.patientProvinceSelect.click()
    // Wait for dropdown to open and load options
    await this.page.waitForTimeout(300)
    // Select from the specific dropdown that's open
    await this.page.getByRole('option', { name: value, exact: true }).first().click()
    // Wait for cascading effect
    await this.page.waitForTimeout(500)
  }

  async selectPatientCity(value: string) {
    await this.patientCitySelect.click()
    await this.page.waitForTimeout(300)
    await this.page.getByRole('option', { name: value, exact: true }).first().click()
    await this.page.waitForTimeout(500)
  }

  async selectPatientBarangay(value: string) {
    await this.patientBarangaySelect.click()
    await this.page.waitForTimeout(300)
    await this.page.getByRole('option', { name: value, exact: true }).first().click()
    await this.page.waitForTimeout(200)
  }

  async selectGuardianGender(value: string) {
    await this.guardianGenderSelect.click()
    // Wait for dropdown to open
    await this.page.waitForTimeout(200)
    // Use a simpler approach - get all options and find the one we want
    await this.page.getByRole('option', { name: value, exact: true }).last().click()
  }

  async selectGuardianProvince(value: string) {
    await this.guardianProvinceSelect.click()
    await this.page.waitForTimeout(300)
    await this.page.getByRole('option', { name: value, exact: true }).first().click()
    await this.page.waitForTimeout(500)
  }

  async selectGuardianCity(value: string) {
    await this.guardianCitySelect.click()
    await this.page.waitForTimeout(300)
    await this.page.getByRole('option', { name: value, exact: true }).first().click()
    await this.page.waitForTimeout(500)
  }

  async selectGuardianBarangay(value: string) {
    await this.guardianBarangaySelect.click()
    await this.page.waitForTimeout(300)
    await this.page.getByRole('option', { name: value, exact: true }).first().click()
    await this.page.waitForTimeout(200)
  }
}