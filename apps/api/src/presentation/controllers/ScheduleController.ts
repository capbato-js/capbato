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
  QueryParam,
} from 'routing-controllers';
import {
  CreateScheduleUseCase,
  UpdateScheduleUseCase,
  DeleteScheduleUseCase,
  GetAllSchedulesQueryHandler,
  GetScheduleByIdQueryHandler,
  GetSchedulesByDateQueryHandler,
  GetSchedulesByDoctorQueryHandler,
  GetTodaySchedulesQueryHandler,
  GetTodayDoctorQueryHandler,
  GetScheduleStatsQueryHandler,
  ScheduleMapper,
  TOKENS,
  ScheduleValidationService,
  ScheduleIdSchema,
  ScheduleWithDoctorService,
} from '@nx-starter/application-shared';
import {
  ScheduleListResponse,
  ScheduleResponse,
  ScheduleStatsResponse,
  ScheduleOperationResponse,
  TodayDoctorResponse,
  CreateScheduleRequestDto,
  UpdateScheduleRequestDto,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

/**
 * REST API Controller for Schedule operations
 * Follows Clean Architecture - Controllers are part of the presentation layer
 */
@Controller('/schedules')
@injectable()
export class ScheduleController {
  constructor(
    @inject(TOKENS.CreateScheduleUseCase)
    private createScheduleUseCase: CreateScheduleUseCase,
    @inject(TOKENS.UpdateScheduleUseCase)
    private updateScheduleUseCase: UpdateScheduleUseCase,
    @inject(TOKENS.DeleteScheduleUseCase)
    private deleteScheduleUseCase: DeleteScheduleUseCase,
    @inject(TOKENS.GetAllSchedulesQueryHandler)
    private getAllSchedulesQueryHandler: GetAllSchedulesQueryHandler,
    @inject(TOKENS.GetScheduleByIdQueryHandler)
    private getScheduleByIdQueryHandler: GetScheduleByIdQueryHandler,
    @inject(TOKENS.GetSchedulesByDateQueryHandler)
    private getSchedulesByDateQueryHandler: GetSchedulesByDateQueryHandler,
    @inject(TOKENS.GetSchedulesByDoctorQueryHandler)
    private getSchedulesByDoctorQueryHandler: GetSchedulesByDoctorQueryHandler,
    @inject(TOKENS.GetTodaySchedulesQueryHandler)
    private getTodaySchedulesQueryHandler: GetTodaySchedulesQueryHandler,
    @inject(TOKENS.GetTodayDoctorQueryHandler)
    private getTodayDoctorQueryHandler: GetTodayDoctorQueryHandler,
    @inject(TOKENS.GetScheduleStatsQueryHandler)
    private getScheduleStatsQueryHandler: GetScheduleStatsQueryHandler,
    @inject(TOKENS.ScheduleValidationService)
    private validationService: ScheduleValidationService,
    @inject(TOKENS.ScheduleWithDoctorService)
    private scheduleWithDoctorService: ScheduleWithDoctorService
  ) {}

  /**
   * GET /api/schedules - Get all schedules with doctor names
   * Query params:
   * - activeOnly: boolean (default: true) - whether to include only future schedules
   */
  @Get('/')
  async getAllSchedules(
    @QueryParam('activeOnly') activeOnly?: boolean
  ): Promise<ScheduleListResponse> {
    const { schedules, doctorNames } = await this.scheduleWithDoctorService.getAllSchedulesWithDoctorNames(
      activeOnly !== false // Default to true unless explicitly false
    );
    const scheduleDtos = ScheduleMapper.toDtoArray(schedules, doctorNames);

    return ApiResponseBuilder.success(scheduleDtos);
  }

  /**
   * GET /api/schedules/stats - Get schedule statistics
   */
  @Get('/stats')
  async getScheduleStats(): Promise<ScheduleStatsResponse> {
    const stats = await this.getScheduleStatsQueryHandler.execute();

    return ApiResponseBuilder.success(stats);
  }

  /**
   * GET /api/schedules/today - Get today's doctor (first scheduled doctor for today)
   */
  @Get('/today')
  async getTodayDoctor(): Promise<TodayDoctorResponse> {
    const schedule = await this.getTodayDoctorQueryHandler.execute();
    
    if (!schedule) {
      const todayDoctorDto = { doctorName: 'N/A' };
      return ApiResponseBuilder.success(todayDoctorDto);
    }

    const todayDoctorDto = ScheduleMapper.toTodayDoctorDto(schedule);
    return ApiResponseBuilder.success(todayDoctorDto);
  }

  /**
   * GET /api/schedules/date/:date - Get schedules by date with doctor names
   */
  @Get('/date/:date')
  async getSchedulesByDate(@Param('date') date: string): Promise<ScheduleListResponse> {
    const validatedData = this.validationService.validateGetByDateQuery({ date });
    const { schedules, doctorNames } = await this.scheduleWithDoctorService.getSchedulesByDateWithDoctorNames(validatedData.date);
    const scheduleDtos = ScheduleMapper.toDtoArray(schedules, doctorNames);

    return ApiResponseBuilder.success(scheduleDtos);
  }

  /**
   * GET /api/schedules/doctor/:doctorId - Get schedules by doctor ID with doctor names
   */
  @Get('/doctor/:doctorId')
  async getSchedulesByDoctor(@Param('doctorId') doctorId: string): Promise<ScheduleListResponse> {
    const validatedData = this.validationService.validateGetByDoctorQuery({ doctorId });
    const { schedules, doctorNames } = await this.scheduleWithDoctorService.getSchedulesByDoctorWithDoctorNames(validatedData.doctorId);
    const scheduleDtos = ScheduleMapper.toDtoArray(schedules, doctorNames);

    return ApiResponseBuilder.success(scheduleDtos);
  }

  /**
   * GET /api/schedules/:id - Get schedule by ID
   */
  @Get('/:id')
  async getScheduleById(@Param('id') id: string): Promise<ScheduleResponse> {
    // Validate the ID parameter
    const validatedId = ScheduleIdSchema.parse(id);
    const schedule = await this.getScheduleByIdQueryHandler.execute({ id: validatedId });
    const scheduleDto = ScheduleMapper.toDto(schedule);
    return ApiResponseBuilder.success(scheduleDto);
  }

  /**
   * POST /api/schedules - Create a new schedule
   */
  @Post('/')
  @HttpCode(201)
  async createSchedule(@Body() body: CreateScheduleRequestDto): Promise<ScheduleResponse> {
    const validatedData = this.validationService.validateCreateCommand(body);
    const schedule = await this.createScheduleUseCase.execute(validatedData);
    const scheduleDto = ScheduleMapper.toDto(schedule);

    return ApiResponseBuilder.success(scheduleDto);
  }

  /**
   * PUT /api/schedules/:id - Update a schedule
   */
  @Put('/:id')
  async updateSchedule(@Param('id') id: string, @Body() body: UpdateScheduleRequestDto): Promise<ScheduleOperationResponse> {
    // Validate the combined data (body + id) using the validation service
    const validatedData = this.validationService.validateUpdateCommand({
      ...body,
      id,
    });

    await this.updateScheduleUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Schedule updated successfully');
  }

  /**
   * DELETE /api/schedules/:id - Delete a schedule
   */
  @Delete('/:id')
  async deleteSchedule(@Param('id') id: string): Promise<ScheduleOperationResponse> {
    const validatedData = this.validationService.validateDeleteCommand({ id });

    await this.deleteScheduleUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Schedule deleted successfully');
  }
}