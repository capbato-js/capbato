import { injectable, inject } from 'tsyringe';
import { Schedule, ScheduleId } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type {
  GetAllSchedulesQuery,
  GetScheduleByIdQuery,
  GetSchedulesByDateQuery,
  GetSchedulesByDoctorQuery,
  GetTodaySchedulesQuery,
  GetScheduleStatsQuery,
  GetTodayDoctorQuery,
} from '../../dto/ScheduleQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all schedules
 */
@injectable()
export class GetAllSchedulesQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetAllSchedulesQuery = {}): Promise<Schedule[]> {
    return await this.scheduleRepository.getAll(query.activeOnly);
  }
}

/**
 * Query handler for getting a schedule by ID
 */
@injectable()
export class GetScheduleByIdQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetScheduleByIdQuery): Promise<Schedule> {
    const scheduleId = new ScheduleId(query.id);
    const schedule = await this.scheduleRepository.getById(scheduleId);
    
    if (!schedule) {
      throw new Error(`Schedule with ID ${query.id} not found`);
    }
    
    return schedule;
  }
}

/**
 * Query handler for getting schedules by date
 */
@injectable()
export class GetSchedulesByDateQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetSchedulesByDateQuery): Promise<Schedule[]> {
    return await this.scheduleRepository.getByDate(query.date);
  }
}

/**
 * Query handler for getting schedules by doctor ID
 */
@injectable()
export class GetSchedulesByDoctorQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetSchedulesByDoctorQuery): Promise<Schedule[]> {
    return await this.scheduleRepository.getByDoctorId(query.doctorId);
  }
}

/**
 * Query handler for getting today's schedules
 */
@injectable()
export class GetTodaySchedulesQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetTodaySchedulesQuery = {}): Promise<Schedule[]> {
    void query; // Mark as intentionally unused
    return await this.scheduleRepository.getTodaySchedules();
  }
}

/**
 * Query handler for getting today's doctor
 */
@injectable()
export class GetTodayDoctorQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetTodayDoctorQuery = {}): Promise<Schedule | null> {
    void query; // Mark as intentionally unused
    const schedule = await this.scheduleRepository.getTodayFirstDoctor();
    return schedule || null;
  }
}

/**
 * Query handler for getting schedule statistics
 */
@injectable()
export class GetScheduleStatsQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(query: GetScheduleStatsQuery = {}): Promise<{
    total: number;
    today: number;
    upcoming: number;
    uniqueDoctors: number;
  }> {
    void query; // Mark as intentionally unused
    return await this.scheduleRepository.getStats();
  }
}