import { injectable, inject } from 'tsyringe';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from 'routing-controllers';
import {
  CreateLabRequestUseCase,
  UpdateLabRequestResultsUseCase,
  CreateBloodChemistryUseCase,
  CreateUrinalysisResultUseCase,
  UpdateUrinalysisResultUseCase,
  DeleteUrinalysisResultUseCase,
  CreateHematologyResultUseCase,
  UpdateHematologyResultUseCase,
  DeleteHematologyResultUseCase,
  CreateFecalysisResultUseCase,
  UpdateFecalysisResultUseCase,
  DeleteFecalysisResultUseCase,
  CreateSerologyResultUseCase,
  UpdateSerologyResultUseCase,
  DeleteSerologyResultUseCase,
  GetAllLabRequestsQueryHandler,
  GetCompletedLabRequestsQueryHandler,
  GetLabRequestByPatientIdQueryHandler,
  GetAllUrinalysisResultsQueryHandler,
  GetUrinalysisResultByIdQueryHandler,
  GetUrinalysisResultsByPatientIdQueryHandler,
  GetAllHematologyResultsQueryHandler,
  GetHematologyResultByIdQueryHandler,
  GetHematologyResultsByPatientIdQueryHandler,
  GetAllFecalysisResultsQueryHandler,
  GetFecalysisResultByIdQueryHandler,
  GetFecalysisResultsByPatientIdQueryHandler,
  GetAllSerologyResultsQueryHandler,
  GetSerologyResultByIdQueryHandler,
  GetSerologyResultsByPatientIdQueryHandler,
  GetBloodChemistryByPatientIdQueryHandler,
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
  LabTestListResponse,
  CreateLabRequestRequestDto,
  UpdateLabRequestResultsRequestDto,
  CreateBloodChemistryRequestDto,
  CreateUrinalysisResultRequestDto,
  UpdateUrinalysisResultRequestDto,
  CreateHematologyResultRequestDto,
  UpdateHematologyResultRequestDto,
  CreateFecalysisResultRequestDto,
  UpdateFecalysisResultRequestDto,
  CreateSerologyResultRequestDto,
  UpdateSerologyResultRequestDto,
  UrinalysisResultResponse,
  UrinalysisResultListResponse,
  HematologyResultResponse,
  HematologyResultListResponse,
  FecalysisResultResponse,
  FecalysisResultListResponse,
  SerologyResultResponse,
  SerologyResultListResponse,
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
    private validationService: LaboratoryValidationService,
    // Urinalysis Result Services
    @inject(TOKENS.CreateUrinalysisResultUseCase)
    private createUrinalysisResultUseCase: CreateUrinalysisResultUseCase,
    @inject(TOKENS.UpdateUrinalysisResultUseCase)
    private updateUrinalysisResultUseCase: UpdateUrinalysisResultUseCase,
    @inject(TOKENS.DeleteUrinalysisResultUseCase)
    private deleteUrinalysisResultUseCase: DeleteUrinalysisResultUseCase,
    @inject(TOKENS.GetAllUrinalysisResultsQueryHandler)
    private getAllUrinalysisResultsQueryHandler: GetAllUrinalysisResultsQueryHandler,
    @inject(TOKENS.GetUrinalysisResultByIdQueryHandler)
    private getUrinalysisResultByIdQueryHandler: GetUrinalysisResultByIdQueryHandler,
    @inject(TOKENS.GetUrinalysisResultsByPatientIdQueryHandler)
    private getUrinalysisResultsByPatientIdQueryHandler: GetUrinalysisResultsByPatientIdQueryHandler,
    // Hematology Result Services
    @inject(TOKENS.CreateHematologyResultUseCase)
    private createHematologyResultUseCase: CreateHematologyResultUseCase,
    @inject(TOKENS.UpdateHematologyResultUseCase)
    private updateHematologyResultUseCase: UpdateHematologyResultUseCase,
    @inject(TOKENS.DeleteHematologyResultUseCase)
    private deleteHematologyResultUseCase: DeleteHematologyResultUseCase,
    @inject(TOKENS.GetAllHematologyResultsQueryHandler)
    private getAllHematologyResultsQueryHandler: GetAllHematologyResultsQueryHandler,
    @inject(TOKENS.GetHematologyResultByIdQueryHandler)
    private getHematologyResultByIdQueryHandler: GetHematologyResultByIdQueryHandler,
    @inject(TOKENS.GetHematologyResultsByPatientIdQueryHandler)
    private getHematologyResultsByPatientIdQueryHandler: GetHematologyResultsByPatientIdQueryHandler,
    // Fecalysis Result Services
    @inject(TOKENS.CreateFecalysisResultUseCase)
    private createFecalysisResultUseCase: CreateFecalysisResultUseCase,
    @inject(TOKENS.UpdateFecalysisResultUseCase)
    private updateFecalysisResultUseCase: UpdateFecalysisResultUseCase,
    @inject(TOKENS.DeleteFecalysisResultUseCase)
    private deleteFecalysisResultUseCase: DeleteFecalysisResultUseCase,
    @inject(TOKENS.GetAllFecalysisResultsQueryHandler)
    private getAllFecalysisResultsQueryHandler: GetAllFecalysisResultsQueryHandler,
    @inject(TOKENS.GetFecalysisResultByIdQueryHandler)
    private getFecalysisResultByIdQueryHandler: GetFecalysisResultByIdQueryHandler,
    @inject(TOKENS.GetFecalysisResultsByPatientIdQueryHandler)
    private getFecalysisResultsByPatientIdQueryHandler: GetFecalysisResultsByPatientIdQueryHandler,
    // Serology Result Services
    @inject(TOKENS.CreateSerologyResultUseCase)
    private createSerologyResultUseCase: CreateSerologyResultUseCase,
    @inject(TOKENS.UpdateSerologyResultUseCase)
    private updateSerologyResultUseCase: UpdateSerologyResultUseCase,
    @inject(TOKENS.DeleteSerologyResultUseCase)
    private deleteSerologyResultUseCase: DeleteSerologyResultUseCase,
    @inject(TOKENS.GetAllSerologyResultsQueryHandler)
    private getAllSerologyResultsQueryHandler: GetAllSerologyResultsQueryHandler,
    @inject(TOKENS.GetSerologyResultByIdQueryHandler)
    private getSerologyResultByIdQueryHandler: GetSerologyResultByIdQueryHandler,
    @inject(TOKENS.GetSerologyResultsByPatientIdQueryHandler)
    private getSerologyResultsByPatientIdQueryHandler: GetSerologyResultsByPatientIdQueryHandler,
    // Blood Chemistry Query Handler
    @inject(TOKENS.GetBloodChemistryByPatientIdQueryHandler)
    private getBloodChemistryByPatientIdQueryHandler: GetBloodChemistryByPatientIdQueryHandler
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
   * GET /api/laboratory/lab-tests/:patientId - Get formatted lab tests for specific patient
   */
  @Get('/lab-tests/:patientId')
  async getLabTestsByPatientId(@Param('patientId') patientId: string): Promise<LabTestListResponse> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    
    // Get lab requests and transform them to lab tests format
    const labRequests = await this.getAllLabRequestsQueryHandler.execute();
    const labRequestDtos = LaboratoryMapper.toLabTestDtoArray(labRequests, validatedPatientId);
    
    // Get blood chemistry results for the patient
    const bloodChemistryResults = await this.getBloodChemistryByPatientIdQueryHandler.execute(validatedPatientId);
    const bloodChemistryDtos = LaboratoryMapper.bloodChemistryToLabTestDtoArray(bloodChemistryResults);
    
    // Combine both types of lab tests
    const allLabTestDtos = [...labRequestDtos, ...bloodChemistryDtos];

    return ApiResponseBuilder.success(allLabTestDtos);
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

  // ==================== URINALYSIS RESULTS ENDPOINTS ====================
  
  /**
   * GET /api/laboratory/urinalysis-results - Get all urinalysis results
   */
  @Get('/urinalysis-results')
  async getAllUrinalysisResults(): Promise<UrinalysisResultListResponse> {
    const urinalysisResults = await this.getAllUrinalysisResultsQueryHandler.execute();
    const urinalysisResultDtos = LaboratoryMapper.toUrinalysisResultDtoArray(urinalysisResults);

    return ApiResponseBuilder.success(urinalysisResultDtos);
  }

  /**
   * GET /api/laboratory/urinalysis-results/:id - Get urinalysis result by ID
   */
  @Get('/urinalysis-results/:id')
  async getUrinalysisResultById(@Param('id') id: string): Promise<UrinalysisResultResponse> {
    const urinalysisResult = await this.getUrinalysisResultByIdQueryHandler.execute(id);
    const urinalysisResultDto = LaboratoryMapper.toUrinalysisResultDto(urinalysisResult);

    return ApiResponseBuilder.success(urinalysisResultDto);
  }

  /**
   * GET /api/laboratory/urinalysis-results/patient/:patientId - Get urinalysis results by patient ID
   */
  @Get('/urinalysis-results/patient/:patientId')
  async getUrinalysisResultsByPatientId(@Param('patientId') patientId: string): Promise<UrinalysisResultListResponse> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const urinalysisResults = await this.getUrinalysisResultsByPatientIdQueryHandler.execute(validatedPatientId);
    const urinalysisResultDtos = LaboratoryMapper.toUrinalysisResultDtoArray(urinalysisResults);

    return ApiResponseBuilder.success(urinalysisResultDtos);
  }

  /**
   * POST /api/laboratory/urinalysis-results - Create a new urinalysis result
   */
  @Post('/urinalysis-results')
  @HttpCode(201)
  async createUrinalysisResult(@Body() body: CreateUrinalysisResultRequestDto): Promise<UrinalysisResultResponse> {
    const validatedData = this.validationService.validateCreateUrinalysisResultCommand(body);
    const urinalysisResult = await this.createUrinalysisResultUseCase.execute(validatedData);
    const urinalysisResultDto = LaboratoryMapper.toUrinalysisResultDto(urinalysisResult);

    return ApiResponseBuilder.success(urinalysisResultDto);
  }

  /**
   * PUT /api/laboratory/urinalysis-results/:id - Update urinalysis result
   */
  @Put('/urinalysis-results/:id')
  async updateUrinalysisResult(
    @Param('id') id: string,
    @Body() body: UpdateUrinalysisResultRequestDto
  ): Promise<UrinalysisResultResponse> {
    const updateData = { ...body, id };
    const validatedData = this.validationService.validateUpdateUrinalysisResultCommand(updateData);
    const urinalysisResult = await this.updateUrinalysisResultUseCase.execute(validatedData);
    const urinalysisResultDto = LaboratoryMapper.toUrinalysisResultDto(urinalysisResult);

    return ApiResponseBuilder.success(urinalysisResultDto);
  }

  /**
   * DELETE /api/laboratory/urinalysis-results/:id - Delete urinalysis result
   */
  @Delete('/urinalysis-results/:id')
  async deleteUrinalysisResult(@Param('id') id: string): Promise<LaboratoryOperationResponse> {
    await this.deleteUrinalysisResultUseCase.execute(id);
    return ApiResponseBuilder.successWithMessage('Urinalysis result deleted successfully');
  }

  // ==================== HEMATOLOGY RESULTS ENDPOINTS ====================
  
  /**
   * GET /api/laboratory/hematology-results - Get all hematology results
   */
  @Get('/hematology-results')
  async getAllHematologyResults(): Promise<HematologyResultListResponse> {
    const hematologyResults = await this.getAllHematologyResultsQueryHandler.execute();
    const hematologyResultDtos = LaboratoryMapper.toHematologyResultDtoArray(hematologyResults);

    return ApiResponseBuilder.success(hematologyResultDtos);
  }

  /**
   * GET /api/laboratory/hematology-results/:id - Get hematology result by ID
   */
  @Get('/hematology-results/:id')
  async getHematologyResultById(@Param('id') id: string): Promise<HematologyResultResponse> {
    const hematologyResult = await this.getHematologyResultByIdQueryHandler.execute(id);
    const hematologyResultDto = LaboratoryMapper.toHematologyResultDto(hematologyResult);

    return ApiResponseBuilder.success(hematologyResultDto);
  }

  /**
   * GET /api/laboratory/hematology-results/patient/:patientId - Get hematology results by patient ID
   */
  @Get('/hematology-results/patient/:patientId')
  async getHematologyResultsByPatientId(@Param('patientId') patientId: string): Promise<HematologyResultListResponse> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const hematologyResults = await this.getHematologyResultsByPatientIdQueryHandler.execute(validatedPatientId);
    const hematologyResultDtos = LaboratoryMapper.toHematologyResultDtoArray(hematologyResults);

    return ApiResponseBuilder.success(hematologyResultDtos);
  }

  /**
   * POST /api/laboratory/hematology-results - Create a new hematology result
   */
  @Post('/hematology-results')
  @HttpCode(201)
  async createHematologyResult(@Body() body: CreateHematologyResultRequestDto): Promise<HematologyResultResponse> {
    const validatedData = this.validationService.validateCreateHematologyResultCommand(body);
    const hematologyResult = await this.createHematologyResultUseCase.execute(validatedData);
    const hematologyResultDto = LaboratoryMapper.toHematologyResultDto(hematologyResult);

    return ApiResponseBuilder.success(hematologyResultDto);
  }

  /**
   * PUT /api/laboratory/hematology-results/:id - Update hematology result
   */
  @Put('/hematology-results/:id')
  async updateHematologyResult(
    @Param('id') id: string,
    @Body() body: UpdateHematologyResultRequestDto
  ): Promise<HematologyResultResponse> {
    const updateData = { ...body, id };
    const validatedData = this.validationService.validateUpdateHematologyResultCommand(updateData);
    const hematologyResult = await this.updateHematologyResultUseCase.execute(validatedData);
    const hematologyResultDto = LaboratoryMapper.toHematologyResultDto(hematologyResult);

    return ApiResponseBuilder.success(hematologyResultDto);
  }

  /**
   * DELETE /api/laboratory/hematology-results/:id - Delete hematology result
   */
  @Delete('/hematology-results/:id')
  async deleteHematologyResult(@Param('id') id: string): Promise<LaboratoryOperationResponse> {
    await this.deleteHematologyResultUseCase.execute(id);
    return ApiResponseBuilder.successWithMessage('Hematology result deleted successfully');
  }

  // ==================== FECALYSIS RESULTS ENDPOINTS ====================
  
  /**
   * GET /api/laboratory/fecalysis-results - Get all fecalysis results
   */
  @Get('/fecalysis-results')
  async getAllFecalysisResults(): Promise<FecalysisResultListResponse> {
    const fecalysisResults = await this.getAllFecalysisResultsQueryHandler.execute();
    const fecalysisResultDtos = LaboratoryMapper.toFecalysisResultDtoArray(fecalysisResults);

    return ApiResponseBuilder.success(fecalysisResultDtos);
  }

  /**
   * GET /api/laboratory/fecalysis-results/:id - Get fecalysis result by ID
   */
  @Get('/fecalysis-results/:id')
  async getFecalysisResultById(@Param('id') id: string): Promise<FecalysisResultResponse> {
    const fecalysisResult = await this.getFecalysisResultByIdQueryHandler.execute(id);
    const fecalysisResultDto = LaboratoryMapper.toFecalysisResultDto(fecalysisResult);

    return ApiResponseBuilder.success(fecalysisResultDto);
  }

  /**
   * GET /api/laboratory/fecalysis-results/patient/:patientId - Get fecalysis results by patient ID
   */
  @Get('/fecalysis-results/patient/:patientId')
  async getFecalysisResultsByPatientId(@Param('patientId') patientId: string): Promise<FecalysisResultListResponse> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const fecalysisResults = await this.getFecalysisResultsByPatientIdQueryHandler.execute(validatedPatientId);
    const fecalysisResultDtos = LaboratoryMapper.toFecalysisResultDtoArray(fecalysisResults);

    return ApiResponseBuilder.success(fecalysisResultDtos);
  }

  /**
   * POST /api/laboratory/fecalysis-results - Create a new fecalysis result
   */
  @Post('/fecalysis-results')
  @HttpCode(201)
  async createFecalysisResult(@Body() body: CreateFecalysisResultRequestDto): Promise<FecalysisResultResponse> {
    const validatedData = this.validationService.validateCreateFecalysisResultCommand(body);
    const fecalysisResult = await this.createFecalysisResultUseCase.execute(validatedData);
    const fecalysisResultDto = LaboratoryMapper.toFecalysisResultDto(fecalysisResult);

    return ApiResponseBuilder.success(fecalysisResultDto);
  }

  /**
   * PUT /api/laboratory/fecalysis-results/:id - Update fecalysis result
   */
  @Put('/fecalysis-results/:id')
  async updateFecalysisResult(
    @Param('id') id: string,
    @Body() body: UpdateFecalysisResultRequestDto
  ): Promise<FecalysisResultResponse> {
    const updateData = { ...body, id };
    const validatedData = this.validationService.validateUpdateFecalysisResultCommand(updateData);
    const fecalysisResult = await this.updateFecalysisResultUseCase.execute(validatedData);
    const fecalysisResultDto = LaboratoryMapper.toFecalysisResultDto(fecalysisResult);

    return ApiResponseBuilder.success(fecalysisResultDto);
  }

  /**
   * DELETE /api/laboratory/fecalysis-results/:id - Delete fecalysis result
   */
  @Delete('/fecalysis-results/:id')
  async deleteFecalysisResult(@Param('id') id: string): Promise<LaboratoryOperationResponse> {
    await this.deleteFecalysisResultUseCase.execute(id);
    return ApiResponseBuilder.successWithMessage('Fecalysis result deleted successfully');
  }

  // ==================== SEROLOGY RESULTS ENDPOINTS ====================
  
  /**
   * GET /api/laboratory/serology-results - Get all serology results
   */
  @Get('/serology-results')
  async getAllSerologyResults(): Promise<SerologyResultListResponse> {
    const serologyResults = await this.getAllSerologyResultsQueryHandler.execute();
    const serologyResultDtos = LaboratoryMapper.toSerologyResultDtoArray(serologyResults);

    return ApiResponseBuilder.success(serologyResultDtos);
  }

  /**
   * GET /api/laboratory/serology-results/:id - Get serology result by ID
   */
  @Get('/serology-results/:id')
  async getSerologyResultById(@Param('id') id: string): Promise<SerologyResultResponse> {
    const serologyResult = await this.getSerologyResultByIdQueryHandler.execute(id);
    const serologyResultDto = LaboratoryMapper.toSerologyResultDto(serologyResult);

    return ApiResponseBuilder.success(serologyResultDto);
  }

  /**
   * GET /api/laboratory/serology-results/patient/:patientId - Get serology results by patient ID
   */
  @Get('/serology-results/patient/:patientId')
  async getSerologyResultsByPatientId(@Param('patientId') patientId: string): Promise<SerologyResultListResponse> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const serologyResults = await this.getSerologyResultsByPatientIdQueryHandler.execute(validatedPatientId);
    const serologyResultDtos = LaboratoryMapper.toSerologyResultDtoArray(serologyResults);

    return ApiResponseBuilder.success(serologyResultDtos);
  }

  /**
   * POST /api/laboratory/serology-results - Create a new serology result
   */
  @Post('/serology-results')
  @HttpCode(201)
  async createSerologyResult(@Body() body: CreateSerologyResultRequestDto): Promise<SerologyResultResponse> {
    const validatedData = this.validationService.validateCreateSerologyResultCommand(body);
    const serologyResult = await this.createSerologyResultUseCase.execute(validatedData);
    const serologyResultDto = LaboratoryMapper.toSerologyResultDto(serologyResult);

    return ApiResponseBuilder.success(serologyResultDto);
  }

  /**
   * PUT /api/laboratory/serology-results/:id - Update serology result
   */
  @Put('/serology-results/:id')
  async updateSerologyResult(
    @Param('id') id: string,
    @Body() body: UpdateSerologyResultRequestDto
  ): Promise<SerologyResultResponse> {
    const updateData = { ...body, id };
    const validatedData = this.validationService.validateUpdateSerologyResultCommand(updateData);
    const serologyResult = await this.updateSerologyResultUseCase.execute(validatedData);
    const serologyResultDto = LaboratoryMapper.toSerologyResultDto(serologyResult);

    return ApiResponseBuilder.success(serologyResultDto);
  }

  /**
   * DELETE /api/laboratory/serology-results/:id - Delete serology result
   */
  @Delete('/serology-results/:id')
  async deleteSerologyResult(@Param('id') id: string): Promise<LaboratoryOperationResponse> {
    await this.deleteSerologyResultUseCase.execute(id);
    return ApiResponseBuilder.successWithMessage('Serology result deleted successfully');
  }
}
