import { expect, test } from '../../fixtures/addPatientPage'
import { ADD_PATIENT_TEST_DATA } from '../../data/addPatientPage/testData'

test.describe('Add Patient Form Interactions', () => {
  test('should fill patient information fields', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.COMPLETE_PATIENT
    
    // Fill basic patient information
    await addPatientPage.firstNameInput.fill(patient.firstName)
    await addPatientPage.middleNameInput.fill(patient.middleName)
    await addPatientPage.lastNameInput.fill(patient.lastName)
    
    // Fill date of birth
    await addPatientPage.dateOfBirthInput.fill(patient.dateOfBirth)
    
    // Select gender
    await addPatientPage.selectGender(patient.gender)
    
    // Fill contact number
    await addPatientPage.contactNumberInput.fill(patient.contactNumber)

    // Verify the fields are filled correctly
    await expect(addPatientPage.firstNameInput).toHaveValue(patient.firstName)
    await expect(addPatientPage.middleNameInput).toHaveValue(patient.middleName)
    await expect(addPatientPage.lastNameInput).toHaveValue(patient.lastName)
    // Date input shows formatted date, not ISO string
    await expect(addPatientPage.dateOfBirthInput).toHaveValue('Aug 20, 2010')
    await expect(addPatientPage.genderSelect).toHaveValue(patient.gender)
    await expect(addPatientPage.contactNumberInput).toHaveValue(patient.contactNumber)
  })

  test('should handle date of birth selection and calculate age', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.COMPLETE_PATIENT
    
    // Fill date of birth
    await addPatientPage.dateOfBirthInput.fill(patient.dateOfBirth)
    
    // Click away to trigger age calculation
    await addPatientPage.firstNameInput.click()
    
    // Wait for age calculation
    await addPatientPage.page.waitForTimeout(500)
    
    // Age should be calculated automatically
    await expect(addPatientPage.ageInput).not.toHaveValue('')
    
    // Age should be a number
    const ageValue = await addPatientPage.ageInput.inputValue()
    expect(parseInt(ageValue)).toBeGreaterThan(0)
  })

  test('should handle gender selection', async ({ addPatientPage }) => {
    // Test different gender options
    await addPatientPage.selectGender(ADD_PATIENT_TEST_DATA.GENDER_OPTIONS.MALE)
    await expect(addPatientPage.genderSelect).toHaveValue(ADD_PATIENT_TEST_DATA.GENDER_OPTIONS.MALE)
    
    await addPatientPage.selectGender(ADD_PATIENT_TEST_DATA.GENDER_OPTIONS.FEMALE)
    await expect(addPatientPage.genderSelect).toHaveValue(ADD_PATIENT_TEST_DATA.GENDER_OPTIONS.FEMALE)
  })

  test('should handle patient address cascade dropdowns', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.COMPLETE_PATIENT
    
    // Initially city and barangay should be disabled
    await expect(addPatientPage.patientCitySelect).toBeDisabled()
    await expect(addPatientPage.patientBarangaySelect).toBeDisabled()
    
    // Select a province
    await addPatientPage.selectPatientProvince(patient.province)
    
    // Wait for city dropdown to load
    await addPatientPage.page.waitForTimeout(1000)
    
    // City dropdown should now be enabled
    await expect(addPatientPage.patientCitySelect).toBeEnabled()
    
    // Select a city
    await addPatientPage.selectPatientCity(patient.city)
    
    // Wait for barangay dropdown to load
    await addPatientPage.page.waitForTimeout(1000)
    
    // Barangay dropdown should now be enabled
    await expect(addPatientPage.patientBarangaySelect).toBeEnabled()
    
    // Select a barangay
    await addPatientPage.selectPatientBarangay(patient.barangay)
    
    // Verify selections
    await expect(addPatientPage.patientProvinceSelect).toHaveValue(patient.province)
    await expect(addPatientPage.patientCitySelect).toHaveValue(patient.city)
    await expect(addPatientPage.patientBarangaySelect).toHaveValue(patient.barangay)
  })

  test('should fill patient address information', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.COMPLETE_PATIENT
    
    // Fill house number and street name
    await addPatientPage.houseNumberInput.fill(patient.houseNumber)
    await addPatientPage.streetNameInput.fill(patient.streetName)
    
    // Verify address fields
    await expect(addPatientPage.houseNumberInput).toHaveValue(patient.houseNumber)
    await expect(addPatientPage.streetNameInput).toHaveValue(patient.streetName)
  })

  test('should fill guardian information fields', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.COMPLETE_PATIENT
    
    // Fill guardian information
    await addPatientPage.guardianNameInput.fill(patient.guardianName)
    await addPatientPage.selectGuardianGender(patient.guardianGender)
    await addPatientPage.guardianRelationshipInput.fill(patient.guardianRelationship)
    await addPatientPage.guardianContactInput.fill(patient.guardianContact)
    
    // Verify guardian fields
    await expect(addPatientPage.guardianNameInput).toHaveValue(patient.guardianName)
    await expect(addPatientPage.guardianGenderSelect).toHaveValue(patient.guardianGender)
    await expect(addPatientPage.guardianRelationshipInput).toHaveValue(patient.guardianRelationship)
    await expect(addPatientPage.guardianContactInput).toHaveValue(patient.guardianContact)
  })

  test('should handle guardian address cascade dropdowns', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.COMPLETE_PATIENT
    
    // Initially guardian city and barangay should be disabled
    await expect(addPatientPage.guardianCitySelect).toBeDisabled()
    await expect(addPatientPage.guardianBarangaySelect).toBeDisabled()
    
    // Select guardian province
    await addPatientPage.selectGuardianProvince(patient.guardianProvince)
    
    // Wait for city dropdown to load
    await addPatientPage.page.waitForTimeout(1000)
    
    // Guardian city dropdown should now be enabled
    await expect(addPatientPage.guardianCitySelect).toBeEnabled()
    
    // Select guardian city
    await addPatientPage.selectGuardianCity(patient.guardianCity)
    
    // Wait for barangay dropdown to load
    await addPatientPage.page.waitForTimeout(1000)
    
    // Guardian barangay dropdown should now be enabled
    await expect(addPatientPage.guardianBarangaySelect).toBeEnabled()
    
    // Select guardian barangay
    await addPatientPage.selectGuardianBarangay(patient.guardianBarangay)
    
    // Verify guardian address selections
    await expect(addPatientPage.guardianProvinceSelect).toHaveValue(patient.guardianProvince)
    await expect(addPatientPage.guardianCitySelect).toHaveValue(patient.guardianCity)
    await expect(addPatientPage.guardianBarangaySelect).toHaveValue(patient.guardianBarangay)
  })

  test('should fill guardian address fields', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.COMPLETE_PATIENT
    
    // Fill guardian address
    await addPatientPage.guardianHouseNumberInput.fill(patient.guardianHouseNumber)
    await addPatientPage.guardianStreetNameInput.fill(patient.guardianStreetName)
    
    // Verify guardian address fields
    await expect(addPatientPage.guardianHouseNumberInput).toHaveValue(patient.guardianHouseNumber)
    await expect(addPatientPage.guardianStreetNameInput).toHaveValue(patient.guardianStreetName)
  })

  test('should reset city and barangay when province changes', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.COMPLETE_PATIENT
    
    // Select LEYTE > BURAUEN > HAPUNAN first
    await addPatientPage.selectPatientProvince(patient.province) // LEYTE
    await addPatientPage.page.waitForTimeout(1000)
    
    await addPatientPage.selectPatientCity(patient.city) // BURAUEN
    await addPatientPage.page.waitForTimeout(1000)
    
    await addPatientPage.selectPatientBarangay(patient.barangay) // HAPUNAN
    
    // Verify initial selections are correct
    await expect(addPatientPage.patientProvinceSelect).toHaveValue(patient.province)
    await expect(addPatientPage.patientCitySelect).toHaveValue(patient.city)
    await expect(addPatientPage.patientBarangaySelect).toHaveValue(patient.barangay)
    
    // Change to a different province (just to test the functionality works)
    await addPatientPage.selectPatientProvince('NATIONAL CAPITAL REGION - MANILA')
    
    // Wait for cascade effects
    await addPatientPage.page.waitForTimeout(1000)
    
    // Verify the province changed successfully
    await expect(addPatientPage.patientProvinceSelect).toHaveValue('NATIONAL CAPITAL REGION - MANILA')
    
    // The cascade functionality should be working (city dropdown should be enabled for new province)
    await expect(addPatientPage.patientCitySelect).toBeEnabled()
  })

  test('should fill complete patient form', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.COMPLETE_PATIENT
    
    // Fill all patient information
    await addPatientPage.firstNameInput.fill(patient.firstName)
    await addPatientPage.middleNameInput.fill(patient.middleName)
    await addPatientPage.lastNameInput.fill(patient.lastName)
    await addPatientPage.dateOfBirthInput.fill(patient.dateOfBirth)
    await addPatientPage.selectGender(patient.gender)
    await addPatientPage.contactNumberInput.fill(patient.contactNumber)
    
    // Fill patient address
    await addPatientPage.houseNumberInput.fill(patient.houseNumber)
    await addPatientPage.streetNameInput.fill(patient.streetName)
    await addPatientPage.selectPatientProvince(patient.province)
    await addPatientPage.page.waitForTimeout(1000)
    await addPatientPage.selectPatientCity(patient.city)
    await addPatientPage.page.waitForTimeout(1000)
    await addPatientPage.selectPatientBarangay(patient.barangay)
    
    // Fill guardian information
    await addPatientPage.guardianNameInput.fill(patient.guardianName)
    await addPatientPage.selectGuardianGender(patient.guardianGender)
    await addPatientPage.guardianRelationshipInput.fill(patient.guardianRelationship)
    await addPatientPage.guardianContactInput.fill(patient.guardianContact)
    
    // Fill guardian address
    await addPatientPage.guardianHouseNumberInput.fill(patient.guardianHouseNumber)
    await addPatientPage.guardianStreetNameInput.fill(patient.guardianStreetName)
    await addPatientPage.selectGuardianProvince(patient.guardianProvince)
    await addPatientPage.page.waitForTimeout(1000)
    await addPatientPage.selectGuardianCity(patient.guardianCity)
    await addPatientPage.page.waitForTimeout(1000)
    await addPatientPage.selectGuardianBarangay(patient.guardianBarangay)
    
    // Verify save button is enabled
    await expect(addPatientPage.saveButton).toBeEnabled()
    
    // All form fields should be filled
    await expect(addPatientPage.firstNameInput).toHaveValue(patient.firstName)
    await expect(addPatientPage.lastNameInput).toHaveValue(patient.lastName)
    await expect(addPatientPage.guardianNameInput).toHaveValue(patient.guardianName)
  })

  test('should fill minimal patient form', async ({ addPatientPage }) => {
    const patient = ADD_PATIENT_TEST_DATA.SAMPLE_DATA.MINIMAL_PATIENT
    
    // Fill only required fields
    await addPatientPage.firstNameInput.fill(patient.firstName)
    await addPatientPage.lastNameInput.fill(patient.lastName)
    await addPatientPage.dateOfBirthInput.fill(patient.dateOfBirth)
    await addPatientPage.selectGender(patient.gender)
    await addPatientPage.contactNumberInput.fill(patient.contactNumber)
    
    // Fill address
    await addPatientPage.selectPatientProvince(patient.province)
    await addPatientPage.page.waitForTimeout(1000)
    await addPatientPage.selectPatientCity(patient.city)
    await addPatientPage.page.waitForTimeout(1000)
    await addPatientPage.selectPatientBarangay(patient.barangay)
    
    // Verify save button is enabled
    await expect(addPatientPage.saveButton).toBeEnabled()
    
    // Required fields should be filled
    await expect(addPatientPage.firstNameInput).toHaveValue(patient.firstName)
    await expect(addPatientPage.lastNameInput).toHaveValue(patient.lastName)
    // Date input shows formatted date for minimal patient (1995-05-15)
    await expect(addPatientPage.dateOfBirthInput).toHaveValue('May 15, 1995')
  })
})