-- Simple diagnostic queries to identify orphaned references

-- Show all tables in the database
SHOW TABLES;

-- Show orphaned appointments
SELECT 'ORPHANED APPOINTMENTS' as type;
SELECT a.id, a.patient_id, a.patient_name, a.appointment_date 
FROM appointments a 
LEFT JOIN patients p ON a.patient_id = p.PatientID 
WHERE a.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- Show orphaned lab requests  
SELECT 'ORPHANED LAB REQUESTS' as type;
SELECT l.id, l.patient_id, l.patient_name, l.request_date 
FROM lab_request_entries l 
LEFT JOIN patients p ON l.patient_id = p.PatientID 
WHERE l.patient_id IS NOT NULL AND p.PatientID IS NULL;

-- Show all current patients
SELECT 'ALL PATIENTS' as type;
SELECT PatientID, FirstName, LastName FROM patients ORDER BY PatientID;

-- Check if there are any other tables with patient references
SELECT 
    TABLE_NAME, 
    COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE COLUMN_NAME LIKE '%patient%' 
  AND TABLE_SCHEMA = 'clinic_management_system'
ORDER BY TABLE_NAME, COLUMN_NAME;
