import { injectable, inject } from 'tsyringe';
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
} from 'routing-controllers';
import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  GetAllTransactionsQueryHandler,
  GetTransactionByIdQueryHandler,
  TransactionMapper,
  TOKENS,
  TransactionValidationService,
  TransactionIdSchema,
} from '@nx-starter/application-shared';
import {
  TransactionListResponse,
  TransactionResponse,
  TransactionOperationResponse,
  CreateTransactionRequestDto,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

/**
 * REST API Controller for Transaction operations
 * Follows Clean Architecture - Controllers are part of the presentation layer
 */
@Controller('/transactions')
@injectable()
export class TransactionController {
  constructor(
    @inject(TOKENS.CreateTransactionUseCase)
    private createTransactionUseCase: CreateTransactionUseCase,
    @inject(TOKENS.DeleteTransactionUseCase)
    private deleteTransactionUseCase: DeleteTransactionUseCase,
    @inject(TOKENS.GetAllTransactionsQueryHandler)
    private getAllTransactionsQueryHandler: GetAllTransactionsQueryHandler,
    @inject(TOKENS.GetTransactionByIdQueryHandler)
    private getTransactionByIdQueryHandler: GetTransactionByIdQueryHandler,
    @inject(TOKENS.TransactionValidationService)
    private validationService: TransactionValidationService
  ) {}

  /**
   * GET /api/transactions - Get all transactions
   */
  @Get('/')
  async getAllTransactions(): Promise<TransactionListResponse> {
    const receipts = await this.getAllTransactionsQueryHandler.execute();
    
    // Create transaction DTOs with placeholder patient and user data
    const transactionDtos = receipts.map(receipt => {
      const patientInfo = {
        id: receipt.patientId,
        patientNumber: 'N/A', // Would be fetched from patient service
        firstName: 'N/A',
        lastName: 'N/A', 
        middleName: '',
        fullName: 'Patient Information Unavailable',
      };
      
      const receivedByName = 'Staff Member'; // Would be fetched from user service
      
      return TransactionMapper.toDto(receipt, patientInfo, receivedByName);
    });

    return ApiResponseBuilder.success(transactionDtos);
  }

  /**
   * GET /api/transactions/:id - Get transaction by ID
   */
  @Get('/:id')
  async getTransactionById(@Param('id') id: string): Promise<TransactionResponse> {
    // Validate the ID parameter
    const validatedId = TransactionIdSchema.parse(id);
    const receipt = await this.getTransactionByIdQueryHandler.execute({ id: validatedId });
    
    // Create patient info placeholder
    const patientInfo = {
      id: receipt.patientId,
      patientNumber: 'N/A',
      firstName: 'N/A',
      lastName: 'N/A',
      middleName: '',
      fullName: 'Patient Information Unavailable',
    };
    
    const receivedByName = 'Staff Member';
    const transactionDto = TransactionMapper.toDto(receipt, patientInfo, receivedByName);
    
    return ApiResponseBuilder.success(transactionDto);
  }

  /**
   * POST /api/transactions - Create a new transaction
   */
  @Post('/')
  @HttpCode(201)
  async createTransaction(@Body() body: CreateTransactionRequestDto): Promise<TransactionResponse> {
    const validatedData = this.validationService.validateCreateCommand(body);
    const receipt = await this.createTransactionUseCase.execute(validatedData);
    
    // Create patient info placeholder
    const patientInfo = {
      id: receipt.patientId,
      patientNumber: 'N/A',
      firstName: 'N/A',
      lastName: 'N/A',
      middleName: '',
      fullName: 'Patient Information Unavailable',
    };
    
    const receivedByName = 'Staff Member';
    const transactionDto = TransactionMapper.toDto(receipt, patientInfo, receivedByName);

    return ApiResponseBuilder.success(transactionDto);
  }

  /**
   * DELETE /api/transactions/:id - Delete a transaction
   */
  @Delete('/:id')
  async deleteTransaction(@Param('id') id: string): Promise<TransactionOperationResponse> {
    const validatedData = this.validationService.validateDeleteCommand({ id });

    await this.deleteTransactionUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Transaction deleted successfully');
  }
}