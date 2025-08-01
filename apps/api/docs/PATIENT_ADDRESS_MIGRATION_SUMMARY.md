# Patient Address Structure Migration - Implementation Summary

## Overview
Successfully implemented separate columns for address fields in the Patient entity to align with the "Add New Patient" form requirements. This provides better data structure and makes it easier to work with address components individually.

## Changes Made

### 1. Database Schema (PatientEntity.ts)
**File:** `apps/api/src/infrastructure/patient/persistence/typeorm/PatientEntity.ts`

**Removed:**
- `address: string` field
- `guardianAddress: string` field

**Added Patient Address Fields:**
- `houseNumber?: string` (max 20 chars)
- `streetName?: string` (max 100 chars) 
- `province?: string` (max 50 chars)
- `cityMunicipality?: string` (max 50 chars)
- `barangay?: string` (max 50 chars)

**Added Guardian Address Fields:**
- `guardianHouseNumber?: string` (max 20 chars)
- `guardianStreetName?: string` (max 100 chars)
- `guardianProvince?: string` (max 50 chars)
- `guardianCityMunicipality?: string` (max 50 chars)
- `guardianBarangay?: string` (max 50 chars)

### 2. Domain Model (Patient.ts)
**File:** `libs/application-shared/src/domain/Patient.ts`

**Updated IPatient Interface:**
- Replaced `address` with individual address fields
- Replaced `guardianAddress` with individual guardian address fields

**Updated Patient Class:**
- Modified constructor to accept `addressInfo` and `guardianAddressInfo` objects
- Added getters for all new address fields
- Added computed `address` and `guardianAddress` properties for backward compatibility
- Added `hasGuardianAddressInfo` helper property
- Updated validation to require at least one address field

### 3. DTOs and Request Types
**Files:** 
- `libs/application-shared/src/dto/PatientDto.ts`
- `libs/application-shared/src/dto/PatientRequestDtos.ts`

**Changes:**
- Added individual address fields to all DTOs
- Kept computed `address` fields for backward compatibility
- Updated validation schemas to handle new structure

### 4. Validation Schema
**File:** `libs/application-shared/src/validation/PatientValidationSchemas.ts`

**Changes:**
- Replaced single `address` field with individual address fields
- Added validation for individual guardian address fields
- Added custom validation to ensure at least one address field is provided
- Maintained existing guardian validation logic

### 5. Repository Implementation
**File:** `apps/api/src/infrastructure/patient/persistence/typeorm/TypeOrmPatientRepository.ts`

**Changes:**
- Updated `create()` method to map individual address fields
- Updated `update()` method to handle new address structure
- Updated `toDomain()` method to construct Patient with new structure

### 6. Use Cases
**File:** `libs/application-shared/src/use-cases/commands/CreatePatientUseCase.ts`

**Changes:**
- Updated Patient construction to use new address structure
- Maintains backward compatibility through computed properties

### 7. Mappers
**File:** `libs/application-shared/src/mappers/PatientMapper.ts`

**Changes:**
- Updated all mapping methods to handle new address structure
- Maintained backward compatibility by including computed address fields in DTOs
- Updated plain object mapping for database interactions

### 8. Web API Repository
**File:** `apps/web/src/infrastructure/api/ApiPatientRepository.ts`

**Changes:**
- Updated to map new address fields from API responses
- Added computed address properties for frontend compatibility

## Database Migration
**File:** `migration-address-structure.sql`

Created SQL migration script to:
- Add new address columns to existing patient table
- Add new guardian address columns
- Provides commented instructions for dropping old columns after migration

## Form Field Alignment

### ✅ Fully Supported Fields:
**Patient Information:**
- Last Name → `lastName`
- First Name → `firstName`  
- Middle Name → `middleName`
- Date of Birth → `dateOfBirth`
- Age → Computed from `dateOfBirth`
- Gender → `gender`
- Contact Number → `contactNumber`

**Patient Address:**
- House No. → `houseNumber`
- Street Name → `streetName`
- Province → `province`
- City/Municipality → `cityMunicipality`
- Barangay → `barangay`

**Guardian Information:**
- Full Name → `guardianName`
- Gender → `guardianGender`
- Relationship → `guardianRelationship`
- Contact Number → `guardianContactNumber`

**Guardian Address:**
- House No. → `guardianHouseNumber`
- Street Name → `guardianStreetName`
- Province → `guardianProvince`
- City/Municipality → `guardianCityMunicipality`
- Barangay → `guardianBarangay`

## Backward Compatibility
- Computed `address` and `guardianAddress` properties maintain existing API contracts
- All existing code using single address fields will continue to work
- Frontend components can still use concatenated address strings if needed

## Next Steps
1. Run database migration in appropriate environments
2. Test API endpoints with new address structure
3. Update frontend form components to use individual address fields
4. Verify all existing functionality still works with computed address properties
5. Consider removing old address columns after full migration and testing

## Benefits
- Better data normalization and querying capabilities
- Easier form validation and user experience
- Maintains backward compatibility
- Aligns perfectly with the form requirements shown in the screenshot
- Supports future features like address autocomplete, province/city dropdowns, etc.
