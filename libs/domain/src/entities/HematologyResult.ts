import { HematologyResultId } from '../value-objects/HematologyResultId';
import { LabRequestId } from '../value-objects/LabRequestId';

interface IHematologyResult {
  id?: HematologyResultId;
  labRequestId: LabRequestId;
  patientId: string;
  patientName: string;
  age?: string;
  sex?: string;
  dateTaken: Date;
  // Hematology specific fields
  hemoglobin?: string;
  hematocrit?: string;
  rbc?: string;
  wbc?: string;
  plateletCount?: string;
  neutrophils?: string;
  lymphocytes?: string;
  monocytes?: string;
  eosinophils?: string;
  basophils?: string;
  mcv?: string;
  mch?: string;
  mchc?: string;
  esr?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class HematologyResult implements IHematologyResult {
  private readonly _id?: HematologyResultId;
  private readonly _labRequestId: LabRequestId;
  private readonly _patientId: string;
  private readonly _patientName: string;
  private readonly _age?: string;
  private readonly _sex?: string;
  private readonly _dateTaken: Date;
  private readonly _hemoglobin?: string;
  private readonly _hematocrit?: string;
  private readonly _rbc?: string;
  private readonly _wbc?: string;
  private readonly _plateletCount?: string;
  private readonly _neutrophils?: string;
  private readonly _lymphocytes?: string;
  private readonly _monocytes?: string;
  private readonly _eosinophils?: string;
  private readonly _basophils?: string;
  private readonly _mcv?: string;
  private readonly _mch?: string;
  private readonly _mchc?: string;
  private readonly _esr?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  private constructor(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<IHematologyResult>,
    id?: string | HematologyResultId,
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    this._labRequestId = labRequestId;
    this._patientId = patientId;
    this._patientName = patientName;
    this._dateTaken = dateTaken;
    this._age = results.age;
    this._sex = results.sex;
    this._hemoglobin = results.hemoglobin;
    this._hematocrit = results.hematocrit;
    this._rbc = results.rbc;
    this._wbc = results.wbc;
    this._plateletCount = results.plateletCount;
    this._neutrophils = results.neutrophils;
    this._lymphocytes = results.lymphocytes;
    this._monocytes = results.monocytes;
    this._eosinophils = results.eosinophils;
    this._basophils = results.basophils;
    this._mcv = results.mcv;
    this._mch = results.mch;
    this._mchc = results.mchc;
    this._esr = results.esr;
    this._id = id instanceof HematologyResultId ? id : id ? new HematologyResultId(id) : undefined;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method for creating new hematology results with business rule validation
   */
  public static create(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<IHematologyResult>
  ): HematologyResult {
    const hematologyResult = new HematologyResult(labRequestId, patientId, patientName, dateTaken, results);
    
    // Business rule validation for new records
    hematologyResult.validate();
    
    return hematologyResult;
  }

  /**
   * Factory method for reconstructing from persistence
   */
  public static fromPersistence(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<IHematologyResult>,
    id: string,
    createdAt: Date,
    updatedAt?: Date
  ): HematologyResult {
    return new HematologyResult(labRequestId, patientId, patientName, dateTaken, results, id, createdAt, updatedAt);
  }

  // Getters
  get id(): HematologyResultId | undefined {
    return this._id;
  }

  get labRequestId(): LabRequestId {
    return this._labRequestId;
  }

  get patientId(): string {
    return this._patientId;
  }

  get patientName(): string {
    return this._patientName;
  }

  get age(): string | undefined {
    return this._age;
  }

  get sex(): string | undefined {
    return this._sex;
  }

  get dateTaken(): Date {
    return this._dateTaken;
  }

  get hemoglobin(): string | undefined {
    return this._hemoglobin;
  }

  get hematocrit(): string | undefined {
    return this._hematocrit;
  }

  get rbc(): string | undefined {
    return this._rbc;
  }

  get wbc(): string | undefined {
    return this._wbc;
  }

  get plateletCount(): string | undefined {
    return this._plateletCount;
  }

  get neutrophils(): string | undefined {
    return this._neutrophils;
  }

  get lymphocytes(): string | undefined {
    return this._lymphocytes;
  }

  get monocytes(): string | undefined {
    return this._monocytes;
  }

  get eosinophils(): string | undefined {
    return this._eosinophils;
  }

  get basophils(): string | undefined {
    return this._basophils;
  }

  get mcv(): string | undefined {
    return this._mcv;
  }

  get mch(): string | undefined {
    return this._mch;
  }

  get mchc(): string | undefined {
    return this._mchc;
  }

  get esr(): string | undefined {
    return this._esr;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Business methods
  update(results: Partial<IHematologyResult>): HematologyResult {
    const newHematologyResult = new HematologyResult(
      this._labRequestId,
      this._patientId,
      this._patientName,
      this._dateTaken,
      { ...this.toPlainObject(), ...results },
      this._id,
      this._createdAt,
      new Date()
    );
    
    newHematologyResult.validate();
    return newHematologyResult;
  }

  /**
   * Business rule validation
   */
  private validate(): void {
    if (!this._patientId?.trim()) {
      throw new Error('Patient ID is required for hematology result');
    }

    if (!this._patientName?.trim()) {
      throw new Error('Patient name is required for hematology result');
    }

    if (!this._dateTaken) {
      throw new Error('Date taken is required for hematology result');
    }

    if (this._dateTaken > new Date()) {
      throw new Error('Date taken cannot be in the future');
    }
  }

  /**
   * Convert to plain object for persistence
   */
  toPlainObject(): Record<string, unknown> {
    return {
      id: this._id?.value,
      labRequestId: this._labRequestId.value,
      patientId: this._patientId,
      patientName: this._patientName,
      age: this._age,
      sex: this._sex,
      dateTaken: this._dateTaken,
      hemoglobin: this._hemoglobin,
      hematocrit: this._hematocrit,
      rbc: this._rbc,
      wbc: this._wbc,
      plateletCount: this._plateletCount,
      neutrophils: this._neutrophils,
      lymphocytes: this._lymphocytes,
      monocytes: this._monocytes,
      eosinophils: this._eosinophils,
      basophils: this._basophils,
      mcv: this._mcv,
      mch: this._mch,
      mchc: this._mchc,
      esr: this._esr,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
