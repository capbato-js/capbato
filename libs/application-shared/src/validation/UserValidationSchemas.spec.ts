import { describe, it, expect } from 'vitest';
import { UpdateUserDetailsFormSchema, UpdateUserDetailsCommandSchema } from './UserValidationSchemas';

describe('UpdateUserDetailsFormSchema', () => {
  it('should validate a complete user update form', () => {
    const validData = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      mobile: '09123456789',
      role: 'admin'
    };

    const result = UpdateUserDetailsFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate a doctor update form with profile fields', () => {
    const validDoctorData = {
      id: '1',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      mobile: '09987654321',
      role: 'doctor',
      specialization: 'Cardiology',
      licenseNumber: 'MD12345',
      experienceYears: 10,
      schedulePattern: 'MWF'
    };

    const result = UpdateUserDetailsFormSchema.safeParse(validDoctorData);
    expect(result.success).toBe(true);
  });

  it('should require doctor fields when role is doctor', () => {
    const doctorDataWithoutFields = {
      id: '1',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      mobile: '09987654321',
      role: 'doctor'
      // Missing specialization and schedulePattern
    };

    const result = UpdateUserDetailsFormSchema.safeParse(doctorDataWithoutFields);
    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'Specialization and schedule pattern are required for doctor role'
        })
      ])
    );
  });

  it('should reject invalid first name', () => {
    const invalidData = {
      id: '1',
      firstName: '', // Empty first name
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'admin'
    };

    const result = UpdateUserDetailsFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email', // Invalid email format
      role: 'admin'
    };

    const result = UpdateUserDetailsFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid role', () => {
    const invalidData = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'invalid-role' // Invalid role
    };

    const result = UpdateUserDetailsFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should validate optional mobile number', () => {
    const dataWithoutMobile = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'admin'
      // mobile is optional
    };

    const result = UpdateUserDetailsFormSchema.safeParse(dataWithoutMobile);
    expect(result.success).toBe(true);
  });

  it('should reject invalid mobile number format', () => {
    const invalidData = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      mobile: '123456789', // Invalid Philippine mobile format
      role: 'admin'
    };

    const result = UpdateUserDetailsFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept valid Philippine mobile formats', () => {
    const validFormats = ['09123456789', '+639123456789'];
    
    validFormats.forEach(mobile => {
      const data = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        mobile,
        role: 'admin'
      };

      const result = UpdateUserDetailsFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it('should validate experience years range', () => {
    const invalidExperience = {
      id: '1',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'doctor',
      specialization: 'Cardiology',
      schedulePattern: 'MWF',
      experienceYears: 100 // Invalid - too high
    };

    const result = UpdateUserDetailsFormSchema.safeParse(invalidExperience);
    expect(result.success).toBe(false);
  });

  it('should validate schedule pattern format', () => {
    const invalidSchedule = {
      id: '1',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'doctor',
      specialization: 'Cardiology',
      schedulePattern: 'INVALID' // Invalid schedule pattern
    };

    const result = UpdateUserDetailsFormSchema.safeParse(invalidSchedule);
    expect(result.success).toBe(false);
  });

  it('should accept valid schedule patterns', () => {
    const validPatterns = ['MWF', 'TTH', 'mwf', 'tth']; // Should normalize to uppercase
    
    validPatterns.forEach(schedulePattern => {
      const data = {
        id: '1',
        firstName: 'Dr. Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'doctor',
        specialization: 'Cardiology',
        schedulePattern
      };

      const result = UpdateUserDetailsFormSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.schedulePattern).toBe(schedulePattern.toUpperCase());
      }
    });
  });
});

describe('UpdateUserDetailsCommandSchema', () => {
  it('should validate command with partial updates', () => {
    const partialUpdate = {
      id: '1234567890abcdef1234567890abcdef', // Valid UUID format
      firstName: 'John'
      // Only updating first name
    };

    const result = UpdateUserDetailsCommandSchema.safeParse(partialUpdate);
    expect(result.success).toBe(true);
  });

  it('should require at least one field for update', () => {
    const emptyUpdate = {
      id: '1234567890abcdef1234567890abcdef'
      // No fields to update
    };

    const result = UpdateUserDetailsCommandSchema.safeParse(emptyUpdate);
    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'At least one field must be provided for update'
        })
      ])
    );
  });

  it('should validate UUID format for id', () => {
    const invalidId = {
      id: 'invalid-id-format',
      firstName: 'John'
    };

    const result = UpdateUserDetailsCommandSchema.safeParse(invalidId);
    expect(result.success).toBe(false);
  });

  it('should require schedule pattern when updating role to doctor', () => {
    const doctorUpdateWithoutSchedule = {
      id: '1234567890abcdef1234567890abcdef',
      role: 'doctor'
      // Missing schedulePattern
    };

    const result = UpdateUserDetailsCommandSchema.safeParse(doctorUpdateWithoutSchedule);
    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'Schedule pattern is required when updating role to doctor'
        })
      ])
    );
  });
});