import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';
import { Schedule, ScheduleId } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import { generateUUID } from '@nx-starter/utils-core';
import { getSqliteDatabase } from '../../../database/connections/SqliteConnection';

interface ScheduleRecord {
  id: string;
  doctor_id: string;
  doctor_name?: string; // Keep for backward compatibility during migration
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string (HH:MM)
  created_at: string; // SQLite datetime as string
  updated_at?: string; // SQLite datetime as string
}

/**
 * SQLite implementation of IScheduleRepository using better-sqlite3
 * Uses shared database connection for consistency
 */
@injectable()
export class SqliteScheduleRepository implements IScheduleRepository {
  private db: Database.Database;

  constructor() {
    // Use shared SQLite database connection
    this.db = getSqliteDatabase();
    this.initializeTable();
  }

  private initializeTable(): void {
    // Create schedules table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT, -- Keep for backward compatibility
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);
      CREATE INDEX IF NOT EXISTS idx_schedules_doctor_id ON schedules(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_schedules_doctor_name ON schedules(doctor_name);
      CREATE INDEX IF NOT EXISTS idx_schedules_date_time ON schedules(date, time);
    `);
  }

  async getAll(activeOnly?: boolean): Promise<Schedule[]> {
    let sql = 'SELECT * FROM schedules';
    const params: string[] = [];
    
    if (activeOnly) {
      const today = new Date().toISOString().split('T')[0];
      sql += ' WHERE date >= ?';
      params.push(today);
    }
    
    sql += ' ORDER BY date ASC, time ASC';
    
    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as ScheduleRecord[];
    return rows.map((row) => this.mapToScheduleEntity(row));
  }

  async create(schedule: Schedule): Promise<Schedule> {
    const id = generateUUID();
    const stmt = this.db.prepare(`
      INSERT INTO schedules (id, doctor_id, date, time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      schedule.doctorIdString,
      schedule.dateString,
      schedule.timeString,
      schedule.createdAt.toISOString(),
      schedule.updatedAt?.toISOString()
    );

    // Return the created schedule with ID
    return Schedule.reconstruct(
      id,
      schedule.doctorId,
      schedule.date,
      schedule.time,
      schedule.createdAt,
      schedule.updatedAt
    );
  }

  async getById(id: ScheduleId): Promise<Schedule | undefined> {
    const stmt = this.db.prepare('SELECT * FROM schedules WHERE id = ?');
    const row = stmt.get(id.value) as ScheduleRecord | undefined;
    return row ? this.mapToScheduleEntity(row) : undefined;
  }

  async getByDate(date: string): Promise<Schedule[]> {
    const stmt = this.db.prepare('SELECT * FROM schedules WHERE date = ? ORDER BY time ASC');
    const rows = stmt.all(date) as ScheduleRecord[];
    return rows.map((row) => this.mapToScheduleEntity(row));
  }

  async getByDoctorName(doctorName: string): Promise<Schedule[]> {
    // Deprecated method - kept for backward compatibility
    void doctorName; // Mark as intentionally unused
    return [];
  }

  async getByDoctorId(doctorId: string): Promise<Schedule[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM schedules 
      WHERE doctor_id = ? 
      ORDER BY date ASC, time ASC
    `);
    const rows = stmt.all(doctorId) as ScheduleRecord[];
    return rows.map((row) => this.mapToScheduleEntity(row));
  }

  async getTodaySchedules(): Promise<Schedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  }

  async getTodayFirstDoctor(): Promise<Schedule | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const stmt = this.db.prepare('SELECT * FROM schedules WHERE date = ? ORDER BY time ASC LIMIT 1');
    const row = stmt.get(today) as ScheduleRecord | undefined;
    return row ? this.mapToScheduleEntity(row) : undefined;
  }

  async update(schedule: Schedule): Promise<Schedule> {
    if (!schedule.id) {
      throw new Error('Cannot update schedule without ID');
    }

    const stmt = this.db.prepare(`
      UPDATE schedules 
      SET doctor_id = ?, date = ?, time = ?, updated_at = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      schedule.doctorIdString,
      schedule.dateString,
      schedule.timeString,
      new Date().toISOString(),
      schedule.id.value
    );

    if (result.changes === 0) {
      throw new Error(`Schedule with ID ${schedule.id.value} not found`);
    }

    // Return updated schedule with new updatedAt
    return Schedule.reconstruct(
      schedule.id,
      schedule.doctorId,
      schedule.date,
      schedule.time,
      schedule.createdAt,
      new Date()
    );
  }

  async delete(id: ScheduleId): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM schedules WHERE id = ?');
    const result = stmt.run(id.value);
    return result.changes > 0;
  }

  async exists(id: ScheduleId): Promise<boolean> {
    const stmt = this.db.prepare('SELECT 1 FROM schedules WHERE id = ? LIMIT 1');
    const row = stmt.get(id.value);
    return !!row;
  }

  async findConflicts(schedule: Schedule): Promise<Schedule[]> {
    let sql = `
      SELECT * FROM schedules 
      WHERE doctor_id = ? 
      AND date = ?
    `;
    const params = [schedule.doctorIdString, schedule.dateString];

    // If schedule has an ID, exclude it from conflicts
    if (schedule.id) {
      sql += ' AND id != ?';
      params.push(schedule.id.value);
    }

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as ScheduleRecord[];
    const allSchedules = rows.map((row) => this.mapToScheduleEntity(row));
    
    // Filter using domain logic for time conflicts
    return allSchedules.filter(existingSchedule => 
      schedule.conflictsWith(existingSchedule)
    );
  }

  async getStats(): Promise<{
    total: number;
    today: number;
    upcoming: number;
    uniqueDoctors: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    
    const totalStmt = this.db.prepare('SELECT COUNT(*) as count FROM schedules');
    const todayStmt = this.db.prepare('SELECT COUNT(*) as count FROM schedules WHERE date = ?');
    const upcomingStmt = this.db.prepare('SELECT COUNT(*) as count FROM schedules WHERE date >= ?');
    const uniqueDoctorsStmt = this.db.prepare('SELECT COUNT(DISTINCT LOWER(doctor_name)) as count FROM schedules');

    const totalResult = totalStmt.get() as { count: number };
    const todayResult = todayStmt.get(today) as { count: number };
    const upcomingResult = upcomingStmt.get(today) as { count: number };
    const uniqueDoctorsResult = uniqueDoctorsStmt.get() as { count: number };

    return {
      total: totalResult.count,
      today: todayResult.count,
      upcoming: upcomingResult.count,
      uniqueDoctors: uniqueDoctorsResult.count,
    };
  }

  /**
   * Convert database record to domain entity
   */
  private mapToScheduleEntity(record: ScheduleRecord): Schedule {
    return Schedule.reconstruct(
      record.id,
      record.doctor_id,
      record.date,
      record.time,
      new Date(record.created_at),
      record.updated_at ? new Date(record.updated_at) : undefined
    );
  }

  /**
   * Convert domain entity to database record (for testing/seeding)
   */
  toRecord(schedule: Schedule): Partial<ScheduleRecord> {
    return {
      id: schedule.stringId,
      doctor_id: schedule.doctorIdString,
      date: schedule.dateString,
      time: schedule.timeString,
      created_at: schedule.createdAt.toISOString(),
      updated_at: schedule.updatedAt?.toISOString(),
    };
  }

  // Utility methods for testing
  async clear(): Promise<void> {
    this.db.exec('DELETE FROM schedules');
  }

  async seed(schedules: Schedule[]): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO schedules (id, doctor_id, date, time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const schedule of schedules) {
      const id = schedule.stringId || generateUUID();
      stmt.run(
        id,
        schedule.doctorIdString,
        schedule.dateString,
        schedule.timeString,
        schedule.createdAt.toISOString(),
        schedule.updatedAt?.toISOString()
      );
    }
  }
}