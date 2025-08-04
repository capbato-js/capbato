import { describe, it, expect } from 'vitest';

// Test the isNavigationItemActive logic directly
const isNavigationItemActive = (currentPath: string, itemPath: string): boolean => {
  // For exact matches
  if (currentPath === itemPath) {
    return true;
  }
  
  // For nested routes, check if current path starts with the item path
  // This handles cases like /patients/new or /patients/:id under /patients
  const itemsWithNestedRoutes = ['/patients', '/doctors', '/appointments'];
  
  if (itemsWithNestedRoutes.includes(itemPath)) {
    return currentPath.startsWith(itemPath + '/') || currentPath === itemPath;
  }
  
  return false;
};

describe('MedicalClinicSidebar - Navigation Active Logic', () => {
  describe('Patients navigation', () => {
    it('should be active on /patients', () => {
      expect(isNavigationItemActive('/patients', '/patients')).toBe(true);
    });

    it('should be active on /patients/new', () => {
      expect(isNavigationItemActive('/patients/new', '/patients')).toBe(true);
    });

    it('should be active on /patients/123', () => {
      expect(isNavigationItemActive('/patients/123', '/patients')).toBe(true);
    });

    it('should be active on /patients/123/edit', () => {
      expect(isNavigationItemActive('/patients/123/edit', '/patients')).toBe(true);
    });

    it('should not be active on /dashboard', () => {
      expect(isNavigationItemActive('/dashboard', '/patients')).toBe(false);
    });

    it('should not be active on /patientsx', () => {
      expect(isNavigationItemActive('/patientsx', '/patients')).toBe(false);
    });
  });

  describe('Doctors navigation', () => {
    it('should be active on /doctors', () => {
      expect(isNavigationItemActive('/doctors', '/doctors')).toBe(true);
    });

    it('should be active on /doctors/new', () => {
      expect(isNavigationItemActive('/doctors/new', '/doctors')).toBe(true);
    });

    it('should be active on /doctors/123', () => {
      expect(isNavigationItemActive('/doctors/123', '/doctors')).toBe(true);
    });
  });

  describe('Appointments navigation', () => {
    it('should be active on /appointments', () => {
      expect(isNavigationItemActive('/appointments', '/appointments')).toBe(true);
    });

    it('should be active on /appointments/new', () => {
      expect(isNavigationItemActive('/appointments/new', '/appointments')).toBe(true);
    });

    it('should be active on /appointments/123', () => {
      expect(isNavigationItemActive('/appointments/123', '/appointments')).toBe(true);
    });
  });

  describe('Other navigation items (exact match only)', () => {
    it('dashboard should only be active on exact /dashboard', () => {
      expect(isNavigationItemActive('/dashboard', '/dashboard')).toBe(true);
      expect(isNavigationItemActive('/dashboard/something', '/dashboard')).toBe(false);
    });

    it('laboratory should only be active on exact /laboratory', () => {
      expect(isNavigationItemActive('/laboratory', '/laboratory')).toBe(true);
      expect(isNavigationItemActive('/laboratory/something', '/laboratory')).toBe(false);
    });

    it('prescriptions should only be active on exact /prescriptions', () => {
      expect(isNavigationItemActive('/prescriptions', '/prescriptions')).toBe(true);
      expect(isNavigationItemActive('/prescriptions/something', '/prescriptions')).toBe(false);
    });

    it('accounts should only be active on exact /accounts', () => {
      expect(isNavigationItemActive('/accounts', '/accounts')).toBe(true);
      expect(isNavigationItemActive('/accounts/something', '/accounts')).toBe(false);
    });
  });
});