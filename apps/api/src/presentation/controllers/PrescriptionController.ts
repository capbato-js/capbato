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
  CreatePrescriptionUseCase,
  UpdatePrescriptionUseCase,
  DeletePrescriptionUseCase,
  GetAllPrescriptionsQueryHandler,
  GetPrescriptionByIdQueryHandler,
  GetPrescriptionsByPatientIdQueryHandler,
  GetPrescriptionsByDoctorIdQueryHandler,
  GetActivePrescriptionsQueryHandler,
  GetExpiredPrescriptionsQueryHandler,
  GetPrescriptionsByMedicationNameQueryHandler,
  GetPrescriptionStatsQueryHandler,
  GetPatientByIdQueryHandler,
  GetDoctorByIdQueryHandler,
  PrescriptionMapper,
  TOKENS,
  PrescriptionValidationService,
  PrescriptionIdSchema,
  FlexibleIdSchema,
} from '@nx-starter/application-shared';
import {
  PrescriptionListResponse,
  PrescriptionResponse,
  PrescriptionStatsResponse,
  PrescriptionOperationResponse,
  CreatePrescriptionRequestDto,
  UpdatePrescriptionRequestDto,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

/**
 * REST API Controller for Prescription operations
 * Follows Clean Architecture - Controllers are part of the presentation layer
 */
@Controller('/prescriptions')
@injectable()
export class PrescriptionController {
  constructor(
    @inject(TOKENS.CreatePrescriptionUseCase)
    private createPrescriptionUseCase: CreatePrescriptionUseCase,
    @inject(TOKENS.UpdatePrescriptionUseCase)
    private updatePrescriptionUseCase: UpdatePrescriptionUseCase,
    @inject(TOKENS.DeletePrescriptionUseCase)
    private deletePrescriptionUseCase: DeletePrescriptionUseCase,
    @inject(TOKENS.GetAllPrescriptionsQueryHandler)
    private getAllPrescriptionsQueryHandler: GetAllPrescriptionsQueryHandler,
    @inject(TOKENS.GetPrescriptionByIdQueryHandler)
    private getPrescriptionByIdQueryHandler: GetPrescriptionByIdQueryHandler,
    @inject(TOKENS.GetPrescriptionsByPatientIdQueryHandler)
    private getPrescriptionsByPatientIdQueryHandler: GetPrescriptionsByPatientIdQueryHandler,
    @inject(TOKENS.GetPrescriptionsByDoctorIdQueryHandler)
    private getPrescriptionsByDoctorIdQueryHandler: GetPrescriptionsByDoctorIdQueryHandler,
    @inject(TOKENS.GetActivePrescriptionsQueryHandler)
    private getActivePrescriptionsQueryHandler: GetActivePrescriptionsQueryHandler,
    @inject(TOKENS.GetExpiredPrescriptionsQueryHandler)
    private getExpiredPrescriptionsQueryHandler: GetExpiredPrescriptionsQueryHandler,
    @inject(TOKENS.GetPrescriptionsByMedicationNameQueryHandler)
    private getPrescriptionsByMedicationNameQueryHandler: GetPrescriptionsByMedicationNameQueryHandler,
    @inject(TOKENS.GetPrescriptionStatsQueryHandler)
    private getPrescriptionStatsQueryHandler: GetPrescriptionStatsQueryHandler,
    @inject(TOKENS.GetPatientByIdQueryHandler)
    private getPatientByIdQueryHandler: GetPatientByIdQueryHandler,
    @inject(TOKENS.GetDoctorByIdQueryHandler)
    private getDoctorByIdQueryHandler: GetDoctorByIdQueryHandler,
    @inject(TOKENS.PrescriptionValidationService)
    private validationService: PrescriptionValidationService
  ) {}

  /**
   * GET /api/prescriptions - Get all prescriptions
   */
  @Get('/')
  async getAllPrescriptions(): Promise<PrescriptionListResponse> {
    const prescriptions = await this.getAllPrescriptionsQueryHandler.execute();
    
    // Map prescriptions to DTOs with populated patient and doctor data
    const prescriptionDtos = await Promise.all(prescriptions.map(async (prescription) => {
      // Fetch patient and doctor data separately to populate the response
      const [patientData, doctorData] = await Promise.all([
        this.getPatientByIdQueryHandler.execute({ id: prescription.patientId }),
        this.getDoctorByIdQueryHandler.execute({ id: prescription.doctorId })
      ]);
      
      // Map prescription to DTO with populated patient and doctor data
      return PrescriptionMapper.toDto(prescription, patientData, doctorData);
    }));

    return ApiResponseBuilder.success(prescriptionDtos);
  }

  /**
   * GET /api/prescriptions/active - Get active prescriptions
   */
  @Get('/active')
  async getActivePrescriptions(): Promise<PrescriptionListResponse> {
    const prescriptions = await this.getActivePrescriptionsQueryHandler.execute();
    const prescriptionDtos = PrescriptionMapper.toDtoArray(prescriptions);

    return ApiResponseBuilder.success(prescriptionDtos);
  }

  /**
   * GET /api/prescriptions/expired - Get expired prescriptions
   */
  @Get('/expired')
  async getExpiredPrescriptions(): Promise<PrescriptionListResponse> {
    const prescriptions = await this.getExpiredPrescriptionsQueryHandler.execute();
    const prescriptionDtos = PrescriptionMapper.toDtoArray(prescriptions);

    return ApiResponseBuilder.success(prescriptionDtos);
  }

  /**
   * GET /api/prescriptions/stats - Get prescription statistics
   */
  @Get('/stats')
  async getPrescriptionStats(): Promise<PrescriptionStatsResponse> {
    const stats = await this.getPrescriptionStatsQueryHandler.execute();

    // Transform to match PrescriptionStatsDto structure
    const transformedStats = {
      totalCount: stats.totalCount,
      activeCount: stats.activeCount,
      completedCount: 0, // Set default values for missing properties
      discontinuedCount: 0,
      onHoldCount: 0,
      expiredCount: stats.expiredCount,
      mostPrescribedMedications: stats.mostPrescribedMedications
    };

    return ApiResponseBuilder.success(transformedStats);
  }

  /**
   * GET /api/prescriptions/patient/:patientId - Get prescriptions by patient ID
   */
  @Get('/patient/:patientId')
  async getPrescriptionsByPatientId(@Param('patientId') patientId: string): Promise<PrescriptionListResponse> {
    // Validate the patient ID parameter
    const validatedPatientId = FlexibleIdSchema.parse(patientId);
    const prescriptions = await this.getPrescriptionsByPatientIdQueryHandler.execute({ 
      patientId: validatedPatientId 
    });

    // Map prescriptions to DTOs with populated patient and doctor data
    const prescriptionDtos = await Promise.all(prescriptions.map(async (prescription) => {
      // Fetch patient and doctor data separately to populate the response
      const [patientData, doctorData] = await Promise.all([
        this.getPatientByIdQueryHandler.execute({ id: prescription.patientId }),
        this.getDoctorByIdQueryHandler.execute({ id: prescription.doctorId })
      ]);
      
      // Map prescription to DTO with populated patient and doctor data
      return PrescriptionMapper.toDto(prescription, patientData, doctorData);
    }));
    
    return ApiResponseBuilder.success(prescriptionDtos);
  }

  /**
   * GET /api/prescriptions/doctor/:doctorId - Get prescriptions by doctor ID
   */
  @Get('/doctor/:doctorId')
  async getPrescriptionsByDoctorId(@Param('doctorId') doctorId: string): Promise<PrescriptionListResponse> {
    // Validate the doctor ID parameter
    const validatedDoctorId = FlexibleIdSchema.parse(doctorId);
    const prescriptions = await this.getPrescriptionsByDoctorIdQueryHandler.execute({ 
      doctorId: validatedDoctorId 
    });
    const prescriptionDtos = PrescriptionMapper.toDtoArray(prescriptions);
    
    return ApiResponseBuilder.success(prescriptionDtos);
  }

  /**
   * GET /api/prescriptions/medication/:medicationName - Get prescriptions by medication name
   */
  @Get('/medication/:medicationName')
  async getPrescriptionsByMedicationName(@Param('medicationName') medicationName: string): Promise<PrescriptionListResponse> {
    const prescriptions = await this.getPrescriptionsByMedicationNameQueryHandler.execute({ 
      medicationName 
    });
    const prescriptionDtos = PrescriptionMapper.toDtoArray(prescriptions);
    
    return ApiResponseBuilder.success(prescriptionDtos);
  }

  /**
   * GET /api/prescriptions/:id - Get prescription by ID
   */
  @Get('/:id')
  async getPrescriptionById(@Param('id') id: string): Promise<PrescriptionResponse> {
    // Validate the ID parameter
    const validatedId = PrescriptionIdSchema.parse(id);
    const prescription = await this.getPrescriptionByIdQueryHandler.execute({ id: validatedId });
    const prescriptionDto = PrescriptionMapper.toDto(prescription);
    
    return ApiResponseBuilder.success(prescriptionDto);
  }

  /**
   * POST /api/prescriptions - Create a new prescription
   */
  @Post('/')
  @HttpCode(201)
  async createPrescription(@Body() body: CreatePrescriptionRequestDto): Promise<PrescriptionResponse> {
    const validatedData = this.validationService.validateCreateCommand(body);
    const prescription = await this.createPrescriptionUseCase.execute(validatedData);
    
    // Fetch patient and doctor data separately to populate the response
    const [patientData, doctorData] = await Promise.all([
      this.getPatientByIdQueryHandler.execute({ id: prescription.patientId }),
      this.getDoctorByIdQueryHandler.execute({ id: prescription.doctorId })
    ]);
    
    // Map prescription to DTO with populated patient and doctor data
    const prescriptionDto = PrescriptionMapper.toDto(prescription, patientData, doctorData);

    return ApiResponseBuilder.success(prescriptionDto);
  }

  /**
   * PUT /api/prescriptions/:id - Update a prescription
   */
  @Put('/:id')
  async updatePrescription(
    @Param('id') id: string, 
    @Body() body: UpdatePrescriptionRequestDto
  ): Promise<PrescriptionResponse> {
    // Validate the combined data (body + id) using the validation service
    const validatedData = this.validationService.validateUpdateCommand({
      ...body,
      id,
    });

    await this.updatePrescriptionUseCase.execute(validatedData);

    // Fetch the updated prescription to return with populated data
    const prescription = await this.getPrescriptionByIdQueryHandler.execute({ id: validatedData.id });
    
    // Fetch patient and doctor data separately to populate the response
    const [patientData, doctorData] = await Promise.all([
      this.getPatientByIdQueryHandler.execute({ id: prescription.patientId }),
      this.getDoctorByIdQueryHandler.execute({ id: prescription.doctorId })
    ]);
    
    // Map prescription to DTO with populated patient and doctor data
    const prescriptionDto = PrescriptionMapper.toDto(prescription, patientData, doctorData);

    return ApiResponseBuilder.success(prescriptionDto);
  }

  /**
   * DELETE /api/prescriptions/:id - Delete a prescription
   */
  @Delete('/:id')
  async deletePrescription(@Param('id') id: string): Promise<PrescriptionOperationResponse> {
    const validatedData = this.validationService.validateDeleteCommand({ id });

    await this.deletePrescriptionUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Prescription deleted successfully');
  }
}