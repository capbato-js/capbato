-- ROLLBACK SCRIPT - Use this to undo the 2025 prefix migration
-- This script will remove the '2025-' prefix from PatientID values
-- 
-- WARNING: Only use this if you need to revert the migration
-- Make sure you have a backup before running this script

-- ============================================================================
-- ROLLBACK MIGRATION - REMOVE 2025- PREFIX
-- ============================================================================

START TRANSACTION;

-- Preview what will be changed back
SELECT 
    'Patients to be reverted:' as preview_type,
    PatientID as current_id,
    SUBSTRING(PatientID, 6) as reverted_id  -- Remove '2025-' (first 5 characters)
FROM patients 
WHERE PatientID LIKE '2025-%'
ORDER BY PatientID;

SELECT 
    'Appointments to be reverted:' as preview_type,
    patient_id as current_id,
    SUBSTRING(patient_id, 6) as reverted_id
FROM appointments 
WHERE patient_id LIKE '2025-%'
ORDER BY patient_id;

SELECT 
    'Lab requests to be reverted:' as preview_type,
    patient_id as current_id,
    SUBSTRING(patient_id, 6) as reverted_id
FROM lab_request_entries 
WHERE patient_id LIKE '2025-%'
ORDER BY patient_id;

-- Uncomment these UPDATE statements to perform the rollback:

/*
-- Revert patients table
UPDATE patients 
SET PatientID = SUBSTRING(PatientID, 6)  -- Remove '2025-' prefix
WHERE PatientID LIKE '2025-%';

-- Revert appointments table  
UPDATE appointments 
SET patient_id = SUBSTRING(patient_id, 6)
WHERE patient_id LIKE '2025-%';

-- Revert lab_request_entries table
UPDATE lab_request_entries 
SET patient_id = SUBSTRING(patient_id, 6)
WHERE patient_id LIKE '2025-%';
*/

-- Verify rollback results (run after uncommenting the UPDATE statements)
SELECT 
    'ROLLBACK VERIFICATION' as status,
    COUNT(*) as total_patients,
    SUM(CASE WHEN PatientID LIKE '2025-%' THEN 1 ELSE 0 END) as still_have_prefix,
    SUM(CASE WHEN PatientID REGEXP '^[A-Z][0-9]+$' THEN 1 ELSE 0 END) as back_to_old_format
FROM patients;

-- If rollback looks correct, commit the changes:
-- COMMIT;

-- If something went wrong, rollback:
-- ROLLBACK;
