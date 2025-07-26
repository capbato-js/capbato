-- DIAGNOSTIC SCRIPT - Find and Fix Orphaned References
-- This script will help identify and resolve orphaned patient_id references

-- ============================================================================
-- STEP 1: IDENTIFY ORPHANED APPOINTMENTS
-- ============================================================================

SELECT 'ORPHANED APPOINTMENTS:' as diagnostic_type;
SELECT 
    a.id as appointment_id,
    a.patient_id as orphaned_patient_id,
    a.patient_name,
    a.appointment_date,
    a.status
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL 
  AND p.PatientID IS NULL
ORDER BY a.patient_id;

-- ============================================================================
-- STEP 2: IDENTIFY ORPHANED LAB REQUESTS
-- ============================================================================

SELECT 'ORPHANED LAB REQUESTS:' as diagnostic_type;
SELECT 
    l.id as lab_request_id,
    l.patient_id as orphaned_patient_id,
    l.patient_name,
    l.request_date
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL 
  AND p.PatientID IS NULL
ORDER BY l.patient_id;

-- ============================================================================
-- STEP 3: CHECK FOR POSSIBLE MATCHES
-- ============================================================================

-- Look for appointments that might match existing patients by name
SELECT 'POSSIBLE APPOINTMENT MATCHES BY NAME:' as diagnostic_type;
SELECT 
    a.id as appointment_id,
    a.patient_id as orphaned_id,
    a.patient_name as appointment_name,
    p.PatientID as existing_patient_id,
    CONCAT(p.FirstName, ' ', p.LastName) as patient_name_in_db,
    'POSSIBLE MATCH' as match_status
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
CROSS JOIN patients p2
WHERE a.patient_id IS NOT NULL 
  AND p.PatientID IS NULL
  AND (
    UPPER(a.patient_name) = UPPER(CONCAT(p2.FirstName, ' ', p2.LastName))
    OR UPPER(a.patient_name) = UPPER(CONCAT(p2.FirstName, ' ', p2.MiddleName, ' ', p2.LastName))
    OR UPPER(a.patient_name) LIKE CONCAT('%', UPPER(p2.FirstName), '%')
  )
ORDER BY a.patient_id;

-- Look for lab requests that might match existing patients by name
SELECT 'POSSIBLE LAB REQUEST MATCHES BY NAME:' as diagnostic_type;
SELECT 
    l.id as lab_request_id,
    l.patient_id as orphaned_id,
    l.patient_name as lab_request_name,
    p.PatientID as existing_patient_id,
    CONCAT(p.FirstName, ' ', p.LastName) as patient_name_in_db,
    'POSSIBLE MATCH' as match_status
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
CROSS JOIN patients p2
WHERE l.patient_id IS NOT NULL 
  AND p.PatientID IS NULL
  AND (
    UPPER(l.patient_name) = UPPER(CONCAT(p2.FirstName, ' ', p2.LastName))
    OR UPPER(l.patient_name) = UPPER(CONCAT(p2.FirstName, ' ', p2.MiddleName, ' ', p2.LastName))
    OR UPPER(l.patient_name) LIKE CONCAT('%', UPPER(p2.FirstName), '%')
  )
ORDER BY l.patient_id;

-- ============================================================================
-- STEP 4: CHECK IF ORPHANED IDs NEED 2025- PREFIX
-- ============================================================================

-- Check if orphaned patient_ids just need the 2025- prefix added
SELECT 'ORPHANED IDs THAT MIGHT NEED 2025- PREFIX:' as diagnostic_type;
SELECT 
    'APPOINTMENTS' as table_type,
    a.patient_id as orphaned_id,
    CONCAT('2025-', a.patient_id) as with_prefix,
    CASE 
        WHEN p.PatientID IS NOT NULL THEN 'MATCH FOUND'
        ELSE 'NO MATCH'
    END as match_status
FROM appointments a 
LEFT JOIN patients orig_p ON a.patient_id = orig_p.PatientID 
LEFT JOIN patients p ON CONCAT('2025-', a.patient_id) = p.PatientID
WHERE a.patient_id IS NOT NULL 
  AND orig_p.PatientID IS NULL

UNION ALL

SELECT 
    'LAB_REQUESTS' as table_type,
    l.patient_id as orphaned_id,
    CONCAT('2025-', l.patient_id) as with_prefix,
    CASE 
        WHEN p.PatientID IS NOT NULL THEN 'MATCH FOUND'
        ELSE 'NO MATCH'
    END as match_status
FROM lab_request_entries l 
LEFT JOIN patients orig_p ON l.patient_id = orig_p.PatientID 
LEFT JOIN patients p ON CONCAT('2025-', l.patient_id) = p.PatientID
WHERE l.patient_id IS NOT NULL 
  AND orig_p.PatientID IS NULL;

-- ============================================================================
-- STEP 5: COMPLETE CURRENT PATIENT LIST
-- ============================================================================

SELECT 'CURRENT PATIENTS IN DATABASE:' as diagnostic_type;
SELECT 
    PatientID,
    CONCAT(FirstName, ' ', COALESCE(MiddleName, ''), ' ', LastName) as full_name
FROM patients 
ORDER BY PatientID;
