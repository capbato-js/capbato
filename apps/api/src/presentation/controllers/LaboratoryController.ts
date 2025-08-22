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
  CreateLabTestResultUseCase,
  UpdateLabTestResultUseCase,
  DeleteLabTestResultUseCase,
  GetAllLabRequestsQueryHandler,
  GetCompletedLabRequestsQueryHandler,
  GetLabRequestByIdQueryHandler,
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
  GetLabTestResultByIdQueryHandler,
  GetAllLabTestResultsQueryHandler,
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
  BloodChemistryListResponse,
  LaboratoryOperationResponse,
  LabTestListResponse,
  LabTestResultResponse,
  LabTestResultListResponse,
  CreateLabRequestRequestDto,
  UpdateLabRequestResultsRequestDto,
  CreateBloodChemistryRequestDto,
  CreateLabTestResultRequestDto,
  UpdateLabTestResultRequestDto,
  CreateUrinalysisResultCommand,
  UpdateUrinalysisResultCommand,
  CreateHematologyResultCommand,
  UpdateHematologyResultCommand,
  CreateFecalysisResultCommand,
  UpdateFecalysisResultCommand,
  CreateSerologyResultCommand,
  UpdateSerologyResultCommand,
  DeleteLabTestResultCommand,
  UpdateLabTestResultCommand,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder, ApiSuccessResponse } from '../dto/ApiResponse';

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
    @inject(TOKENS.CreateLabTestResultUseCase)
    private createLabTestResultUseCase: CreateLabTestResultUseCase,
    @inject(TOKENS.GetAllLabRequestsQueryHandler)
    private getAllLabRequestsQueryHandler: GetAllLabRequestsQueryHandler,
    @inject(TOKENS.GetCompletedLabRequestsQueryHandler)
    private getCompletedLabRequestsQueryHandler: GetCompletedLabRequestsQueryHandler,
    @inject(TOKENS.GetLabRequestByIdQueryHandler)
    private getLabRequestByIdQueryHandler: GetLabRequestByIdQueryHandler,
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
    @inject(TOKENS.GetLabTestResultByIdQueryHandler)
    private getLabTestResultByIdQueryHandler: GetLabTestResultByIdQueryHandler,
    @inject(TOKENS.GetAllLabTestResultsQueryHandler)
    private getAllLabTestResultsQueryHandler: GetAllLabTestResultsQueryHandler,
    @inject(TOKENS.UpdateLabTestResultUseCase)
    private updateLabTestResultUseCase: UpdateLabTestResultUseCase,
    @inject(TOKENS.DeleteLabTestResultUseCase)
    private deleteLabTestResultUseCase: DeleteLabTestResultUseCase,
    // Blood Chemistry Query Handler
    @inject(TOKENS.GetBloodChemistryByPatientIdQueryHandler)
    private getBloodChemistryByPatientIdQueryHandler: GetBloodChemistryByPatientIdQueryHandler
  ) {}

  /**
   * GET /api/laboratory/requests - Get all lab requests
   */
  @Get('/requests')
  async getAllLabRequests(): Promise<LabRequestListResponse> {
    const labRequests = await this.getAllLabRequestsQueryHandler.execute();
    const labRequestDtos = LaboratoryMapper.toLabRequestDtoArray(labRequests);

    return ApiResponseBuilder.success(labRequestDtos);
  }

  /**
   * GET /api/laboratory/requests/completed - Get completed lab requests
   */
  @Get('/requests/completed')
  async getCompletedLabRequests(): Promise<LabRequestListResponse> {
    const labRequests = await this.getCompletedLabRequestsQueryHandler.execute();
    const labRequestDtos = LaboratoryMapper.toLabRequestDtoArray(labRequests);

    return ApiResponseBuilder.success(labRequestDtos);
  }

  /**
   * GET /api/laboratory/requests/:id - Get lab request by ID
   */
  @Get('/requests/:id')
  async getLabRequestById(@Param('id') id: string): Promise<LabRequestResponse> {
    const validatedId = LabRequestIdSchema.parse(id);
    const labRequest = await this.getLabRequestByIdQueryHandler.execute(validatedId);
    const labRequestDto = LaboratoryMapper.toLabRequestDto(labRequest);

    return ApiResponseBuilder.success(labRequestDto);
  }

  /**
   * GET /api/laboratory/requests/:patientId - Get lab request by patient ID (most recent)
   */
  @Get('/requests/:patientId')
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
    
    // No longer combine with blood chemistry results since they're now part of lab requests
    // Blood chemistry results are added directly to lab requests, not as separate records

    return ApiResponseBuilder.success(labRequestDtos);
  }

  /**
   * GET /api/laboratory/blood-chemistry/:patientId - Get blood chemistry results for specific patient
   */
  @Get('/blood-chemistry/:patientId')
  async getBloodChemistryByPatientId(@Param('patientId') patientId: string): Promise<BloodChemistryListResponse> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const bloodChemistryResults = await this.getBloodChemistryByPatientIdQueryHandler.execute(validatedPatientId);
    const bloodChemistryDtos = LaboratoryMapper.toBloodChemistryDtoArray(bloodChemistryResults);

    return ApiResponseBuilder.success(bloodChemistryDtos);
  }

  /**
   * POST /api/laboratory/requests - Create a new lab request
   */
  @Post('/requests')
  @HttpCode(201)
  async createLabRequest(@Body() body: CreateLabRequestRequestDto): Promise<LabRequestResponse> {
    const validatedData = this.validationService.validateCreateLabRequestCommand(body);
    const labRequest = await this.createLabRequestUseCase.execute(validatedData);
    const labRequestDto = LaboratoryMapper.toLabRequestDto(labRequest);

    return ApiResponseBuilder.success(labRequestDto);
  }

  /**
   * PUT /api/laboratory/requests/:patientId/:requestDate - Update lab request results
   */
  @Put('/requests/:patientId/:requestDate')
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

  /**
   * POST /api/laboratory/test-results - Create lab test results
   */
  @Post('/test-results')
  @HttpCode(201)
  async createLabTestResult(@Body() body: CreateLabTestResultRequestDto): Promise<LabTestResultResponse> {
    const validatedData = this.validationService.validateCreateLabTestResultCommand(body);
    const labTestResult = await this.createLabTestResultUseCase.execute(validatedData);
    const labTestResultDto = LaboratoryMapper.toLabTestResultDto(labTestResult);

    return ApiResponseBuilder.success(labTestResultDto);
  }

  /**
   * GET /api/laboratory/test-results - Get all lab test results
   */
  @Get('/test-results')
  async getAllLabTestResults(): Promise<LabTestResultListResponse> {
    const labTestResults = await this.getAllLabTestResultsQueryHandler.execute();
    const labTestResultDtos = labTestResults.map(labTestResult => 
      LaboratoryMapper.toLabTestResultDto(labTestResult)
    );

    return ApiResponseBuilder.success(labTestResultDtos);
  }

  /**
   * GET /api/laboratory/test-results/:id - Get lab test result by ID
   */
  @Get('/test-results/:id')
  async getLabTestResultById(@Param('id') id: string): Promise<LabTestResultResponse> {
    const validatedId = LabRequestIdSchema.parse(id);
    const labTestResult = await this.getLabTestResultByIdQueryHandler.execute(validatedId);
    const labTestResultDto = LaboratoryMapper.toLabTestResultDto(labTestResult);

    return ApiResponseBuilder.success(labTestResultDto);
  }

  /**
   * DELETE /api/laboratory/test-results/:id - Delete lab test result by ID
   */
  @Delete('/test-results/:id')
  async deleteLabTestResult(@Param('id') id: string): Promise<LaboratoryOperationResponse> {
    const validatedCommand = this.validationService.validateDeleteLabTestResultCommand({ id });
    await this.deleteLabTestResultUseCase.execute(validatedCommand);
    return ApiResponseBuilder.successWithMessage('Lab test result deleted successfully');
  }

  /**
   * PUT /api/laboratory/test-results/:id - Update lab test result by ID
   */
  @Put('/test-results/:id')
  async updateLabTestResult(
    @Param('id') id: string,
    @Body() body: UpdateLabTestResultRequestDto
  ): Promise<LabTestResultResponse> {
    const updateData = { ...body, id };
    const validatedCommand = this.validationService.validateUpdateLabTestResultCommand(updateData);
    const labTestResult = await this.updateLabTestResultUseCase.execute(validatedCommand);
    const labTestResultDto = LaboratoryMapper.toLabTestResultDto(labTestResult);

    return ApiResponseBuilder.success(labTestResultDto);
  }

  // ==================== URINALYSIS RESULTS ENDPOINTS (LEGACY - DO NOT USE) ====================
  // @deprecated These specialized test result endpoints are legacy.
  // Use the general createLabTestResult endpoint (POST /api/laboratory/test-results) instead.
  
  /**
   * GET /api/laboratory/urinalysis-results - Get all urinalysis results
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/urinalysis-results')
  async getAllUrinalysisResults(): Promise<ApiSuccessResponse<any[]>> {
    const urinalysisResults = await this.getAllUrinalysisResultsQueryHandler.execute();
    const urinalysisResultDtos = LaboratoryMapper.toUrinalysisResultDtoArray(urinalysisResults);

    return ApiResponseBuilder.success(urinalysisResultDtos);
  }

  /**
   * GET /api/laboratory/urinalysis-results/:id - Get urinalysis result by ID
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/urinalysis-results/:id')
  async getUrinalysisResultById(@Param('id') id: string): Promise<ApiSuccessResponse<any>> {
    const urinalysisResult = await this.getUrinalysisResultByIdQueryHandler.execute(id);
    const urinalysisResultDto = LaboratoryMapper.toUrinalysisResultDto(urinalysisResult);

    return ApiResponseBuilder.success(urinalysisResultDto);
  }

  /**
   * GET /api/laboratory/urinalysis-results/patient/:patientId - Get urinalysis results by patient ID
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/urinalysis-results/patient/:patientId')
  async getUrinalysisResultsByPatientId(@Param('patientId') patientId: string): Promise<ApiSuccessResponse<any[]>> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const urinalysisResults = await this.getUrinalysisResultsByPatientIdQueryHandler.execute(validatedPatientId);
    const urinalysisResultDtos = LaboratoryMapper.toUrinalysisResultDtoArray(urinalysisResults);

    return ApiResponseBuilder.success(urinalysisResultDtos);
  }

  /**
   * POST /api/laboratory/urinalysis-results - Create a new urinalysis result
   * @deprecated Use POST /api/laboratory/test-results instead
   */
  @Post('/urinalysis-results')
  @HttpCode(201)
  async createUrinalysisResult(@Body() body: CreateUrinalysisResultCommand): Promise<ApiSuccessResponse<any>> {
    const validatedData = this.validationService.validateCreateUrinalysisResultCommand(body);
    const urinalysisResult = await this.createUrinalysisResultUseCase.execute(validatedData);
    const urinalysisResultDto = LaboratoryMapper.toUrinalysisResultDto(urinalysisResult);

    return ApiResponseBuilder.success(urinalysisResultDto);
  }

  /**
   * PUT /api/laboratory/urinalysis-results/:id - Update urinalysis result
   * @deprecated Use general lab test results endpoint instead
   */
  @Put('/urinalysis-results/:id')
  async updateUrinalysisResult(
    @Param('id') id: string,
    @Body() body: UpdateUrinalysisResultCommand
  ): Promise<ApiSuccessResponse<any>> {
    const updateData = { ...body, id };
    const validatedData = this.validationService.validateUpdateUrinalysisResultCommand(updateData);
    const urinalysisResult = await this.updateUrinalysisResultUseCase.execute(validatedData);
    const urinalysisResultDto = LaboratoryMapper.toUrinalysisResultDto(urinalysisResult);

    return ApiResponseBuilder.success(urinalysisResultDto);
  }

  /**
   * DELETE /api/laboratory/urinalysis-results/:id - Delete urinalysis result
   * @deprecated Use general lab test results endpoint instead
   */
  @Delete('/urinalysis-results/:id')
  async deleteUrinalysisResult(@Param('id') id: string): Promise<LaboratoryOperationResponse> {
    await this.deleteUrinalysisResultUseCase.execute({ id });
    return ApiResponseBuilder.successWithMessage('Urinalysis result deleted successfully');
  }

  // ==================== HEMATOLOGY RESULTS ENDPOINTS (LEGACY - DO NOT USE) ====================
  // @deprecated These specialized test result endpoints are legacy.
  // Use the general createLabTestResult endpoint (POST /api/laboratory/test-results) instead.
  
  /**
   * GET /api/laboratory/hematology-results - Get all hematology results
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/hematology-results')
  async getAllHematologyResults(): Promise<ApiSuccessResponse<any[]>> {
    const hematologyResults = await this.getAllHematologyResultsQueryHandler.execute();
    const hematologyResultDtos = LaboratoryMapper.toHematologyResultDtoArray(hematologyResults);

    return ApiResponseBuilder.success(hematologyResultDtos);
  }

  /**
   * GET /api/laboratory/hematology-results/:id - Get hematology result by ID
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/hematology-results/:id')
  async getHematologyResultById(@Param('id') id: string): Promise<ApiSuccessResponse<any>> {
    const hematologyResult = await this.getHematologyResultByIdQueryHandler.execute(id);
    const hematologyResultDto = LaboratoryMapper.toHematologyResultDto(hematologyResult);

    return ApiResponseBuilder.success(hematologyResultDto);
  }

  /**
   * GET /api/laboratory/hematology-results/patient/:patientId - Get hematology results by patient ID
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/hematology-results/patient/:patientId')
  async getHematologyResultsByPatientId(@Param('patientId') patientId: string): Promise<ApiSuccessResponse<any[]>> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const hematologyResults = await this.getHematologyResultsByPatientIdQueryHandler.execute(validatedPatientId);
    const hematologyResultDtos = LaboratoryMapper.toHematologyResultDtoArray(hematologyResults);

    return ApiResponseBuilder.success(hematologyResultDtos);
  }

  /**
   * POST /api/laboratory/hematology-results - Create a new hematology result
   * @deprecated Use POST /api/laboratory/test-results instead
   */
  @Post('/hematology-results')
  @HttpCode(201)
  async createHematologyResult(@Body() body: CreateHematologyResultCommand): Promise<ApiSuccessResponse<any>> {
    const validatedData = this.validationService.validateCreateHematologyResultCommand(body);
    const hematologyResult = await this.createHematologyResultUseCase.execute(validatedData);
    const hematologyResultDto = LaboratoryMapper.toHematologyResultDto(hematologyResult);

    return ApiResponseBuilder.success(hematologyResultDto);
  }

  /**
   * PUT /api/laboratory/hematology-results/:id - Update hematology result
   * @deprecated Use general lab test results endpoint instead
   */
  @Put('/hematology-results/:id')
  async updateHematologyResult(
    @Param('id') id: string,
    @Body() body: UpdateHematologyResultCommand
  ): Promise<ApiSuccessResponse<any>> {
    const updateData = { ...body, id };
    const validatedData = this.validationService.validateUpdateHematologyResultCommand(updateData);
    const hematologyResult = await this.updateHematologyResultUseCase.execute(validatedData);
    const hematologyResultDto = LaboratoryMapper.toHematologyResultDto(hematologyResult);

    return ApiResponseBuilder.success(hematologyResultDto);
  }

  /**
   * DELETE /api/laboratory/hematology-results/:id - Delete hematology result
   * @deprecated Use general lab test results endpoint instead
   */
  @Delete('/hematology-results/:id')
  async deleteHematologyResult(@Param('id') id: string): Promise<LaboratoryOperationResponse> {
    await this.deleteHematologyResultUseCase.execute({ id });
    return ApiResponseBuilder.successWithMessage('Hematology result deleted successfully');
  }

  // ==================== FECALYSIS RESULTS ENDPOINTS (LEGACY - DO NOT USE) ====================
  // @deprecated These specialized test result endpoints are legacy.
  // Use the general createLabTestResult endpoint (POST /api/laboratory/test-results) instead.
  
  /**
   * GET /api/laboratory/fecalysis-results - Get all fecalysis results
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/fecalysis-results')
  async getAllFecalysisResults(): Promise<ApiSuccessResponse<any[]>> {
    const fecalysisResults = await this.getAllFecalysisResultsQueryHandler.execute();
    const fecalysisResultDtos = LaboratoryMapper.toFecalysisResultDtoArray(fecalysisResults);

    return ApiResponseBuilder.success(fecalysisResultDtos);
  }

  /**
   * GET /api/laboratory/fecalysis-results/:id - Get fecalysis result by ID
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/fecalysis-results/:id')
  async getFecalysisResultById(@Param('id') id: string): Promise<ApiSuccessResponse<any>> {
    const fecalysisResult = await this.getFecalysisResultByIdQueryHandler.execute(id);
    const fecalysisResultDto = LaboratoryMapper.toFecalysisResultDto(fecalysisResult);

    return ApiResponseBuilder.success(fecalysisResultDto);
  }

  /**
   * GET /api/laboratory/fecalysis-results/patient/:patientId - Get fecalysis results by patient ID
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/fecalysis-results/patient/:patientId')
  async getFecalysisResultsByPatientId(@Param('patientId') patientId: string): Promise<ApiSuccessResponse<any[]>> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const fecalysisResults = await this.getFecalysisResultsByPatientIdQueryHandler.execute(validatedPatientId);
    const fecalysisResultDtos = LaboratoryMapper.toFecalysisResultDtoArray(fecalysisResults);

    return ApiResponseBuilder.success(fecalysisResultDtos);
  }

  /**
   * POST /api/laboratory/fecalysis-results - Create a new fecalysis result
   * @deprecated Use POST /api/laboratory/test-results instead
   */
  @Post('/fecalysis-results')
  @HttpCode(201)
  async createFecalysisResult(@Body() body: CreateFecalysisResultCommand): Promise<ApiSuccessResponse<any>> {
    const validatedData = this.validationService.validateCreateFecalysisResultCommand(body);
    const fecalysisResult = await this.createFecalysisResultUseCase.execute(validatedData);
    const fecalysisResultDto = LaboratoryMapper.toFecalysisResultDto(fecalysisResult);

    return ApiResponseBuilder.success(fecalysisResultDto);
  }

  /**
   * PUT /api/laboratory/fecalysis-results/:id - Update fecalysis result
   * @deprecated Use general lab test results endpoint instead
   */
  @Put('/fecalysis-results/:id')
  async updateFecalysisResult(
    @Param('id') id: string,
    @Body() body: UpdateFecalysisResultCommand
  ): Promise<ApiSuccessResponse<any>> {
    const updateData = { ...body, id };
    const validatedData = this.validationService.validateUpdateFecalysisResultCommand(updateData);
    const fecalysisResult = await this.updateFecalysisResultUseCase.execute(validatedData);
    const fecalysisResultDto = LaboratoryMapper.toFecalysisResultDto(fecalysisResult);

    return ApiResponseBuilder.success(fecalysisResultDto);
  }

  /**
   * DELETE /api/laboratory/fecalysis-results/:id - Delete fecalysis result
   * @deprecated Use general lab test results endpoint instead
   */
  @Delete('/fecalysis-results/:id')
  async deleteFecalysisResult(@Param('id') id: string): Promise<LaboratoryOperationResponse> {
    await this.deleteFecalysisResultUseCase.execute({ id });
    return ApiResponseBuilder.successWithMessage('Fecalysis result deleted successfully');
  }

  // ==================== SEROLOGY RESULTS ENDPOINTS (LEGACY - DO NOT USE) ====================
  // @deprecated These specialized test result endpoints are legacy.
  // Use the general createLabTestResult endpoint (POST /api/laboratory/test-results) instead.
  
  /**
   * GET /api/laboratory/serology-results - Get all serology results
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/serology-results')
  async getAllSerologyResults(): Promise<ApiSuccessResponse<any[]>> {
    const serologyResults = await this.getAllSerologyResultsQueryHandler.execute();
    const serologyResultDtos = LaboratoryMapper.toSerologyResultDtoArray(serologyResults);

    return ApiResponseBuilder.success(serologyResultDtos);
  }

  /**
   * GET /api/laboratory/serology-results/:id - Get serology result by ID
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/serology-results/:id')
  async getSerologyResultById(@Param('id') id: string): Promise<ApiSuccessResponse<any>> {
    const serologyResult = await this.getSerologyResultByIdQueryHandler.execute(id);
    const serologyResultDto = LaboratoryMapper.toSerologyResultDto(serologyResult);

    return ApiResponseBuilder.success(serologyResultDto);
  }

  /**
   * GET /api/laboratory/serology-results/patient/:patientId - Get serology results by patient ID
   * @deprecated Use general lab test results endpoint instead
   */
  @Get('/serology-results/patient/:patientId')
  async getSerologyResultsByPatientId(@Param('patientId') patientId: string): Promise<ApiSuccessResponse<any[]>> {
    const validatedPatientId = LabRequestIdSchema.parse(patientId);
    const serologyResults = await this.getSerologyResultsByPatientIdQueryHandler.execute(validatedPatientId);
    const serologyResultDtos = LaboratoryMapper.toSerologyResultDtoArray(serologyResults);

    return ApiResponseBuilder.success(serologyResultDtos);
  }

  /**
   * POST /api/laboratory/serology-results - Create a new serology result
   * @deprecated Use POST /api/laboratory/test-results instead
   */
  @Post('/serology-results')
  @HttpCode(201)
  async createSerologyResult(@Body() body: CreateSerologyResultCommand): Promise<ApiSuccessResponse<any>> {
    const validatedData = this.validationService.validateCreateSerologyResultCommand(body);
    const serologyResult = await this.createSerologyResultUseCase.execute(validatedData);
    const serologyResultDto = LaboratoryMapper.toSerologyResultDto(serologyResult);

    return ApiResponseBuilder.success(serologyResultDto);
  }

  /**
   * PUT /api/laboratory/serology-results/:id - Update serology result
   * @deprecated Use general lab test results endpoint instead
   */
  @Put('/serology-results/:id')
  async updateSerologyResult(
    @Param('id') id: string,
    @Body() body: UpdateSerologyResultCommand
  ): Promise<ApiSuccessResponse<any>> {
    const updateData = { ...body, id };
    const validatedData = this.validationService.validateUpdateSerologyResultCommand(updateData);
    const serologyResult = await this.updateSerologyResultUseCase.execute(validatedData);
    const serologyResultDto = LaboratoryMapper.toSerologyResultDto(serologyResult);

    return ApiResponseBuilder.success(serologyResultDto);
  }

  /**
   * DELETE /api/laboratory/serology-results/:id - Delete serology result
   * @deprecated Use general lab test results endpoint instead
   */
  @Delete('/serology-results/:id')
  async deleteSerologyResult(@Param('id') id: string): Promise<LaboratoryOperationResponse> {
    await this.deleteSerologyResultUseCase.execute({ id });
    return ApiResponseBuilder.successWithMessage('Serology result deleted successfully');
  }
}
