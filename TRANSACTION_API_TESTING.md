# Transaction API Manual Testing Guide

This document provides manual testing steps for the transaction/receipts API endpoints.

## Prerequisites

Start the API server:
```bash
cd /home/runner/work/capbato-js/capbato-js
DATABASE_TYPE=memory ORM_TYPE=native pnpm nx serve api
```

The API will be available at: http://localhost:4000/api/transactions

## Test 1: Create a Transaction (POST /api/transactions)

### Request:
```bash
curl -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "d7b20ad40f44478db25fe3ac78a1dd16",
    "date": "2025-01-15T00:00:00.000Z",
    "paymentMethod": "Cash",
    "receivedById": "user-123-456-789",
    "items": [
      {
        "serviceName": "Consultation",
        "description": "General checkup",
        "quantity": 1,
        "unitPrice": 800.0
      },
      {
        "serviceName": "Lab Tests",
        "description": "Blood work",
        "quantity": 2,
        "unitPrice": 350.0
      }
    ]
  }'
```

### Expected Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "receiptNumber": "R-2025-001",
    "date": "2025-01-15",
    "patient": {
      "id": "d7b20ad40f44478db25fe3ac78a1dd16",
      "patientNumber": "Unknown",
      "firstName": "Unknown",
      "lastName": "Patient",
      "middleName": "",
      "fullName": "Unknown Patient"
    },
    "totalAmount": 1500.0,
    "paymentMethod": "Cash",
    "receivedBy": "Unknown",
    "items": [
      {
        "serviceName": "Consultation",
        "description": "General checkup",
        "quantity": 1,
        "unitPrice": 800.0,
        "subtotal": 800.0
      },
      {
        "serviceName": "Lab Tests",
        "description": "Blood work",
        "quantity": 2,
        "unitPrice": 350.0,
        "subtotal": 700.0
      }
    ],
    "itemsSummary": "Consultation, Lab Tests",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

## Test 2: Get All Transactions (GET /api/transactions)

### Request:
```bash
curl -X GET http://localhost:4000/api/transactions
```

### Expected Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "receiptNumber": "R-2025-001",
      "date": "2025-01-15",
      "patient": {
        "id": "d7b20ad40f44478db25fe3ac78a1dd16",
        "patientNumber": "Unknown",
        "firstName": "Unknown",
        "lastName": "Patient",
        "middleName": "",
        "fullName": "Unknown Patient"
      },
      "totalAmount": 1500.0,
      "paymentMethod": "Cash",
      "receivedBy": "Unknown",
      "items": [
        {
          "serviceName": "Consultation",
          "description": "General checkup",
          "quantity": 1,
          "unitPrice": 800.0,
          "subtotal": 800.0
        },
        {
          "serviceName": "Lab Tests",
          "description": "Blood work",
          "quantity": 2,
          "unitPrice": 350.0,
          "subtotal": 700.0
        }
      ],
      "itemsSummary": "Consultation, Lab Tests",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

## Test 3: Get Transaction by ID (GET /api/transactions/:id)

### Request:
```bash
curl -X GET http://localhost:4000/api/transactions/1
```

### Expected Response:
Same as the create response above.

## Test 4: Delete Transaction (DELETE /api/transactions/:id)

### Request:
```bash
curl -X DELETE http://localhost:4000/api/transactions/1
```

### Expected Response:
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

## Validation Tests

### Test 5: Invalid Payment Method
```bash
curl -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "d7b20ad40f44478db25fe3ac78a1dd16",
    "date": "2025-01-15T00:00:00.000Z",
    "paymentMethod": "InvalidMethod",
    "receivedById": "user-123-456-789",
    "items": [
      {
        "serviceName": "Consultation",
        "description": "General checkup",
        "quantity": 1,
        "unitPrice": 800.0
      }
    ]
  }'
```

Expected: 400 error with validation message.

### Test 6: Empty Items Array
```bash
curl -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "d7b20ad40f44478db25fe3ac78a1dd16",
    "date": "2025-01-15T00:00:00.000Z",
    "paymentMethod": "Cash",
    "receivedById": "user-123-456-789",
    "items": []
  }'
```

Expected: 400 error with validation message.

### Test 7: Future Date
```bash
curl -X POST http://localhost:4000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "d7b20ad40f44478db25fe3ac78a1dd16",
    "date": "2026-01-15T00:00:00.000Z",
    "paymentMethod": "Cash",
    "receivedById": "user-123-456-789",
    "items": [
      {
        "serviceName": "Consultation",
        "description": "General checkup",
        "quantity": 1,
        "unitPrice": 800.0
      }
    ]
  }'
```

Expected: 400 error with validation message.

## Notes

- The implementation currently uses placeholder patient and user information since external service integration is not implemented.
- Patient and receivedBy fields will show "Unknown" values until patient and user repositories are integrated into the mapper.
- All business logic, validation, and core functionality is working correctly.
- Receipt numbers are auto-generated with the format R-YYYY-NNN.
- Total amounts are calculated automatically from items.