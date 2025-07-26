# Philippine Address API - Postman Testing Guide

## Overview

This document provides comprehensive testing instructions for the Philippine Address API endpoints integrated into the Clinic Management System. The API provides cascading address selection with complete coverage of Philippine provinces, cities/municipalities, and barangays.

## API Endpoints

### 1. Get All Provinces
- **URL**: `GET /address/provinces`
- **Description**: Retrieves all Philippine provinces and regions
- **Response**: Array of province objects with `code` and `name`

### 2. Get Cities by Province
- **URL**: `GET /address/cities/{provinceCode}`
- **Description**: Retrieves all cities/municipalities for a specific province
- **Parameters**: `provinceCode` - Province code (e.g., "ABRA", "NATIONAL_CAPITAL_REGION_-_MANILA")
- **Response**: Array of city objects with `code` and `name`

### 3. Get Barangays by City
- **URL**: `GET /address/barangays/{cityCode}`
- **Description**: Retrieves all barangays for a specific city/municipality
- **Parameters**: `cityCode` - City code (e.g., "bangued", "binondo")
- **Response**: Array of barangay objects with `code` and `name`

## Test Coverage

### Functional Tests

#### Provinces Endpoint
- ✅ **Response Structure**: Validates array response with required properties
- ✅ **Data Integrity**: Checks for expected province names (ABRA, BATAAN, CEBU)
- ✅ **Comprehensive Coverage**: Ensures 80+ provinces are returned
- ✅ **Code Format**: Validates province codes are properly formatted
- ✅ **Data Quality**: Ensures province names are not empty

#### Cities Endpoint
- ✅ **Response Structure**: Validates array response with required properties
- ✅ **Province Filtering**: Ensures cities belong to requested province
- ✅ **Code Format**: Validates city codes (lowercase with underscores)
- ✅ **Data Quality**: Ensures city names are not empty
- ✅ **Sorting**: Verifies cities are sorted alphabetically

#### Barangays Endpoint
- ✅ **Response Structure**: Validates array response with required properties
- ✅ **City Filtering**: Ensures barangays belong to requested city
- ✅ **Code Format**: Validates barangay codes (B### pattern)
- ✅ **Data Quality**: Ensures barangay names are not empty
- ✅ **Comprehensive Data**: Verifies adequate barangay coverage

### Integration Tests

#### Metro Manila Test
- **Purpose**: Validates NCR data structure and content
- **Endpoint**: `/address/cities/NATIONAL_CAPITAL_REGION_-_MANILA`
- **Validations**:
  - Contains expected Manila districts (BINONDO, ERMITA, MALATE)
  - Has multiple districts (10+)

#### Cascading Flow Test
- **Purpose**: Tests complete Province → City → Barangay flow
- **Flow**: NCR → BINONDO → Barangays
- **Validations**:
  - Complete cascading functionality
  - Binondo has numbered barangays
  - Proper data relationships

### Error Handling Tests

#### Invalid Province Test
- **Purpose**: Tests graceful handling of invalid province codes
- **Endpoint**: `/address/cities/INVALID_PROVINCE`
- **Expected**: Empty array response (200 status)

#### Invalid City Test
- **Purpose**: Tests graceful handling of invalid city codes
- **Endpoint**: `/address/barangays/invalid_city`
- **Expected**: Empty array response (200 status)

### Performance Tests

#### Response Time
- **Expectation**: All endpoints respond within 2 seconds
- **Critical**: Response time under 5 seconds (global test)

#### Response Size
- **Expectation**: Response size under 1MB for any endpoint
- **Purpose**: Ensures efficient data transfer

## Data Source Validation

### Coverage Statistics
- **Regions**: 17 (NCR, CAR, BARMM, Regions I-XIII)
- **Provinces**: 81 complete coverage
- **Cities/Municipalities**: 1,634+ complete coverage
- **Barangays**: 42,000+ from 2019 COMELEC data

### Data Quality Assurance
- **Source**: Official 2019 COMELEC election records
- **Accuracy**: Verified as of May 13, 2019
- **Authenticity**: Government-verified address data

## Test Execution

### Running Tests in Postman

1. **Import Collection**: Import the updated `Clinic_Management_System_API.postman_collection.json`
2. **Set Environment**: Ensure `baseUrl` variable is set to `http://localhost:3001`
3. **Run Address Folder**: Execute all tests in the "Address" folder
4. **Monitor Results**: Check test results in Postman Test Results tab

### Expected Test Results

| Test Category | Expected Pass Rate | Critical Tests |
|---------------|-------------------|----------------|
| Provinces | 100% (7/7) | Response structure, coverage |
| Cities | 100% (7/7) | Response structure, filtering |
| Barangays | 100% (7/7) | Response structure, code format |
| Integration | 100% (3/3) | Metro Manila, cascading flow |
| Error Handling | 100% (2/2) | Invalid inputs |
| Performance | 100% (2/2) | Response time, size |

### Global Variables Set During Tests

The tests automatically set these global variables for cross-test usage:

- `testProvinceCode`: First province code from provinces response
- `testProvinceName`: First province name from provinces response
- `testCityCode`: First city code from cities response
- `testCityName`: First city name from cities response
- `testBarangayCode`: First barangay code from barangays response
- `testBarangayName`: First barangay name from barangays response

## Sample Test Flows

### Basic Flow
1. GET /address/provinces → Get ABRA
2. GET /address/cities/ABRA → Get bangued
3. GET /address/barangays/bangued → Get AGTANGAO, ANGAD, etc.

### Metro Manila Flow
1. GET /address/provinces → Get NATIONAL_CAPITAL_REGION_-_MANILA
2. GET /address/cities/NATIONAL_CAPITAL_REGION_-_MANILA → Get binondo, ermita, etc.
3. GET /address/barangays/binondo → Get BARANGAY 287, 288, etc.

### Error Handling Flow
1. GET /address/cities/INVALID_PROVINCE → Empty array
2. GET /address/barangays/invalid_city → Empty array

## Test Maintenance

### Updating Tests
- Tests are designed to be data-independent
- Add new validation as needed for data integrity
- Update expected counts if data source changes

### Adding New Test Cases
- Follow existing test structure in collection
- Include proper error handling
- Add performance validations
- Document expected outcomes

## Troubleshooting

### Common Issues

1. **Server Not Running**: Ensure server is running on port 3001
2. **Empty Responses**: Check province/city codes are correctly formatted
3. **Test Failures**: Verify data source file is properly loaded
4. **Performance Issues**: Monitor server resources and response times

### Debug Information

Each test includes console logging for debugging:
- Request URLs and parameters
- Response data samples
- Variable assignments
- Test progression status

## Integration with Frontend

The API is designed to work seamlessly with the frontend address selector:

- **Province Selection**: Triggers city dropdown population
- **City Selection**: Triggers barangay dropdown population
- **Error Handling**: Graceful fallbacks for invalid selections
- **Performance**: Optimized for real-time user interaction

## Conclusion

The comprehensive test suite ensures:
- **Data Integrity**: All Philippine address data is accurate and complete
- **API Reliability**: Endpoints respond correctly under all conditions
- **Performance**: Fast response times for real-time user interaction
- **Error Handling**: Graceful handling of edge cases and invalid inputs
- **Integration**: Seamless frontend-backend integration

This testing framework provides confidence in the Philippine address selection system's reliability and accuracy for production use.
