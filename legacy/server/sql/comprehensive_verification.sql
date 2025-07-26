-- COMPREHENSIVE VERIFICATION SCRIPT
-- This script checks ALL possible references to patient IDs in the database

-- ============================================================================
-- STEP 1: CHECK ALL TABLES AND COLUMNS
-- ============================================================================

-- Find all columns that might contain patient references
SELECT 
    'ALL PATIENT-RELATED COLUMNS:' as check_type,
    TABLE_NAME, 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'clinic_management_system'
  AND (
    COLUMN_NAME LIKE '%patient%' 
    OR COLUMN_NAME = 'PatientID'
    OR COLUMN_NAME LIKE '%patient_id%'
  )
ORDER BY TABLE_NAME, COLUMN_NAME;

-- ============================================================================
-- STEP 2: VERIFY ALL KNOWN TABLES
-- ============================================================================

-- Check patients table
SELECT 'PATIENTS TABLE:' as table_check;
SELECT 
    COUNT(*) as total_patients,
    SUM(CASE WHEN PatientID LIKE '2025-%' THEN 1 ELSE 0 END) as with_2025_prefix,
    SUM(CASE WHEN PatientID REGEXP '^[A-Z][0-9]+$' THEN 1 ELSE 0 END) as old_format,
    SUM(CASE WHEN PatientID NOT LIKE '2025-%' AND PatientID NOT REGEXP '^[A-Z][0-9]+$' THEN 1 ELSE 0 END) as other_format
FROM patients;

-- Check appointments table
SELECT 'APPOINTMENTS TABLE:' as table_check;
SELECT 
    COUNT(*) as total_appointments,
    SUM(CASE WHEN patient_id IS NULL THEN 1 ELSE 0 END) as null_patient_id,
    SUM(CASE WHEN patient_id LIKE '2025-%' THEN 1 ELSE 0 END) as with_2025_prefix,
    SUM(CASE WHEN patient_id REGEXP '^[A-Z][0-9]+$' THEN 1 ELSE 0 END) as old_format,
    SUM(CASE WHEN patient_id IS NOT NULL AND patient_id NOT LIKE '2025-%' AND patient_id NOT REGEXP '^[A-Z][0-9]+$' THEN 1 ELSE 0 END) as other_format
FROM appointments;

-- Check lab_request_entries table
SELECT 'LAB_REQUEST_ENTRIES TABLE:' as table_check;
SELECT 
    COUNT(*) as total_lab_requests,
    SUM(CASE WHEN patient_id IS NULL THEN 1 ELSE 0 END) as null_patient_id,
    SUM(CASE WHEN patient_id LIKE '2025-%' THEN 1 ELSE 0 END) as with_2025_prefix,
    SUM(CASE WHEN patient_id REGEXP '^[A-Z][0-9]+$' THEN 1 ELSE 0 END) as old_format,
    SUM(CASE WHEN patient_id IS NOT NULL AND patient_id NOT LIKE '2025-%' AND patient_id NOT REGEXP '^[A-Z][0-9]+$' THEN 1 ELSE 0 END) as other_format
FROM lab_request_entries;

-- ============================================================================
-- STEP 3: CHECK FOR OTHER TABLES THAT MIGHT EXIST
-- ============================================================================

-- Check if there are other tables we haven't considered
-- (This will show any table that might have patient references)

-- Check for blood_chem table (if it exists)
SELECT 'CHECKING FOR BLOOD_CHEM TABLE:' as table_check;
SELECT COUNT(*) as table_exists FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'clinic_management_system' AND TABLE_NAME = 'blood_chem';

-- Check for hematology table (if it exists)  
SELECT 'CHECKING FOR HEMATOLOGY TABLE:' as table_check;
SELECT COUNT(*) as table_exists FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'clinic_management_system' AND TABLE_NAME = 'hematology';

-- Check for urinalysis table (if it exists)
SELECT 'CHECKING FOR URINALYSIS TABLE:' as table_check;
SELECT COUNT(*) as table_exists FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'clinic_management_system' AND TABLE_NAME = 'urinalysis';

-- Check for fecalysis table (if it exists)
SELECT 'CHECKING FOR FECALYSIS TABLE:' as table_check;
SELECT COUNT(*) as table_exists FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'clinic_management_system' AND TABLE_NAME = 'fecalysis';

-- ============================================================================
-- STEP 4: DETAILED ORPHANED REFERENCE ANALYSIS
-- ============================================================================

-- Show exactly which records are orphaned in appointments
SELECT 'DETAILED ORPHANED APPOINTMENTS:' as detail_check;
SELECT 
    a.id,
    a.patient_id,
    a.patient_name,
    a.appointment_date,
    a.status,
    'NO_MATCHING_PATIENT' as issue
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- Show exactly which records are orphaned in lab_request_entries
SELECT 'DETAILED ORPHANED LAB REQUESTS:' as detail_check;
SELECT 
    l.id,
    l.patient_id,
    l.patient_name,
    l.request_date,
    'NO_MATCHING_PATIENT' as issue
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- ============================================================================
-- STEP 5: SHOW ALL CURRENT VALID PATIENT IDs
-- ============================================================================

SELECT 'ALL VALID PATIENT IDS:' as valid_ids;
SELECT PatientID, CONCAT(FirstName, ' ', LastName) as name 
FROM patients 
ORDER BY PatientID;
