import { Receipt } from '../entities/Receipt';

export interface IReceiptRepository {
  /**
   * Get all receipts
   */
  getAll(): Promise<Receipt[]>;

  /**
   * Get receipt by ID
   */
  getById(id: string): Promise<Receipt | null>;

  /**
   * Create a new receipt
   */
  create(receipt: Receipt): Promise<Receipt>;

  /**
   * Delete a receipt by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Get receipts by patient ID
   */
  getByPatientId(patientId: string): Promise<Receipt[]>;

  /**
   * Get receipts by date range
   */
  getByDateRange(startDate: Date, endDate: Date): Promise<Receipt[]>;

  /**
   * Get the next sequence number for receipt number generation
   */
  getNextSequenceNumber(year: number): Promise<number>;

  /**
   * Check if receipt number exists
   */
  existsByReceiptNumber(receiptNumber: string): Promise<boolean>;

  /**
   * Create a receipt with atomically generated sequence number
   * This method handles sequence number generation and receipt creation in a single transaction
   */
  createWithAtomicSequence(
    date: Date,
    patientId: string,
    paymentMethod: string,
    receivedById: string,
    items: Array<{
      serviceName: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>
  ): Promise<Receipt>;
}