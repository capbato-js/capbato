import Database from 'better-sqlite3';
import { injectable } from 'tsyringe';
import { 
  ILabRequestRepository,
  LabRequestRepositoryFilter,
  LabRequest,
  LabRequestId,
  LabRequestPatientInfo,
  LabRequestTests,
  LabRequestStatus 
} from '@nx-starter/domain';
import { getSqliteDatabase } from '../../../database/connections/SqliteConnection';

interface LabRequestRecord {
  id: number;
  patientId: string;
  patientName: string;
  ageGender: string;
  requestDate: string;
  status: string;
  dateTaken?: string;
  others?: string;
  
  // Basic Tests
  cbcWithPlatelet?: string;
  pregnancyTest?: string;
  urinalysis?: string;
  fecalysis?: string;
  occultBloodTest?: string;
  
  // Hepatitis Tests
  hepaBScreening?: string;
  hepaAScreening?: string;
  hepatitisProfile?: string;
  
  // STD Tests
  vdrlRpr?: string;
  
  // Other Tests
  dengueNs1?: string;
  ca125CeaPsa?: string;
  
  // Blood Chemistry Results
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
  
  // Other Tests
  ecg?: string;
  t3?: string;
  t4?: string;
  ft3?: string;
  ft4?: string;
  tsh?: string;
  
  createdAt: string;
  updatedAt?: string;
}

@injectable()
export class SqliteLabRequestRepository implements ILabRequestRepository {
  private db: Database.Database;

  constructor() {
    this.db = getSqliteDatabase();
    this.initializeTable();
  }

  private initializeTable(): void {
    const stmt = this.db.prepare(`
      CREATE TABLE IF NOT EXISTS lab_request_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientId TEXT NOT NULL,
        patientName TEXT NOT NULL,
        ageGender TEXT NOT NULL,
        requestDate TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        dateTaken TEXT,
        others TEXT,
        
        -- Basic Tests
        cbcWithPlatelet TEXT,
        pregnancyTest TEXT,
        urinalysis TEXT,
        fecalysis TEXT,
        occultBloodTest TEXT,
        
        -- Hepatitis Tests
        hepaBScreening TEXT,
        hepaAScreening TEXT,
        hepatitisProfile TEXT,
        
        -- STD Tests
        vdrlRpr TEXT,
        
        -- Other Tests
        dengueNs1 TEXT,
        ca125CeaPsa TEXT,
        
        -- Blood Chemistry Results
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
        
        -- Other Tests
        ecg TEXT,
        t3 TEXT,
        t4 TEXT,
        ft3 TEXT,
        ft4 TEXT,
        tsh TEXT,
        
        createdAt TEXT NOT NULL,
        updatedAt TEXT
      )
    `);
    stmt.run();

    // Create indexes
    this.db.prepare('CREATE INDEX IF NOT EXISTS idx_lab_request_patient_id ON lab_request_entries(patientId)').run();
    this.db.prepare('CREATE INDEX IF NOT EXISTS idx_lab_request_status ON lab_request_entries(status)').run();
    this.db.prepare('CREATE INDEX IF NOT EXISTS idx_lab_request_date ON lab_request_entries(requestDate)').run();
  }

  async save(labRequest: LabRequest): Promise<LabRequest> {
    if (labRequest.id) {
      return await this.update(labRequest);
    }

    const tests = labRequest.tests.tests;
    const stmt = this.db.prepare(`
      INSERT INTO lab_request_entries (
        patientId, patientName, ageGender, requestDate, status, dateTaken, others,
        cbcWithPlatelet, pregnancyTest, urinalysis, fecalysis, occultBloodTest,
        hepaBScreening, hepaAScreening, hepatitisProfile, vdrlRpr, dengueNs1, ca125CeaPsa,
        fbs, bun, creatinine, bloodUricAcid, lipidProfile, sgot, sgpt, alp, sodiumNa, potassiumK, hbalc,
        ecg, t3, t4, ft3, ft4, tsh, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      labRequest.patientInfo.patientId,
      labRequest.patientInfo.patientName,
      labRequest.patientInfo.ageGender,
      labRequest.requestDate.toISOString(),
      labRequest.status.value,
      labRequest.dateTaken?.toISOString(),
      labRequest.others,
      tests.routine.cbcWithPlatelet ? 'true' : '',
      tests.routine.pregnancyTest ? 'true' : '',
      tests.routine.urinalysis ? 'true' : '',
      tests.routine.fecalysis ? 'true' : '',
      tests.routine.occultBloodTest ? 'true' : '',
      tests.serology.hepatitisBScreening ? 'true' : '',
      tests.serology.hepatitisAScreening ? 'true' : '',
      tests.serology.hepatitisProfile ? 'true' : '',
      tests.serology.vdrlRpr ? 'true' : '',
      tests.serology.dengueNs1 ? 'true' : '',
      (tests.serology.ca125 || tests.serology.cea || tests.serology.psa) ? 'true' : '',
      tests.bloodChemistry.fbs ? 'true' : '',
      tests.bloodChemistry.bun ? 'true' : '',
      tests.bloodChemistry.creatinine ? 'true' : '',
      tests.bloodChemistry.bloodUricAcid ? 'true' : '',
      tests.bloodChemistry.lipidProfile ? 'true' : '',
      tests.bloodChemistry.sgot ? 'true' : '',
      tests.bloodChemistry.sgpt ? 'true' : '',
      tests.bloodChemistry.alkalinePhosphatase ? 'true' : '',
      tests.bloodChemistry.sodium ? 'true' : '',
      tests.bloodChemistry.potassium ? 'true' : '',
      tests.bloodChemistry.hba1c ? 'true' : '',
      tests.miscellaneous.ecg ? 'true' : '',
      tests.thyroid.t3 ? 'true' : '',
      tests.thyroid.t4 ? 'true' : '',
      tests.thyroid.ft3 ? 'true' : '',
      tests.thyroid.ft4 ? 'true' : '',
      tests.thyroid.tsh ? 'true' : '',
      labRequest.createdAt.toISOString(),
      labRequest.updatedAt?.toISOString()
    );

    const newLabRequest = new LabRequest(
      labRequest.patientInfo,
      labRequest.requestDate,
      labRequest.tests,
      labRequest.status,
      result.lastInsertRowid.toString(),
      labRequest.dateTaken,
      labRequest.others,
      labRequest.createdAt,
      labRequest.updatedAt
    );

    return newLabRequest;
  }

  async findById(id: LabRequestId): Promise<LabRequest | null> {
    const stmt = this.db.prepare('SELECT * FROM lab_request_entries WHERE id = ?');
    const row = stmt.get(parseInt(id.value)) as LabRequestRecord | undefined;
    return row ? this.recordToDomain(row) : null;
  }

  async getById(id: string): Promise<LabRequest | null> {
    const stmt = this.db.prepare('SELECT * FROM lab_request_entries WHERE id = ?');
    const row = stmt.get(parseInt(id)) as LabRequestRecord | undefined;
    return row ? this.recordToDomain(row) : null;
  }

  async findAll(filter?: LabRequestRepositoryFilter): Promise<LabRequest[]> {
    let query = 'SELECT * FROM lab_request_entries';
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
    const rows = stmt.all(...params) as LabRequestRecord[];
    return rows.map(row => this.recordToDomain(row));
  }

  async findByPatientId(patientId: string): Promise<LabRequest[]> {
    const stmt = this.db.prepare('SELECT * FROM lab_request_entries WHERE patientId = ? ORDER BY requestDate DESC');
    const rows = stmt.all(patientId) as LabRequestRecord[];
    return rows.map(row => this.recordToDomain(row));
  }

  async findCompleted(): Promise<LabRequest[]> {
    const stmt = this.db.prepare('SELECT * FROM lab_request_entries WHERE status = ? ORDER BY requestDate DESC');
    const rows = stmt.all('completed') as LabRequestRecord[];
    return rows.map(row => this.recordToDomain(row));
  }

  async update(labRequest: LabRequest): Promise<LabRequest> {
    if (!labRequest.id) {
      throw new Error('Lab request must have an ID to update');
    }

    const tests = labRequest.tests.tests;
    const stmt = this.db.prepare(`
      UPDATE lab_request_entries SET
        patientId = ?, patientName = ?, ageGender = ?, requestDate = ?, status = ?, dateTaken = ?, others = ?,
        cbcWithPlatelet = ?, pregnancyTest = ?, urinalysis = ?, fecalysis = ?, occultBloodTest = ?,
        hepaBScreening = ?, hepaAScreening = ?, hepatitisProfile = ?, vdrlRpr = ?, dengueNs1 = ?, ca125CeaPsa = ?,
        fbs = ?, bun = ?, creatinine = ?, bloodUricAcid = ?, lipidProfile = ?, sgot = ?, sgpt = ?, alp = ?, 
        sodiumNa = ?, potassiumK = ?, hbalc = ?, ecg = ?, t3 = ?, t4 = ?, ft3 = ?, ft4 = ?, tsh = ?, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run(
      labRequest.patientInfo.patientId,
      labRequest.patientInfo.patientName,
      labRequest.patientInfo.ageGender,
      labRequest.requestDate.toISOString(),
      labRequest.status.value,
      labRequest.dateTaken?.toISOString(),
      labRequest.others,
      tests.routine.cbcWithPlatelet ? 'true' : '',
      tests.routine.pregnancyTest ? 'true' : '',
      tests.routine.urinalysis ? 'true' : '',
      tests.routine.fecalysis ? 'true' : '',
      tests.routine.occultBloodTest ? 'true' : '',
      tests.serology.hepatitisBScreening ? 'true' : '',
      tests.serology.hepatitisAScreening ? 'true' : '',
      tests.serology.hepatitisProfile ? 'true' : '',
      tests.serology.vdrlRpr ? 'true' : '',
      tests.serology.dengueNs1 ? 'true' : '',
      (tests.serology.ca125 || tests.serology.cea || tests.serology.psa) ? 'true' : '',
      tests.bloodChemistry.fbs ? 'true' : '',
      tests.bloodChemistry.bun ? 'true' : '',
      tests.bloodChemistry.creatinine ? 'true' : '',
      tests.bloodChemistry.bloodUricAcid ? 'true' : '',
      tests.bloodChemistry.lipidProfile ? 'true' : '',
      tests.bloodChemistry.sgot ? 'true' : '',
      tests.bloodChemistry.sgpt ? 'true' : '',
      tests.bloodChemistry.alkalinePhosphatase ? 'true' : '',
      tests.bloodChemistry.sodium ? 'true' : '',
      tests.bloodChemistry.potassium ? 'true' : '',
      tests.bloodChemistry.hba1c ? 'true' : '',
      tests.miscellaneous.ecg ? 'true' : '',
      tests.thyroid.t3 ? 'true' : '',
      tests.thyroid.t4 ? 'true' : '',
      tests.thyroid.ft3 ? 'true' : '',
      tests.thyroid.ft4 ? 'true' : '',
      tests.thyroid.tsh ? 'true' : '',
      new Date().toISOString(),
      parseInt(labRequest.id.value)
    );

    return labRequest;
  }

  async delete(id: LabRequestId): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM lab_request_entries WHERE id = ?');
    stmt.run(parseInt(id.value));
  }

  private recordToDomain(record: LabRequestRecord): LabRequest {
    const patientInfo = LabRequestPatientInfo.create({
      patientId: record.patientId,
      patientName: record.patientName,
      ageGender: record.ageGender
    });

    const tests = LabRequestTests.create({
      routine: {
        cbcWithPlatelet: !!record.cbcWithPlatelet,
        pregnancyTest: !!record.pregnancyTest,
        urinalysis: !!record.urinalysis,
        fecalysis: !!record.fecalysis,
        occultBloodTest: !!record.occultBloodTest,
      },
      serology: {
        hepatitisBScreening: !!record.hepaBScreening,
        hepatitisAScreening: !!record.hepaAScreening,
        hepatitisCScreening: false,
        hepatitisProfile: !!record.hepatitisProfile,
        vdrlRpr: !!record.vdrlRpr,
        crp: false,
        dengueNs1: !!record.dengueNs1,
        aso: false,
        crf: false,
        raRf: false,
        tumorMarkers: false,
        ca125: !!record.ca125CeaPsa,
        cea: !!record.ca125CeaPsa,
        psa: !!record.ca125CeaPsa,
        betaHcg: false,
      },
      bloodChemistry: {
        fbs: !!record.fbs,
        bun: !!record.bun,
        creatinine: !!record.creatinine,
        bloodUricAcid: !!record.bloodUricAcid,
        lipidProfile: !!record.lipidProfile,
        sgot: !!record.sgot,
        sgpt: !!record.sgpt,
        alkalinePhosphatase: !!record.alp,
        sodium: !!record.sodiumNa,
        potassium: !!record.potassiumK,
        hba1c: !!record.hbalc,
      },
      miscellaneous: {
        ecg: !!record.ecg,
      },
      thyroid: {
        t3: !!record.t3,
        t4: !!record.t4,
        ft3: !!record.ft3,
        ft4: !!record.ft4,
        tsh: !!record.tsh,
      },
    });

    const status = LabRequestStatus.create(record.status);

    return new LabRequest(
      patientInfo,
      new Date(record.requestDate),
      tests,
      status,
      record.id.toString(),
      record.dateTaken ? new Date(record.dateTaken) : undefined,
      record.others,
      new Date(record.createdAt),
      record.updatedAt ? new Date(record.updatedAt) : undefined
    );
  }
}
