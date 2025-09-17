import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatDateLong,
  formatCurrency,
  enhanceTransactionWithSearchFields,
  transformFormDataToTransaction,
} from './transactionFormatUtils';

describe('Transaction Format Utils', () => {
  describe('formatDate', () => {
    it('should format date in Philippines locale (MM/DD/YYYY)', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      // Note: toLocaleDateString behavior can vary by environment
      // Testing the general format pattern rather than exact string
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle different date string formats', () => {
      expect(formatDate('2024-12-25')).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(formatDate('2024-01-01T00:00:00.000Z')).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle edge case dates', () => {
      expect(formatDate('2024-02-29')).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Leap year
      expect(formatDate('2024-12-31')).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // End of year
    });
  });

  describe('formatDateLong', () => {
    it('should format date in long US format', () => {
      const result = formatDateLong('2024-01-15T10:30:00Z');
      // Testing pattern for "Month Day, Year" format
      expect(result).toMatch(/[A-Za-z]+ \d{1,2}, \d{4}/);
    });

    it('should handle different months correctly', () => {
      const january = formatDateLong('2024-01-15');
      const december = formatDateLong('2024-12-25');
      
      expect(january).toMatch(/January \d{1,2}, \d{4}/);
      expect(december).toMatch(/December \d{1,2}, \d{4}/);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with peso symbol and two decimal places', () => {
      expect(formatCurrency(1000)).toBe('₱1,000.00');
      expect(formatCurrency(1500.5)).toBe('₱1,500.50');
      expect(formatCurrency(0)).toBe('₱0.00');
    });

    it('should handle large numbers with proper comma separation', () => {
      expect(formatCurrency(1000000)).toBe('₱1,000,000.00');
      expect(formatCurrency(1234567.89)).toBe('₱1,234,567.89');
    });

    it('should handle small decimal amounts', () => {
      expect(formatCurrency(0.99)).toBe('₱0.99');
      expect(formatCurrency(0.01)).toBe('₱0.01');
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-100)).toBe('₱-100.00');
      expect(formatCurrency(-1500.75)).toBe('₱-1,500.75');
    });

    it('should round to two decimal places', () => {
      expect(formatCurrency(1000.999)).toBe('₱1,001.00');
      expect(formatCurrency(1000.001)).toBe('₱1,000.00');
    });
  });

  describe('enhanceTransactionWithSearchFields', () => {
    it('should add search fields to transaction object', () => {
      const transaction = {
        id: 'trans-1',
        amount: 1500,
        patient: {
          patientNumber: 'P001',
          fullName: 'John Doe',
        },
      };

      const enhanced = enhanceTransactionWithSearchFields(transaction);

      expect(enhanced).toEqual({
        id: 'trans-1',
        amount: 1500,
        patient: {
          patientNumber: 'P001',
          fullName: 'John Doe',
        },
        patientNumber: 'P001',
        patientName: 'John Doe',
      });
    });

    it('should preserve all original properties', () => {
      const transaction = {
        id: 'trans-1',
        amount: 1500,
        date: '2024-01-15',
        paymentMethod: 'Cash',
        patient: {
          patientNumber: 'P001',
          fullName: 'John Doe',
        },
        items: [],
      };

      const enhanced = enhanceTransactionWithSearchFields(transaction);

      expect(enhanced.id).toBe('trans-1');
      expect(enhanced.amount).toBe(1500);
      expect(enhanced.date).toBe('2024-01-15');
      expect(enhanced.paymentMethod).toBe('Cash');
      expect(enhanced.items).toEqual([]);
      expect(enhanced.patient).toEqual(transaction.patient);
    });

    it('should handle empty patient name', () => {
      const transaction = {
        id: 'trans-1',
        patient: {
          patientNumber: 'P001',
          fullName: '',
        },
      };

      const enhanced = enhanceTransactionWithSearchFields(transaction);

      expect(enhanced.patientNumber).toBe('P001');
      expect(enhanced.patientName).toBe('');
    });

    it('should handle special characters in patient data', () => {
      const transaction = {
        id: 'trans-1',
        patient: {
          patientNumber: 'P-001-A',
          fullName: 'José María Dos Santos Jr.',
        },
      };

      const enhanced = enhanceTransactionWithSearchFields(transaction);

      expect(enhanced.patientNumber).toBe('P-001-A');
      expect(enhanced.patientName).toBe('José María Dos Santos Jr.');
    });
  });

  describe('transformFormDataToTransaction', () => {
    it('should transform form data to transaction format', () => {
      const formData = {
        patientId: 'patient-1',
        date: '2024-01-15',
        paymentMethod: 'Cash',
        receivedById: 'user-1',
        items: [
          {
            serviceName: 'Consultation',
            description: 'General checkup',
            quantity: 1,
            unitPrice: 500,
          },
          {
            serviceName: 'Lab Test',
            quantity: 2,
            unitPrice: 750,
          },
        ],
      };

      const result = transformFormDataToTransaction(formData);

      expect(result).toEqual({
        patientId: 'patient-1',
        date: '2024-01-15',
        paymentMethod: 'Cash',
        receivedById: 'user-1',
        items: [
          {
            serviceName: 'Consultation',
            description: 'General checkup',
            quantity: 1,
            unitPrice: 500,
          },
          {
            serviceName: 'Lab Test',
            description: '',
            quantity: 2,
            unitPrice: 750,
          },
        ],
      });
    });

    it('should handle missing description fields', () => {
      const formData = {
        patientId: 'patient-1',
        date: '2024-01-15',
        paymentMethod: 'Cash',
        receivedById: 'user-1',
        items: [
          {
            serviceName: 'Consultation',
            quantity: 1,
            unitPrice: 500,
          },
        ],
      };

      const result = transformFormDataToTransaction(formData);

      expect(result.items[0].description).toBe('');
    });

    it('should handle empty items array', () => {
      const formData = {
        patientId: 'patient-1',
        date: '2024-01-15',
        paymentMethod: 'Cash',
        receivedById: 'user-1',
        items: [],
      };

      const result = transformFormDataToTransaction(formData);

      expect(result.items).toEqual([]);
    });

    it('should preserve all item properties', () => {
      const formData = {
        patientId: 'patient-1',
        date: '2024-01-15',
        paymentMethod: 'Cash',
        receivedById: 'user-1',
        items: [
          {
            serviceName: 'Consultation',
            description: 'Detailed description',
            quantity: 3,
            unitPrice: 1200.50,
            extraField: 'should not be included',
          },
        ],
      };

      const result = transformFormDataToTransaction(formData);

      expect(result.items[0]).toEqual({
        serviceName: 'Consultation',
        description: 'Detailed description',
        quantity: 3,
        unitPrice: 1200.50,
      });
      expect(result.items[0]).not.toHaveProperty('extraField');
    });

    it('should handle numeric values correctly', () => {
      const formData = {
        patientId: 'patient-1',
        date: '2024-01-15',
        paymentMethod: 'Cash',
        receivedById: 'user-1',
        items: [
          {
            serviceName: 'Lab Test',
            quantity: 0,
            unitPrice: 0,
          },
        ],
      };

      const result = transformFormDataToTransaction(formData);

      expect(result.items[0].quantity).toBe(0);
      expect(result.items[0].unitPrice).toBe(0);
    });
  });
});