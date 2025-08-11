import { injectable, inject } from 'tsyringe';
import type { IReceiptRepository } from '@nx-starter/domain';
import type { DeleteTransactionCommand } from '../../dto/TransactionCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for deleting a transaction (receipt)
 * Handles all business logic for transaction deletion
 */
@injectable()
export class DeleteTransactionUseCase {
  constructor(
    @inject(TOKENS.ReceiptRepository) private receiptRepository: IReceiptRepository
  ) {}

  async execute(command: DeleteTransactionCommand): Promise<void> {
    // Check if receipt exists before attempting to delete
    const existingReceipt = await this.receiptRepository.getById(command.id);
    
    if (!existingReceipt) {
      throw new Error(`Transaction with ID ${command.id} not found`);
    }

    // Delete the receipt
    await this.receiptRepository.delete(command.id);
  }
}