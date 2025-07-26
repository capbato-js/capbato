-- Update PatientID column to accommodate year prefix format (YYYY-L#)
-- This script should be run on the existing database to update the schema

ALTER TABLE patients MODIFY COLUMN PatientID VARCHAR(15) NOT NULL;

-- Note: This change is backward compatible since existing IDs like 'A1', 'B2' etc.
-- will still fit within the new VARCHAR(15) limit, and new IDs will use format '2025-A1', '2025-B2' etc.
