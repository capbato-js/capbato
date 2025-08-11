import { injectable, inject } from 'tsyringe';
import { Receipt } from '@nx-starter/domain';
import type { IReceiptRepository } from '@nx-starter/domain';
import type {
  GetAllTransactionsQuery,
  GetTransactionByIdQuery,
} from '../../dto/TransactionQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all transactions (receipts)
 */
@injectable()
export class GetAllTransactionsQueryHandler {
  constructor(
    @inject(TOKENS.ReceiptRepository) private receiptRepository: IReceiptRepository
  ) {}

  async execute(_query?: GetAllTransactionsQuery): Promise<Receipt[]> {
    return await this.receiptRepository.getAll();
  }
}

/**
 * Query handler for getting transaction by ID
 */
@injectable()
export class GetTransactionByIdQueryHandler {
  constructor(
    @inject(TOKENS.ReceiptRepository) private receiptRepository: IReceiptRepository
  ) {}

  async execute(query: GetTransactionByIdQuery): Promise<Receipt> {
    const receipt = await this.receiptRepository.getById(query.id);
    if (!receipt) {
      throw new Error(`Transaction with ID ${query.id} not found`);
    }
    return receipt;
  }
}