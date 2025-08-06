import { UrinalysisResultId } from '../value-objects/UrinalysisResultId';
import { LabRequestId } from '../value-objects/LabRequestId';

interface IUrinalysisResult {
  id?: UrinalysisResultId;
  labRequestId: LabRequestId;
  patientId: string;
  patientName: string;
  age?: string;
  sex?: string;
  dateTaken: Date;
  // Urinalysis specific fields
  color?: string;
  transparency?: string;
  specificGravity?: string;
  ph?: string;
  protein?: string;
  glucose?: string;
  epithelialCells?: string;
  redCells?: string;
  pusCells?: string;
  mucusThread?: string;
  amorphousUrates?: string;
  amorphousPhosphate?: string;
  crystals?: string;
  bacteria?: string;
  others?: string;
  pregnancyTest?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class UrinalysisResult implements IUrinalysisResult {
  private readonly _id?: UrinalysisResultId;
  private readonly _labRequestId: LabRequestId;
  private readonly _patientId: string;
  private readonly _patientName: string;
  private readonly _age?: string;
  private readonly _sex?: string;
  private readonly _dateTaken: Date;
  private readonly _color?: string;
  private readonly _transparency?: string;
  private readonly _specificGravity?: string;
  private readonly _ph?: string;
  private readonly _protein?: string;
  private readonly _glucose?: string;
  private readonly _epithelialCells?: string;
  private readonly _redCells?: string;
  private readonly _pusCells?: string;
  private readonly _mucusThread?: string;
  private readonly _amorphousUrates?: string;
  private readonly _amorphousPhosphate?: string;
  private readonly _crystals?: string;
  private readonly _bacteria?: string;
  private readonly _others?: string;
  private readonly _pregnancyTest?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  private constructor(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<IUrinalysisResult>,
    id?: string | UrinalysisResultId,
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
    this._transparency = results.transparency;
    this._specificGravity = results.specificGravity;
    this._ph = results.ph;
    this._protein = results.protein;
    this._glucose = results.glucose;
    this._epithelialCells = results.epithelialCells;
    this._redCells = results.redCells;
    this._pusCells = results.pusCells;
    this._mucusThread = results.mucusThread;
    this._amorphousUrates = results.amorphousUrates;
    this._amorphousPhosphate = results.amorphousPhosphate;
    this._crystals = results.crystals;
    this._bacteria = results.bacteria;
    this._others = results.others;
    this._pregnancyTest = results.pregnancyTest;
    this._id = id instanceof UrinalysisResultId ? id : id ? new UrinalysisResultId(id) : undefined;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method for creating new urinalysis results with business rule validation
   */
  public static create(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<IUrinalysisResult>
  ): UrinalysisResult {
    const urinalysisResult = new UrinalysisResult(labRequestId, patientId, patientName, dateTaken, results);
    
    // Business rule validation for new records
    urinalysisResult.validate();
    
    return urinalysisResult;
  }

  /**
   * Factory method for reconstructing from persistence
   */
  public static fromPersistence(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<IUrinalysisResult>,
    id: string,
    createdAt: Date,
    updatedAt?: Date
  ): UrinalysisResult {
    return new UrinalysisResult(labRequestId, patientId, patientName, dateTaken, results, id, createdAt, updatedAt);
  }

  // Getters
  get id(): UrinalysisResultId | undefined {
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

  get transparency(): string | undefined {
    return this._transparency;
  }

  get specificGravity(): string | undefined {
    return this._specificGravity;
  }

  get ph(): string | undefined {
    return this._ph;
  }

  get protein(): string | undefined {
    return this._protein;
  }

  get glucose(): string | undefined {
    return this._glucose;
  }

  get epithelialCells(): string | undefined {
    return this._epithelialCells;
  }

  get redCells(): string | undefined {
    return this._redCells;
  }

  get pusCells(): string | undefined {
    return this._pusCells;
  }

  get mucusThread(): string | undefined {
    return this._mucusThread;
  }

  get amorphousUrates(): string | undefined {
    return this._amorphousUrates;
  }

  get amorphousPhosphate(): string | undefined {
    return this._amorphousPhosphate;
  }

  get crystals(): string | undefined {
    return this._crystals;
  }

  get bacteria(): string | undefined {
    return this._bacteria;
  }

  get others(): string | undefined {
    return this._others;
  }

  get pregnancyTest(): string | undefined {
    return this._pregnancyTest;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Business methods
  update(results: Partial<IUrinalysisResult>): UrinalysisResult {
    const newUrinalysisResult = new UrinalysisResult(
      this._labRequestId,
      this._patientId,
      this._patientName,
      this._dateTaken,
      { ...this.toPlainObject(), ...results },
      this._id,
      this._createdAt,
      new Date()
    );
    
    newUrinalysisResult.validate();
    return newUrinalysisResult;
  }

  /**
   * Business rule validation
   */
  private validate(): void {
    if (!this._patientId?.trim()) {
      throw new Error('Patient ID is required for urinalysis result');
    }

    if (!this._patientName?.trim()) {
      throw new Error('Patient name is required for urinalysis result');
    }

    if (!this._dateTaken) {
      throw new Error('Date taken is required for urinalysis result');
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
      transparency: this._transparency,
      specificGravity: this._specificGravity,
      ph: this._ph,
      protein: this._protein,
      glucose: this._glucose,
      epithelialCells: this._epithelialCells,
      redCells: this._redCells,
      pusCells: this._pusCells,
      mucusThread: this._mucusThread,
      amorphousUrates: this._amorphousUrates,
      amorphousPhosphate: this._amorphousPhosphate,
      crystals: this._crystals,
      bacteria: this._bacteria,
      others: this._others,
      pregnancyTest: this._pregnancyTest,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
