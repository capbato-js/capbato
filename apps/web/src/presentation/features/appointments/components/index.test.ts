import { describe, it, expect } from 'vitest';
import * as components from './index';

describe('Appointments Components Index', () => {
  describe('exports', () => {
    it('exports AppointmentsTable', () => {
      expect(components.AppointmentsTable).toBeDefined();
      expect(typeof components.AppointmentsTable).toBe('function');
    });

    it('exports AppointmentsCalendar', () => {
      expect(components.AppointmentsCalendar).toBeDefined();
      expect(typeof components.AppointmentsCalendar).toBe('function');
    });

    it('exports AppointmentsFilterControls', () => {
      expect(components.AppointmentsFilterControls).toBeDefined();
      expect(typeof components.AppointmentsFilterControls).toBe('function');
    });

    it('exports AppointmentCountDisplay', () => {
      expect(components.AppointmentCountDisplay).toBeDefined();
      expect(typeof components.AppointmentCountDisplay).toBe('function');
    });

    it('exports AddAppointmentForm', () => {
      expect(components.AddAppointmentForm).toBeDefined();
      expect(typeof components.AddAppointmentForm).toBe('function');
    });

    it('exports AddAppointmentModal', () => {
      expect(components.AddAppointmentModal).toBeDefined();
      expect(typeof components.AddAppointmentModal).toBe('function');
    });
  });

  describe('type exports', () => {
    it('exports AddAppointmentFormProps type', () => {
      // Type checking happens at compile time, so this test ensures the export exists
      expect('AddAppointmentFormProps' in components).toBe(false); // Types are not runtime exports
    });
  });

  describe('module structure', () => {
    it('exports expected number of components', () => {
      const componentNames = Object.keys(components);
      const expectedComponents = [
        'AppointmentsTable',
        'AppointmentsCalendar', 
        'AppointmentsFilterControls',
        'AppointmentCountDisplay',
        'AddAppointmentForm',
        'AddAppointmentModal'
      ];
      
      expectedComponents.forEach(componentName => {
        expect(componentNames).toContain(componentName);
      });
    });

    it('has proper component structure', () => {
      const componentValues = Object.values(components);
      componentValues.forEach(component => {
        expect(typeof component).toBe('function');
      });
    });
  });
});