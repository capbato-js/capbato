-- SIMPLE CLEANUP SCRIPT - Remove orphaned records for 2025-R4
-- This will complete your migration by removing the invalid references

START TRANSACTION;

-- Show what will be deleted
SELECT 'RECORDS TO BE DELETED:' as preview;
SELECT 'Appointments' as type, COUNT(*) as count FROM appointments WHERE patient_id = '2025-R4';
SELECT 'Lab Requests' as type, COUNT(*) as count FROM lab_request_entries WHERE patient_id = '2025-R4';

-- Delete orphaned appointments
DELETE FROM appointments WHERE patient_id = '2025-R4';

-- Delete orphaned lab requests  
DELETE FROM lab_request_entries WHERE patient_id = '2025-R4';

-- Verify cleanup
SELECT 'CLEANUP VERIFICATION:' as status;
SELECT COUNT(*) as remaining_orphaned_appointments 
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL;

SELECT COUNT(*) as remaining_orphaned_lab_requests 
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL;

COMMIT;
