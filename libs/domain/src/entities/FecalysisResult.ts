import { FecalysisResultId } from '../value-objects/FecalysisResultId';
import { LabRequestId } from '../value-objects/LabRequestId';

interface IFecalysisResult {
  id?: FecalysisResultId;
  labRequestId: LabRequestId;
  patientId: string;
  patientName: string;
  age?: string;
  sex?: string;
  dateTaken: Date;
  // Fecalysis specific fields
  color?: string;
  consistency?: string;
  rbc?: string;
  wbc?: string;
  occultBlood?: string;
  urobilinogen?: string;
  others?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class FecalysisResult implements IFecalysisResult {
  private readonly _id?: FecalysisResultId;
  private readonly _labRequestId: LabRequestId;
  private readonly _patientId: string;
  private readonly _patientName: string;
  private readonly _age?: string;
  private readonly _sex?: string;
  private readonly _dateTaken: Date;
  private readonly _color?: string;
  private readonly _consistency?: string;
  private readonly _rbc?: string;
  private readonly _wbc?: string;
  private readonly _occultBlood?: string;
  private readonly _urobilinogen?: string;
  private readonly _others?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  private constructor(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<IFecalysisResult>,
    id?: string | FecalysisResultId,
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    this._labRequestId = labRequestId;
    this._patientId = patientId;
    this._patientName = patientName;
    this._dateTaken = dateTaken;
    this._age = results.age;
    this._sex = results.sex;
    this._color = results.color;
    this._consistency = results.consistency;
    this._rbc = results.rbc;
    this._wbc = results.wbc;
    this._occultBlood = results.occultBlood;
    this._urobilinogen = results.urobilinogen;
    this._others = results.others;
    this._id = id instanceof FecalysisResultId ? id : id ? new FecalysisResultId(id) : undefined;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method for creating new fecalysis results with business rule validation
   */
  public static create(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<IFecalysisResult>
  ): FecalysisResult {
    const fecalysisResult = new FecalysisResult(labRequestId, patientId, patientName, dateTaken, results);
    
    // Business rule validation for new records
    fecalysisResult.validate();
    
    return fecalysisResult;
  }

  /**
   * Factory method for reconstructing from persistence
   */
  public static fromPersistence(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<IFecalysisResult>,
    id: string,
    createdAt: Date,
    updatedAt?: Date
  ): FecalysisResult {
    return new FecalysisResult(labRequestId, patientId, patientName, dateTaken, results, id, createdAt, updatedAt);
  }

  // Getters
  get id(): FecalysisResultId | undefined {
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

  get color(): string | undefined {
    return this._color;
  }

  get consistency(): string | undefined {
    return this._consistency;
  }

  get rbc(): string | undefined {
    return this._rbc;
  }

  get wbc(): string | undefined {
    return this._wbc;
  }

  get occultBlood(): string | undefined {
    return this._occultBlood;
  }

  get urobilinogen(): string | undefined {
    return this._urobilinogen;
  }

  get others(): string | undefined {
    return this._others;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Business methods
  update(results: Partial<IFecalysisResult>): FecalysisResult {
    const newFecalysisResult = new FecalysisResult(
      this._labRequestId,
      this._patientId,
      this._patientName,
      this._dateTaken,
      { ...this.toPlainObject(), ...results },
      this._id,
      this._createdAt,
      new Date()
    );
    
    newFecalysisResult.validate();
    return newFecalysisResult;
  }

  /**
   * Business rule validation
   */
  private validate(): void {
    if (!this._patientId?.trim()) {
      throw new Error('Patient ID is required for fecalysis result');
    }

    if (!this._patientName?.trim()) {
      throw new Error('Patient name is required for fecalysis result');
    }

    if (!this._dateTaken) {
      throw new Error('Date taken is required for fecalysis result');
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
      color: this._color,
      consistency: this._consistency,
      rbc: this._rbc,
      wbc: this._wbc,
      occultBlood: this._occultBlood,
      urobilinogen: this._urobilinogen,
      others: this._others,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
