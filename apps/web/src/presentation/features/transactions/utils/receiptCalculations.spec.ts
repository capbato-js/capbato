import { describe, it, expect } from 'vitest';
import { calculateSubtotal, calculateTotal, isFormValid } from './receiptCalculations';

describe('Receipt Calculations', () => {
  describe('calculateSubtotal', () => {
    it('should calculate subtotal correctly for positive numbers', () => {
      expect(calculateSubtotal(2, 100)).toBe(200);
      expect(calculateSubtotal(1, 500)).toBe(500);
      expect(calculateSubtotal(3, 250.50)).toBe(751.5);
    });

    it('should handle zero quantity', () => {
      expect(calculateSubtotal(0, 100)).toBe(0);
    });

    it('should handle zero unit price', () => {
      expect(calculateSubtotal(2, 0)).toBe(0);
    });

    it('should handle both zero quantity and price', () => {
      expect(calculateSubtotal(0, 0)).toBe(0);
    });

    it('should handle decimal values correctly', () => {
      expect(calculateSubtotal(2.5, 100.25)).toBe(250.625);
      expect(calculateSubtotal(1.2, 50.75)).toBe(60.9);
    });

    it('should handle negative values', () => {
      // While not typical in business logic, testing mathematical behavior
      expect(calculateSubtotal(-2, 100)).toBe(-200);
      expect(calculateSubtotal(2, -100)).toBe(-200);
      expect(calculateSubtotal(-2, -100)).toBe(200);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total for multiple items', () => {
      const items = [
        { quantity: 2, unitPrice: 100 },
        { quantity: 1, unitPrice: 500 },
        { quantity: 3, unitPrice: 50 },
      ];
      
      expect(calculateTotal(items)).toBe(850); // 200 + 500 + 150
    });

    it('should handle empty items array', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('should handle items with missing quantity', () => {
      const items = [
        { unitPrice: 100 }, // quantity undefined
        { quantity: 2, unitPrice: 200 },
      ];
      
      expect(calculateTotal(items)).toBe(400); // 0 + 400
    });

    it('should handle items with missing unit price', () => {
      const items = [
        { quantity: 2 }, // unitPrice undefined
        { quantity: 2, unitPrice: 200 },
      ];
      
      expect(calculateTotal(items)).toBe(400); // 0 + 400
    });

    it('should handle items with both missing values', () => {
      const items = [
        {}, // both undefined
        { quantity: 2, unitPrice: 200 },
      ];
      
      expect(calculateTotal(items)).toBe(400); // 0 + 400
    });

    it('should handle items with zero values', () => {
      const items = [
        { quantity: 0, unitPrice: 100 },
        { quantity: 2, unitPrice: 0 },
        { quantity: 3, unitPrice: 150 },
      ];
      
      expect(calculateTotal(items)).toBe(450); // 0 + 0 + 450
    });

    it('should handle decimal values in total calculation', () => {
      const items = [
        { quantity: 1.5, unitPrice: 100.25 },
        { quantity: 2, unitPrice: 75.5 },
      ];
      
      expect(calculateTotal(items)).toBe(301.375); // 150.375 + 151
    });

    it('should handle large numbers', () => {
      const items = [
        { quantity: 1000, unitPrice: 999.99 },
        { quantity: 500, unitPrice: 1500.50 },
      ];
      
      expect(calculateTotal(items)).toBe(1750240); // 999990 + 750250
    });
  });

  describe('isFormValid', () => {
    it('should return true for valid form data', () => {
      const items = [
        { serviceName: 'Consultation', quantity: 1, unitPrice: 500 },
      ];
      
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', items)).toBe(true);
    });

    it('should return false when patientId is empty', () => {
      const items = [
        { serviceName: 'Consultation', quantity: 1, unitPrice: 500 },
      ];
      
      expect(isFormValid('', '2024-01-15', 'Cash', items)).toBe(false);
    });

    it('should return false when date is empty', () => {
      const items = [
        { serviceName: 'Consultation', quantity: 1, unitPrice: 500 },
      ];
      
      expect(isFormValid('patient-1', '', 'Cash', items)).toBe(false);
    });

    it('should return false when paymentMethod is empty', () => {
      const items = [
        { serviceName: 'Consultation', quantity: 1, unitPrice: 500 },
      ];
      
      expect(isFormValid('patient-1', '2024-01-15', '', items)).toBe(false);
    });

    it('should return false when no valid items exist', () => {
      const items = [
        { serviceName: '', quantity: 1, unitPrice: 500 }, // empty service name
        { serviceName: 'Consultation', quantity: 0, unitPrice: 500 }, // zero quantity
        { serviceName: 'Lab Test', quantity: 1, unitPrice: 0 }, // zero price
      ];
      
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', items)).toBe(false);
    });

    it('should return false when items array is empty', () => {
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', [])).toBe(false);
    });

    it('should return true when at least one item is valid', () => {
      const items = [
        { serviceName: '', quantity: 1, unitPrice: 500 }, // invalid
        { serviceName: 'Consultation', quantity: 1, unitPrice: 500 }, // valid
        { serviceName: 'Lab Test', quantity: 0, unitPrice: 100 }, // invalid
      ];
      
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', items)).toBe(true);
    });

    it('should handle service name with only whitespace', () => {
      const items = [
        { serviceName: '   ', quantity: 1, unitPrice: 500 }, // whitespace only
      ];
      
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', items)).toBe(false);
    });

    it('should handle missing service name', () => {
      const items = [
        { quantity: 1, unitPrice: 500 }, // serviceName undefined
      ];
      
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', items)).toBe(false);
    });

    it('should handle missing quantity', () => {
      const items = [
        { serviceName: 'Consultation', unitPrice: 500 }, // quantity undefined (defaults to 0)
      ];
      
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', items)).toBe(false);
    });

    it('should handle missing unit price', () => {
      const items = [
        { serviceName: 'Consultation', quantity: 1 }, // unitPrice undefined (defaults to 0)
      ];
      
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', items)).toBe(false);
    });

    it('should validate quantity and unit price are positive', () => {
      // Testing that negative quantities are invalid
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', [
        { serviceName: 'Consultation', quantity: -1, unitPrice: 500 } // negative quantity
      ])).toBe(false); // -1 fails the > 0 check
      
      // Testing that negative prices are invalid
      expect(isFormValid('patient-1', '2024-01-15', 'Cash', [
        { serviceName: 'Consultation', quantity: 1, unitPrice: -500 } // negative price
      ])).toBe(false); // -500 fails the > 0 check
    });
  });
});