import { injectable } from 'tsyringe';
import { ValidationService } from './ValidationService';
import {
  CreateTransactionCommandSchema,
  DeleteTransactionCommandSchema,
  GetTransactionByIdQuerySchema,
  GetAllTransactionsQuerySchema,
  CreateTransactionCommand,
  DeleteTransactionCommand,
  GetTransactionByIdQuery,
  GetAllTransactionsQuery,
} from './TransactionValidationSchemas';

/**
 * Validation service for CreateTransactionCommand
 * Encapsulates validation logic for creating new transactions
 */
@injectable()
export class CreateTransactionValidationService extends ValidationService<unknown, CreateTransactionCommand> {
  protected schema = CreateTransactionCommandSchema;
}

/**
 * Validation service for DeleteTransactionCommand
 * Encapsulates validation logic for deleting transactions
 */
@injectable()
export class DeleteTransactionValidationService extends ValidationService<unknown, DeleteTransactionCommand> {
  protected schema = DeleteTransactionCommandSchema;
}

/**
 * Validation service for GetTransactionByIdQuery
 * Encapsulates validation logic for getting a transaction by ID
 */
@injectable()
export class GetTransactionByIdValidationService extends ValidationService<unknown, GetTransactionByIdQuery> {
  protected schema = GetTransactionByIdQuerySchema;
}

/**
 * Validation service for GetAllTransactionsQuery
 * Encapsulates validation logic for getting all transactions
 */
@injectable()
export class GetAllTransactionsValidationService extends ValidationService<unknown, GetAllTransactionsQuery> {
  protected schema = GetAllTransactionsQuerySchema;
}

/**
 * Main validation service that aggregates all transaction validation operations
 * Follows the same pattern as TodoValidationService
 */
@injectable()
export class TransactionValidationService {
  constructor(
    private createValidator: CreateTransactionValidationService,
    private deleteValidator: DeleteTransactionValidationService,
    private getByIdValidator: GetTransactionByIdValidationService,
    private getAllValidator: GetAllTransactionsValidationService
  ) {}

  validateCreateCommand(data: unknown): CreateTransactionCommand {
    return this.createValidator.validate(data);
  }

  validateDeleteCommand(data: unknown): DeleteTransactionCommand {
    return this.deleteValidator.validate(data);
  }

  validateGetByIdQuery(data: unknown): GetTransactionByIdQuery {
    return this.getByIdValidator.validate(data);
  }

  validateGetAllQuery(data: unknown): GetAllTransactionsQuery {
    return this.getAllValidator.validate(data);
  }
}