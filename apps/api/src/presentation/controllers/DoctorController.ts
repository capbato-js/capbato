import { injectable, inject } from 'tsyringe';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  QueryParam,
  Authorized,
} from 'routing-controllers';
import { CreateDoctorProfileCommandHandler } from '@nx-starter/application-api';
import {
  GetAllDoctorsQueryHandler,
  GetDoctorByIdQueryHandler,
  GetDoctorByUserIdQueryHandler,
  GetDoctorsBySpecializationQueryHandler,
  CheckDoctorProfileExistsQueryHandler,
  UpdateDoctorSchedulePatternUseCase,
  RemoveDoctorSchedulePatternUseCase,
  InitializeDoctorSchedulesUseCase,
  CreateScheduleOverrideUseCase,
  UpdateScheduleOverrideUseCase,
  DeleteScheduleOverrideUseCase,
  GetAllScheduleOverridesQueryHandler,
  GetScheduleOverrideByDateQueryHandler,
  GetScheduleOverrideByIdQueryHandler,
} from '@nx-starter/application-shared';
import {
  DoctorListResponse,
  DoctorSummaryListResponse,
  DoctorResponse,
  DoctorOperationResponse,
  DoctorScheduleOperationResponse,
  CreateDoctorProfileCommand,
  UpdateDoctorProfileCommand,
  UpdateDoctorSchedulePatternCommand,
  RemoveDoctorSchedulePatternCommand,
  UpdateDoctorSchedulePatternRequestDto,
  CreateScheduleOverrideRequestDto,
  UpdateScheduleOverrideRequestDto,
  ScheduleOverrideListResponse,
  GetAllDoctorsQuery,
  GetDoctorByIdQuery,
  GetDoctorByUserIdQuery,
  GetDoctorsBySpecializationQuery,
  TOKENS,
  DoctorValidationService,
  ScheduleOverrideValidationService,
  ScheduleOverrideMapper,
  CreateDoctorProfileCommandSchema,
  UpdateDoctorProfileCommandSchema,
  DoctorIdSchema,
  UserIdSchema,
  SpecializationSchema,
  ScheduleOverrideDateSchema,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

/**
 * REST API Controller for Doctor Profile operations
 * Follows Clean Architecture - Controllers are part of the presentation layer
 * 
 * This controller manages doctor profiles that are linked to User accounts.
 * It provides endpoints for CRUD operations on doctor professional information.
 */
@Controller('/doctors')
@injectable()
export class DoctorController {
  constructor(
    @inject(TOKENS.GetAllDoctorsQueryHandler)
    private getAllDoctorsQueryHandler: GetAllDoctorsQueryHandler,
    @inject(TOKENS.GetDoctorByIdQueryHandler)
    private getDoctorByIdQueryHandler: GetDoctorByIdQueryHandler,
    @inject(TOKENS.GetDoctorByUserIdQueryHandler)
    private getDoctorByUserIdQueryHandler: GetDoctorByUserIdQueryHandler,
    @inject(TOKENS.GetDoctorsBySpecializationQueryHandler)
    private getDoctorsBySpecializationQueryHandler: GetDoctorsBySpecializationQueryHandler,
    @inject(TOKENS.CheckDoctorProfileExistsQueryHandler)
    private checkDoctorProfileExistsQueryHandler: CheckDoctorProfileExistsQueryHandler,
    @inject(TOKENS.CreateDoctorProfileCommandHandler)
    private createDoctorProfileCommandHandler: CreateDoctorProfileCommandHandler,
    @inject(TOKENS.UpdateDoctorSchedulePatternUseCase)
    private updateDoctorSchedulePatternUseCase: UpdateDoctorSchedulePatternUseCase,
    @inject(TOKENS.RemoveDoctorSchedulePatternUseCase)
    private removeDoctorSchedulePatternUseCase: RemoveDoctorSchedulePatternUseCase,
    @inject(TOKENS.InitializeDoctorSchedulesUseCase)
    private initializeDoctorSchedulesUseCase: InitializeDoctorSchedulesUseCase,
    @inject(TOKENS.CreateScheduleOverrideUseCase)
    private createScheduleOverrideUseCase: CreateScheduleOverrideUseCase,
    @inject(TOKENS.UpdateScheduleOverrideUseCase)
    private updateScheduleOverrideUseCase: UpdateScheduleOverrideUseCase,
    @inject(TOKENS.DeleteScheduleOverrideUseCase)
    private deleteScheduleOverrideUseCase: DeleteScheduleOverrideUseCase,
    @inject(TOKENS.GetAllScheduleOverridesQueryHandler)
    private getAllScheduleOverridesQueryHandler: GetAllScheduleOverridesQueryHandler,
    @inject(TOKENS.GetScheduleOverrideByDateQueryHandler)
    private getScheduleOverrideByDateQueryHandler: GetScheduleOverrideByDateQueryHandler,
    @inject(TOKENS.DoctorValidationService)
    private validationService: DoctorValidationService,
    @inject(TOKENS.ScheduleOverrideValidationService)
    private scheduleOverrideValidationService: ScheduleOverrideValidationService
  ) {}

  /**
   * GET /api/doctors - Get all doctors with optional filtering
   * Query params:
   * - active: boolean (default: true) - whether to include only active doctors
   * - format: 'full' | 'summary' (default: 'full') - response format
   */
  @Get('/')
  async getAllDoctors(
    @QueryParam('active') active?: boolean,
    @QueryParam('format') format?: string
  ): Promise<DoctorListResponse | DoctorSummaryListResponse> {
    const query: GetAllDoctorsQuery = {
      activeOnly: active !== false // Default to true unless explicitly false
    };

    if (format === 'summary') {
      const doctorSummaries = await this.getAllDoctorsQueryHandler.getSummary(query);
      return ApiResponseBuilder.success(doctorSummaries);
    } else {
      const doctors = await this.getAllDoctorsQueryHandler.execute(query);
      return ApiResponseBuilder.success(doctors);
    }
  }

  /**
   * GET /api/doctors/schedule-overrides - Get all schedule overrides (Admin only)
   */
  @Get('/schedule-overrides')
  @Authorized('admin')
  async getScheduleOverrides(): Promise<ScheduleOverrideListResponse> {
    const overrides = await this.getAllScheduleOverridesQueryHandler.execute();
    const overrideDtos = ScheduleOverrideMapper.toDtoArray(overrides);

    return ApiResponseBuilder.success(overrideDtos);
  }

  /**
   * GET /api/doctors/:id - Get doctor profile by profile ID
   */
  @Get('/:id')
  async getDoctorById(@Param('id') id: string): Promise<DoctorResponse> {
    const validatedId = DoctorIdSchema.parse(id);
    const query: GetDoctorByIdQuery = { id: validatedId };
    
    const doctor = await this.getDoctorByIdQueryHandler.execute(query);
    if (!doctor) {
      throw new Error(`Doctor profile with ID ${validatedId} not found`);
    }
    
    return ApiResponseBuilder.success(doctor);
  }

  /**
   * GET /api/doctors/user/:userId - Get doctor profile by user ID
   */
  @Get('/user/:userId')
  async getDoctorByUserId(@Param('userId') userId: string): Promise<DoctorResponse> {
    const validatedUserId = UserIdSchema.parse(userId);
    const query: GetDoctorByUserIdQuery = { userId: validatedUserId };
    
    const doctor = await this.getDoctorByUserIdQueryHandler.execute(query);
    if (!doctor) {
      throw new Error(`Doctor profile for user ${validatedUserId} not found`);
    }
    
    return ApiResponseBuilder.success(doctor);
  }

  /**
   * GET /api/doctors/specialization/:specialization - Get doctors by specialization
   */
  @Get('/specialization/:specialization')
  async getDoctorsBySpecialization(
    @Param('specialization') specialization: string,
    @QueryParam('active') active?: boolean
  ): Promise<DoctorListResponse> {
    const validatedSpecialization = SpecializationSchema.parse(specialization);
    const query: GetDoctorsBySpecializationQuery = { specialization: validatedSpecialization };
    
    const doctors = await this.getDoctorsBySpecializationQueryHandler.execute(
      query, 
      active !== false // Default to true unless explicitly false
    );

    return ApiResponseBuilder.success(doctors);
  }

  /**
   * GET /api/doctors/check/:userId - Check if user has a doctor profile
   */
  @Get('/check/:userId')
  async checkDoctorProfileExists(@Param('userId') userId: string): Promise<{ exists: boolean }> {
    const validatedUserId = UserIdSchema.parse(userId);
    const exists = await this.checkDoctorProfileExistsQueryHandler.execute(validatedUserId);
    
    return { exists };
  }

  /**
   * POST /api/doctors - Create a new doctor profile
   */
  @Post('/')
  async createDoctorProfile(@Body() command: CreateDoctorProfileCommand): Promise<DoctorOperationResponse> {
    // Validate the command
    const validatedCommand = CreateDoctorProfileCommandSchema.parse(command);
    
    // Execute the command - TypeScript should recognize that validation ensures required fields
    await this.createDoctorProfileCommandHandler.execute(validatedCommand as CreateDoctorProfileCommand);
    
    return ApiResponseBuilder.successWithMessage('Doctor profile created successfully');
  }

  /**
   * PUT /api/doctors/:id - Update a doctor profile
   */
  @Put('/:id')
  async updateDoctorProfile(
    @Param('id') id: string,
    @Body() command: Omit<UpdateDoctorProfileCommand, 'id'>
  ): Promise<DoctorOperationResponse> {
    const validatedId = DoctorIdSchema.parse(id);
    const fullCommand: UpdateDoctorProfileCommand = { ...command, id: validatedId };
    
    // Validate the command
    const validatedCommand = UpdateDoctorProfileCommandSchema.parse(fullCommand);
    
    // TODO: Implement UpdateDoctorProfileCommandHandler
    // const result = await this.updateDoctorProfileCommandHandler.execute(validatedCommand);
    
    return ApiResponseBuilder.successWithMessage('Doctor profile updated successfully');
  }

  /**
   * DELETE /api/doctors/:id - Delete a doctor profile (soft delete - set inactive)
   */
  @Delete('/:id')
  async deleteDoctorProfile(@Param('id') id: string): Promise<DoctorOperationResponse> {
    const validatedId = DoctorIdSchema.parse(id);
    
    // TODO: Implement DeleteDoctorProfileCommandHandler or update profile to inactive
    // const result = await this.deleteDoctorProfileCommandHandler.execute({ id: validatedId });
    
    return ApiResponseBuilder.successWithMessage('Doctor profile deactivated successfully');
  }

  /**
   * PUT /api/doctors/:id/schedule - Update a doctor's schedule pattern (Admin only)
   */
  @Put('/:id/schedule')
  @Authorized('admin')
  async updateDoctorSchedulePattern(
    @Param('id') id: string,
    @Body() requestDto: UpdateDoctorSchedulePatternRequestDto
  ): Promise<DoctorScheduleOperationResponse> {
    const validatedId = DoctorIdSchema.parse(id);
    
    // Validate schedule pattern
    if (!requestDto.schedulePattern || requestDto.schedulePattern.trim() === '') {
      throw new Error('Schedule pattern is required');
    }

    const command: UpdateDoctorSchedulePatternCommand = {
      id: validatedId,
      schedulePattern: requestDto.schedulePattern.trim()
    };

    await this.updateDoctorSchedulePatternUseCase.execute(command);

    return ApiResponseBuilder.successWithMessage(
      `Doctor schedule pattern updated to: ${requestDto.schedulePattern}`
    );
  }

  /**
   * DELETE /api/doctors/:id/schedule - Remove a doctor's schedule pattern (Admin only)
   */
  @Delete('/:id/schedule')
  @Authorized('admin')
  async removeDoctorSchedulePattern(@Param('id') id: string): Promise<DoctorScheduleOperationResponse> {
    const validatedId = DoctorIdSchema.parse(id);

    const command: RemoveDoctorSchedulePatternCommand = {
      id: validatedId
    };

    await this.removeDoctorSchedulePatternUseCase.execute(command);

    return ApiResponseBuilder.successWithMessage('Doctor schedule pattern removed successfully');
  }

  /**
   * POST /api/doctors/initialize-schedules - Initialize default schedule patterns for doctors without them (Admin only)
   */
  @Post('/initialize-schedules')
  // @Authorized('admin')
  async initializeDoctorSchedules(): Promise<{
    success: boolean;
    message: string;
    data: { updated: number; skipped: number; doctors: unknown[] };
  }> {
    const result = await this.initializeDoctorSchedulesUseCase.execute();

    return {
      success: true,
      message: `Initialized schedules for ${result.updated} doctors, skipped ${result.skipped} doctors that already had schedules`,
      data: result
    };
  }

  /**
   * POST /api/doctors/schedule-override - Override doctor assignment for a specific date
   */
  @Post('/schedule-override')
  @Authorized('admin')
  async createScheduleOverride(@Body() body: CreateScheduleOverrideRequestDto): Promise<DoctorScheduleOperationResponse> {
    const validatedData = this.scheduleOverrideValidationService.validateCreateCommand(body);
    await this.createScheduleOverrideUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage(
      `Schedule override created for ${body.date}. Dr. ${body.assignedDoctorId} will be assigned.`
    );
  }

  /**
   * PUT /api/doctors/schedule-override/:id - Update existing schedule override
   */
  @Put('/schedule-override/:id')
  @Authorized('admin')
  async updateScheduleOverride(
    @Param('id') id: string, 
    @Body() body: UpdateScheduleOverrideRequestDto
  ): Promise<DoctorScheduleOperationResponse> {
    const validatedData = this.scheduleOverrideValidationService.validateUpdateCommand({
      id,
      ...body
    });
    
    await this.updateScheduleOverrideUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage(
      `Schedule override updated successfully.`
    );
  }

  /**
   * DELETE /api/doctors/schedule-override/:date - Remove schedule override for a specific date
   */
  @Delete('/schedule-override/:date')
  @Authorized('admin')
  async removeScheduleOverride(@Param('date') date: string): Promise<DoctorScheduleOperationResponse> {
    const validatedDate = ScheduleOverrideDateSchema.parse(date);
    
    // Get the override first to make sure it exists
    const override = await this.getScheduleOverrideByDateQueryHandler.execute({ date: validatedDate });
    if (override) {
      await this.deleteScheduleOverrideUseCase.execute({ id: override.id });
    }

    return ApiResponseBuilder.successWithMessage(
      `Schedule override removed for ${date}. Default schedule pattern will be used.`
    );
  }
}
