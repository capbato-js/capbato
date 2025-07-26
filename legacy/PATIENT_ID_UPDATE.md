# Patient ID Format Update

## Summary
Updated the patient ID generation logic to include the current year as a prefix.

## Changes Made

### Before
- Patient IDs were generated in format: `A1`, `A2`, `B1`, `B2`, etc.
- Pattern: `{FirstLetterOfLastName}{IncrementalNumber}`

### After (Current Implementation)
- Patient IDs are now generated in format: `2025-A1`, `2025-A2`, `2025-B1`, `2025-B2`, etc.
- Pattern: `{CurrentYear}-{FirstLetterOfLastName}{IncrementalNumber}`

## Files Modified

### 1. Server-side Logic
- **File**: `server/src/controllers/patients.controllers.js`
- **Change**: Updated the patient ID generation logic in the `addPatient` function
- **Details**: 
  - Added `currentYear` variable to get the current year
  - Updated `patientIdPrefix` to include year and dash
  - Updated SQL query to search for the new pattern

### 2. Database Schema
- **Files**: 
  - `server/src/config/patients.sql`
  - `server/patients.sql`
- **Change**: Increased `PatientID` field from `VARCHAR(10)` to `VARCHAR(15)`
- **Reason**: To accommodate the longer format (e.g., "2025-A123" = 8 characters minimum)

### 3. Database Migration Script
- **File**: `server/update_patient_id_schema.sql` (NEW)
- **Purpose**: SQL script to update existing database schema
- **Usage**: Run this script on your existing database to update the PatientID column size

## Backward Compatibility

✅ **Fully Backward Compatible**
- Existing patients with old format (A1, B1, G1, etc.) will continue to work
- Old patient IDs are still valid and functional
- Only new patients will get the new format

## Benefits

1. **Year Tracking**: Easy to identify when a patient was registered
2. **Better Organization**: Patients can be grouped by registration year
3. **Scalability**: Supports unlimited patients per year per letter
4. **Professional**: More professional ID format with year prefix

## Example Patient IDs

### New Format (2025 onwards)
- `2025-A1` - First patient with last name starting with "A" in 2025
- `2025-A2` - Second patient with last name starting with "A" in 2025
- `2025-B1` - First patient with last name starting with "B" in 2025
- `2026-A1` - First patient with last name starting with "A" in 2026

### Legacy Format (Still Supported)
- `A1`, `B1`, `G1`, `H1`, `L1` (existing patients)

## Testing

To test the new format:
1. Ensure the server is running
2. Add a new patient through the web interface
3. Verify the generated Patient ID follows the new format: `2025-{Letter}{Number}`

## Database Update Required

If you have an existing database, run the following SQL command:

```sql
ALTER TABLE patients MODIFY COLUMN PatientID VARCHAR(15) NOT NULL;
```

Or use the provided migration script:
```bash
mysql -u your_username -p your_database_name < server/update_patient_id_schema.sql
```
