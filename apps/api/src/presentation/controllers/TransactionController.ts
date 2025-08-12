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
  IPatientRepository,
} from '@nx-starter/application-shared';
import type { IUserRepository } from '@nx-starter/domain';
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
    private validationService: TransactionValidationService,
    @inject(TOKENS.PatientRepository)
    private patientRepository: IPatientRepository,
    @inject(TOKENS.UserRepository)
    private userRepository: IUserRepository
  ) {}

  /**
   * GET /api/transactions - Get all transactions
   */
  @Get('/')
  async getAllTransactions(): Promise<TransactionListResponse> {
    const receipts = await this.getAllTransactionsQueryHandler.execute();
    
    // Create transaction DTOs with real patient and user data
    const transactionDtos = await Promise.all(receipts.map(async (receipt) => {
      // Fetch actual patient information
      const patient = await this.patientRepository.getById(receipt.patientId);
      const patientInfo = patient ? {
        id: patient.id,
        patientNumber: patient.patientNumber || 'N/A',
        firstName: patient.firstName,
        lastName: patient.lastName,
        middleName: patient.middleName || '',
        fullName: patient.fullName,
        address: patient.address || 'N/A',
        contactNumber: patient.contactNumber || 'N/A',
        email: undefined, // Email not available in current patient entity
      } : {
        id: receipt.patientId,
        patientNumber: 'N/A',
        firstName: 'N/A',
        lastName: 'N/A',
        middleName: '',
        fullName: 'Patient Information Unavailable',
        address: 'N/A',
        contactNumber: 'N/A',
        email: undefined,
      };
      
      // Fetch actual user information for receivedBy
      const user = await this.userRepository.getById(receipt.receivedById);
      const receivedByName = user ? user.fullName : 'Staff Member';
      
      return TransactionMapper.toDto(receipt, patientInfo, receivedByName);
    }));

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
    
    // Fetch actual patient information
    const patient = await this.patientRepository.getById(receipt.patientId);
    const patientInfo = patient ? {
      id: patient.id,
      patientNumber: patient.patientNumber || 'N/A',
      firstName: patient.firstName,
      lastName: patient.lastName,
      middleName: patient.middleName || '',
      fullName: patient.fullName,
      address: patient.address || 'N/A',
      contactNumber: patient.contactNumber || 'N/A',
      email: undefined, // Email not available in current patient entity
    } : {
      id: receipt.patientId,
      patientNumber: 'N/A',
      firstName: 'N/A',
      lastName: 'N/A',
      middleName: '',
      fullName: 'Patient Information Unavailable',
      address: 'N/A',
      contactNumber: 'N/A',
      email: undefined,
    };
    
    // Fetch actual user information for receivedBy
    const user = await this.userRepository.getById(receipt.receivedById);
    const receivedByName = user ? user.fullName : 'Staff Member';
    
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
    
    // Fetch actual patient information
    const patient = await this.patientRepository.getById(receipt.patientId);
    const patientInfo = patient ? {
      id: patient.id,
      patientNumber: patient.patientNumber || 'N/A',
      firstName: patient.firstName,
      lastName: patient.lastName,
      middleName: patient.middleName || '',
      fullName: patient.fullName,
      address: patient.address || 'N/A',
      contactNumber: patient.contactNumber || 'N/A',
      email: undefined, // Email not available in current patient entity
    } : {
      id: receipt.patientId,
      patientNumber: 'N/A',
      firstName: 'N/A',
      lastName: 'N/A',
      middleName: '',
      fullName: 'Patient Information Unavailable',
      address: 'N/A',
      contactNumber: 'N/A',
      email: undefined,
    };
    
    // Fetch actual user information for receivedBy
    const user = await this.userRepository.getById(receipt.receivedById);
    const receivedByName = user ? user.fullName : 'Staff Member';
    
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