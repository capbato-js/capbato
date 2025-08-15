# POST /api/laboratory/test-results

Creates lab test results for completed lab requests. Validates results against original requests and updates status to completed.

## Request
```json
{
  "labRequestId": "d2e66463bb2349209ea2cddf47f7822f",
  "patientId": "f5768246f4a64410a2a845a4a618f07e", 
  "dateTested": "2025-08-13T10:30:00.000Z",
  "bloodChemistry": {
    "fbs": 5.2,
    "cholesterol": 4.1,
    "triglycerides": 1.2
  },
  "urinalysis": {
    "color": "Yellow",
    "protein": "Negative"
  }
}
```

## Response
```json
{
  "success": true,
  "data": {
    "id": "abc123def456ghi789jkl012mno345pqr",
    "labRequestId": "d2e66463bb2349209ea2cddf47f7822f",
    "patientId": "f5768246f4a64410a2a845a4a618f07e",
    "dateTested": "2025-08-13T10:30:00.000Z",
    "status": "completed"
  },
  "message": "Lab test result created successfully"
}
```

## Features
- Validates lab request exists and belongs to patient
- Checks request status is pending
- Validates results against originally requested tests  
- Updates lab request status to completed
- Uses dashless UUID format (32 hex chars)
- Maps grouped payload to flat database structure