import { injectable, inject } from 'tsyringe';
import { Receipt, PaymentMethod } from '@nx-starter/domain';
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
    const date = new Date(command.date);

    // Validate payment method using value object
    const paymentMethod = new PaymentMethod(command.paymentMethod);

    // Use atomic creation - all repositories must support this now
    console.log('✅ Using atomic sequence creation');
    const items = command.items.map(item => ({
      serviceName: item.serviceName,
      description: item.description || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    return await this.receiptRepository.createWithAtomicSequence(
      date,
      command.patientId,
      paymentMethod.value,
      command.receivedById,
      items
    );
  }
}