#!/bin/bash

# Philippine Address API - Automated Testing Script
# Uses Newman (Postman CLI) to run comprehensive API tests

echo "🇵🇭 Philippine Address API - Automated Testing"
echo "=============================================="

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    echo "❌ Newman (Postman CLI) is not installed"
    echo "📦 Install with: npm install -g newman"
    echo "📦 Or install with: npm install -g newman newman-reporter-html"
    exit 1
fi

# Check if server is running
echo "🔍 Checking if server is running on port 3001..."
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ Server is not running on port 3001"
    echo "🚀 Start server with: cd server && npm start"
    exit 1
fi

echo "✅ Server is running"

# Set variables
COLLECTION_FILE="Clinic_Management_System_API.postman_collection.json"
REPORTS_DIR="postman-tests/reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create reports directory
mkdir -p "$REPORTS_DIR"

echo "📊 Running Postman tests..."

# Run only Address folder tests
echo "🏃‍♂️ Running Address API tests..."
newman run "$COLLECTION_FILE" \
    --folder "Address" \
    --reporters cli,json,html \
    --reporter-json-export "$REPORTS_DIR/address_test_results_$TIMESTAMP.json" \
    --reporter-html-export "$REPORTS_DIR/address_test_results_$TIMESTAMP.html" \
    --verbose

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ All Address API tests passed!"
    echo "📊 Reports saved to: $REPORTS_DIR/"
    echo "🌐 HTML Report: $REPORTS_DIR/address_test_results_$TIMESTAMP.html"
    echo "📄 JSON Report: $REPORTS_DIR/address_test_results_$TIMESTAMP.json"
else
    echo "❌ Some tests failed. Check the reports for details."
    exit 1
fi

# Optional: Run a quick smoke test
echo ""
echo "🧪 Quick Smoke Test:"
echo "==================="

echo "Testing Provinces endpoint..."
PROVINCES_COUNT=$(curl -s http://localhost:3001/address/provinces | jq '. | length')
echo "✅ Provinces found: $PROVINCES_COUNT"

echo "Testing Cities endpoint (ABRA)..."
CITIES_COUNT=$(curl -s http://localhost:3001/address/cities/ABRA | jq '. | length')
echo "✅ Cities in ABRA: $CITIES_COUNT"

echo "Testing Barangays endpoint (bangued)..."
BARANGAYS_COUNT=$(curl -s http://localhost:3001/address/barangays/bangued | jq '. | length')
echo "✅ Barangays in Bangued: $BARANGAYS_COUNT"

echo ""
echo "🎉 Philippine Address API testing completed successfully!"
echo "📈 Data Coverage:"
echo "   - Provinces: $PROVINCES_COUNT"
echo "   - Sample Cities (ABRA): $CITIES_COUNT"
echo "   - Sample Barangays (Bangued): $BARANGAYS_COUNT"
