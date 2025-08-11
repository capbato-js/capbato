import { Receipt, ReceiptItem, ReceiptNumber, PaymentMethod } from '../index';

describe('Receipt Domain Entity', () => {
  describe('Constructor and Basic Properties', () => {
    it('should create a receipt with valid data', () => {
      const items = [
        new ReceiptItem({
          serviceName: 'Consultation',
          description: 'General checkup',
          quantity: 1,
          unitPrice: 800.0,
        }),
      ];

      const receipt = new Receipt(
        'R-2025-001',
        new Date('2025-01-15'),
        'patient-id-123',
        'Cash',
        'user-id-456',
        items
      );

      expect(receipt.receiptNumberValue).toBe('R-2025-001');
      expect(receipt.patientId).toBe('patient-id-123');
      expect(receipt.paymentMethodValue).toBe('Cash');
      expect(receipt.receivedById).toBe('user-id-456');
      expect(receipt.totalAmount).toBe(800.0);
      expect(receipt.items).toHaveLength(1);
    });

    it('should calculate total amount correctly with multiple items', () => {
      const items = [
        new ReceiptItem({
          serviceName: 'Consultation',
          description: 'General checkup',
          quantity: 1,
          unitPrice: 800.0,
        }),
        new ReceiptItem({
          serviceName: 'Lab Tests',
          description: 'Blood work',
          quantity: 2,
          unitPrice: 350.0,
        }),
      ];

      const receipt = new Receipt(
        'R-2025-001',
        new Date('2025-01-15'),
        'patient-id-123',
        'Cash',
        'user-id-456',
        items
      );

      expect(receipt.totalAmount).toBe(1500.0); // 800 + (2 * 350)
    });
  });

  describe('Business Logic', () => {
    it('should generate items summary correctly', () => {
      const items = [
        new ReceiptItem({
          serviceName: 'Consultation',
          description: 'General checkup',
          quantity: 1,
          unitPrice: 800.0,
        }),
        new ReceiptItem({
          serviceName: 'Lab Tests',
          description: 'Blood work',
          quantity: 2,
          unitPrice: 350.0,
        }),
      ];

      const receipt = new Receipt(
        'R-2025-001',
        new Date('2025-01-15'),
        'patient-id-123',
        'Cash',
        'user-id-456',
        items
      );

      expect(receipt.getItemsSummary()).toBe('Consultation, Lab Tests');
    });

    it('should add items correctly', () => {
      const items = [
        new ReceiptItem({
          serviceName: 'Consultation',
          description: 'General checkup',
          quantity: 1,
          unitPrice: 800.0,
        }),
      ];

      const receipt = new Receipt(
        'R-2025-001',
        new Date('2025-01-15'),
        'patient-id-123',
        'Cash',
        'user-id-456',
        items
      );

      const newItem = new ReceiptItem({
        serviceName: 'X-Ray',
        description: 'Chest X-Ray',
        quantity: 1,
        unitPrice: 500.0,
      });

      const updatedReceipt = receipt.addItem(newItem);
      
      expect(updatedReceipt.items).toHaveLength(2);
      expect(updatedReceipt.totalAmount).toBe(1300.0); // 800 + 500
      expect(updatedReceipt.getItemsSummary()).toBe('Consultation, X-Ray');
    });
  });

  describe('Validation', () => {
    it('should throw error for empty patient ID', () => {
      const items = [
        new ReceiptItem({
          serviceName: 'Consultation',
          description: 'General checkup',
          quantity: 1,
          unitPrice: 800.0,
        }),
      ];

      expect(() => {
        new Receipt(
          'R-2025-001',
          new Date('2025-01-15'),
          '', // Empty patient ID
          'Cash',
          'user-id-456',
          items
        );
      }).toThrow('Patient ID cannot be empty');
    });

    it('should throw error for empty items array', () => {
      expect(() => {
        new Receipt(
          'R-2025-001',
          new Date('2025-01-15'),
          'patient-id-123',
          'Cash',
          'user-id-456',
          [] // Empty items
        );
      }).toThrow('Receipt must have at least one item');
    });

    it('should throw error for future date', () => {
      const items = [
        new ReceiptItem({
          serviceName: 'Consultation',
          description: 'General checkup',
          quantity: 1,
          unitPrice: 800.0,
        }),
      ];

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      expect(() => {
        new Receipt(
          'R-2025-001',
          futureDate,
          'patient-id-123',
          'Cash',
          'user-id-456',
          items
        );
      }).toThrow('Receipt date cannot be in the future');
    });
  });
});