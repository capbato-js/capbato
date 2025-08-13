import { LabRequestId } from '../value-objects/LabRequestId';
import { LabRequestPatientInfo } from '../value-objects/LabRequestPatientInfo';
import { LabRequestTests } from '../value-objects/LabRequestTests';
import { LabRequestStatus } from '../value-objects/LabRequestStatus';

interface ILabRequest {
  id?: LabRequestId;
  patientInfo: LabRequestPatientInfo;
  requestDate: Date;
  tests: LabRequestTests;
  status: LabRequestStatus;
  dateTaken?: Date;
  others?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class LabRequest implements ILabRequest {
  private readonly _id?: LabRequestId;
  private readonly _patientInfo: LabRequestPatientInfo;
  private readonly _requestDate: Date;
  private readonly _tests: LabRequestTests;
  private readonly _status: LabRequestStatus;
  private readonly _dateTaken?: Date;
  private readonly _others?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  constructor(
    patientInfo: LabRequestPatientInfo,
    requestDate: Date,
    tests: LabRequestTests,
    status: LabRequestStatus = LabRequestStatus.create('pending'),
    id?: string | LabRequestId,
    dateTaken?: Date,
    others?: string,
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    this._patientInfo = patientInfo;
    this._requestDate = requestDate;
    this._tests = tests;
    this._status = status;
    this._id = id instanceof LabRequestId ? id : id ? new LabRequestId(id) : undefined;
    this._dateTaken = dateTaken;
    this._others = others;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): LabRequestId | undefined {
    return this._id;
  }

  get patientInfo(): LabRequestPatientInfo {
    return this._patientInfo;
  }

  get requestDate(): Date {
    return this._requestDate;
  }

  get tests(): LabRequestTests {
    return this._tests;
  }

  get status(): LabRequestStatus {
    return this._status;
  }

  get dateTaken(): Date | undefined {
    return this._dateTaken;
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
  complete(dateTaken: Date): LabRequest {
    return new LabRequest(
      this._patientInfo,
      this._requestDate,
      this._tests,
      LabRequestStatus.create('completed'),
      this._id,
      dateTaken,
      this._others,
      this._createdAt,
      new Date()
    );
  }

  updateResults(updatedTests: LabRequestTests, dateTaken?: Date): LabRequest {
    return new LabRequest(
      this._patientInfo,
      this._requestDate,
      updatedTests,
      this._status,
      this._id,
      dateTaken || this._dateTaken,
      this._others,
      this._createdAt,
      new Date()
    );
  }

  cancel(): LabRequest {
    return new LabRequest(
      this._patientInfo,
      this._requestDate,
      this._tests,
      LabRequestStatus.create('cancelled'),
      this._id,
      this._dateTaken,
      this._others,
      this._createdAt,
      new Date()
    );
  }

  isCompleted(): boolean {
    return this._status.value === 'completed';
  }

  isPending(): boolean {
    return this._status.value === 'pending';
  }

  isCancelled(): boolean {
    return this._status.value === 'cancelled';
  }

  hasResults(): boolean {
    return this._dateTaken !== undefined;
  }

  validate(): void {
    this._patientInfo.validate();
    this._tests.validate();
    this._status.validate();
  }
}
