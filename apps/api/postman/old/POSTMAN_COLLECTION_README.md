# Clinic Management System API - Postman Collection

## Overview

This comprehensive Postman collection provides complete API testing coverage for the Clinic Management System. The collection follows Clean Architecture principles and includes extensive test scenarios for all API endpoints.

## Collection Structure

### 1. Server Health & Info
- **Get Server Info** - Basic server information and available endpoints
- **Health Check** - Server health verification

### 2. Authentication  
- **Register User - Admin Setup** - Creates admin user for testing
- **Login User - Happy Path** - Successful authentication flow
- **Register User - Doctor Role** - Role-based user creation
- **Register User - Missing Required Fields** - Validation error testing
- **Login - Invalid Credentials** - Authentication error testing

### 3. Patient Management
- **Get Patient Statistics** - Patient count and statistics
- **Create Patient - Complete Information** - Full patient creation with guardian
- **Create Patient - Minimal Required Data** - Essential fields only
- **Get All Patients** - Patient listing with pagination support
- **Get Patient by ID** - Individual patient retrieval
- **Get Patient by ID - Not Found** - Error handling for missing patients
- **Create Patient - Missing Required Fields** - Validation error testing

### 4. User Management
- **Get All Users** - User listing for management
- **Change User Password - Happy Path** - Password update functionality
- **Change Password - User Not Found** - Error handling for invalid users
- **Change Password - Missing Password Field** - Validation error testing

### 5. Todo Management
- **Create Todo - Happy Path** - Todo creation with all fields
- **Get All Todos** - Complete todo listing
- **Get Todo by ID** - Individual todo retrieval
- **Get Active Todos** - Filter for non-completed todos
- **Get Todo Statistics** - Todo counts and metrics
- **Update Todo** - Todo modification
- **Toggle Todo Completion** - Completion status changes
- **Delete Todo** - Todo removal
- **Create Todo - Missing Title** - Validation error testing

### 6. Error Handling & Edge Cases
- **Unknown Route - 404** - Invalid endpoint testing
- **Invalid JSON - 400** - Malformed request testing

## API Endpoints Coverage

### Authentication (`/api/auth`)
- ✅ `POST /register` - User registration with role support
- ✅ `POST /login` - User authentication (email/username)

### Patient Management (`/api/patients`)  
- ✅ `GET /total` - Patient statistics
- ✅ `GET /` - List all patients
- ✅ `GET /:id` - Get patient by ID
- ✅ `POST /` - Create new patient

### User Management (`/api/users`)
- ✅ `GET /` - List all users
- ✅ `PUT /:id/password` - Change user password

### Todo Management (`/api/todos`)
- ✅ `GET /` - Get all todos
- ✅ `GET /active` - Get active todos
- ✅ `GET /completed` - Get completed todos
- ✅ `GET /stats` - Get todo statistics
- ✅ `GET /:id` - Get todo by ID
- ✅ `POST /` - Create todo
- ✅ `PUT /:id` - Update todo
- ✅ `PATCH /:id/toggle` - Toggle todo completion
- ✅ `DELETE /:id` - Delete todo

## Testing Strategy

### 1. Core API Testing
- **Happy Path Testing**: Validates core functionality with valid data
- **Response Validation**: Verifies correct status codes and response structure
- **Field Validation**: Ensures all required fields are present and correctly typed
- **Data Persistence**: Confirms data is properly stored and retrievable

### 2. Error Handling & Validation
- **Missing Required Fields**: Tests validation for incomplete requests
- **Invalid Data Types**: Validates proper error responses for wrong data formats
- **Not Found Scenarios**: Tests 404 responses for non-existent resources
- **Authentication Errors**: Validates unauthorized access attempts

### 3. Dynamic Data Management
- **Variable Storage**: Automatically captures IDs from creation responses
- **Dynamic References**: Uses stored variables for dependent requests
- **Test Data Generation**: Creates realistic test data with randomization
- **Cleanup Scenarios**: Includes delete operations to clean up test data

### 4. Performance & Reliability
- **Response Time Testing**: Validates reasonable response times (<1-2 seconds)
- **Load Testing**: Ensures API handles multiple requests gracefully
- **Error Recovery**: Tests system behavior under error conditions

### 5. Security Testing
- **Authentication Flows**: Validates JWT token generation and usage
- **Role-Based Access**: Tests different user roles and permissions
- **Input Validation**: Ensures proper sanitization of user inputs
- **Password Security**: Tests password change functionality

## Environment Variables

The collection uses the following environment variables:

### Core Variables
- `baseUrl` - API server URL (default: http://localhost:4000)
- `authToken` - JWT token from login (auto-populated)

### Dynamic Test Data
- `testUserId` - User ID from registration (auto-populated)
- `testPatientId` - Patient ID from creation (auto-populated)  
- `todoId` - Todo ID from creation (auto-populated)
- `testEmail` - Dynamic email for registration (auto-populated)

### Fixed Test Credentials
- `loginTestEmail` - Fixed admin email for testing
- `loginTestPassword` - Fixed admin password for testing
- `doctorTestEmail` - Fixed doctor email for testing
- `doctorTestPassword` - Fixed doctor password for testing

## Running the Tests

### Prerequisites
1. Ensure the API server is running on the configured baseUrl
2. Install Newman globally: `npm install -g newman`
3. Verify pnpm is installed: `npm install -g pnpm`

### Command Line Execution

```bash
# Run all tests with detailed output
pnpm e2e:postman

# Run with custom environment
newman run apps/api/postman-collection.json -e apps/api/postman-environment.json

# Generate HTML report
newman run apps/api/postman-collection.json -e apps/api/postman-environment.json --reporters html --reporter-html-export report.html

# Run with additional options
newman run apps/api/postman-collection.json -e apps/api/postman-environment.json --reporters cli,json,html --reporter-html-export apps/api/postman/report.html --timeout-request 30000 --delay-request 100
```

### Newman Command Options

- `--reporters cli,json,html` - Multiple output formats
- `--reporter-html-export report.html` - Generate HTML report
- `--timeout-request 30000` - Set request timeout (30 seconds)
- `--delay-request 100` - Add delay between requests
- `--iteration-count 3` - Run collection multiple times
- `--verbose` - Detailed output for debugging

## Test Results Interpretation

### Success Criteria
- All status code assertions pass (200, 201, 400, 404, etc.)
- Response content type is application/json
- Required fields are present in responses
- Dynamic variables are properly captured and stored
- Response times are within acceptable limits

### Common Issues
- **Connection Refused**: API server is not running
- **Authentication Failures**: Invalid credentials or expired tokens
- **Validation Errors**: Missing or invalid required fields
- **Not Found Errors**: Resources don't exist (expected for negative tests)

## Collection Maintenance

### Adding New Endpoints
1. Create new request in appropriate folder
2. Add comprehensive test scripts with assertions
3. Update environment variables if needed
4. Document the new endpoint in this README

### Test Script Standards
```javascript
pm.test('Status code is 200', function () {
    pm.response.to.have.status(200);
});

pm.test('Response has correct content type', function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
});

pm.test('Response has required fields', function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('success', true);
    pm.expect(responseJson).to.have.property('data');
});

pm.test('Response time is reasonable', function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

### Variable Management
- Use collection variables for data that persists across requests
- Use environment variables for configuration settings
- Auto-populate dynamic IDs from creation responses
- Clear temporary variables after cleanup operations

## Integration with CI/CD

The collection is designed for automated testing in CI/CD pipelines:

```yaml
# Example GitHub Actions step
- name: Run API Tests
  run: |
    pnpm install
    pnpm start:api &
    sleep 10
    pnpm e2e:postman
    kill %1
```

## Best Practices

### Request Organization
- Group related endpoints in logical folders
- Use descriptive names that indicate the test purpose
- Include both positive and negative test scenarios
- Order requests to create dependencies (create before read/update/delete)

### Test Script Quality
- Include comprehensive assertions for all response aspects
- Use descriptive test names that explain what is being validated
- Validate both success and error scenarios
- Include performance assertions for response times

### Documentation
- Document complex test scenarios and their purpose
- Include examples of expected request/response formats
- Maintain up-to-date environment variable documentation
- Document any special setup or configuration requirements

## Troubleshooting

### Common Issues and Solutions

1. **Server Connection Issues**
   - Verify API server is running on correct port
   - Check firewall settings and network connectivity
   - Ensure environment baseUrl is correct

2. **Authentication Problems**
   - Verify user credentials in environment variables
   - Check if authentication endpoints are working
   - Ensure JWT tokens are being properly stored and used

3. **Test Failures**
   - Review actual vs expected response formats
   - Check for API changes that affect response structure
   - Verify database state and test data dependencies

4. **Performance Issues**
   - Increase timeout values for slow operations
   - Add delays between requests if needed
   - Monitor server resources during test execution

For additional support, refer to the API documentation and ensure the server is properly configured and running.