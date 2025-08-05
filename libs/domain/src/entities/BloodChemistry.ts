import { BloodChemistryId } from '../value-objects/BloodChemistryId';
import { BloodChemistryPatientInfo } from '../value-objects/BloodChemistryPatientInfo';
import { BloodChemistryResults } from '../value-objects/BloodChemistryResults';

interface IBloodChemistry {
  id?: BloodChemistryId;
  patientInfo: BloodChemistryPatientInfo;
  dateTaken: Date;
  results: BloodChemistryResults;
  createdAt: Date;
  updatedAt?: Date;
}

export class BloodChemistry implements IBloodChemistry {
  private readonly _id?: BloodChemistryId;
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
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    this._patientInfo = patientInfo;
    this._dateTaken = dateTaken;
    this._results = results;
    this._id = id instanceof BloodChemistryId ? id : id ? new BloodChemistryId(id) : undefined;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Factory method for creating new blood chemistry records with business rule validation
   */
  public static create(
    patientInfo: BloodChemistryPatientInfo,
    dateTaken: Date,
    results: BloodChemistryResults
  ): BloodChemistry {
    const bloodChemistry = new BloodChemistry(patientInfo, dateTaken, results);
    
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
    updatedAt?: Date
  ): BloodChemistry {
    return new BloodChemistry(
      patientInfo,
      dateTaken,
      results,
      id,
      createdAt,
      updatedAt
    );
  }

  get id(): BloodChemistryId | undefined {
    return this._id;
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
    return BloodChemistry.reconstruct(
      this._id!,
      this._patientInfo,
      this._dateTaken,
      newResults,
      this._createdAt,
      new Date()
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
