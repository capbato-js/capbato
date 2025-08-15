import { describe, it, expect, beforeEach } from 'vitest';
import { LabTestResult } from './LabTestResult';

describe('LabTestResult', () => {
  const mockDate = new Date('2025-08-13T10:30:00.000Z');
  
  describe('creation', () => {
    it('should create a lab test result with blood chemistry results', () => {
      const bloodChemistry = {
        fbs: 5.2,
        cholesterol: 4.1,
        triglycerides: 1.2
      };

      const result = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate,
        bloodChemistry,
        undefined,
        undefined,
        undefined,
        undefined,
        'Test remarks',
        'abc123def456ghi789jkl012mno345pqr'
      );

      expect(result.labRequestId).toBe('d2e66463bb2349209ea2cddf47f7822f');
      expect(result.patientId).toBe('f5768246f4a64410a2a845a4a618f07e');
      expect(result.dateTested).toBe(mockDate);
      expect(result.bloodChemistry).toEqual(bloodChemistry);
      expect(result.urinalysis).toBeUndefined();
      expect(result.remarks).toBe('Test remarks');
      expect(result.id).toBe('abc123def456ghi789jkl012mno345pqr');
    });

    it('should create a lab test result with urinalysis results', () => {
      const urinalysis = {
        color: 'Yellow',
        protein: 'Negative'
      };

      const result = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate,
        undefined,
        urinalysis
      );

      expect(result.urinalysis).toEqual(urinalysis);
      expect(result.bloodChemistry).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate successfully with valid data', () => {
      const result = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate,
        { fbs: 5.2 }
      );

      expect(() => result.validate()).not.toThrow();
    });

    it('should throw error if lab request ID is invalid', () => {
      const result = new LabTestResult(
        'invalid-id',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate,
        { fbs: 5.2 }
      );

      expect(() => result.validate()).toThrow('Lab request ID must be a valid dashless UUID (32 characters)');
    });

    it('should throw error if patient ID is invalid', () => {
      const result = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'invalid-id',
        mockDate,
        { fbs: 5.2 }
      );

      expect(() => result.validate()).toThrow('Patient ID must be a valid dashless UUID (32 characters)');
    });

    it('should throw error if date tested is in the future', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const result = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        futureDate,
        { fbs: 5.2 }
      );

      expect(() => result.validate()).toThrow('Date tested cannot be in the future');
    });

    it('should throw error if no test results are provided', () => {
      const result = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate
      );

      expect(() => result.validate()).toThrow('At least one test result type must be provided');
    });
  });

  describe('business methods', () => {
    it('should correctly identify if has any results', () => {
      const resultWithBloodChem = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate,
        { fbs: 5.2 }
      );

      const resultWithUrinalysis = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate,
        undefined,
        { color: 'Yellow' }
      );

      const resultWithNoResults = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate
      );

      expect(resultWithBloodChem.hasAnyResults()).toBe(true);
      expect(resultWithUrinalysis.hasAnyResults()).toBe(true);
      expect(resultWithNoResults.hasAnyResults()).toBe(false);
    });

    it('should correctly identify specific test types', () => {
      const result = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate,
        { fbs: 5.2 },
        { color: 'Yellow' }
      );

      expect(result.hasBloodChemistryResults()).toBe(true);
      expect(result.hasUrinalysisResults()).toBe(true);
      expect(result.hasHematologyResults()).toBe(false);
      expect(result.hasFecalysisResults()).toBe(false);
      expect(result.hasSerologyResults()).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should create new instance when updating', () => {
      const original = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate,
        { fbs: 5.2 }
      );

      const updated = original.update(
        { fbs: 6.0, cholesterol: 4.5 },
        undefined,
        undefined,
        undefined,
        undefined,
        'Updated remarks'
      );

      expect(updated).not.toBe(original);
      expect(original.bloodChemistry?.fbs).toBe(5.2);
      expect(updated.bloodChemistry?.fbs).toBe(6.0);
      expect(updated.bloodChemistry?.cholesterol).toBe(4.5);
      expect(updated.remarks).toBe('Updated remarks');
    });

    it('should create new instance with ID', () => {
      const original = new LabTestResult(
        'd2e66463bb2349209ea2cddf47f7822f',
        'f5768246f4a64410a2a845a4a618f07e',
        mockDate,
        { fbs: 5.2 }
      );

      const withId = original.withId('abc123def456ghi789jkl012mno345pqr');

      expect(withId).not.toBe(original);
      expect(original.id).toBeUndefined();
      expect(withId.id).toBe('abc123def456ghi789jkl012mno345pqr');
      expect(withId.bloodChemistry).toEqual(original.bloodChemistry);
    });
  });
});