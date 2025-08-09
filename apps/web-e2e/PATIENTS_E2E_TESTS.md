# Patients Page E2E Tests

This document describes the comprehensive e2e test suite for the `/patients` page CRUD operations.

## Overview

The patients e2e tests provide comprehensive coverage for:
- **Create**: Adding new patients via the AddPatientPage
- **Read**: Viewing patients list and individual patient details  
- **Update**: Editing patients via EditPatientPage
- **Delete**: Note - DELETE functionality tests are excluded as the API doesn't provide a DELETE endpoint for patients

## Test Structure

### Files
- `apps/web-e2e/src/patients.spec.ts` - Main test suite
- `apps/web-e2e/src/pages/PatientsPage.ts` - Page object models
- `apps/web-e2e/src/utils/auth-helper.ts` - Authentication utilities
- `apps/web-e2e/src/utils/test-setup.ts` - Updated with patient data cleanup

### Page Object Models

#### PatientsPage
- Main patients list page (`/patients`)
- Methods for navigation, search, patient list interactions

#### AddPatientPage  
- New patient form page (`/patients/new`)
- Methods for filling forms, validation, saving patients

#### EditPatientPage
- Edit patient form page (`/patients/:id/edit`) 
- Extends AddPatientPage with update-specific functionality

#### PatientDetailsPage
- Patient details view page (`/patients/:id`)
- Methods for viewing patient information, navigation to edit

### Authentication
- Uses `AuthHelper` class to handle protected routes
- Automatically registers/logs in test user with admin role
- Manages JWT tokens in localStorage for authenticated requests

## Test Categories

### 1. Initial State and Navigation
- Page structure and title validation
- Empty state handling
- Navigation between pages
- Search functionality

### 2. Adding Patients (Create)
- ✅ Minimal required data patient creation
- ✅ Complete data patient creation (with guardian/address)
- ✅ Form validation for required fields
- ✅ Phone number format validation
- ✅ Cancel and back button functionality

### 3. Viewing Patients List (Read)
- ✅ Table display with patient information
- ✅ Search by name and contact number
- ✅ Pagination handling (when applicable)
- ✅ Row click navigation to details

### 4. Patient Details View (Read)
- ✅ Patient information display
- ✅ Navigation to edit page
- ✅ Back to patients list navigation

### 5. Editing Patients (Update)
- ✅ Form pre-population with existing data
- ✅ Successful patient information updates
- ✅ Validation of updated information
- ✅ Cancel edit functionality

### 6. Integration Workflows
- ✅ Complete CRUD workflow testing
- ✅ Multiple patients handling
- ✅ Cross-page navigation consistency

### 7. Error Handling
- ✅ Network error graceful handling
- ✅ Form validation error display
- ✅ Invalid data format validation

### 8. Performance and Responsive Design
- ✅ Page load time validation (< 5 seconds)
- ✅ Large dataset handling (10+ patients)
- ✅ Responsive design on different screen sizes
- ✅ Mobile/tablet compatibility

### 9. Accessibility and User Experience
- ✅ Keyboard navigation support
- ✅ ARIA labels and semantic markup
- ✅ Clear user action feedback

### 10. Data Persistence and State Management
- ✅ Data persistence across page refreshes
- ✅ Concurrent user action handling
- ✅ Browser navigation (back/forward) handling

## Running the Tests

### Prerequisites
1. Install pnpm globally: `npm install -g pnpm`
2. Install dependencies: `pnpm install`
3. Ensure API and Web servers can be started

### Commands

#### Quick Commands (as specified in the issue)
```bash
# Run patients e2e tests (part of web-e2e)
pnpm endweb

# Run all e2e tests
pnpm e2e

# Run with browser UI visible
pnpm e2e:headed
```

#### Full Commands
```bash
# Run web e2e tests (including patients)
pnpm e2e:web

# Run API e2e tests
pnpm e2e:api

# Run all e2e tests
pnpm nx run-many -t e2e -p api-e2e,web-e2e

# Run with headed mode (browser visible)
pnpm nx e2e web-e2e --headed

# Run specific test file
pnpm nx e2e web-e2e --spec="**/patients.spec.ts"
```

## Configuration

### Server Setup
The tests automatically start:
- API server on `http://localhost:4000` with memory database
- Web server on `http://localhost:3000`

### Environment Variables
- `VITE_API_BASE_URL=http://localhost:4000` (Web app)
- `NODE_ENV=development` (API)
- `DB_TYPE=memory` (API - for testing)
- `DB_ORM=native` (API - for testing)

### Test Data
- Tests use in-memory database for isolation
- Test user created automatically: `test@example.com` / `TestPassword123!`
- Patient data is created and cleaned up per test

## API Endpoints Tested

### Patients API (`/api/patients`)
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient by ID  
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update existing patient
- `GET /api/patients/total` - Get patient statistics

### Authentication API (`/api/auth`)
- `POST /api/auth/register` - Register test user
- `POST /api/auth/login` - Login test user

## Test Data Examples

### Minimal Patient Data
```typescript
{
  firstName: 'John',
  lastName: 'Doe', 
  dateOfBirth: '1990-01-15',
  gender: 'Male',
  contactNumber: '09123456789'
}
```

### Complete Patient Data
```typescript
{
  firstName: 'Jane',
  middleName: 'Marie',
  lastName: 'Smith',
  dateOfBirth: '1985-03-20',
  gender: 'Female',
  contactNumber: '09187654321',
  guardianFirstName: 'Robert',
  guardianLastName: 'Smith', 
  guardianContactNumber: '09111222333',
  street: '123 Main Street'
}
```

## Troubleshooting

### Common Issues

1. **Tests fail with authentication errors**
   - Ensure API server is running on port 4000
   - Check that user registration endpoint is working

2. **Page elements not found**
   - Verify the web app is running on port 3000
   - Check if UI element selectors have changed

3. **Timeout errors**
   - Increase timeout values in `playwright.config.ts`
   - Check server startup time in global setup

4. **Database state issues**
   - Tests use memory database which resets on API restart
   - Patient cleanup runs before each test

### Debug Mode
```bash
# Run tests with debug output
pnpm nx e2e web-e2e --headed --debug

# Run specific test with debug
pnpm nx e2e web-e2e --spec="**/patients.spec.ts" --headed
```

## Test Coverage Summary

✅ **Comprehensive CRUD operations**  
✅ **Authentication handling**  
✅ **Form validation and error handling**  
✅ **Search and filtering functionality**  
✅ **Cross-browser compatibility ready**  
✅ **Performance and accessibility testing**  
✅ **Mobile responsive design validation**  
✅ **Data persistence and state management**

The test suite provides production-ready e2e coverage for the patients module with 50+ test scenarios covering all critical user journeys and edge cases.