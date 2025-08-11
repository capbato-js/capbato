import { ReceiptNumber } from './ReceiptNumber';

describe('ReceiptNumber Value Object', () => {
  describe('Valid Receipt Numbers', () => {
    it('should create receipt number with valid format', () => {
      const receiptNumber = new ReceiptNumber('R-2025-001');
      expect(receiptNumber.value).toBe('R-2025-001');
    });

    it('should accept receipt numbers with longer sequence numbers', () => {
      const receiptNumber = new ReceiptNumber('R-2025-12345');
      expect(receiptNumber.value).toBe('R-2025-12345');
    });
  });

  describe('Invalid Receipt Numbers', () => {
    it('should throw error for empty string', () => {
      expect(() => new ReceiptNumber('')).toThrow('Receipt number cannot be empty');
    });

    it('should throw error for invalid format - missing prefix', () => {
      expect(() => new ReceiptNumber('2025-001')).toThrow(
        'Receipt number must follow format R-YYYY-NNN (e.g., R-2025-001)'
      );
    });

    it('should throw error for invalid format - wrong prefix', () => {
      expect(() => new ReceiptNumber('X-2025-001')).toThrow(
        'Receipt number must follow format R-YYYY-NNN (e.g., R-2025-001)'
      );
    });

    it('should throw error for invalid format - missing year', () => {
      expect(() => new ReceiptNumber('R-001')).toThrow(
        'Receipt number must follow format R-YYYY-NNN (e.g., R-2025-001)'
      );
    });

    it('should throw error for invalid format - invalid year', () => {
      expect(() => new ReceiptNumber('R-25-001')).toThrow(
        'Receipt number must follow format R-YYYY-NNN (e.g., R-2025-001)'
      );
    });

    it('should throw error for invalid format - missing sequence', () => {
      expect(() => new ReceiptNumber('R-2025-')).toThrow(
        'Receipt number must follow format R-YYYY-NNN (e.g., R-2025-001)'
      );
    });
  });

  describe('Static Generation', () => {
    it('should generate receipt number with correct format', () => {
      const receiptNumber = ReceiptNumber.generate(2025, 1);
      expect(receiptNumber.value).toBe('R-2025-001');
    });

    it('should pad sequence numbers correctly', () => {
      const receiptNumber = ReceiptNumber.generate(2025, 42);
      expect(receiptNumber.value).toBe('R-2025-042');
    });

    it('should handle large sequence numbers', () => {
      const receiptNumber = ReceiptNumber.generate(2025, 12345);
      expect(receiptNumber.value).toBe('R-2025-12345');
    });
  });

  describe('Equality', () => {
    it('should be equal when values are the same', () => {
      const receiptNumber1 = new ReceiptNumber('R-2025-001');
      const receiptNumber2 = new ReceiptNumber('R-2025-001');
      expect(receiptNumber1.equals(receiptNumber2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      const receiptNumber1 = new ReceiptNumber('R-2025-001');
      const receiptNumber2 = new ReceiptNumber('R-2025-002');
      expect(receiptNumber1.equals(receiptNumber2)).toBe(false);
    });
  });
});