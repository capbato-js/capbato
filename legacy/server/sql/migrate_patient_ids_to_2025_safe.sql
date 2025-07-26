-- SAFE MIGRATION SCRIPT WITH TRANSACTION SUPPORT
-- This version uses transactions so you can rollback if something goes wrong
-- 
-- INSTRUCTIONS:
-- 1. Make a backup of your database before running this script
-- 2. Run this script section by section, checking results after each step
-- 3. If anything looks wrong, run ROLLBACK; to undo changes
-- 4. Only run COMMIT; when you're satisfied with the results

-- ============================================================================
-- STEP 1: START TRANSACTION AND UPDATE COLUMN SIZES
-- ============================================================================

START TRANSACTION;

-- Update column sizes first to accommodate the new format
ALTER TABLE patients MODIFY COLUMN PatientID VARCHAR(15) NOT NULL;
ALTER TABLE appointments MODIFY COLUMN patient_id VARCHAR(15) DEFAULT NULL;
ALTER TABLE lab_request_entries MODIFY COLUMN patient_id VARCHAR(15) DEFAULT NULL;

-- Verify column changes (these should show VARCHAR(15))
SELECT 
    COLUMN_NAME, 
    COLUMN_TYPE, 
    IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME IN ('patients', 'appointments', 'lab_request_entries') 
  AND COLUMN_NAME IN ('PatientID', 'patient_id')
ORDER BY TABLE_NAME, COLUMN_NAME;

-- ============================================================================
-- STEP 2: PREVIEW WHAT WILL BE CHANGED
-- ============================================================================

-- Show patients that will be updated
SELECT 
    'Patients to be updated:' as preview_type,
    PatientID as current_id,
    CONCAT('2025-', PatientID) as new_id
FROM patients 
WHERE PatientID NOT LIKE '____-%' 
  AND PatientID REGEXP '^[A-Z][0-9]+$'
ORDER BY PatientID;

-- Show appointments that will be updated
SELECT 
    'Appointments to be updated:' as preview_type,
    patient_id as current_id,
    CONCAT('2025-', patient_id) as new_id
FROM appointments 
WHERE patient_id IS NOT NULL
  AND patient_id NOT LIKE '____-%'
  AND patient_id REGEXP '^[A-Z][0-9]+$'
ORDER BY patient_id;

-- Show lab requests that will be updated
SELECT 
    'Lab requests to be updated:' as preview_type,
    patient_id as current_id,
    CONCAT('2025-', patient_id) as new_id
FROM lab_request_entries 
WHERE patient_id IS NOT NULL
  AND patient_id NOT LIKE '____-%'
  AND patient_id REGEXP '^[A-Z][0-9]+$'
ORDER BY patient_id;

-- ============================================================================
-- STEP 3: PERFORM THE MIGRATION (Uncomment to execute)
-- ============================================================================

-- If the preview looks correct, uncomment and run these UPDATE statements:

/*
-- Update patients table
UPDATE patients 
SET PatientID = CONCAT('2025-', PatientID)
WHERE PatientID NOT LIKE '____-%'  
  AND PatientID REGEXP '^[A-Z][0-9]+$';

-- Update appointments table
UPDATE appointments 
SET patient_id = CONCAT('2025-', patient_id)
WHERE patient_id IS NOT NULL
  AND patient_id NOT LIKE '____-%'
  AND patient_id REGEXP '^[A-Z][0-9]+$';

-- Update lab_request_entries table
UPDATE lab_request_entries 
SET patient_id = CONCAT('2025-', patient_id)
WHERE patient_id IS NOT NULL
  AND patient_id NOT LIKE '____-%'
  AND patient_id REGEXP '^[A-Z][0-9]+$';
*/

-- ============================================================================
-- STEP 4: VERIFY RESULTS (Run after uncommenting and executing Step 3)
-- ============================================================================

-- Check migration results
SELECT 
    'PATIENTS TABLE' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN PatientID LIKE '2025-%' THEN 1 ELSE 0 END) as records_with_new_format,
    SUM(CASE WHEN PatientID NOT LIKE '____-%' THEN 1 ELSE 0 END) as records_with_old_format
FROM patients

UNION ALL

SELECT 
    'APPOINTMENTS TABLE' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN patient_id LIKE '2025-%' THEN 1 ELSE 0 END) as records_with_new_format,
    SUM(CASE WHEN patient_id IS NOT NULL AND patient_id NOT LIKE '____-%' THEN 1 ELSE 0 END) as records_with_old_format
FROM appointments

UNION ALL

SELECT 
    'LAB_REQUEST_ENTRIES TABLE' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN patient_id LIKE '2025-%' THEN 1 ELSE 0 END) as records_with_new_format,
    SUM(CASE WHEN patient_id IS NOT NULL AND patient_id NOT LIKE '____-%' THEN 1 ELSE 0 END) as records_with_old_format
FROM lab_request_entries;

-- Check for orphaned references (should return 0)
SELECT 
    'Orphaned appointment references' as check_type,
    COUNT(*) as count
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL

UNION ALL

SELECT 
    'Orphaned lab request references' as check_type,
    COUNT(*) as count
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- Sample of migrated data
SELECT 
    PatientID, 
    CONCAT(FirstName, ' ', LastName) as PatientName 
FROM patients 
WHERE PatientID LIKE '2025-%' 
ORDER BY PatientID 
LIMIT 10;

-- ============================================================================
-- STEP 5: COMMIT OR ROLLBACK
-- ============================================================================

-- If everything looks good, uncomment and run:
-- COMMIT;

-- If something went wrong, uncomment and run:
-- ROLLBACK;
