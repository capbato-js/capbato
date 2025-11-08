-- Migration script to convert reason_for_visit from TEXT to JSON array
-- Run this BEFORE deploying the new code if your database still has TEXT type

-- For MySQL
-- Step 1: Check current column type
-- SHOW COLUMNS FROM appointments LIKE 'reason_for_visit';

-- Step 2: If column is TEXT, run this migration
-- This assumes reason_for_visit contains simple strings like 'Consultation'

-- Create a temporary column to store the array
ALTER TABLE appointments ADD COLUMN reason_for_visit_temp JSON;

-- Convert existing text values to JSON arrays
-- Handle NULL values
UPDATE appointments
SET reason_for_visit_temp = CASE
    WHEN reason_for_visit IS NULL OR reason_for_visit = '' THEN CAST('["Consultation"]' AS JSON)
    ELSE CAST(CONCAT('["', reason_for_visit, '"]') AS JSON)
END;

-- Drop old column
ALTER TABLE appointments DROP COLUMN reason_for_visit;

-- Rename new column
ALTER TABLE appointments CHANGE reason_for_visit_temp reason_for_visit JSON NOT NULL;

-- Step 3: Fix any appointments that ended up with JSON null
UPDATE appointments
SET reason_for_visit = CAST('["Consultation"]' AS JSON)
WHERE JSON_TYPE(reason_for_visit) = 'NULL';
