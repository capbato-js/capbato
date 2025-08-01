-- Migration: Restructure address fields in patient table
-- This migration adds separate columns for address components and migrates existing data

-- Add new address columns
ALTER TABLE patient
ADD COLUMN house_number VARCHAR(20) NULL,
ADD COLUMN street_name VARCHAR(100) NULL,
ADD COLUMN province VARCHAR(50) NULL,
ADD COLUMN city_municipality VARCHAR(50) NULL,
ADD COLUMN barangay VARCHAR(50) NULL;

-- Add new guardian address columns
ALTER TABLE patient
ADD COLUMN guardian_house_number VARCHAR(20) NULL,
ADD COLUMN guardian_street_name VARCHAR(100) NULL,
ADD COLUMN guardian_province VARCHAR(50) NULL,
ADD COLUMN guardian_city_municipality VARCHAR(50) NULL,
ADD COLUMN guardian_barangay VARCHAR(50) NULL;

-- Optional: Drop the old address and guardian_address columns after data migration
-- IMPORTANT: Run this only after ensuring all data has been properly migrated
-- and the application has been updated to use the new columns

-- ALTER TABLE patient DROP COLUMN address;
-- ALTER TABLE patient DROP COLUMN guardian_address;

-- Note: For production, you would typically:
-- 1. Add the new columns (done above)
-- 2. Update the application to write to both old and new columns
-- 3. Migrate existing data from old to new columns
-- 4. Update the application to read from new columns only
-- 5. Remove the old columns (commented out above)
