# Postman Tests for Philippine Address API

This directory contains comprehensive testing resources for the Philippine Address API endpoints in the Clinic Management System.

## 📁 Directory Structure

```
postman-tests/
├── README.md                           # This file
├── TESTING_GUIDE.md                   # Comprehensive testing documentation
├── address-endpoints-tests.js         # Test scripts for Postman
├── run-address-tests.sh               # Newman CLI test runner
└── reports/                           # Generated test reports (auto-created)
    ├── address_test_results_TIMESTAMP.html
    └── address_test_results_TIMESTAMP.json
```

## 🚀 Quick Start

### 1. Using Postman GUI

1. **Import Collection**: Import `../Clinic_Management_System_API.postman_collection.json`
2. **Set Environment**: Set `baseUrl` to `http://localhost:3001`
3. **Run Tests**: Execute the "Address" folder tests
4. **View Results**: Check the Test Results tab

### 2. Using Newman CLI

```bash
# Install Newman (if not installed)
npm install -g newman newman-reporter-html

# Run automated tests
./run-address-tests.sh
```

### 3. Manual API Testing

```bash
# Test provinces
curl http://localhost:3001/address/provinces | jq '.[:3]'

# Test cities for ABRA
curl http://localhost:3001/address/cities/ABRA | jq '.[:3]'

# Test barangays for Bangued
curl http://localhost:3001/address/barangays/bangued | jq '.[:3]'
```

## 🧪 Test Coverage

### API Endpoints Tested

| Endpoint | Method | Purpose | Tests |
|----------|--------|---------|-------|
| `/address/provinces` | GET | Get all provinces | 7 tests |
| `/address/cities/{provinceCode}` | GET | Get cities by province | 7 tests |
| `/address/barangays/{cityCode}` | GET | Get barangays by city | 7 tests |

### Test Categories

#### ✅ **Functional Tests**
- Response structure validation
- Data integrity checks
- Required properties verification
- Data format validation
- Alphabetical sorting verification

#### ✅ **Integration Tests**
- Metro Manila data validation
- Complete cascading flow testing
- Cross-endpoint data consistency

#### ✅ **Error Handling Tests**
- Invalid province code handling
- Invalid city code handling
- Graceful failure responses

#### ✅ **Performance Tests**
- Response time validation (< 2s)
- Response size checks (< 1MB)
- Server availability monitoring

## 📊 Expected Results

### Test Statistics
- **Total Tests**: 30+ comprehensive tests
- **Expected Pass Rate**: 100%
- **Coverage**: All endpoints, all scenarios
- **Performance**: < 2 seconds per request

### Data Validation
- **Provinces**: 81 provinces validated
- **Cities**: 1,634+ cities validated
- **Barangays**: 42,000+ barangays validated
- **Source**: 2019 COMELEC official data

## 🔧 Test Configuration

### Global Variables

The tests automatically set and use these variables:

```javascript
// Set during province tests
pm.globals.set('testProvinceCode', 'ABRA');
pm.globals.set('testProvinceName', 'ABRA');

// Set during city tests
pm.globals.set('testCityCode', 'bangued');
pm.globals.set('testCityName', 'BANGUED');

// Set during barangay tests
pm.globals.set('testBarangayCode', 'B001');
pm.globals.set('testBarangayName', 'AGTANGAO');
```

### Environment Variables

Required environment variables:

```json
{
  "baseUrl": "http://localhost:3001"
}
```

## 🏃‍♂️ Running Tests

### Prerequisites

1. **Server Running**: Ensure clinic management server is running on port 3001
2. **Data Loaded**: Verify philippines-complete.json is loaded
3. **Dependencies**: Install jq for CLI testing (optional)

### Test Execution Order

The tests are designed to run in sequence:

1. **Get All Provinces** → Sets test province variables
2. **Get Cities by Province** → Uses province from step 1, sets city variables
3. **Get Barangays by City** → Uses city from step 2, sets barangay variables
4. **Metro Manila Test** → Independent validation
5. **Cascading Flow Test** → End-to-end validation
6. **Error Handling Tests** → Edge case validation

### Sample Output

```bash
🇵🇭 Philippine Address API - Automated Testing
==============================================
✅ Server is running
📊 Running Postman tests...
🏃‍♂️ Running Address API tests...

→ Get All Provinces
  ✓ Status code is 200
  ✓ Response is an array
  ✓ Provinces have required properties
  ✓ Contains expected provinces
  ✓ Has comprehensive coverage (80+ provinces)

→ Get Cities by Province
  ✓ Status code is 200
  ✓ Response is an array
  ✓ Cities have required properties
  ✓ Cities are for the requested province
  ✓ City codes are properly formatted

→ Get Barangays by City
  ✓ Status code is 200
  ✓ Response is an array
  ✓ Barangays have required properties
  ✓ Barangay codes follow format
  ✓ Has comprehensive barangay data

✅ All Address API tests passed!
```

## 🔍 Debugging

### Common Issues

1. **Server Not Running**
   ```bash
   # Start server
   cd ../server && npm start
   ```

2. **Data Not Loaded**
   ```bash
   # Check if data file exists
   ls ../server/src/data/philippines-complete.json
   ```

3. **Newman Not Installed**
   ```bash
   # Install Newman
   npm install -g newman newman-reporter-html
   ```

### Debug Information

Each test includes console logging:
- Request URLs and parameters
- Response data samples
- Variable assignments
- Test progression status

### Manual Verification

```bash
# Check server status
curl http://localhost:3001/

# Test provinces endpoint
curl http://localhost:3001/address/provinces | jq 'length'

# Test cities endpoint
curl http://localhost:3001/address/cities/ABRA | jq 'length'

# Test barangays endpoint
curl http://localhost:3001/address/barangays/bangued | jq 'length'
```

## 📈 Performance Benchmarks

### Expected Performance
- **Provinces Endpoint**: < 500ms
- **Cities Endpoint**: < 300ms
- **Barangays Endpoint**: < 200ms
- **Total Test Suite**: < 30 seconds

### Performance Monitoring

The tests include performance validation:
```javascript
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

## 📝 Test Reports

### HTML Reports

Newman generates detailed HTML reports:
- **Location**: `reports/address_test_results_TIMESTAMP.html`
- **Content**: Test results, response data, performance metrics
- **Format**: Interactive HTML with charts and details

### JSON Reports

Machine-readable test results:
- **Location**: `reports/address_test_results_TIMESTAMP.json`
- **Content**: Structured test data for CI/CD integration
- **Format**: Newman JSON report format

## 🔄 Continuous Integration

### GitHub Actions Integration

Sample CI configuration:

```yaml
name: Address API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Start Server
        run: cd server && npm install && npm start &
      - name: Wait for Server
        run: sleep 10
      - name: Install Newman
        run: npm install -g newman
      - name: Run Tests
        run: ./postman-tests/run-address-tests.sh
```

## 🤝 Contributing

### Adding New Tests

1. **Create Test Script**: Add to `address-endpoints-tests.js`
2. **Update Collection**: Add to Postman collection
3. **Document Test**: Update `TESTING_GUIDE.md`
4. **Verify Coverage**: Ensure comprehensive validation

### Test Standards

- **Descriptive Names**: Clear test descriptions
- **Comprehensive Validation**: Check all response properties
- **Error Handling**: Test edge cases and errors
- **Performance**: Include response time checks
- **Documentation**: Comment complex test logic

## 📞 Support

For issues with the Philippine Address API tests:

1. **Check Server**: Verify server is running on port 3001
2. **Review Logs**: Check console output for error details
3. **Validate Data**: Ensure data source is properly loaded
4. **Test Manually**: Use curl commands for direct API testing

## 📚 Resources

- **Postman Documentation**: https://learning.postman.com/
- **Newman CLI**: https://github.com/postmanlabs/newman
- **Philippine Address Data**: Based on 2019 COMELEC records
- **API Documentation**: See server Swagger docs at http://localhost:3001/api-docs
