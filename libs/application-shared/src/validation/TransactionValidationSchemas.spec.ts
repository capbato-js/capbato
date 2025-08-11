import { 
  AddTransactionFormSchema,
  CreateTransactionCommandSchema,
  TransactionValidationSchemas,
  TRANSACTION_VALIDATION_ERRORS
} from '../TransactionValidationSchemas';

describe('TransactionValidationSchemas', () => {
  describe('AddTransactionFormSchema', () => {
    it('should validate a complete transaction form', () => {
      const validData = {
        patientId: 'd7b20ad40f44478db25fe3ac78a1dd16',
        date: '2025-08-11',
        paymentMethod: 'Cash',
        receivedById: 'current-staff-id',
        items: [
          {
            serviceName: 'Consultation',
            description: 'General checkup',
            quantity: 1,
            unitPrice: 800.0,
          },
          {
            serviceName: 'Lab Tests',
            description: 'Blood work',
            quantity: 2,
            unitPrice: 350.0,
          },
        ],
      };

      const result = AddTransactionFormSchema.safeParse(validData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.items).toHaveLength(2);
        expect(result.data.items[0].serviceName).toBe('Consultation');
        expect(result.data.items[1].quantity).toBe(2);
      }
    });

    it('should reject transaction with missing required fields', () => {
      const invalidData = {
        patientId: '', // Missing patient
        date: '2025-08-11',
        paymentMethod: 'Cash',
        receivedById: 'staff-id',
        items: [],  // No items
      };

      const result = AddTransactionFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message);
        expect(errors).toContain(TRANSACTION_VALIDATION_ERRORS.MISSING_PATIENT);
        expect(errors).toContain(TRANSACTION_VALIDATION_ERRORS.MISSING_ITEMS);
      }
    });

    it('should reject transaction with invalid item data', () => {
      const invalidData = {
        patientId: 'd7b20ad40f44478db25fe3ac78a1dd16',
        date: '2025-08-11',
        paymentMethod: 'Cash',
        receivedById: 'staff-id',
        items: [
          {
            serviceName: '', // Empty service name
            description: 'Test',
            quantity: 0, // Invalid quantity
            unitPrice: -100, // Negative price
          },
        ],
      };

      const result = AddTransactionFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message);
        expect(errors).toContain(TRANSACTION_VALIDATION_ERRORS.INVALID_SERVICE_NAME);
        expect(errors).toContain(TRANSACTION_VALIDATION_ERRORS.QUANTITY_MIN);
        expect(errors).toContain(TRANSACTION_VALIDATION_ERRORS.UNIT_PRICE_MIN);
      }
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const invalidData = {
        patientId: 'd7b20ad40f44478db25fe3ac78a1dd16',
        date: futureDate.toISOString().split('T')[0],
        paymentMethod: 'Cash',
        receivedById: 'staff-id',
        items: [
          {
            serviceName: 'Consultation',
            description: '',
            quantity: 1,
            unitPrice: 800.0,
          },
        ],
      };

      const result = AddTransactionFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message);
        expect(errors).toContain(TRANSACTION_VALIDATION_ERRORS.FUTURE_DATE);
      }
    });
  });

  describe('CreateTransactionCommandSchema', () => {
    it('should validate a backend command with ISO datetime', () => {
      const validCommand = {
        patientId: 'd7b20ad40f44478db25fe3ac78a1dd16',
        date: new Date('2025-08-11').toISOString(),
        paymentMethod: 'Cash',
        receivedById: 'current-staff-id',
        items: [
          {
            serviceName: 'Consultation',
            description: 'General checkup',
            quantity: 1,
            unitPrice: 800.0,
          },
        ],
      };

      const result = CreateTransactionCommandSchema.safeParse(validCommand);
      expect(result.success).toBe(true);
    });

    it('should validate with dashless UUID format', () => {
      const validCommand = {
        patientId: 'd7b20ad40f44478db25fe3ac78a1dd16',
        date: new Date('2025-08-11').toISOString(),
        paymentMethod: 'Cash',
        receivedById: 'currentstaffid123456789012345678',
        items: [
          {
            serviceName: 'Consultation',
            description: '',
            quantity: 1,
            unitPrice: 800.0,
          },
        ],
      };

      const result = CreateTransactionCommandSchema.safeParse(validCommand);
      expect(result.success).toBe(true);
    });
  });

  describe('Transaction type exports', () => {
    it('should export all required schemas', () => {
      expect(TransactionValidationSchemas).toBeDefined();
      expect(TransactionValidationSchemas.AddTransactionFormSchema).toBeDefined();
      expect(TransactionValidationSchemas.CreateTransactionCommandSchema).toBeDefined();
      expect(TransactionValidationSchemas.TransactionIdSchema).toBeDefined();
    });

    it('should export validation error messages', () => {
      expect(TRANSACTION_VALIDATION_ERRORS).toBeDefined();
      expect(TRANSACTION_VALIDATION_ERRORS.MISSING_PATIENT).toBe('Patient selection is required');
      expect(TRANSACTION_VALIDATION_ERRORS.MISSING_ITEMS).toBe('At least one service item is required');
    });
  });
});