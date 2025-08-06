import { SerologyResultId } from '../value-objects/SerologyResultId';
import { LabRequestId } from '../value-objects/LabRequestId';

interface ISerologyResult {
  id?: SerologyResultId;
  labRequestId: LabRequestId;
  patientId: string;
  patientName: string;
  age?: string;
  sex?: string;
  dateTaken: Date;
  // Serology specific fields
  vdrl?: string;
  rpr?: string;
  hbsag?: string;
  antiHcv?: string;
  hivTest?: string;
  pregnancyTest?: string;
  dengueNs1?: string;
  dengueTourniquet?: string;
  weilFelix?: string;
  typhidot?: string;
  bloodType?: string;
  rhFactor?: string;
  others?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class SerologyResult implements ISerologyResult {
  private readonly _id?: SerologyResultId;
  private readonly _labRequestId: LabRequestId;
  private readonly _patientId: string;
  private readonly _patientName: string;
  private readonly _age?: string;
  private readonly _sex?: string;
  private readonly _dateTaken: Date;
  private readonly _vdrl?: string;
  private readonly _rpr?: string;
  private readonly _hbsag?: string;
  private readonly _antiHcv?: string;
  private readonly _hivTest?: string;
  private readonly _pregnancyTest?: string;
  private readonly _dengueNs1?: string;
  private readonly _dengueTourniquet?: string;
  private readonly _weilFelix?: string;
  private readonly _typhidot?: string;
  private readonly _bloodType?: string;
  private readonly _rhFactor?: string;
  private readonly _others?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  private constructor(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<ISerologyResult>,
    id?: string | SerologyResultId,
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    this._labRequestId = labRequestId;
    this._patientId = patientId;
    this._patientName = patientName;
    this._dateTaken = dateTaken;
    this._age = results.age;
    this._sex = results.sex;
    this._vdrl = results.vdrl;
    this._rpr = results.rpr;
    this._hbsag = results.hbsag;
    this._antiHcv = results.antiHcv;
    this._hivTest = results.hivTest;
    this._pregnancyTest = results.pregnancyTest;
    this._dengueNs1 = results.dengueNs1;
    this._dengueTourniquet = results.dengueTourniquet;
    this._weilFelix = results.weilFelix;
    this._typhidot = results.typhidot;
    this._bloodType = results.bloodType;
    this._rhFactor = results.rhFactor;
    this._others = results.others;
    this._id = id instanceof SerologyResultId ? id : id ? new SerologyResultId(id) : undefined;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method for creating new serology results with business rule validation
   */
  public static create(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<ISerologyResult>
  ): SerologyResult {
    const serologyResult = new SerologyResult(labRequestId, patientId, patientName, dateTaken, results);
    
    // Business rule validation for new records
    serologyResult.validate();
    
    return serologyResult;
  }

  /**
   * Factory method for reconstructing from persistence
   */
  public static fromPersistence(
    labRequestId: LabRequestId,
    patientId: string,
    patientName: string,
    dateTaken: Date,
    results: Partial<ISerologyResult>,
    id: string,
    createdAt: Date,
    updatedAt?: Date
  ): SerologyResult {
    return new SerologyResult(labRequestId, patientId, patientName, dateTaken, results, id, createdAt, updatedAt);
  }

  // Getters
  get id(): SerologyResultId | undefined {
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

  get vdrl(): string | undefined {
    return this._vdrl;
  }

  get rpr(): string | undefined {
    return this._rpr;
  }

  get hbsag(): string | undefined {
    return this._hbsag;
  }

  get antiHcv(): string | undefined {
    return this._antiHcv;
  }

  get hivTest(): string | undefined {
    return this._hivTest;
  }

  get pregnancyTest(): string | undefined {
    return this._pregnancyTest;
  }

  get dengueNs1(): string | undefined {
    return this._dengueNs1;
  }

  get dengueTourniquet(): string | undefined {
    return this._dengueTourniquet;
  }

  get weilFelix(): string | undefined {
    return this._weilFelix;
  }

  get typhidot(): string | undefined {
    return this._typhidot;
  }

  get bloodType(): string | undefined {
    return this._bloodType;
  }

  get rhFactor(): string | undefined {
    return this._rhFactor;
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
  update(results: Partial<ISerologyResult>): SerologyResult {
    const newSerologyResult = new SerologyResult(
      this._labRequestId,
      this._patientId,
      this._patientName,
      this._dateTaken,
      { ...this.toPlainObject(), ...results },
      this._id,
      this._createdAt,
      new Date()
    );
    
    newSerologyResult.validate();
    return newSerologyResult;
  }

  /**
   * Business rule validation
   */
  private validate(): void {
    if (!this._patientId?.trim()) {
      throw new Error('Patient ID is required for serology result');
    }

    if (!this._patientName?.trim()) {
      throw new Error('Patient name is required for serology result');
    }

    if (!this._dateTaken) {
      throw new Error('Date taken is required for serology result');
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
      vdrl: this._vdrl,
      rpr: this._rpr,
      hbsag: this._hbsag,
      antiHcv: this._antiHcv,
      hivTest: this._hivTest,
      pregnancyTest: this._pregnancyTest,
      dengueNs1: this._dengueNs1,
      dengueTourniquet: this._dengueTourniquet,
      weilFelix: this._weilFelix,
      typhidot: this._typhidot,
      bloodType: this._bloodType,
      rhFactor: this._rhFactor,
      others: this._others,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
