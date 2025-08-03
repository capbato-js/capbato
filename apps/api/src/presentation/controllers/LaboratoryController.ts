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
  CreateLabRequestUseCase,
  UpdateLabRequestResultsUseCase,
  CreateBloodChemistryUseCase,
  GetAllLabRequestsQueryHandler,
  GetCompletedLabRequestsQueryHandler,
  GetLabRequestByPatientIdQueryHandler,
  LaboratoryMapper,
  TOKENS,
  LaboratoryValidationService,
  LabRequestIdSchema,
} from '@nx-starter/application-shared';
import {
  LabRequestListResponse,
  LabRequestResponse,
  BloodChemistryResponse,
  LaboratoryOperationResponse,
  CreateLabRequestRequestDto,
  UpdateLabRequestResultsRequestDto,
  CreateBloodChemistryRequestDto,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

/**
 * REST API Controller for Laboratory operations
 * Follows Clean Architecture - Controllers are part of the presentation layer
 */
@Controller('/laboratory')
@injectable()
export class LaboratoryController {
  constructor(
    @inject(TOKENS.CreateLabRequestUseCase)
    private createLabRequestUseCase: CreateLabRequestUseCase,
    @inject(TOKENS.UpdateLabRequestResultsUseCase)
    private updateLabRequestResultsUseCase: UpdateLabRequestResultsUseCase,
    @inject(TOKENS.CreateBloodChemistryUseCase)
    private createBloodChemistryUseCase: CreateBloodChemistryUseCase,
    @inject(TOKENS.GetAllLabRequestsQueryHandler)
    private getAllLabRequestsQueryHandler: GetAllLabRequestsQueryHandler,
    @inject(TOKENS.GetCompletedLabRequestsQueryHandler)
    private getCompletedLabRequestsQueryHandler: GetCompletedLabRequestsQueryHandler,
    @inject(TOKENS.GetLabRequestByPatientIdQueryHandler)
    private getLabRequestByPatientIdQueryHandler: GetLabRequestByPatientIdQueryHandler,
    @inject(TOKENS.LaboratoryValidationService)
    private validationService: LaboratoryValidationService
  ) {}

  /**
   * GET /api/laboratory/lab-requests - Get all lab requests
   */
  @Get('/lab-requests')
  async getAllLabRequests(): Promise<LabRequestListResponse> {
    const labRequests = await this.getAllLabRequestsQueryHandler.execute();
    const labRequestDtos = LaboratoryMapper.toLabRequestDtoArray(labRequests);

    return ApiResponseBuilder.success(labRequestDtos);
  }

  /**
   * GET /api/laboratory/lab-requests/completed - Get completed lab requests
   */
  @Get('/lab-requests/completed')
  async getCompletedLabRequests(): Promise<LabRequestListResponse> {
    const labRequests = await this.getCompletedLabRequestsQueryHandler.execute();
    const labRequestDtos = LaboratoryMapper.toLabRequestDtoArray(labRequests);

    return ApiResponseBuilder.success(labRequestDtos);
  }

  /**
   * GET /api/laboratory/lab-requests/:patientId - Get lab request by patient ID (most recent)
   */
  @Get('/lab-requests/:patientId')
  async getLabRequestByPatientId(@Param('patientId') patientId: string): Promise<LabRequestResponse> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const labRequest = await this.getLabRequestByPatientIdQueryHandler.execute(validatedPatientId);
    const labRequestDto = LaboratoryMapper.toLabRequestDto(labRequest);

    return ApiResponseBuilder.success(labRequestDto);
  }

  /**
   * POST /api/laboratory/lab-requests - Create a new lab request
   */
  @Post('/lab-requests')
  @HttpCode(201)
  async createLabRequest(@Body() body: CreateLabRequestRequestDto): Promise<LabRequestResponse> {
    const validatedData = this.validationService.validateCreateLabRequestCommand(body);
    const labRequest = await this.createLabRequestUseCase.execute(validatedData);
    const labRequestDto = LaboratoryMapper.toLabRequestDto(labRequest);

    return ApiResponseBuilder.success(labRequestDto);
  }

  /**
   * PUT /api/laboratory/lab-requests/:patientId/:requestDate - Update lab request results
   */
  @Put('/lab-requests/:patientId/:requestDate')
  async updateLabRequestResults(
    @Param('patientId') patientId: string,
    @Param('requestDate') requestDate: string,
    @Body() body: UpdateLabRequestResultsRequestDto
  ): Promise<LaboratoryOperationResponse> {
    // Combine path parameters with body for validation
    const updateData = {
      ...body,
      patientId,
      requestDate,
    };

    const validatedData = this.validationService.validateUpdateLabRequestResultsCommand(updateData);
    await this.updateLabRequestResultsUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Lab results updated successfully');
  }

  /**
   * POST /api/laboratory/blood-chemistry - Create blood chemistry results
   */
  @Post('/blood-chemistry')
  @HttpCode(201)
  async createBloodChemistry(@Body() body: CreateBloodChemistryRequestDto): Promise<BloodChemistryResponse> {
    const validatedData = this.validationService.validateCreateBloodChemistryCommand(body);
    const bloodChemistry = await this.createBloodChemistryUseCase.execute(validatedData);
    const bloodChemistryDto = LaboratoryMapper.toBloodChemistryDto(bloodChemistry);

    return ApiResponseBuilder.success(bloodChemistryDto);
  }
}
