import { CreateTransactionUseCase } from './CreateTransactionUseCase';
import { Receipt, ReceiptItem, ReceiptNumber, PaymentMethod, IReceiptRepository } from '@nx-starter/domain';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let mockReceiptRepository: IReceiptRepository;

  beforeEach(() => {
    mockReceiptRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      getByPatientId: vi.fn(),
      getByDateRange: vi.fn(),
      getNextSequenceNumber: vi.fn(),
      existsByReceiptNumber: vi.fn(),
    };

    useCase = new CreateTransactionUseCase(mockReceiptRepository);
  });

  describe('execute', () => {
    it('should create a transaction successfully', async () => {
      // Arrange
      const command = {
        patientId: 'patient-id-123',
        date: '2025-01-15T00:00:00.000Z',
        paymentMethod: 'Cash' as const,
        receivedById: 'user-id-456',
        items: [
          {
            serviceName: 'Consultation',
            description: 'General checkup',
            quantity: 1,
            unitPrice: 800.0,
          },
        ],
      };

      const mockCreatedReceipt = new Receipt(
        'R-2025-001',
        new Date('2025-01-15'),
        'patient-id-123',
        'Cash',
        'user-id-456',
        [
          new ReceiptItem({
            serviceName: 'Consultation',
            description: 'General checkup',
            quantity: 1,
            unitPrice: 800.0,
          }),
        ],
        new Date(),
        new Date(),
        '1'
      );

      vi.mocked(mockReceiptRepository.getNextSequenceNumber).mockResolvedValue(1);
      vi.mocked(mockReceiptRepository.create).mockResolvedValue(mockCreatedReceipt);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockReceiptRepository.getNextSequenceNumber).toHaveBeenCalledWith(2025);
      expect(mockReceiptRepository.create).toHaveBeenCalled();
      expect(result.receiptNumberValue).toBe('R-2025-001');
      expect(result.patientId).toBe('patient-id-123');
      expect(result.totalAmount).toBe(800.0);
    });

    it('should generate correct receipt number with sequence', async () => {
      // Arrange
      const command = {
        patientId: 'patient-id-123',
        date: '2025-01-15T00:00:00.000Z',
        paymentMethod: 'Cash' as const,
        receivedById: 'user-id-456',
        items: [
          {
            serviceName: 'Consultation',
            description: 'General checkup',
            quantity: 1,
            unitPrice: 800.0,
          },
        ],
      };

      const mockCreatedReceipt = new Receipt(
        'R-2025-042',
        new Date('2025-01-15'),
        'patient-id-123',
        'Cash',
        'user-id-456',
        [
          new ReceiptItem({
            serviceName: 'Consultation',
            description: 'General checkup',
            quantity: 1,
            unitPrice: 800.0,
          }),
        ]
      );

      vi.mocked(mockReceiptRepository.getNextSequenceNumber).mockResolvedValue(42);
      vi.mocked(mockReceiptRepository.create).mockResolvedValue(mockCreatedReceipt);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(mockReceiptRepository.getNextSequenceNumber).toHaveBeenCalledWith(2025);
      expect(result.receiptNumberValue).toBe('R-2025-042');
    });

    it('should calculate total amount correctly with multiple items', async () => {
      // Arrange
      const command = {
        patientId: 'patient-id-123',
        date: '2025-01-15T00:00:00.000Z',
        paymentMethod: 'Cash' as const,
        receivedById: 'user-id-456',
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

      const mockCreatedReceipt = new Receipt(
        'R-2025-001',
        new Date('2025-01-15'),
        'patient-id-123',
        'Cash',
        'user-id-456',
        [
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
        ]
      );

      vi.mocked(mockReceiptRepository.getNextSequenceNumber).mockResolvedValue(1);
      vi.mocked(mockReceiptRepository.create).mockResolvedValue(mockCreatedReceipt);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.totalAmount).toBe(1500.0); // 800 + (2 * 350)
    });

    it('should validate payment method', async () => {
      // Arrange
      const command = {
        patientId: 'patient-id-123',
        date: '2025-01-15T00:00:00.000Z',
        paymentMethod: 'InvalidMethod' as any,
        receivedById: 'user-id-456',
        items: [
          {
            serviceName: 'Consultation',
            description: 'General checkup',
            quantity: 1,
            unitPrice: 800.0,
          },
        ],
      };

      vi.mocked(mockReceiptRepository.getNextSequenceNumber).mockResolvedValue(1);

      // Act & Assert
      await expect(useCase.execute(command)).rejects.toThrow();
    });
  });
});