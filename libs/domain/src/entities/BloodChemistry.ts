import { BloodChemistryId } from '../value-objects/BloodChemistryId';
import { BloodChemistryPatientInfo } from '../value-objects/BloodChemistryPatientInfo';
import { BloodChemistryResults } from '../value-objects/BloodChemistryResults';
import { LabRequestId } from '../value-objects/LabRequestId';

interface IBloodChemistry {
  id?: BloodChemistryId;
  labRequestId?: LabRequestId;
  patientInfo: BloodChemistryPatientInfo;
  dateTaken: Date;
  results: BloodChemistryResults;
  createdAt: Date;
  updatedAt?: Date;
}

export class BloodChemistry implements IBloodChemistry {
  private readonly _id?: BloodChemistryId;
  private readonly _labRequestId?: LabRequestId;
  private readonly _patientInfo: BloodChemistryPatientInfo;
  private readonly _dateTaken: Date;
  private readonly _results: BloodChemistryResults;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  private constructor(
    patientInfo: BloodChemistryPatientInfo,
    dateTaken: Date,
    results: BloodChemistryResults,
    id?: string | BloodChemistryId,
    labRequestId?: string | LabRequestId,
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    this._patientInfo = patientInfo;
    this._dateTaken = dateTaken;
    this._results = results;
    this._id = id instanceof BloodChemistryId ? id : id ? new BloodChemistryId(id) : undefined;
    this._labRequestId = labRequestId instanceof LabRequestId ? labRequestId : labRequestId ? new LabRequestId(labRequestId) : undefined;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method for creating new blood chemistry records with business rule validation
   */
  public static create(
    patientInfo: BloodChemistryPatientInfo,
    dateTaken: Date,
    results: BloodChemistryResults,
    labRequestId?: string | LabRequestId
  ): BloodChemistry {
    const bloodChemistry = new BloodChemistry(patientInfo, dateTaken, results, undefined, labRequestId);
    
    // Business rule validation for new records
    bloodChemistry.validate();
    
    return bloodChemistry;
  }

  /**
   * Factory method for reconstructing blood chemistry records from persistence without validation
   */
  public static reconstruct(
    id: string | BloodChemistryId,
    patientInfo: BloodChemistryPatientInfo,
    dateTaken: Date,
    results: BloodChemistryResults,
    createdAt: Date,
    updatedAt?: Date,
    labRequestId?: string | LabRequestId
  ): BloodChemistry {
    return new BloodChemistry(
      patientInfo,
      dateTaken,
      results,
      id,
      labRequestId,
      createdAt,
      updatedAt
    );
  }

  get id(): BloodChemistryId | undefined {
    return this._id;
  }

  get labRequestId(): LabRequestId | undefined {
    return this._labRequestId;
  }

  get patientInfo(): BloodChemistryPatientInfo {
    return this._patientInfo;
  }

  get dateTaken(): Date {
    return this._dateTaken;
  }

  get results(): BloodChemistryResults {
    return this._results;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Business methods
  updateResults(newResults: BloodChemistryResults): BloodChemistry {
    if (!this._id) {
      throw new Error('Cannot update results of unsaved BloodChemistry record');
    }
    return BloodChemistry.reconstruct(
      this._id,
      this._patientInfo,
      this._dateTaken,
      newResults,
      this._createdAt,
      new Date(),
      this._labRequestId
    );
  }

  hasAbnormalResults(): boolean {
    return this._results.hasAbnormalValues();
  }

  validate(): void {
    this._patientInfo.validate();
    this._results.validate();
    
    // Validate date taken is not in the future
    if (this._dateTaken > new Date()) {
      throw new Error('Date taken cannot be in the future');
    }
  }
}
