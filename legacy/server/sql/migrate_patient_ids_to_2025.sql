-- Migration script to update existing PatientID values to include 2025 prefix
-- This script will convert existing IDs like 'A1', 'B2', 'G1' to '2025-A1', '2025-B2', '2025-G1'
-- 
-- IMPORTANT: 
-- 1. Make a backup of your database before running this script
-- 2. This operation cannot be easily undone
-- 3. Test on a copy of your database first

-- Step 1: First, update the PatientID column size to accommodate the new format
-- Also update foreign key columns that reference PatientID
ALTER TABLE patients MODIFY COLUMN PatientID VARCHAR(15) NOT NULL;
ALTER TABLE appointments MODIFY COLUMN patient_id VARCHAR(15) DEFAULT NULL;
ALTER TABLE lab_request_entries MODIFY COLUMN patient_id VARCHAR(15) DEFAULT NULL;

-- Step 2: Update all existing PatientID values to include 2025- prefix
-- This will only update IDs that don't already have the year prefix
UPDATE patients 
SET PatientID = CONCAT('2025-', PatientID)
WHERE PatientID NOT LIKE '____-%'  -- Skip IDs that already have year-dash pattern (YYYY-)
  AND PatientID REGEXP '^[A-Z][0-9]+$';  -- Only update IDs that match the old pattern (Letter followed by numbers)

-- Step 3: Update any foreign key references in other tables
-- Note: We need to update these AFTER updating the patients table

-- Update appointments table patient_id references
UPDATE appointments 
SET patient_id = CONCAT('2025-', patient_id)
WHERE patient_id IS NOT NULL
  AND patient_id NOT LIKE '____-%'
  AND patient_id REGEXP '^[A-Z][0-9]+$';

-- Update lab_request_entries table patient_id references  
UPDATE lab_request_entries 
SET patient_id = CONCAT('2025-', patient_id)
WHERE patient_id IS NOT NULL
  AND patient_id NOT LIKE '____-%'
  AND patient_id REGEXP '^[A-Z][0-9]+$';

-- Step 4: Verify the migration results
-- These queries help you verify that the migration completed successfully

SELECT 'Migration Results Summary:' as status;

-- Show total patients and how many have the new format
SELECT 
    COUNT(*) as total_patients,
    SUM(CASE WHEN PatientID LIKE '2025-%' THEN 1 ELSE 0 END) as patients_with_new_format,
    SUM(CASE WHEN PatientID NOT LIKE '____-%' THEN 1 ELSE 0 END) as patients_with_old_format
FROM patients;

-- Show total appointments and their patient_id format
SELECT 
    COUNT(*) as total_appointments,
    SUM(CASE WHEN patient_id LIKE '2025-%' THEN 1 ELSE 0 END) as appointments_with_new_format,
    SUM(CASE WHEN patient_id IS NOT NULL AND patient_id NOT LIKE '____-%' THEN 1 ELSE 0 END) as appointments_with_old_format
FROM appointments;

-- Show total lab requests and their patient_id format  
SELECT 
    COUNT(*) as total_lab_requests,
    SUM(CASE WHEN patient_id LIKE '2025-%' THEN 1 ELSE 0 END) as lab_requests_with_new_format,
    SUM(CASE WHEN patient_id IS NOT NULL AND patient_id NOT LIKE '____-%' THEN 1 ELSE 0 END) as lab_requests_with_old_format
FROM lab_request_entries;

-- Show sample of migrated patient data
SELECT PatientID, CONCAT(FirstName, ' ', LastName) as PatientName 
FROM patients 
WHERE PatientID LIKE '2025-%' 
ORDER BY PatientID
LIMIT 10;

-- Check for any orphaned references (should return 0 rows)
SELECT 'Checking for orphaned patient_id references:' as check_status;
SELECT COUNT(*) as orphaned_appointments 
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL;

SELECT COUNT(*) as orphaned_lab_requests 
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL;
