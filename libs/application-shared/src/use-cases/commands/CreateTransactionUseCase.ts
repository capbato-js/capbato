import { injectable, inject } from 'tsyringe';
import { Receipt, ReceiptItem, ReceiptNumber, PaymentMethod } from '@nx-starter/domain';
import type { IReceiptRepository } from '@nx-starter/domain';
import type { CreateTransactionCommand } from '../../dto/TransactionCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for creating a new transaction (receipt)
 * Handles all business logic and validation for transaction creation
 */
@injectable()
export class CreateTransactionUseCase {
  constructor(
    @inject(TOKENS.ReceiptRepository) private receiptRepository: IReceiptRepository
  ) {}

  async execute(command: CreateTransactionCommand): Promise<Receipt> {
    // Get next sequence number for receipt number generation
    const date = new Date(command.date);
    const year = date.getFullYear();
    const sequenceNumber = await this.receiptRepository.getNextSequenceNumber(year);
    
    // Generate receipt number
    const receiptNumber = ReceiptNumber.generate(year, sequenceNumber);

    // Validate payment method using value object
    const paymentMethod = new PaymentMethod(command.paymentMethod);

    // Create receipt items with domain validation
    const items = command.items.map(item => 
      new ReceiptItem({
        serviceName: item.serviceName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })
    );

    // Create receipt entity with domain logic
    const receipt = new Receipt(
      receiptNumber,
      date,
      command.patientId,
      paymentMethod,
      command.receivedById,
      items
    );

    // Domain validation is handled in the Receipt constructor
    // Persist using repository
    const savedReceipt = await this.receiptRepository.create(receipt);

    return savedReceipt;
  }
}