-- FIX ORPHANED REFERENCES SCRIPT
-- This script provides solutions for common orphaned reference issues

START TRANSACTION;

-- ============================================================================
-- OPTION 1: Fix orphaned references that just need 2025- prefix
-- ============================================================================

-- Check if some appointment patient_ids just need the 2025- prefix
SELECT 'APPOINTMENTS THAT NEED 2025- PREFIX:' as fix_type;
SELECT 
    a.id as appointment_id,
    a.patient_id as current_id,
    CONCAT('2025-', a.patient_id) as should_be,
    p.PatientID as matching_patient
FROM appointments a 
LEFT JOIN patients orig_p ON a.patient_id = orig_p.PatientID 
JOIN patients p ON CONCAT('2025-', a.patient_id) = p.PatientID
WHERE a.patient_id IS NOT NULL 
  AND orig_p.PatientID IS NULL;

-- Fix appointments that need 2025- prefix
UPDATE appointments a
JOIN patients p ON CONCAT('2025-', a.patient_id) = p.PatientID
SET a.patient_id = CONCAT('2025-', a.patient_id)
WHERE a.patient_id IS NOT NULL 
  AND a.patient_id NOT LIKE '2025-%'
  AND NOT EXISTS (SELECT 1 FROM patients orig_p WHERE orig_p.PatientID = a.patient_id);

-- Check if some lab request patient_ids just need the 2025- prefix  
SELECT 'LAB REQUESTS THAT NEED 2025- PREFIX:' as fix_type;
SELECT 
    l.id as lab_request_id,
    l.patient_id as current_id,
    CONCAT('2025-', l.patient_id) as should_be,
    p.PatientID as matching_patient
FROM lab_request_entries l 
LEFT JOIN patients orig_p ON l.patient_id = orig_p.PatientID 
JOIN patients p ON CONCAT('2025-', l.patient_id) = p.PatientID
WHERE l.patient_id IS NOT NULL 
  AND orig_p.PatientID IS NULL;

-- Fix lab requests that need 2025- prefix
UPDATE lab_request_entries l
JOIN patients p ON CONCAT('2025-', l.patient_id) = p.PatientID
SET l.patient_id = CONCAT('2025-', l.patient_id)
WHERE l.patient_id IS NOT NULL 
  AND l.patient_id NOT LIKE '2025-%'
  AND NOT EXISTS (SELECT 1 FROM patients orig_p WHERE orig_p.PatientID = l.patient_id);

-- ============================================================================
-- OPTION 2: Remove completely orphaned records (use with caution)
-- ============================================================================

-- Show records that will be cleaned up (review before uncommenting DELETE statements)
SELECT 'APPOINTMENTS TO BE DELETED (NO MATCHING PATIENT):' as cleanup_type;
SELECT a.id, a.patient_id, a.patient_name, a.appointment_date
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
LEFT JOIN patients p2 ON CONCAT('2025-', a.patient_id) = p2.PatientID
WHERE a.patient_id IS NOT NULL 
  AND p.PatientID IS NULL 
  AND p2.PatientID IS NULL;

SELECT 'LAB REQUESTS TO BE DELETED (NO MATCHING PATIENT):' as cleanup_type;
SELECT l.id, l.patient_id, l.patient_name, l.request_date
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
LEFT JOIN patients p2 ON CONCAT('2025-', l.patient_id) = p2.PatientID
WHERE l.patient_id IS NOT NULL 
  AND p.PatientID IS NULL 
  AND p2.PatientID IS NULL;

-- Uncomment these DELETE statements only if you want to remove orphaned records:
/*
-- Delete orphaned appointments
DELETE a FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
LEFT JOIN patients p2 ON CONCAT('2025-', a.patient_id) = p2.PatientID
WHERE a.patient_id IS NOT NULL 
  AND p.PatientID IS NULL 
  AND p2.PatientID IS NULL;

-- Delete orphaned lab requests
DELETE l FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
LEFT JOIN patients p2 ON CONCAT('2025-', l.patient_id) = p2.PatientID
WHERE l.patient_id IS NOT NULL 
  AND p.PatientID IS NULL 
  AND p2.PatientID IS NULL;
*/

-- ============================================================================
-- VERIFICATION AFTER FIXES
-- ============================================================================

-- Check remaining orphaned references
SELECT 'REMAINING ORPHANED APPOINTMENTS:' as final_check;
SELECT COUNT(*) as count
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL;

SELECT 'REMAINING ORPHANED LAB REQUESTS:' as final_check;
SELECT COUNT(*) as count
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- If everything looks good, commit:
-- COMMIT;

-- If something went wrong, rollback:
-- ROLLBACK;
