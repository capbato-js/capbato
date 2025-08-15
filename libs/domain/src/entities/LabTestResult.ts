import { LabRequestId } from '../value-objects/LabRequestId';

export interface LabTestBloodChemistryResults {
  fbs?: number;
  bun?: number;
  creatinine?: number;
  uricAcid?: number;
  cholesterol?: number;
  triglycerides?: number;
  hdl?: number;
  ldl?: number;
  vldl?: number;
  sodium?: number;
  potassium?: number;
  sgot?: number;
  sgpt?: number;
  alkPhosphatase?: number;
  hba1c?: number;
}

export interface LabTestUrinalysisResults {
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
}

export interface LabTestHematologyResults {
  hematocrit?: string;
  hemoglobin?: string;
  rbc?: string;
  wbc?: string;
  segmenters?: string;
  lymphocyte?: string;
  monocyte?: string;
  basophils?: string;
  eosinophils?: string;
  platelet?: string;
  others?: string;
}

export interface LabTestFecalysisResults {
  color?: string;
  consistency?: string;
  rbc?: string;
  wbc?: string;
  occultBlood?: string;
  urobilinogen?: string;
  others?: string;
}

export interface LabTestSerologyResults {
  ft3?: number;
  ft4?: number;
  tsh?: number;
  dengueIgg?: string;
  dengueIgm?: string;
  dengueNs1?: string;
}

interface ILabTestResult {
  id?: string;
  labRequestId: string;
  patientId: string;
  dateTested: Date;
  bloodChemistry?: LabTestBloodChemistryResults;
  urinalysis?: LabTestUrinalysisResults;
  hematology?: LabTestHematologyResults;
  fecalysis?: LabTestFecalysisResults;
  serology?: LabTestSerologyResults;
  remarks?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class LabTestResult implements ILabTestResult {
  private readonly _id?: string;
  private readonly _labRequestId: string;
  private readonly _patientId: string;
  private readonly _dateTested: Date;
  private readonly _bloodChemistry?: LabTestBloodChemistryResults;
  private readonly _urinalysis?: LabTestUrinalysisResults;
  private readonly _hematology?: LabTestHematologyResults;
  private readonly _fecalysis?: LabTestFecalysisResults;
  private readonly _serology?: LabTestSerologyResults;
  private readonly _remarks?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  constructor(
    labRequestId: string,
    patientId: string,
    dateTested: Date,
    bloodChemistry?: LabTestBloodChemistryResults,
    urinalysis?: LabTestUrinalysisResults,
    hematology?: LabTestHematologyResults,
    fecalysis?: LabTestFecalysisResults,
    serology?: LabTestSerologyResults,
    remarks?: string,
    id?: string,
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    this._labRequestId = labRequestId;
    this._patientId = patientId;
    this._dateTested = dateTested;
    this._bloodChemistry = bloodChemistry;
    this._urinalysis = urinalysis;
    this._hematology = hematology;
    this._fecalysis = fecalysis;
    this._serology = serology;
    this._remarks = remarks;
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get labRequestId(): string {
    return this._labRequestId;
  }

  get patientId(): string {
    return this._patientId;
  }

  get dateTested(): Date {
    return this._dateTested;
  }

  get bloodChemistry(): LabTestBloodChemistryResults | undefined {
    return this._bloodChemistry;
  }

  get urinalysis(): LabTestUrinalysisResults | undefined {
    return this._urinalysis;
  }

  get hematology(): LabTestHematologyResults | undefined {
    return this._hematology;
  }

  get fecalysis(): LabTestFecalysisResults | undefined {
    return this._fecalysis;
  }

  get serology(): LabTestSerologyResults | undefined {
    return this._serology;
  }

  get remarks(): string | undefined {
    return this._remarks;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Business methods
  hasAnyResults(): boolean {
    return !!(
      this._bloodChemistry ||
      this._urinalysis ||
      this._hematology ||
      this._fecalysis ||
      this._serology
    );
  }

  hasBloodChemistryResults(): boolean {
    return !!this._bloodChemistry && Object.keys(this._bloodChemistry).length > 0;
  }

  hasUrinalysisResults(): boolean {
    return !!this._urinalysis && Object.keys(this._urinalysis).length > 0;
  }

  hasHematologyResults(): boolean {
    return !!this._hematology && Object.keys(this._hematology).length > 0;
  }

  hasFecalysisResults(): boolean {
    return !!this._fecalysis && Object.keys(this._fecalysis).length > 0;
  }

  hasSerologyResults(): boolean {
    return !!this._serology && Object.keys(this._serology).length > 0;
  }

  validate(): void {
    if (!this._labRequestId || this._labRequestId.length !== 32) {
      throw new Error('Lab request ID must be a valid dashless UUID (32 characters)');
    }

    if (!this._patientId || this._patientId.length !== 32) {
      throw new Error('Patient ID must be a valid dashless UUID (32 characters)');
    }

    if (!this._dateTested) {
      throw new Error('Date tested is required');
    }

    if (this._dateTested > new Date()) {
      throw new Error('Date tested cannot be in the future');
    }

    if (!this.hasAnyResults()) {
      throw new Error('At least one test result type must be provided');
    }
  }

  withId(id: string): LabTestResult {
    return new LabTestResult(
      this._labRequestId,
      this._patientId,
      this._dateTested,
      this._bloodChemistry,
      this._urinalysis,
      this._hematology,
      this._fecalysis,
      this._serology,
      this._remarks,
      id,
      this._createdAt,
      this._updatedAt
    );
  }

  update(
    bloodChemistry?: LabTestBloodChemistryResults,
    urinalysis?: LabTestUrinalysisResults,
    hematology?: LabTestHematologyResults,
    fecalysis?: LabTestFecalysisResults,
    serology?: LabTestSerologyResults,
    remarks?: string
  ): LabTestResult {
    return new LabTestResult(
      this._labRequestId,
      this._patientId,
      this._dateTested,
      bloodChemistry ?? this._bloodChemistry,
      urinalysis ?? this._urinalysis,
      hematology ?? this._hematology,
      fecalysis ?? this._fecalysis,
      serology ?? this._serology,
      remarks ?? this._remarks,
      this._id,
      this._createdAt,
      new Date()
    );
  }
}