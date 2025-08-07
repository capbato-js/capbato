import { injectable, inject } from 'tsyringe';
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpCode,
} from 'routing-controllers';
import {
  CreatePatientUseCase,
  UpdatePatientUseCase,
  GetAllPatientsQueryHandler,
  GetPatientByIdQueryHandler,
  GetPatientStatsQueryHandler,
  PatientMapper,
  TOKENS,
  PatientValidationService,
  PatientIdSchema,
} from '@nx-starter/application-shared';
import {
  PatientResponse,
  PatientListResponse,
  PatientStatsResponse,
  CreatePatientRequestDto,
  UpdatePatientRequestDto,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

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
    @inject(TOKENS.UpdatePatientUseCase)
    private updatePatientUseCase: UpdatePatientUseCase,
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
    const stats = await this.getPatientStatsQueryHandler.execute();
    return ApiResponseBuilder.success(stats);
  }

  /**
   * GET /api/patients - Get all patients (for frontend filtering)
   */
  @Get('/')
  async getAllPatients(): Promise<PatientListResponse> {
    const patients = await this.getAllPatientsQueryHandler.execute();
    const patientListDtos = PatientMapper.toListDtoArray(patients);
    return ApiResponseBuilder.success(patientListDtos);
  }

  /**
   * GET /api/patients/:id - Get patient by ID
   */
  @Get('/:id')
  async getPatientById(@Param('id') id: string): Promise<PatientResponse> {
    // Validate the ID parameter
    const validatedId = PatientIdSchema.parse(id);
    const patient = await this.getPatientByIdQueryHandler.execute({ id: validatedId });
    const patientDto = PatientMapper.toDto(patient);
    return ApiResponseBuilder.success(patientDto);
  }

  /**
   * POST /api/patients - Create a new patient
   */
  @Post('/')
  @HttpCode(201)
  async createPatient(@Body() body: CreatePatientRequestDto): Promise<PatientResponse> {
    const validatedData = this.validationService.validateCreateCommand(body);
    const patient = await this.createPatientUseCase.execute(validatedData);
    const patientDto = PatientMapper.toDto(patient);
    
    return ApiResponseBuilder.success(patientDto);
  }

  /**
   * PUT /api/patients/:id - Update an existing patient
   */
  @Put('/:id')
  async updatePatient(@Param('id') id: string, @Body() body: UpdatePatientRequestDto): Promise<PatientResponse> {
    // Validate the ID parameter
    const validatedId = PatientIdSchema.parse(id);
    
    // Create update command with ID from path parameter
    const updateCommand = {
      id: validatedId,
      ...body,
    };
    
    const validatedData = this.validationService.validateUpdateCommand(updateCommand);
    const patient = await this.updatePatientUseCase.execute(validatedData);
    const patientDto = PatientMapper.toDto(patient);
    
    return ApiResponseBuilder.success(patientDto);
  }
}