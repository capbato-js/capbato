-- VERIFICATION SCRIPT - Check current status after recreating AJ Riego (2025-R4)
-- This will confirm if all orphaned references are now resolved

-- ============================================================================
-- STEP 1: VERIFY AJ RIEGO EXISTS
-- ============================================================================

SELECT 'CHECKING IF AJ RIEGO (2025-R4) EXISTS:' as check_type;
SELECT 
    PatientID,
    FirstName,
    LastName,
    CONCAT(FirstName, ' ', LastName) as full_name
FROM patients 
WHERE PatientID = '2025-R4';

-- ============================================================================
-- STEP 2: CHECK ALL RIEGO FAMILY MEMBERS
-- ============================================================================

SELECT 'ALL RIEGO FAMILY MEMBERS:' as check_type;
SELECT 
    PatientID,
    FirstName,
    LastName,
    CONCAT(FirstName, ' ', LastName) as full_name
FROM patients 
WHERE LastName LIKE '%RIEGO%'
ORDER BY PatientID;

-- ============================================================================
-- STEP 3: CHECK IF ORPHANED REFERENCES ARE NOW RESOLVED
-- ============================================================================

-- Check orphaned appointments (should be 0 now)
SELECT 'ORPHANED APPOINTMENTS CHECK:' as check_type;
SELECT COUNT(*) as orphaned_count
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- Show any remaining orphaned appointments (should be empty)
SELECT 'REMAINING ORPHANED APPOINTMENTS (should be empty):' as check_type;
SELECT 
    a.id,
    a.patient_id,
    a.patient_name,
    a.appointment_date
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- Check orphaned lab requests (should be 0 now)
SELECT 'ORPHANED LAB REQUESTS CHECK:' as check_type;
SELECT COUNT(*) as orphaned_count
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- Show any remaining orphaned lab requests (should be empty)
SELECT 'REMAINING ORPHANED LAB REQUESTS (should be empty):' as check_type;
SELECT 
    l.id,
    l.patient_id,
    l.patient_name,
    l.request_date
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- ============================================================================
-- STEP 4: VERIFY AJ RIEGO'S APPOINTMENTS AND LAB REQUESTS
-- ============================================================================

-- Show AJ Riego's appointments
SELECT 'AJ RIEGO APPOINTMENTS:' as check_type;
SELECT 
    a.id,
    a.patient_id,
    a.patient_name,
    a.appointment_date,
    a.status,
    p.PatientID as linked_patient_id
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id = '2025-R4'
ORDER BY a.appointment_date;

-- Show AJ Riego's lab requests
SELECT 'AJ RIEGO LAB REQUESTS:' as check_type;
SELECT 
    l.id,
    l.patient_id,
    l.patient_name,
    l.request_date,
    p.PatientID as linked_patient_id
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id = '2025-R4'
ORDER BY l.request_date;

-- ============================================================================
-- STEP 5: FINAL MIGRATION STATUS SUMMARY
-- ============================================================================

SELECT 'FINAL MIGRATION STATUS:' as status_type;
SELECT 
    'PATIENTS' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN PatientID LIKE '2025-%' THEN 1 ELSE 0 END) as with_2025_prefix,
    SUM(CASE WHEN PatientID NOT LIKE '2025-%' THEN 1 ELSE 0 END) as without_prefix
FROM patients

UNION ALL

SELECT 
    'APPOINTMENTS' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN patient_id LIKE '2025-%' THEN 1 ELSE 0 END) as with_2025_prefix,
    SUM(CASE WHEN patient_id IS NOT NULL AND patient_id NOT LIKE '2025-%' THEN 1 ELSE 0 END) as without_prefix
FROM appointments

UNION ALL

SELECT 
    'LAB_REQUESTS' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN patient_id LIKE '2025-%' THEN 1 ELSE 0 END) as with_2025_prefix,
    SUM(CASE WHEN patient_id IS NOT NULL AND patient_id NOT LIKE '2025-%' THEN 1 ELSE 0 END) as without_prefix
FROM lab_request_entries;

-- Final check: Total orphaned references across all tables
SELECT 'TOTAL ORPHANED REFERENCES:' as final_check;
SELECT 
    (SELECT COUNT(*) FROM appointments a LEFT JOIN patients p ON a.patient_id = p.PatientID WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL) +
    (SELECT COUNT(*) FROM lab_request_entries l LEFT JOIN patients p ON l.patient_id = p.PatientID WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL) 
    as total_orphaned_references;
