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
import { DoctorNotFoundException } from '@nx-starter/domain';
import {
  CreateAppointmentUseCase,
  UpdateAppointmentUseCase,
  DeleteAppointmentUseCase,
  ConfirmAppointmentUseCase,
  CancelAppointmentUseCase,
  CompleteAppointmentUseCase,
  RescheduleAppointmentUseCase,
  GetAllAppointmentsQueryHandler,
  GetAppointmentByIdQueryHandler,
  GetAppointmentsByPatientIdQueryHandler,
  GetTodayAppointmentsQueryHandler,
  GetTodayConfirmedAppointmentsQueryHandler,
  GetConfirmedAppointmentsQueryHandler,
  GetWeeklyAppointmentSummaryQueryHandler,
  GetAppointmentStatsQueryHandler,
  GetPatientByIdQueryHandler,
  GetDoctorByIdQueryHandler,
  AppointmentMapper,
  TOKENS,
  AppointmentValidationService,
  AppointmentIdSchema,
} from '@nx-starter/application-shared';
import {
  AppointmentListResponse,
  AppointmentResponse,
  AppointmentStatsResponse,
  AppointmentOperationResponse,
  WeeklyAppointmentSummaryResponse,
  CreateAppointmentRequestDto,
  UpdateAppointmentRequestDto,
  RescheduleAppointmentRequestDto,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

/**
 * REST API Controller for Appointment operations
 * Follows Clean Architecture - Controllers are part of the presentation layer
 */
@Controller('/appointments')
@injectable()
export class AppointmentController {
  constructor(
    @inject(TOKENS.CreateAppointmentUseCase)
    private createAppointmentUseCase: CreateAppointmentUseCase,
    @inject(TOKENS.UpdateAppointmentUseCase)
    private updateAppointmentUseCase: UpdateAppointmentUseCase,
    @inject(TOKENS.DeleteAppointmentUseCase)
    private deleteAppointmentUseCase: DeleteAppointmentUseCase,
    @inject(TOKENS.ConfirmAppointmentUseCase)
    private confirmAppointmentUseCase: ConfirmAppointmentUseCase,
    @inject(TOKENS.CancelAppointmentUseCase)
    private cancelAppointmentUseCase: CancelAppointmentUseCase,
    @inject(TOKENS.CompleteAppointmentUseCase)
    private completeAppointmentUseCase: CompleteAppointmentUseCase,
    @inject(TOKENS.RescheduleAppointmentUseCase)
    private rescheduleAppointmentUseCase: RescheduleAppointmentUseCase,
    @inject(TOKENS.GetAllAppointmentsQueryHandler)
    private getAllAppointmentsQueryHandler: GetAllAppointmentsQueryHandler,
    @inject(TOKENS.GetAppointmentByIdQueryHandler)
    private getAppointmentByIdQueryHandler: GetAppointmentByIdQueryHandler,
    @inject(TOKENS.GetAppointmentsByPatientIdQueryHandler)
    private getAppointmentsByPatientIdQueryHandler: GetAppointmentsByPatientIdQueryHandler,
    @inject(TOKENS.GetTodayAppointmentsQueryHandler)
    private getTodayAppointmentsQueryHandler: GetTodayAppointmentsQueryHandler,
    @inject(TOKENS.GetTodayConfirmedAppointmentsQueryHandler)
    private getTodayConfirmedAppointmentsQueryHandler: GetTodayConfirmedAppointmentsQueryHandler,
    @inject(TOKENS.GetConfirmedAppointmentsQueryHandler)
    private getConfirmedAppointmentsQueryHandler: GetConfirmedAppointmentsQueryHandler,
    @inject(TOKENS.GetWeeklyAppointmentSummaryQueryHandler)
    private getWeeklyAppointmentSummaryQueryHandler: GetWeeklyAppointmentSummaryQueryHandler,
    @inject(TOKENS.GetAppointmentStatsQueryHandler)
    private getAppointmentStatsQueryHandler: GetAppointmentStatsQueryHandler,
    @inject(TOKENS.GetPatientByIdQueryHandler)
    private getPatientByIdQueryHandler: GetPatientByIdQueryHandler,
    @inject(TOKENS.GetDoctorByIdQueryHandler)
    private getDoctorByIdQueryHandler: GetDoctorByIdQueryHandler,
    @inject(TOKENS.AppointmentValidationService)
    private validationService: AppointmentValidationService
  ) {}

  /**
   * GET /api/appointments - Get all appointments with populated patient and doctor data
   */
  @Get('/')
  async getAllAppointments(): Promise<AppointmentListResponse> {
    const appointments = await this.getAllAppointmentsQueryHandler.execute();
    
    // Map appointments to DTOs with populated patient and doctor data
    const appointmentDtos = appointments.map(appointment => {
      const populatedPatient = (appointment as any)._populatedPatient;
      const populatedDoctor = (appointment as any)._populatedDoctor;
      
      return AppointmentMapper.toDto(appointment, populatedPatient, populatedDoctor);
    });

    return ApiResponseBuilder.success(appointmentDtos);
  }

  /**
   * GET /api/appointments/stats - Get appointment statistics
   */
  @Get('/stats')
  async getAppointmentStats(): Promise<AppointmentStatsResponse> {
    const stats = await this.getAppointmentStatsQueryHandler.execute();

    return ApiResponseBuilder.success(stats);
  }

  /**
   * GET /api/appointments/today - Get today's appointments
   */
  @Get('/today')
  async getTodayAppointments(): Promise<AppointmentListResponse> {
    const appointments = await this.getTodayAppointmentsQueryHandler.execute();
    const appointmentDtos = AppointmentMapper.toDtoArray(appointments);

    return ApiResponseBuilder.success(appointmentDtos);
  }

  /**
   * GET /api/appointments/today/confirmed - Get today's confirmed appointments
   */
  @Get('/today/confirmed')
  async getTodayConfirmedAppointments(): Promise<AppointmentListResponse> {
    const appointments = await this.getTodayConfirmedAppointmentsQueryHandler.execute();
    const appointmentDtos = AppointmentMapper.toDtoArray(appointments);

    return ApiResponseBuilder.success(appointmentDtos);
  }

  /**
   * GET /api/appointments/confirmed - Get all confirmed appointments
   */
  @Get('/confirmed')
  async getConfirmedAppointments(): Promise<AppointmentListResponse> {
    const appointments = await this.getConfirmedAppointmentsQueryHandler.execute();
    const appointmentDtos = AppointmentMapper.toDtoArray(appointments);

    return ApiResponseBuilder.success(appointmentDtos);
  }

  /**
   * GET /api/appointments/weekly-summary - Get weekly appointment summary
   */
  @Get('/weekly-summary')
  async getWeeklyAppointmentSummary(): Promise<WeeklyAppointmentSummaryResponse> {
    const summary = await this.getWeeklyAppointmentSummaryQueryHandler.execute();

    return ApiResponseBuilder.success(summary);
  }

  /**
   * GET /api/appointments/patient/:patientId - Get appointments by patient ID with populated patient and doctor data
   */
  @Get('/patient/:patientId')
  async getAppointmentsByPatientId(@Param('patientId') patientId: string): Promise<AppointmentListResponse> {
    const validatedQuery = this.validationService.validateGetByPatientIdQuery({ 
      patientId: patientId 
    });
    
    const appointments = await this.getAppointmentsByPatientIdQueryHandler.execute(validatedQuery);
    
    // Map appointments to DTOs with populated patient and doctor data
    const appointmentDtos = appointments.map(appointment => {
      const populatedPatient = (appointment as any)._populatedPatient;
      const populatedDoctor = (appointment as any)._populatedDoctor;
      
      return AppointmentMapper.toDto(appointment, populatedPatient, populatedDoctor);
    });

    return ApiResponseBuilder.success(appointmentDtos);
  }

  /**
   * GET /api/appointments/:id - Get appointment by ID
   */
  @Get('/:id')
  async getAppointmentById(@Param('id') id: string): Promise<AppointmentResponse> {
    // Validate the ID parameter
    const validatedId = AppointmentIdSchema.parse(id);
    const appointment = await this.getAppointmentByIdQueryHandler.execute({ id: validatedId });
    const appointmentDto = AppointmentMapper.toDto(appointment);
    
    return ApiResponseBuilder.success(appointmentDto);
  }

  /**
   * POST /api/appointments - Create a new appointment
   */
  @Post('/')
  @HttpCode(201)
  async createAppointment(@Body() body: CreateAppointmentRequestDto): Promise<AppointmentResponse> {
    const validatedData = this.validationService.validateCreateCommand(body);
    const appointment = await this.createAppointmentUseCase.execute(validatedData);
    
    // Fetch patient and doctor data separately to populate the response
    const [patientData, doctorData] = await Promise.all([
      this.getPatientByIdQueryHandler.execute({ id: appointment.patientId }),
      this.getDoctorByIdQueryHandler.execute({ id: appointment.doctorId })
    ]);
    
    // Check if doctor was found
    if (!doctorData) {
      throw new DoctorNotFoundException(appointment.doctorId);
    }
    
    // Map appointment to DTO with populated patient and doctor data
    const appointmentDto = AppointmentMapper.toDto(appointment, patientData, doctorData);

    return ApiResponseBuilder.success(appointmentDto);
  }

  /**
   * PUT /api/appointments/:id - Update an appointment
   */
  @Put('/:id')
  async updateAppointment(
    @Param('id') id: string, 
    @Body() body: UpdateAppointmentRequestDto
  ): Promise<AppointmentResponse> {
    // Validate the combined data (body + id) using the validation service
    const validatedData = this.validationService.validateUpdateCommand({
      ...body,
      id,
    });

    await this.updateAppointmentUseCase.execute(validatedData);

    // Fetch the updated appointment to return with populated data
    const appointment = await this.getAppointmentByIdQueryHandler.execute({ id: validatedData.id });
    
    // Fetch patient and doctor data separately to populate the response
    const [patientData, doctorData] = await Promise.all([
      this.getPatientByIdQueryHandler.execute({ id: appointment.patientId }),
      this.getDoctorByIdQueryHandler.execute({ id: appointment.doctorId })
    ]);
    
    // Check if doctor was found
    if (!doctorData) {
      throw new DoctorNotFoundException(appointment.doctorId);
    }
    
    // Map appointment to DTO with populated patient and doctor data
    const appointmentDto = AppointmentMapper.toDto(appointment, patientData, doctorData);

    return ApiResponseBuilder.success(appointmentDto);
  }

  /**
   * PUT /api/appointments/:id/confirm - Confirm an appointment
   */
  @Put('/:id/confirm')
  async confirmAppointment(@Param('id') id: string): Promise<AppointmentOperationResponse> {
    const validatedData = this.validationService.validateConfirmCommand({ id });

    await this.confirmAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment confirmed successfully');
  }

  /**
   * PUT /api/appointments/:id/cancel - Cancel an appointment
   */
  @Put('/:id/cancel')
  async cancelAppointment(@Param('id') id: string): Promise<AppointmentOperationResponse> {
    const validatedData = this.validationService.validateCancelCommand({ id });

    await this.cancelAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment cancelled successfully');
  }

  /**
   * PUT /api/appointments/:id/complete - Mark an appointment as completed
   */
  @Put('/:id/complete')
  async completeAppointment(@Param('id') id: string): Promise<AppointmentOperationResponse> {
    const validatedData = this.validationService.validateCompleteCommand({ id });

    await this.completeAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment marked as completed successfully');
  }

  /**
   * PUT /api/appointments/:id/reconfirm - Reconfirm an appointment (set status back to confirmed)
   */
  @Put('/:id/reconfirm')
  async reconfirmAppointment(@Param('id') id: string): Promise<AppointmentOperationResponse> {
    const validatedData = this.validationService.validateConfirmCommand({ id });

    await this.confirmAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment reconfirmed successfully');
  }

  /**
   * PUT /api/appointments/:id/reschedule - Reschedule an appointment
   */
  @Put('/:id/reschedule')
  async rescheduleAppointment(
    @Param('id') id: string,
    @Body() body: RescheduleAppointmentRequestDto
  ): Promise<AppointmentOperationResponse> {
    const validatedData = this.validationService.validateRescheduleCommand({
      ...body,
      id,
    });

    await this.rescheduleAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment rescheduled successfully');
  }

  /**
   * DELETE /api/appointments/:id - Delete an appointment
   */
  @Delete('/:id')
  async deleteAppointment(@Param('id') id: string): Promise<AppointmentOperationResponse> {
    const validatedData = this.validationService.validateDeleteCommand({ id });

    await this.deleteAppointmentUseCase.execute(validatedData);

    return ApiResponseBuilder.successWithMessage('Appointment deleted successfully');
  }
}
