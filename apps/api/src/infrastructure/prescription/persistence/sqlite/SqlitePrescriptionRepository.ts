import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';
import { Prescription } from '@nx-starter/domain';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import { PrescriptionMapper } from '@nx-starter/application-shared';
import { generateUUID } from '@nx-starter/utils-core';
import { getSqliteDatabase } from '../../../database/connections/SqliteConnection';

interface PrescriptionRecord {
  id: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  prescribedDate: string; // SQLite datetime as string
  expiryDate?: string;
  isActive: number; // SQLite boolean as integer
  createdAt: string; // SQLite datetime as string
}

/**
 * SQLite implementation of IPrescriptionRepository using better-sqlite3
 * Uses shared database connection
 */
@injectable()
export class SqlitePrescriptionRepository implements IPrescriptionRepository {
  private db: Database.Database;

  constructor() {
    // Use shared SQLite database connection
    this.db = getSqliteDatabase();
  }

  async getAll(): Promise<Prescription[]> {
    const stmt = this.db.prepare('SELECT * FROM prescriptions ORDER BY createdAt DESC');
    const rows = stmt.all() as PrescriptionRecord[];
    return rows.map((row) => this.mapToPrescriptionEntity(row));
  }

  async create(prescription: Prescription): Promise<string> {
    const id = generateUUID();
    const stmt = this.db.prepare(`
      INSERT INTO prescriptions (
        id, patientId, doctorId, medicationName, dosage, instructions,
        prescribedDate, expiryDate, isActive, createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      prescription.patientId,
      prescription.doctorId,
      prescription.medications[0]?.medicationName?.value || '',
      prescription.medications[0]?.dosage?.value || '',
      prescription.medications[0]?.instructions?.value || '',
      prescription.prescribedDate.toISOString(),
      prescription.expiryDate?.toISOString(),
      prescription.status === 'active' ? 1 : 0,
      prescription.createdAt.toISOString()
    );

    return id;
  }

  async update(id: string, changes: Partial<Prescription>): Promise<void> {
    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];

    // Handle medications array - for simplicity, just update with first medication
    if ((changes as any).medications && (changes as any).medications.length > 0) {
      const firstMedication = (changes as any).medications[0];
      updateFields.push('medicationName = ?');
      values.push(firstMedication.medicationName?.value || firstMedication.medicationName);
      
      updateFields.push('dosage = ?');
      values.push(firstMedication.dosage?.value || firstMedication.dosage);
      
      updateFields.push('instructions = ?');
      values.push(firstMedication.instructions?.value || firstMedication.instructions);
    }

    if (changes.expiryDate !== undefined) {
      updateFields.push('expiryDate = ?');
      values.push(changes.expiryDate?.toISOString());
    }

    // Map status to isActive
    if ((changes as any).status !== undefined) {
      updateFields.push('isActive = ?');
      values.push((changes as any).status === 'active' ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return; // No changes to update
    }

    values.push(id); // Add id for WHERE clause

    const stmt = this.db.prepare(`
      UPDATE prescriptions 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `);

    const result = stmt.run(...values);
    if (result.changes === 0) {
      throw new Error(`Prescription with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM prescriptions WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      throw new Error(`Prescription with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Prescription | undefined> {
    const stmt = this.db.prepare('SELECT * FROM prescriptions WHERE id = ?');
    const row = stmt.get(id) as PrescriptionRecord | undefined;
    return row ? this.mapToPrescriptionEntity(row) : undefined;
  }

  async getByPatientId(patientId: string): Promise<Prescription[]> {
    const stmt = this.db.prepare('SELECT * FROM prescriptions WHERE patientId = ? ORDER BY createdAt DESC');
    const rows = stmt.all(patientId) as PrescriptionRecord[];
    return rows.map((row) => this.mapToPrescriptionEntity(row));
  }

  async getByDoctorId(doctorId: string): Promise<Prescription[]> {
    const stmt = this.db.prepare('SELECT * FROM prescriptions WHERE doctorId = ? ORDER BY createdAt DESC');
    const rows = stmt.all(doctorId) as PrescriptionRecord[];
    return rows.map((row) => this.mapToPrescriptionEntity(row));
  }

  async getActive(): Promise<Prescription[]> {
    const stmt = this.db.prepare('SELECT * FROM prescriptions WHERE isActive = 1 ORDER BY createdAt DESC');
    const rows = stmt.all() as PrescriptionRecord[];
    return rows.map((row) => this.mapToPrescriptionEntity(row));
  }

  async getExpired(): Promise<Prescription[]> {
    const currentDate = new Date().toISOString();
    const stmt = this.db.prepare(`
      SELECT * FROM prescriptions 
      WHERE expiryDate IS NOT NULL AND expiryDate < ? 
      ORDER BY createdAt DESC
    `);
    const rows = stmt.all(currentDate) as PrescriptionRecord[];
    return rows.map((row) => this.mapToPrescriptionEntity(row));
  }

  async getByMedicationName(medicationName: string): Promise<Prescription[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM prescriptions 
      WHERE medicationName LIKE ? 
      ORDER BY createdAt DESC
    `);
    const rows = stmt.all(`%${medicationName}%`) as PrescriptionRecord[];
    return rows.map((row) => this.mapToPrescriptionEntity(row));
  }

  /**
   * Maps database record to domain entity
   */
  private mapToPrescriptionEntity(record: PrescriptionRecord): Prescription {
    return PrescriptionMapper.fromPlainObject({
      id: record.id,
      patientId: record.patientId,
      doctorId: record.doctorId,
      medicationName: record.medicationName,
      dosage: record.dosage,
      instructions: record.instructions,
      prescribedDate: new Date(record.prescribedDate),
      expiryDate: record.expiryDate ? new Date(record.expiryDate) : undefined,
      isActive: record.isActive === 1,
      createdAt: new Date(record.createdAt),
    });
  }
}