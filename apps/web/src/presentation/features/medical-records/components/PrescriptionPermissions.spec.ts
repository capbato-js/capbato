import { describe, it, expect } from 'vitest';
import { canCreatePrescriptions } from '../../../../infrastructure/auth/rbac';

describe('Prescription Permissions', () => {
  describe('canCreatePrescriptions', () => {
    it('should allow admin to create prescriptions', () => {
      expect(canCreatePrescriptions('admin')).toBe(true);
    });

    it('should allow doctor to create prescriptions', () => {
      expect(canCreatePrescriptions('doctor')).toBe(true);
    });

    it('should not allow receptionist to create prescriptions', () => {
      expect(canCreatePrescriptions('receptionist')).toBe(false);
    });

    it('should not allow empty role to create prescriptions', () => {
      expect(canCreatePrescriptions('')).toBe(false);
    });

    it('should not allow undefined role to create prescriptions', () => {
      expect(canCreatePrescriptions(undefined as unknown as string)).toBe(false);
    });

    it('should not allow invalid role to create prescriptions', () => {
      expect(canCreatePrescriptions('invalid-role')).toBe(false);
    });
  });
});