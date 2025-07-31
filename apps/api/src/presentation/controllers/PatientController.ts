import { injectable, inject } from 'tsyringe';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
} from 'routing-controllers';
import {
  CreatePatientUseCase,
  GetAllPatientsQueryHandler,
  GetPatientByIdQueryHandler,
  GetPatientStatsQueryHandler,
  PatientMapper,
  TOKENS,
  PatientValidationService,
  PatientIdSchema,
  isPatientDomainError,
  getHttpStatusForPatientError,
} from '@nx-starter/application-shared';
import {
  PatientResponse,
  PatientListResponse,
  PatientStatsResponse,
  PatientOperationResponse,
  CreatePatientRequestDto,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';
import { HttpError } from 'routing-controllers';

/**
 * REST API Controller for Patient operations
 * Follows Clean Architecture - Controllers are part of the presentation layer
 */
@Controller('/patients')
@injectable()
export class PatientController {
  constructor(
    @inject(TOKENS.CreatePatientUseCase)
    private createPatientUseCase: CreatePatientUseCase,
    @inject(TOKENS.GetAllPatientsQueryHandler)
    private getAllPatientsQueryHandler: GetAllPatientsQueryHandler,
    @inject(TOKENS.GetPatientByIdQueryHandler)
    private getPatientByIdQueryHandler: GetPatientByIdQueryHandler,
    @inject(TOKENS.GetPatientStatsQueryHandler)
    private getPatientStatsQueryHandler: GetPatientStatsQueryHandler,
    @inject(TOKENS.PatientValidationService)
    private validationService: PatientValidationService
  ) {}

  /**
   * GET /api/patients/total - Get total patient count and statistics
   */
  @Get('/total')
  async getPatientStats(): Promise<PatientStatsResponse> {
    try {
      const stats = await this.getPatientStatsQueryHandler.execute();
      return ApiResponseBuilder.success(stats);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * GET /api/patients - Get all patients (for frontend filtering)
   */
  @Get('/')
  async getAllPatients(): Promise<PatientListResponse> {
    try {
      const patients = await this.getAllPatientsQueryHandler.execute();
      const patientListDtos = PatientMapper.toListDtoArray(patients);
      return ApiResponseBuilder.success(patientListDtos);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * GET /api/patients/:id - Get patient by ID
   */
  @Get('/:id')
  async getPatientById(@Param('id') id: string): Promise<PatientResponse> {
    try {
      // Validate the ID parameter
      const validatedId = PatientIdSchema.parse(id);
      const patient = await this.getPatientByIdQueryHandler.execute({ id: validatedId });
      const patientDto = PatientMapper.toDto(patient);
      return ApiResponseBuilder.success(patientDto);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * POST /api/patients - Create a new patient
   */
  @Post('/')
  @HttpCode(201)
  async createPatient(@Body() body: CreatePatientRequestDto): Promise<PatientResponse> {
    try {
      const validatedData = this.validationService.validateCreateCommand(body);
      const patient = await this.createPatientUseCase.execute(validatedData);
      const patientDto = PatientMapper.toDto(patient);
      
      return ApiResponseBuilder.success(patientDto);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Error handler that converts domain errors to HTTP errors
   */
  private handleError(error: unknown): never {
    // Handle domain-specific errors
    if (isPatientDomainError(error)) {
      const statusCode = getHttpStatusForPatientError(error);
      throw new HttpError(statusCode, error.message);
    }

    // Handle validation errors (from Zod)
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as { issues: Array<{ message: string; path?: string[] }> };
      const messages = zodError.issues.map(issue => {
        const path = issue.path?.join('.') || 'field';
        return `${path}: ${issue.message}`;
      });
      throw new HttpError(400, `Validation failed: ${messages.join(', ')}`);
    }

    // Handle generic errors
    if (error instanceof Error) {
      console.error('❌ Patient Controller Error:', error.message, error.stack);
      throw new HttpError(500, 'Internal server error');
    }

    // Fallback for unknown errors
    console.error('❌ Unknown Patient Controller Error:', error);
    throw new HttpError(500, 'Internal server error');
  }
}