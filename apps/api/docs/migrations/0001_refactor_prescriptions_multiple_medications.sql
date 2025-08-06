-- Migration to refactor prescriptions to support multiple medications
-- This migration:
-- 1. Creates a new medications table
-- 2. Migrates existing prescription medication data to the new table
-- 3. Removes medication-specific columns from prescriptions table

-- Step 1: Create the medications table
CREATE TABLE medications (
    id VARCHAR(36) PRIMARY KEY,
    prescription_id VARCHAR(36) NOT NULL,
    medication_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    instructions TEXT NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_medications_prescription_id (prescription_id),
    INDEX idx_medications_medication_name (medication_name),
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
);

-- Step 2: Migrate existing prescription data to medications table
-- This will create one medication record for each existing prescription
INSERT INTO medications (id, prescription_id, medication_name, dosage, instructions, frequency, duration, created_at)
SELECT 
    UUID() as id,
    id as prescription_id,
    medication_name,
    dosage,
    instructions,
    frequency,
    duration,
    created_at
FROM prescriptions 
WHERE medication_name IS NOT NULL;

-- Step 3: Remove medication-specific columns from prescriptions table
-- Note: In a production environment, you might want to do this in steps and backup first
ALTER TABLE prescriptions 
DROP COLUMN medication_name,
DROP COLUMN dosage,
DROP COLUMN instructions,
DROP COLUMN frequency,
DROP COLUMN duration;

-- Step 4: Remove the medication_name index that no longer exists
-- Note: MySQL will automatically drop the index when the column is dropped
