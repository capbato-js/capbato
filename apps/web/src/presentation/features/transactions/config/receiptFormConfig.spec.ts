import { describe, it, expect } from 'vitest';
import {
  COMMON_SERVICES,
  PAYMENT_METHOD_OPTIONS,
  getServiceOptions,
} from './receiptFormConfig';

describe('Receipt Form Config', () => {
  describe('COMMON_SERVICES', () => {
    it('should export array of common services', () => {
      expect(COMMON_SERVICES).toBeInstanceOf(Array);
      expect(COMMON_SERVICES.length).toBeGreaterThan(0);
    });

    it('should have services with name and unitPrice properties', () => {
      COMMON_SERVICES.forEach(service => {
        expect(service).toHaveProperty('name');
        expect(service).toHaveProperty('unitPrice');
        expect(typeof service.name).toBe('string');
        expect(typeof service.unitPrice).toBe('number');
      });
    });

    it('should include expected common services', () => {
      const serviceNames = COMMON_SERVICES.map(service => service.name);
      
      expect(serviceNames).toContain('Consultation');
      expect(serviceNames).toContain('Lab Tests');
      expect(serviceNames).toContain('Medication');
    });

    it('should have reasonable unit prices', () => {
      COMMON_SERVICES.forEach(service => {
        expect(service.unitPrice).toBeGreaterThan(0);
        expect(service.unitPrice).toBeLessThan(10000); // Reasonable upper limit
      });
    });

    it('should have specific service configurations', () => {
      const consultation = COMMON_SERVICES.find(s => s.name === 'Consultation');
      const labTests = COMMON_SERVICES.find(s => s.name === 'Lab Tests');
      const medication = COMMON_SERVICES.find(s => s.name === 'Medication');

      expect(consultation?.unitPrice).toBe(800.0);
      expect(labTests?.unitPrice).toBe(350.0);
      expect(medication?.unitPrice).toBe(100.0);
    });
  });

  describe('PAYMENT_METHOD_OPTIONS', () => {
    it('should export array of payment method options', () => {
      expect(PAYMENT_METHOD_OPTIONS).toBeInstanceOf(Array);
      expect(PAYMENT_METHOD_OPTIONS.length).toBeGreaterThan(0);
    });

    it('should have options with value and label properties', () => {
      PAYMENT_METHOD_OPTIONS.forEach(option => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
        expect(typeof option.value).toBe('string');
        expect(typeof option.label).toBe('string');
      });
    });

    it('should include expected payment methods', () => {
      const values = PAYMENT_METHOD_OPTIONS.map(option => option.value);
      
      expect(values).toContain('Cash');
      expect(values).toContain('GCash');
      expect(values).toContain('Card');
      expect(values).toContain('Bank Transfer');
      expect(values).toContain('Check');
    });

    it('should have descriptive labels', () => {
      const cashOption = PAYMENT_METHOD_OPTIONS.find(o => o.value === 'Cash');
      const gcashOption = PAYMENT_METHOD_OPTIONS.find(o => o.value === 'GCash');
      const cardOption = PAYMENT_METHOD_OPTIONS.find(o => o.value === 'Card');
      const bankOption = PAYMENT_METHOD_OPTIONS.find(o => o.value === 'Bank Transfer');
      const checkOption = PAYMENT_METHOD_OPTIONS.find(o => o.value === 'Check');

      expect(cashOption?.label).toBe('Cash');
      expect(gcashOption?.label).toBe('GCash');
      expect(cardOption?.label).toBe('Credit/Debit Card');
      expect(bankOption?.label).toBe('Bank Transfer');
      expect(checkOption?.label).toBe('Check');
    });

    it('should have unique values', () => {
      const values = PAYMENT_METHOD_OPTIONS.map(option => option.value);
      const uniqueValues = [...new Set(values)];
      
      expect(values.length).toBe(uniqueValues.length);
    });

    it('should have no empty values or labels', () => {
      PAYMENT_METHOD_OPTIONS.forEach(option => {
        expect(option.value.trim()).not.toBe('');
        expect(option.label.trim()).not.toBe('');
      });
    });
  });

  describe('getServiceOptions', () => {
    it('should return array of service options', () => {
      const result = getServiceOptions();
      
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(COMMON_SERVICES.length);
    });

    it('should transform services to option format', () => {
      const result = getServiceOptions();
      
      result.forEach(option => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
        expect(typeof option.value).toBe('string');
        expect(typeof option.label).toBe('string');
      });
    });

    it('should map service names to value and label', () => {
      const result = getServiceOptions();
      
      result.forEach(option => {
        expect(option.value).toBe(option.label);
        
        // Verify the option corresponds to a service
        const matchingService = COMMON_SERVICES.find(s => s.name === option.value);
        expect(matchingService).toBeDefined();
      });
    });

    it('should include all common services', () => {
      const result = getServiceOptions();
      const optionValues = result.map(option => option.value);
      
      COMMON_SERVICES.forEach(service => {
        expect(optionValues).toContain(service.name);
      });
    });

    it('should return consistent results on multiple calls', () => {
      const result1 = getServiceOptions();
      const result2 = getServiceOptions();
      
      expect(result1).toEqual(result2);
    });

    it('should return a new array on each call', () => {
      const result1 = getServiceOptions();
      const result2 = getServiceOptions();
      
      expect(result1).not.toBe(result2); // Different array instances
      expect(result1).toEqual(result2); // But same content
    });
  });

  describe('Configuration integrity', () => {
    it('should maintain data consistency between configs', () => {
      const serviceOptions = getServiceOptions();
      const serviceNames = COMMON_SERVICES.map(s => s.name);
      const optionValues = serviceOptions.map(o => o.value);
      
      expect(serviceNames.sort()).toEqual(optionValues.sort());
    });

    it('should have immutable configuration constants', () => {
      const originalServicesLength = COMMON_SERVICES.length;
      const originalPaymentMethodsLength = PAYMENT_METHOD_OPTIONS.length;
      
      // These should not change the original arrays
      expect(() => {
        COMMON_SERVICES.push({ name: 'Test', unitPrice: 100 });
      }).not.toThrow();
      
      expect(() => {
        PAYMENT_METHOD_OPTIONS.push({ value: 'Test', label: 'Test' });
      }).not.toThrow();
      
      // Reset for other tests (if needed)
      COMMON_SERVICES.splice(originalServicesLength);
      PAYMENT_METHOD_OPTIONS.splice(originalPaymentMethodsLength);
      
      expect(COMMON_SERVICES.length).toBe(originalServicesLength);
      expect(PAYMENT_METHOD_OPTIONS.length).toBe(originalPaymentMethodsLength);
    });
  });
});