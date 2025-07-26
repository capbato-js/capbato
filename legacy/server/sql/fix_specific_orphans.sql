-- FIX SPECIFIC ORPHANED REFERENCES FOR 2025-R4 (AJ RIEGO)
-- This script provides options to resolve the orphaned references

START TRANSACTION;

-- ============================================================================
-- OPTION 1: CREATE THE MISSING PATIENT (2025-R4 - AJ RIEGO)
-- ============================================================================

-- If AJ RIEGO is a legitimate patient that should exist, create the patient record
-- You'll need to fill in the missing details like DOB, age, gender, etc.

/*
INSERT INTO patients 
(PatientID, LastName, FirstName, MiddleName, DateOfBirth, Age, Gender, ContactNumber, Address,
 GuardianName, GuardianGender, GuardianRelationship, GuardianContactNumber, GuardianAddress)
VALUES 
('2025-R4', 'RIEGO', 'AJ', '', '2000-01-01', 25, 'MALE', '09123456789', 'SAMPLE ADDRESS',
 'GUARDIAN NAME', 'MALE', 'FATHER', '09123456789', 'GUARDIAN ADDRESS');
*/

-- ============================================================================
-- OPTION 2: REASSIGN TO EXISTING RIEGO FAMILY MEMBER
-- ============================================================================

-- Check existing RIEGO family members to see if AJ should be reassigned
SELECT 'EXISTING RIEGO FAMILY MEMBERS:' as info;
SELECT PatientID, FirstName, LastName 
FROM patients 
WHERE LastName LIKE '%RIEGO%' 
ORDER BY PatientID;

-- If AJ RIEGO should be reassigned to an existing RIEGO patient, uncomment and modify:
/*
-- Example: Reassign to 2025-R1 (SOLEIL RIEGO)
UPDATE appointments 
SET patient_id = '2025-R1', patient_name = 'SOLEIL RIEGO'
WHERE patient_id = '2025-R4' AND patient_name = 'AJ  RIEGO';

UPDATE lab_request_entries 
SET patient_id = '2025-R1', patient_name = 'SOLEIL RIEGO'
WHERE patient_id = '2025-R4' AND patient_name = 'AJ  RIEGO';
*/

-- ============================================================================
-- OPTION 3: DELETE THE ORPHANED RECORDS
-- ============================================================================

-- Show what will be deleted
SELECT 'APPOINTMENTS TO BE DELETED:' as deletion_preview;
SELECT id, patient_id, patient_name, appointment_date, status
FROM appointments 
WHERE patient_id = '2025-R4' AND patient_name = 'AJ  RIEGO';

SELECT 'LAB REQUESTS TO BE DELETED:' as deletion_preview;
SELECT id, patient_id, patient_name, request_date
FROM lab_request_entries 
WHERE patient_id = '2025-R4' AND patient_name = 'AJ  RIEGO';

-- Uncomment to delete orphaned records:
/*
DELETE FROM appointments 
WHERE patient_id = '2025-R4' AND patient_name = 'AJ  RIEGO';

DELETE FROM lab_request_entries 
WHERE patient_id = '2025-R4' AND patient_name = 'AJ  RIEGO';
*/

-- ============================================================================
-- VERIFICATION AFTER FIX
-- ============================================================================

-- Check orphaned references after applying your chosen solution
SELECT 'ORPHANED APPOINTMENTS AFTER FIX:' as final_check;
SELECT COUNT(*) as remaining_orphaned_appointments
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL;

SELECT 'ORPHANED LAB REQUESTS AFTER FIX:' as final_check;
SELECT COUNT(*) as remaining_orphaned_lab_requests
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- If the fix looks good, commit the transaction:
-- COMMIT;

-- If something went wrong, rollback:
-- ROLLBACK;
