import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';
import { 
  IBloodChemistryRepository,
  BloodChemistryRepositoryFilter,
  BloodChemistry,
  BloodChemistryId,
  BloodChemistryPatientInfo,
  BloodChemistryResults
} from '@nx-starter/domain';
import { getSqliteDatabase } from '../../../database/connections/SqliteConnection';

interface BloodChemistryRecord {
  id: number;
  patientId: string;
  patientName: string;
  ageGender: string;
  requestDate: string;
  status: string;
  dateTaken?: string;
  others?: string;
  
  // Blood Chemistry Tests
  fbs?: string;
  bun?: string;
  creatinine?: string;
  bloodUricAcid?: string;
  lipidProfile?: string;
  sgot?: string;
  sgpt?: string;
  alp?: string;
  sodiumNa?: string;
  potassiumK?: string;
  hbalc?: string;
  
  createdAt: string;
  updatedAt?: string;
}

@injectable()
export class SqliteBloodChemistryRepository implements IBloodChemistryRepository {
  private db: Database.Database;

  constructor() {
    this.db = getSqliteDatabase();
    this.initializeTable();
  }

  private initializeTable(): void {
    const stmt = this.db.prepare(`
      CREATE TABLE IF NOT EXISTS blood_chem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientId TEXT NOT NULL,
        patientName TEXT NOT NULL,
        ageGender TEXT NOT NULL,
        requestDate TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        dateTaken TEXT,
        others TEXT,
        
        -- Blood Chemistry Tests
        fbs TEXT,
        bun TEXT,
        creatinine TEXT,
        bloodUricAcid TEXT,
        lipidProfile TEXT,
        sgot TEXT,
        sgpt TEXT,
        alp TEXT,
        sodiumNa TEXT,
        potassiumK TEXT,
        hbalc TEXT,
        
        createdAt TEXT NOT NULL,
        updatedAt TEXT
      )
    `);
    stmt.run();

    // Create indexes
    this.db.prepare('CREATE INDEX IF NOT EXISTS idx_blood_chem_patient_id ON blood_chem(patientId)').run();
    this.db.prepare('CREATE INDEX IF NOT EXISTS idx_blood_chem_status ON blood_chem(status)').run();
    this.db.prepare('CREATE INDEX IF NOT EXISTS idx_blood_chem_date ON blood_chem(requestDate)').run();
  }

  async save(bloodChemistry: BloodChemistry): Promise<BloodChemistry> {
    if (bloodChemistry.id) {
      return await this.update(bloodChemistry);
    }

    const results = bloodChemistry.results.results;
    const stmt = this.db.prepare(`
      INSERT INTO blood_chem (
        patientId, patientName, ageGender, requestDate, status, dateTaken, others,
        fbs, bun, creatinine, bloodUricAcid, lipidProfile, sgot, sgpt, alp, sodiumNa, potassiumK, hbalc,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      `BC-${Date.now()}`, // Generate a simple patient ID
      bloodChemistry.patientInfo.patientName,
      `${bloodChemistry.patientInfo.age}/${bloodChemistry.patientInfo.sex}`,
      bloodChemistry.dateTaken.toISOString(),
      'complete', // Default status
      bloodChemistry.dateTaken.toISOString(),
      '', // Default empty others
      results.fbs?.toString(),
      results.bun?.toString(),
      results.creatinine?.toString(),
      results.uricAcid?.toString(),
      results.cholesterol ? `Cholesterol: ${results.cholesterol}` : undefined,
      results.sgot?.toString(),
      results.sgpt?.toString(),
      results.alkPhosphatase?.toString(),
      results.sodium?.toString(),
      results.potassium?.toString(),
      results.hbalc?.toString(),
      bloodChemistry.createdAt.toISOString(),
      bloodChemistry.updatedAt?.toISOString()
    );

    const newBloodChemistry = BloodChemistry.reconstruct(
      result.lastInsertRowid.toString(),
      bloodChemistry.patientInfo,
      bloodChemistry.dateTaken,
      bloodChemistry.results,
      bloodChemistry.createdAt,
      bloodChemistry.updatedAt
    );

    return newBloodChemistry;
  }

  async findById(id: BloodChemistryId): Promise<BloodChemistry | null> {
    const stmt = this.db.prepare('SELECT * FROM blood_chem WHERE id = ?');
    const row = stmt.get(parseInt(id.value)) as BloodChemistryRecord | undefined;
    return row ? this.recordToDomain(row) : null;
  }

  async findAll(filter?: BloodChemistryRepositoryFilter): Promise<BloodChemistry[]> {
    let query = 'SELECT * FROM blood_chem';
    const params: unknown[] = [];
    const conditions: string[] = [];

    if (filter?.status) {
      conditions.push('status = ?');
      params.push(filter.status);
    }

    if (filter?.patientId) {
      conditions.push('patientId = ?');
      params.push(filter.patientId);
    }

    if (filter?.dateFrom && filter?.dateTo) {
      conditions.push('requestDate BETWEEN ? AND ?');
      params.push(filter.dateFrom.toISOString(), filter.dateTo.toISOString());
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY requestDate DESC';

    const stmt = this.db.prepare(query);
    const rows = stmt.all(...params) as BloodChemistryRecord[];
    return rows.map(row => this.recordToDomain(row));
  }

  async findByPatientId(patientId: string): Promise<BloodChemistry[]> {
    const stmt = this.db.prepare('SELECT * FROM blood_chem WHERE patientId = ? ORDER BY requestDate DESC');
    const rows = stmt.all(patientId) as BloodChemistryRecord[];
    return rows.map(row => this.recordToDomain(row));
  }

  async findCompleted(): Promise<BloodChemistry[]> {
    const stmt = this.db.prepare('SELECT * FROM blood_chem WHERE status = ? ORDER BY requestDate DESC');
    const rows = stmt.all('complete') as BloodChemistryRecord[];
    return rows.map(row => this.recordToDomain(row));
  }

  async update(bloodChemistry: BloodChemistry): Promise<BloodChemistry> {
    if (!bloodChemistry.id) {
      throw new Error('Blood chemistry must have an ID to update');
    }

    const results = bloodChemistry.results.results;
    const stmt = this.db.prepare(`
      UPDATE blood_chem SET
        patientId = ?, patientName = ?, ageGender = ?, requestDate = ?, status = ?, dateTaken = ?, others = ?,
        fbs = ?, bun = ?, creatinine = ?, bloodUricAcid = ?, lipidProfile = ?, sgot = ?, sgpt = ?, alp = ?, 
        sodiumNa = ?, potassiumK = ?, hbalc = ?, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run(
      `BC-${Date.now()}`, // Generate a simple patient ID
      bloodChemistry.patientInfo.patientName,
      `${bloodChemistry.patientInfo.age}/${bloodChemistry.patientInfo.sex}`,
      bloodChemistry.dateTaken.toISOString(),
      'complete', // Default status
      bloodChemistry.dateTaken.toISOString(),
      '', // Default empty others
      results.fbs?.toString(),
      results.bun?.toString(),
      results.creatinine?.toString(),
      results.uricAcid?.toString(),
      results.cholesterol ? `Cholesterol: ${results.cholesterol}` : undefined,
      results.sgot?.toString(),
      results.sgpt?.toString(),
      results.alkPhosphatase?.toString(),
      results.sodium?.toString(),
      results.potassium?.toString(),
      results.hbalc?.toString(),
      new Date().toISOString(),
      parseInt(bloodChemistry.id.value)
    );

    return bloodChemistry;
  }

  async delete(id: BloodChemistryId): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM blood_chem WHERE id = ?');
    stmt.run(parseInt(id.value));
  }

  private recordToDomain(record: BloodChemistryRecord): BloodChemistry {
    const patientInfo = new BloodChemistryPatientInfo({
      patientName: record.patientName,
      age: parseInt(record.ageGender.split('/')[0]) || 0,
      sex: record.ageGender.split('/')[1] || 'unknown'
    });

    const results = new BloodChemistryResults({
      fbs: record.fbs ? parseFloat(record.fbs) : undefined,
      bun: record.bun ? parseFloat(record.bun) : undefined,
      creatinine: record.creatinine ? parseFloat(record.creatinine) : undefined,
      uricAcid: record.bloodUricAcid ? parseFloat(record.bloodUricAcid) : undefined,
      cholesterol: record.lipidProfile ? parseFloat(record.lipidProfile.replace(/[^\d.]/g, '')) || undefined : undefined,
      sgot: record.sgot ? parseFloat(record.sgot) : undefined,
      sgpt: record.sgpt ? parseFloat(record.sgpt) : undefined,
      alkPhosphatase: record.alp ? parseFloat(record.alp) : undefined,
      sodium: record.sodiumNa ? parseFloat(record.sodiumNa) : undefined,
      potassium: record.potassiumK ? parseFloat(record.potassiumK) : undefined,
      hbalc: record.hbalc ? parseFloat(record.hbalc) : undefined
    });

    return BloodChemistry.reconstruct(
      record.id.toString(),
      patientInfo,
      record.dateTaken ? new Date(record.dateTaken) : new Date(record.requestDate),
      results,
      new Date(record.createdAt),
      record.updatedAt ? new Date(record.updatedAt) : undefined
    );
  }
}
