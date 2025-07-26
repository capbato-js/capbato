-- VERIFICATION SCRIPT FOR IMPORTED DATABASE
-- Run this after importing the database to verify everything is correct

USE clinic_management_system;

-- 1. Check if all tables exist
SELECT 'Checking tables...' as status;
SHOW TABLES;

-- 2. Verify Patient IDs are in 2025- format
SELECT 'Checking Patient ID format...' as status;
SELECT 
    PatientID,
    CONCAT(FirstName, ' ', MiddleName, ' ', LastName) as FullName,
    CASE 
        WHEN PatientID LIKE '2025-%' THEN '✅ Correct Format'
        ELSE '❌ Wrong Format'
    END as FormatCheck
FROM patients 
ORDER BY PatientID;

-- 3. Count records in each table
SELECT 'Record counts...' as status;
SELECT 
    'patients' as TableName, 
    COUNT(*) as RecordCount 
FROM patients
UNION ALL
SELECT 
    'appointments' as TableName, 
    COUNT(*) as RecordCount 
FROM appointments
UNION ALL
SELECT 
    'lab_request_entries' as TableName, 
    COUNT(*) as RecordCount 
FROM lab_request_entries;

-- 4. Check foreign key integrity (no orphaned records)
SELECT 'Checking foreign key integrity...' as status;

-- Check for orphaned appointments
SELECT 
    'Orphaned Appointments' as CheckType,
    COUNT(*) as OrphanCount
FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.PatientID
WHERE p.PatientID IS NULL;

-- Check for orphaned lab requests
SELECT 
    'Orphaned Lab Requests' as CheckType,
    COUNT(*) as OrphanCount
FROM lab_request_entries l
LEFT JOIN patients p ON l.patient_id = p.PatientID
WHERE p.PatientID IS NULL;

-- 5. Sample data verification
SELECT 'Sample appointments with Patient IDs...' as status;
SELECT 
    a.id,
    a.patient_name,
    a.patient_id,
    p.PatientID as VerifyPatientExists,
    a.appointment_date
FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.PatientID
ORDER BY a.appointment_date DESC
LIMIT 5;

-- 6. Final status
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM patients WHERE PatientID NOT LIKE '2025-%') = 0
             AND (SELECT COUNT(*) FROM appointments a LEFT JOIN patients p ON a.patient_id = p.PatientID WHERE p.PatientID IS NULL) = 0
             AND (SELECT COUNT(*) FROM lab_request_entries l LEFT JOIN patients p ON l.patient_id = p.PatientID WHERE p.PatientID IS NULL) = 0
        THEN '🎉 SUCCESS: Database imported correctly! All Patient IDs are in 2025- format and all references are valid.'
        ELSE '⚠️  WARNING: There may be issues with the import. Check the results above.'
    END as ImportStatus;
