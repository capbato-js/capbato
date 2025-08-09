import { Page, Locator, expect } from '@playwright/test';
import { cleanupPatientData } from '../utils/test-setup';
import { AuthHelper } from '../utils/auth-helper';

export class PatientsPage {
  private page: Page;
  private authHelper: AuthHelper;
  private addPatientButton: Locator;
  private searchInput: Locator;
  private patientTable: Locator;
  private emptyStateMessage: Locator;
  private loadingIndicator: Locator;
  private errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authHelper = new AuthHelper(page);
    // Using common data-testid patterns and element selectors
    this.addPatientButton = page.locator('button', { hasText: 'Add New Patient' });
    this.searchInput = page.locator('input[placeholder*="Search patients"]');
    this.patientTable = page.locator('[data-testid="data-table"]');
    this.emptyStateMessage = page.locator('text=No patients found');
    this.loadingIndicator = page.locator('[data-testid="loading-spinner"]');
    this.errorAlert = page.locator('[role="alert"]');
  }

  async navigate() {
    await this.authHelper.navigateToProtectedRoute('/patients');
  }

  async cleanup() {
    await cleanupPatientData(this.page);
  }

  async addNewPatient() {
    await this.addPatientButton.click();
    await this.page.waitForURL('/patients/new');
  }

  async searchPatients(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    // Wait for search to be processed
    await this.page.waitForTimeout(500);
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(500);
  }

  async getPatientRowByText(text: string) {
    return new PatientRow(
      this.page.locator('tr').filter({ hasText: text }).first()
    );
  }

  async getPatientRowByIndex(index: number) {
    return new PatientRow(
      this.page.locator('tbody tr').nth(index)
    );
  }

  async getPatientRowsCount() {
    return await this.page.locator('tbody tr').count();
  }

  async expectEmptyState() {
    await expect(this.emptyStateMessage).toBeVisible();
  }

  async expectPatientsLoaded() {
    await expect(this.patientTable).toBeVisible();
    await expect(this.page.locator('tbody tr')).toHaveCount({ min: 1 });
  }

  async expectLoadingState() {
    await expect(this.loadingIndicator).toBeVisible();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorAlert).toContainText(message);
  }

  async expectPageTitle() {
    await expect(this.page.locator('text=Patient Records')).toBeVisible();
  }

  async expectPatientInList(patientName: string) {
    await expect(this.page.locator('tbody tr').filter({ hasText: patientName })).toBeVisible();
  }

  async expectPatientNotInList(patientName: string) {
    await expect(this.page.locator('tbody tr').filter({ hasText: patientName })).not.toBeVisible();
  }

  async expectSearchResultsCount(count: number) {
    await expect(this.page.locator('tbody tr')).toHaveCount(count);
  }
}

export class PatientRow {
  private locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  async click() {
    await this.locator.click();
  }

  async viewDetails() {
    const viewButton = this.locator.locator('button[title*="View"], button[aria-label*="View"]');
    await viewButton.click();
  }

  async edit() {
    const editButton = this.locator.locator('button[title*="Update"], button[title*="Edit"], button[aria-label*="Edit"]');
    await editButton.click();
  }

  async expectPatientNumber(patientNumber: string) {
    await expect(this.locator).toContainText(patientNumber);
  }

  async expectPatientName(name: string) {
    await expect(this.locator).toContainText(name);
  }

  async expectAge(age: string | number) {
    await expect(this.locator).toContainText(age.toString());
  }

  async expectGender(gender: string) {
    await expect(this.locator).toContainText(gender);
  }

  async expectContactNumber(contactNumber: string) {
    await expect(this.locator).toContainText(contactNumber);
  }

  async expectGuardianName(guardianName: string) {
    if (guardianName) {
      await expect(this.locator).toContainText(guardianName);
    } else {
      await expect(this.locator).toContainText('N/A');
    }
  }

  async getPatientId(): Promise<string> {
    // Extract patient ID from data attributes or URL when clicking
    await this.click();
    const currentUrl = this.locator.page().url();
    const match = currentUrl.match(/\/patients\/(.+)$/);
    if (match) {
      return match[1];
    }
    throw new Error('Could not extract patient ID from URL');
  }
}

export class AddPatientPage {
  protected page: Page;
  protected authHelper: AuthHelper;
  protected firstNameInput: Locator;
  protected middleNameInput: Locator;
  protected lastNameInput: Locator;
  protected dateOfBirthInput: Locator;
  protected genderSelect: Locator;
  protected contactNumberInput: Locator;
  protected guardianFirstNameInput: Locator;
  protected guardianLastNameInput: Locator;
  protected guardianContactNumberInput: Locator;
  protected provinceSelect: Locator;
  protected citySelect: Locator;
  protected barangaySelect: Locator;
  protected streetInput: Locator;
  protected saveButton: Locator;
  protected cancelButton: Locator;
  protected backButton: Locator;
  protected errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authHelper = new AuthHelper(page);
    // Form inputs - using common naming patterns
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.dateOfBirthInput = page.locator('input[name="dateOfBirth"]');
    this.genderSelect = page.locator('select[name="gender"], [data-testid="gender-select"]');
    this.contactNumberInput = page.locator('input[name="contactNumber"]');
    this.guardianFirstNameInput = page.locator('input[name="guardianFirstName"]');
    this.guardianLastNameInput = page.locator('input[name="guardianLastName"]');
    this.guardianContactNumberInput = page.locator('input[name="guardianContactNumber"]');
    this.provinceSelect = page.locator('select[name="province"], [data-testid="province-select"]');
    this.citySelect = page.locator('select[name="city"], [data-testid="city-select"]');
    this.barangaySelect = page.locator('select[name="barangay"], [data-testid="barangay-select"]');
    this.streetInput = page.locator('input[name="street"]');
    
    // Action buttons
    this.saveButton = page.locator('button[type="submit"], button', { hasText: 'Save' });
    this.cancelButton = page.locator('button', { hasText: 'Cancel' });
    this.backButton = page.locator('button', { hasText: 'Back to Patients' });
    
    // Error handling
    this.errorAlert = page.locator('[role="alert"]');
  }

  async navigate() {
    await this.authHelper.navigateToProtectedRoute('/patients/new');
  }

  async fillPatientForm(patientData: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    contactNumber: string;
    guardianFirstName?: string;
    guardianLastName?: string;
    guardianContactNumber?: string;
    province?: string;
    city?: string;
    barangay?: string;
    street?: string;
  }) {
    await this.firstNameInput.fill(patientData.firstName);
    
    if (patientData.middleName) {
      await this.middleNameInput.fill(patientData.middleName);
    }
    
    await this.lastNameInput.fill(patientData.lastName);
    await this.dateOfBirthInput.fill(patientData.dateOfBirth);
    await this.genderSelect.selectOption(patientData.gender);
    await this.contactNumberInput.fill(patientData.contactNumber);
    
    if (patientData.guardianFirstName) {
      await this.guardianFirstNameInput.fill(patientData.guardianFirstName);
    }
    
    if (patientData.guardianLastName) {
      await this.guardianLastNameInput.fill(patientData.guardianLastName);
    }
    
    if (patientData.guardianContactNumber) {
      await this.guardianContactNumberInput.fill(patientData.guardianContactNumber);
    }
    
    // Address fields - fill if provided
    if (patientData.province) {
      await this.provinceSelect.selectOption(patientData.province);
      await this.page.waitForTimeout(500); // Wait for city options to load
    }
    
    if (patientData.city) {
      await this.citySelect.selectOption(patientData.city);
      await this.page.waitForTimeout(500); // Wait for barangay options to load
    }
    
    if (patientData.barangay) {
      await this.barangaySelect.selectOption(patientData.barangay);
    }
    
    if (patientData.street) {
      await this.streetInput.fill(patientData.street);
    }
  }

  async savePatient() {
    await this.saveButton.click();
    // Wait for navigation back to patients list or success indication
    await this.page.waitForURL('/patients', { timeout: 10000 });
  }

  async cancelForm() {
    await this.cancelButton.click();
    await this.page.waitForURL('/patients');
  }

  async goBack() {
    await this.backButton.click();
    await this.page.waitForURL('/patients');
  }

  async expectValidationError(fieldName: string, message: string) {
    const errorElement = this.page.locator(`[data-testid="${fieldName}-error"], .error-message`).filter({ hasText: message });
    await expect(errorElement).toBeVisible();
  }

  async expectFormError(message: string) {
    await expect(this.errorAlert).toContainText(message);
  }

  async expectPageTitle() {
    await expect(this.page.locator('text=Add New Patient')).toBeVisible();
  }

  async expectSaveButtonDisabled() {
    await expect(this.saveButton).toBeDisabled();
  }

  async expectSaveButtonEnabled() {
    await expect(this.saveButton).toBeEnabled();
  }
}

export class EditPatientPage extends AddPatientPage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToEdit(patientId: string) {
    await this.authHelper.navigateToProtectedRoute(`/patients/${patientId}/edit`);
  }

  async expectPageTitle() {
    await expect(this.page.locator('text=Edit Patient')).toBeVisible();
  }

  async updatePatient() {
    await this.saveButton.click();
    // Wait for navigation back to patients list or patient details
    await this.page.waitForTimeout(2000);
  }
}

export class PatientDetailsPage {
  private page: Page;
  private authHelper: AuthHelper;
  private editButton: Locator;
  private backButton: Locator;
  private patientInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authHelper = new AuthHelper(page);
    this.editButton = page.locator('button', { hasText: 'Edit' });
    this.backButton = page.locator('button', { hasText: 'Back' });
    this.patientInfo = page.locator('[data-testid="patient-info"]');
  }

  async navigateToDetails(patientId: string) {
    await this.authHelper.navigateToProtectedRoute(`/patients/${patientId}`);
  }

  async editPatient() {
    await this.editButton.click();
    await this.page.waitForURL(/\/patients\/.+\/edit/);
  }

  async goBack() {
    await this.backButton.click();
    await this.page.waitForURL('/patients');
  }

  async expectPatientName(name: string) {
    await expect(this.page.locator('text=' + name)).toBeVisible();
  }

  async expectPatientDetails(details: {
    name?: string;
    age?: string | number;
    gender?: string;
    contactNumber?: string;
    guardianName?: string;
  }) {
    if (details.name) {
      await expect(this.page.locator('text=' + details.name)).toBeVisible();
    }
    if (details.age) {
      await expect(this.page.locator('text=' + details.age.toString())).toBeVisible();
    }
    if (details.gender) {
      await expect(this.page.locator('text=' + details.gender)).toBeVisible();
    }
    if (details.contactNumber) {
      await expect(this.page.locator('text=' + details.contactNumber)).toBeVisible();
    }
    if (details.guardianName) {
      await expect(this.page.locator('text=' + details.guardianName)).toBeVisible();
    }
  }
}