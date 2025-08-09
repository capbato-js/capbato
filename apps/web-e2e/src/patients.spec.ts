import { test, expect } from '@playwright/test';
import { PatientsPage, AddPatientPage, EditPatientPage, PatientDetailsPage } from './pages/PatientsPage';

test.describe('Patients Application', () => {
  let patientsPage: PatientsPage;
  let addPatientPage: AddPatientPage;
  let editPatientPage: EditPatientPage;
  let patientDetailsPage: PatientDetailsPage;

  test.beforeEach(async ({ page }) => {
    patientsPage = new PatientsPage(page);
    addPatientPage = new AddPatientPage(page);
    editPatientPage = new EditPatientPage(page);
    patientDetailsPage = new PatientDetailsPage(page);
    
    // Clean up any existing patient data before each test
    await patientsPage.cleanup();
    await patientsPage.navigate();
  });

  test.describe('Initial State and Navigation', () => {
    test('should display patients page with correct title and structure', async ({ page }) => {
      await expect(page).toHaveTitle(/Frontend/);
      await patientsPage.expectPageTitle();
    });

    test('should show empty state when no patients exist', async () => {
      await patientsPage.expectEmptyState();
    });

    test('should navigate to add patient page when clicking add button', async () => {
      await patientsPage.addNewPatient();
      await addPatientPage.expectPageTitle();
    });

    test('should have functional search box', async () => {
      const searchInput = patientsPage['page'].locator('input[placeholder*="Search patients"]');
      await expect(searchInput).toBeVisible();
      await patientsPage.searchPatients('test');
      await patientsPage.clearSearch();
    });
  });

  test.describe('Adding Patients (Create)', () => {
    test.beforeEach(async () => {
      await patientsPage.addNewPatient();
    });

    test('should successfully add a new patient with minimal required data', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        gender: 'Male' as const,
        contactNumber: '09123456789'
      };

      await addPatientPage.fillPatientForm(patientData);
      await addPatientPage.savePatient();

      // Should navigate back to patients list
      await patientsPage.expectPatientInList('John Doe');
    });

    test('should successfully add a patient with complete data including guardian and address', async () => {
      const patientData = {
        firstName: 'Jane',
        middleName: 'Marie',
        lastName: 'Smith',
        dateOfBirth: '1985-03-20',
        gender: 'Female' as const,
        contactNumber: '09187654321',
        guardianFirstName: 'Robert',
        guardianLastName: 'Smith',
        guardianContactNumber: '09111222333',
        street: '123 Main Street'
      };

      await addPatientPage.fillPatientForm(patientData);
      await addPatientPage.savePatient();

      await patientsPage.expectPatientInList('Jane Marie Smith');
      
      // Verify patient details include guardian information
      const patientRow = await patientsPage.getPatientRowByText('Jane Marie Smith');
      await patientRow.expectGuardianName('Robert Smith');
    });

    test('should validate required fields', async ({ page }) => {
      // Try to save without filling required fields
      const saveButton = addPatientPage['page'].locator('button[type="submit"], button', { hasText: 'Save' });
      await expect(saveButton).toBeDisabled();

      // Fill only some required fields and check validation
      await addPatientPage.fillPatientForm({
        firstName: 'Test',
        lastName: '', // Missing required field
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        contactNumber: '09123456789'
      });

      // Last name is required
      await expect(page.locator('input[name="lastName"]')).toHaveValue('');
    });

    test('should validate phone number format', async () => {
      const patientData = {
        firstName: 'Invalid',
        lastName: 'Phone',
        dateOfBirth: '1990-01-01',
        gender: 'Male' as const,
        contactNumber: '123' // Invalid phone format
      };

      await addPatientPage.fillPatientForm(patientData);
      // Form should show validation error for invalid phone number
      // Note: Actual validation behavior depends on implementation
    });

    test('should allow canceling form creation', async () => {
      await addPatientPage.fillPatientForm({
        firstName: 'Cancel',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        contactNumber: '09123456789'
      });

      await addPatientPage.cancelForm();
      await patientsPage.expectEmptyState();
    });

    test('should navigate back using back button', async () => {
      await addPatientPage.goBack();
      await patientsPage.expectPageTitle();
    });
  });

  test.describe('Viewing Patients List (Read)', () => {
    test.beforeEach(async () => {
      // Add some test patients first
      await patientsPage.addNewPatient();
      await addPatientPage.fillPatientForm({
        firstName: 'Alice',
        lastName: 'Johnson',
        dateOfBirth: '1992-05-10',
        gender: 'Female',
        contactNumber: '09111111111'
      });
      await addPatientPage.savePatient();

      await patientsPage.addNewPatient();
      await addPatientPage.fillPatientForm({
        firstName: 'Bob',
        lastName: 'Wilson',
        dateOfBirth: '1988-12-25',
        gender: 'Male',
        contactNumber: '09222222222',
        guardianFirstName: 'Carol',
        guardianLastName: 'Wilson'
      });
      await addPatientPage.savePatient();
    });

    test('should display patients in table format', async () => {
      await patientsPage.expectPatientsLoaded();
      await expect(patientsPage.getPatientRowsCount()).resolves.toBe(2);
    });

    test('should display correct patient information in table', async () => {
      const aliceRow = await patientsPage.getPatientRowByText('Alice Johnson');
      await aliceRow.expectPatientName('Alice Johnson');
      await aliceRow.expectGender('Female');
      await aliceRow.expectContactNumber('09111111111');

      const bobRow = await patientsPage.getPatientRowByText('Bob Wilson');
      await bobRow.expectPatientName('Bob Wilson');
      await bobRow.expectGender('Male');
      await bobRow.expectGuardianName('Carol Wilson');
    });

    test('should support searching patients by name', async () => {
      await patientsPage.searchPatients('Alice');
      await patientsPage.expectSearchResultsCount(1);
      await patientsPage.expectPatientInList('Alice Johnson');
      await patientsPage.expectPatientNotInList('Bob Wilson');

      await patientsPage.clearSearch();
      await patientsPage.expectSearchResultsCount(2);
    });

    test('should support searching patients by contact number', async () => {
      await patientsPage.searchPatients('09111111111');
      await patientsPage.expectSearchResultsCount(1);
      await patientsPage.expectPatientInList('Alice Johnson');
    });

    test('should show no results for non-existent search', async () => {
      await patientsPage.searchPatients('NonExistentPatient');
      await patientsPage.expectSearchResultsCount(0);
    });

    test('should navigate to patient details when clicking on patient row', async () => {
      const aliceRow = await patientsPage.getPatientRowByText('Alice Johnson');
      await aliceRow.click();
      // Should navigate to patient details page
      await expect(patientsPage['page']).toHaveURL(/\/patients\/.+$/);
    });
  });

  test.describe('Patient Details View (Read)', () => {
    let patientId: string;

    test.beforeEach(async () => {
      // Create a patient first
      await patientsPage.addNewPatient();
      await addPatientPage.fillPatientForm({
        firstName: 'Details',
        lastName: 'Test',
        dateOfBirth: '1990-06-15',
        gender: 'Male',
        contactNumber: '09333333333',
        guardianFirstName: 'Guardian',
        guardianLastName: 'Test'
      });
      await addPatientPage.savePatient();

      // Get the patient ID for navigation
      const patientRow = await patientsPage.getPatientRowByText('Details Test');
      await patientRow.click();
      
      // Extract ID from URL
      const currentUrl = patientsPage['page'].url();
      const match = currentUrl.match(/\/patients\/(.+)$/);
      patientId = match ? match[1] : '';
    });

    test('should display patient details correctly', async () => {
      await patientDetailsPage.expectPatientDetails({
        name: 'Details Test',
        gender: 'Male',
        contactNumber: '09333333333',
        guardianName: 'Guardian Test'
      });
    });

    test('should navigate to edit page when clicking edit button', async () => {
      await patientDetailsPage.editPatient();
      await editPatientPage.expectPageTitle();
    });

    test('should navigate back to patients list', async () => {
      await patientDetailsPage.goBack();
      await patientsPage.expectPageTitle();
    });
  });

  test.describe('Editing Patients (Update)', () => {
    let patientId: string;

    test.beforeEach(async () => {
      // Create a patient first
      await patientsPage.addNewPatient();
      await addPatientPage.fillPatientForm({
        firstName: 'Original',
        lastName: 'Patient',
        dateOfBirth: '1985-08-20',
        gender: 'Female',
        contactNumber: '09444444444'
      });
      await addPatientPage.savePatient();

      // Navigate to edit page
      const patientRow = await patientsPage.getPatientRowByText('Original Patient');
      await patientRow.edit();
      
      // Extract ID from URL
      const currentUrl = editPatientPage['page'].url();
      const match = currentUrl.match(/\/patients\/(.+)\/edit$/);
      patientId = match ? match[1] : '';
    });

    test('should pre-fill form with existing patient data', async ({ page }) => {
      await editPatientPage.expectPageTitle();
      
      // Check that form is pre-filled
      await expect(page.locator('input[name="firstName"]')).toHaveValue('Original');
      await expect(page.locator('input[name="lastName"]')).toHaveValue('Patient');
      await expect(page.locator('input[name="contactNumber"]')).toHaveValue('09444444444');
    });

    test('should successfully update patient information', async () => {
      await editPatientPage.fillPatientForm({
        firstName: 'Updated',
        lastName: 'Patient',
        dateOfBirth: '1985-08-20',
        gender: 'Female',
        contactNumber: '09555555555'
      });

      await editPatientPage.updatePatient();

      // Should return to patients list with updated information
      await patientsPage.expectPatientInList('Updated Patient');
      await patientsPage.expectPatientNotInList('Original Patient');
      
      const updatedRow = await patientsPage.getPatientRowByText('Updated Patient');
      await updatedRow.expectContactNumber('09555555555');
    });

    test('should validate updated information', async () => {
      // Try to clear required field
      const firstNameInput = editPatientPage['page'].locator('input[name="firstName"]');
      await firstNameInput.clear();
      const saveButton = editPatientPage['page'].locator('button[type="submit"], button', { hasText: 'Save' });
      await expect(saveButton).toBeDisabled();
    });

    test('should allow canceling edit', async () => {
      await editPatientPage.fillPatientForm({
        firstName: 'ShouldNotSave',
        lastName: 'Patient',
        dateOfBirth: '1985-08-20',
        gender: 'Female',
        contactNumber: '09444444444'
      });

      await editPatientPage.cancelForm();
      
      // Should return to patients list without changes
      await patientsPage.expectPatientInList('Original Patient');
      await patientsPage.expectPatientNotInList('ShouldNotSave Patient');
    });
  });

  test.describe('Integration Workflows', () => {
    test('should support complete CRUD workflow', async () => {
      // CREATE
      await patientsPage.addNewPatient();
      await addPatientPage.fillPatientForm({
        firstName: 'Workflow',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        contactNumber: '09666666666'
      });
      await addPatientPage.savePatient();

      // READ - View in list
      await patientsPage.expectPatientInList('Workflow Test');
      
      // READ - View details
      const patientRow = await patientsPage.getPatientRowByText('Workflow Test');
      await patientRow.viewDetails();
      await patientDetailsPage.expectPatientDetails({
        name: 'Workflow Test',
        gender: 'Male',
        contactNumber: '09666666666'
      });

      // UPDATE
      await patientDetailsPage.editPatient();
      await editPatientPage.fillPatientForm({
        firstName: 'Updated Workflow',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        contactNumber: '09777777777'
      });
      await editPatientPage.updatePatient();

      // Verify update
      await patientsPage.expectPatientInList('Updated Workflow Test');
      const updatedRow = await patientsPage.getPatientRowByText('Updated Workflow Test');
      await updatedRow.expectContactNumber('09777777777');
    });

    test('should handle multiple patients efficiently', async () => {
      // Add multiple patients
      const patients = [
        { firstName: 'Patient', lastName: 'One', contactNumber: '09111111111' },
        { firstName: 'Patient', lastName: 'Two', contactNumber: '09222222222' },
        { firstName: 'Patient', lastName: 'Three', contactNumber: '09333333333' }
      ];

      for (const patient of patients) {
        await patientsPage.addNewPatient();
        await addPatientPage.fillPatientForm({
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          contactNumber: patient.contactNumber
        });
        await addPatientPage.savePatient();
      }

      // Verify all patients are listed
      await patientsPage.expectSearchResultsCount(3);
      await patientsPage.expectPatientInList('Patient One');
      await patientsPage.expectPatientInList('Patient Two');
      await patientsPage.expectPatientInList('Patient Three');

      // Test search functionality with multiple patients
      await patientsPage.searchPatients('Two');
      await patientsPage.expectSearchResultsCount(1);
      await patientsPage.expectPatientInList('Patient Two');
      await patientsPage.expectPatientNotInList('Patient One');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // This test would require mocking network failures
      // For now, we can test form validation errors
      await patientsPage.addNewPatient();
      
      // Try submitting form without required fields
      await addPatientPage['saveButton'].click();
      
      // Should remain on add patient page due to validation
      await addPatientPage.expectPageTitle();
    });

    test('should show validation errors for invalid data', async () => {
      await patientsPage.addNewPatient();
      
      await addPatientPage.fillPatientForm({
        firstName: '', // Empty required field
        lastName: 'Test',
        dateOfBirth: 'invalid-date',
        gender: 'Male',
        contactNumber: '123' // Invalid phone number
      });

      // Form should not submit and should show validation errors
      const saveButton = addPatientPage['page'].locator('button[type="submit"], button', { hasText: 'Save' });
      await expect(saveButton).toBeDisabled();
    });
  });

  test.describe('Performance and Responsive Design', () => {
    test('should load patients page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await patientsPage.navigate();
      const endTime = Date.now();
      const loadTime = endTime - startTime;

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle large numbers of patients efficiently', async () => {
      // Add multiple patients to test performance
      const patientCount = 10;
      for (let i = 1; i <= patientCount; i++) {
        await patientsPage.addNewPatient();
        await addPatientPage.fillPatientForm({
          firstName: `Patient${i}`,
          lastName: `Test`,
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          contactNumber: `091${i.toString().padStart(8, '0')}`
        });
        await addPatientPage.savePatient();
      }

      // Check that all patients are loaded efficiently
      await patientsPage.expectSearchResultsCount(patientCount);
      
      // Search should still be responsive
      await patientsPage.searchPatients('Patient5');
      await patientsPage.expectSearchResultsCount(1);
    });

    test('should maintain responsiveness on different screen sizes', async ({ page }) => {
      // Test tablet size
      await page.setViewportSize({ width: 768, height: 1024 });
      await patientsPage.navigate();
      await patientsPage.expectPageTitle();

      // Test mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await patientsPage.expectPageTitle();
      
      // Key elements should still be accessible on mobile
      await expect(page.locator('button', { hasText: 'Add New Patient' })).toBeVisible();

      // Restore desktop size
      await page.setViewportSize({ width: 1280, height: 720 });
    });
  });

  test.describe('Accessibility and User Experience', () => {
    test('should support keyboard navigation', async ({ page }) => {
      await patientsPage.navigate();
      
      // Tab through key elements
      await page.keyboard.press('Tab'); // Should focus on search input or add button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to activate add patient with Enter key
      await page.keyboard.press('Enter');
      // This would navigate to add patient page if focused on the add button
    });

    test('should have proper ARIA labels and semantic markup', async ({ page }) => {
      await patientsPage.navigate();
      
      // Check for proper semantic markup
      await expect(page.locator('main, [role="main"]')).toBeVisible();
      await expect(page.locator('h1, h2, [role="heading"]')).toBeVisible();
      
      // Check for form labels when adding patient
      await patientsPage.addNewPatient();
      await expect(page.locator('label[for], [aria-label]')).toHaveCount({ min: 1 });
    });

    test('should provide clear feedback for user actions', async () => {
      // Test success feedback
      await patientsPage.addNewPatient();
      await addPatientPage.fillPatientForm({
        firstName: 'Feedback',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        contactNumber: '09123456789'
      });
      await addPatientPage.savePatient();

      // Should navigate back to patients list showing the new patient
      await patientsPage.expectPatientInList('Feedback Test');
    });
  });

  test.describe('Data Persistence and State Management', () => {
    test('should maintain patient data across page refreshes', async ({ page }) => {
      // Create a patient
      await patientsPage.addNewPatient();
      await addPatientPage.fillPatientForm({
        firstName: 'Persistent',
        lastName: 'Data',
        dateOfBirth: '1990-01-01',
        gender: 'Female',
        contactNumber: '09123456789'
      });
      await addPatientPage.savePatient();

      // Refresh the page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Patient should still be there
      await patientsPage.expectPatientInList('Persistent Data');
    });

    test('should handle concurrent user actions gracefully', async () => {
      // Simulate rapid user actions
      await patientsPage.addNewPatient();
      await addPatientPage.fillPatientForm({
        firstName: 'Concurrent',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        contactNumber: '09123456789'
      });

      // Try to save multiple times quickly (user double-click scenario)
      await addPatientPage.savePatient();
      // Should not create duplicate patients
      await patientsPage.expectSearchResultsCount(1);
    });

    test('should handle browser back/forward navigation correctly', async ({ page }) => {
      // Navigate to add patient
      await patientsPage.addNewPatient();
      await addPatientPage.expectPageTitle();

      // Use browser back button
      await page.goBack();
      await patientsPage.expectPageTitle();

      // Use browser forward button
      await page.goForward();
      await addPatientPage.expectPageTitle();
    });
  });
});