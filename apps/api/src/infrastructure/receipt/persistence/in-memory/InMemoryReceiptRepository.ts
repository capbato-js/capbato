import { injectable } from 'tsyringe';
import { Receipt, ReceiptNumber } from '@nx-starter/domain';
import type { IReceiptRepository } from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

/**
 * In-memory implementation of IReceiptRepository
 * Useful for development and testing
 */
@injectable()
export class InMemoryReceiptRepository implements IReceiptRepository {
  private receipts: Map<string, Receipt> = new Map();
  private sequenceNumbers: Map<number, number> = new Map(); // year -> sequence

  async getAll(): Promise<Receipt[]> {
    return Array.from(this.receipts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getById(id: string): Promise<Receipt | null> {
    return this.receipts.get(id) || null;
  }

  async create(receipt: Receipt): Promise<Receipt> {
    const id = generateId();
    
    // Create receipt with generated ID
    const receiptWithId = new Receipt(
      receipt.receiptNumber,
      receipt.date,
      receipt.patientId,
      receipt.paymentMethod,
      receipt.receivedById,
      receipt.items,
      receipt.createdAt,
      receipt.updatedAt,
      id
    );

    this.receipts.set(id, receiptWithId);
    
    // Update sequence number for the year
    const year = receipt.date.getFullYear();
    const currentSequence = this.sequenceNumbers.get(year) || 0;
    this.sequenceNumbers.set(year, currentSequence + 1);

    return receiptWithId;
  }

  async delete(id: string): Promise<void> {
    if (!this.receipts.has(id)) {
      throw new Error(`Receipt with ID ${id} not found`);
    }
    this.receipts.delete(id);
  }

  async getByPatientId(patientId: string): Promise<Receipt[]> {
    return Array.from(this.receipts.values())
      .filter(receipt => receipt.patientId === patientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Receipt[]> {
    return Array.from(this.receipts.values())
      .filter(receipt => receipt.date >= startDate && receipt.date <= endDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getNextSequenceNumber(year: number): Promise<number> {
    const currentSequence = this.sequenceNumbers.get(year) || 0;
    return currentSequence + 1;
  }

  async existsByReceiptNumber(receiptNumber: string): Promise<boolean> {
    return Array.from(this.receipts.values()).some(
      receipt => receipt.receiptNumberValue === receiptNumber
    );
  }
}