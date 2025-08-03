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
import { LabRequestModel, ILabRequestDocument } from './LabRequestSchema';

@injectable()
export class MongooseLabRequestRepository implements ILabRequestRepository {
  async save(labRequest: LabRequest): Promise<LabRequest> {
    const document = labRequest.id
      ? await LabRequestModel.findByIdAndUpdate(
          labRequest.id.value,
          this.domainToDocument(labRequest),
          { new: true, upsert: true }
        )
      : await LabRequestModel.create(this.domainToDocument(labRequest));

    if (!document) {
      throw new Error('Failed to save lab request');
    }

    return this.documentToDomain(document);
  }

  async findById(id: LabRequestId): Promise<LabRequest | null> {
    const document = await LabRequestModel.findById(id.value);
    return document ? this.documentToDomain(document) : null;
  }

  async findAll(filter?: LabRequestRepositoryFilter): Promise<LabRequest[]> {
    const query: Record<string, unknown> = {};

    if (filter?.status) {
      query.status = filter.status;
    }

    if (filter?.patientId) {
      query.patientId = filter.patientId;
    }

    if (filter?.dateFrom && filter?.dateTo) {
      query.requestDate = {
        $gte: filter.dateFrom,
        $lte: filter.dateTo
      };
    }

    const documents = await LabRequestModel
      .find(query)
      .sort({ requestDate: -1 })
      .exec();

    return documents.map(doc => this.documentToDomain(doc));
  }

  async findByPatientId(patientId: string): Promise<LabRequest[]> {
    const documents = await LabRequestModel
      .find({ patientId })
      .sort({ requestDate: -1 })
      .exec();

    return documents.map(doc => this.documentToDomain(doc));
  }

  async findCompleted(): Promise<LabRequest[]> {
    const documents = await LabRequestModel
      .find({ status: 'complete' })
      .sort({ requestDate: -1 })
      .exec();

    return documents.map(doc => this.documentToDomain(doc));
  }

  async update(labRequest: LabRequest): Promise<LabRequest> {
    if (!labRequest.id) {
      throw new Error('Lab request must have an ID to update');
    }

    const document = await LabRequestModel.findByIdAndUpdate(
      labRequest.id.value,
      this.domainToDocument(labRequest),
      { new: true }
    );

    if (!document) {
      throw new Error('Lab request not found');
    }

    return this.documentToDomain(document);
  }

  async delete(id: LabRequestId): Promise<void> {
    await LabRequestModel.findByIdAndDelete(id.value);
  }

  private domainToDocument(labRequest: LabRequest): Partial<ILabRequestDocument> {
    const doc: Partial<ILabRequestDocument> = {
      patientId: labRequest.patientInfo.patientId,
      patientName: labRequest.patientInfo.patientName,
      ageGender: labRequest.patientInfo.ageGender,
      requestDate: labRequest.requestDate,
      status: labRequest.status.value,
      dateTaken: labRequest.dateTaken,
      others: labRequest.others,
      createdAt: labRequest.createdAt,
      updatedAt: labRequest.updatedAt
    };

    // Map tests to document fields
    const tests = labRequest.tests.tests;
    doc.cbcWithPlatelet = tests.cbcWithPlatelet;
    doc.pregnancyTest = tests.pregnancyTest;
    doc.urinalysis = tests.urinalysis;
    doc.fecalysis = tests.fecalysis;
    doc.occultBloodTest = tests.occultBloodTest;
    doc.hepaBScreening = tests.hepaBScreening;
    doc.hepaAScreening = tests.hepaAScreening;
    doc.hepatitisProfile = tests.hepatitisProfile;
    doc.vdrlRpr = tests.vdrlRpr;
    doc.dengueNs1 = tests.dengueNs1;
    doc.ca125CeaPsa = tests.ca125CeaPsa;
    doc.fbs = tests.fbs;
    doc.bun = tests.bun;
    doc.creatinine = tests.creatinine;
    doc.bloodUricAcid = tests.bloodUricAcid;
    doc.lipidProfile = tests.lipidProfile;
    doc.sgot = tests.sgot;
    doc.sgpt = tests.sgpt;
    doc.alp = tests.alp;
    doc.sodiumNa = tests.sodiumNa;
    doc.potassiumK = tests.potassiumK;
    doc.hbalc = tests.hbalc;
    doc.ecg = tests.ecg;
    doc.t3 = tests.t3;
    doc.t4 = tests.t4;
    doc.ft3 = tests.ft3;
    doc.ft4 = tests.ft4;
    doc.tsh = tests.tsh;

    if (labRequest.id) {
      doc._id = labRequest.id.value;
    }

    return doc;
  }

  private documentToDomain(document: ILabRequestDocument): LabRequest {
    const patientInfo = LabRequestPatientInfo.create({
      patientId: document.patientId,
      patientName: document.patientName,
      ageGender: document.ageGender
    });

    const tests = LabRequestTests.create({
      cbcWithPlatelet: document.cbcWithPlatelet,
      pregnancyTest: document.pregnancyTest,
      urinalysis: document.urinalysis,
      fecalysis: document.fecalysis,
      occultBloodTest: document.occultBloodTest,
      hepaBScreening: document.hepaBScreening,
      hepaAScreening: document.hepaAScreening,
      hepatitisProfile: document.hepatitisProfile,
      vdrlRpr: document.vdrlRpr,
      dengueNs1: document.dengueNs1,
      ca125CeaPsa: document.ca125CeaPsa,
      fbs: document.fbs,
      bun: document.bun,
      creatinine: document.creatinine,
      bloodUricAcid: document.bloodUricAcid,
      lipidProfile: document.lipidProfile,
      sgot: document.sgot,
      sgpt: document.sgpt,
      alp: document.alp,
      sodiumNa: document.sodiumNa,
      potassiumK: document.potassiumK,
      hbalc: document.hbalc,
      ecg: document.ecg,
      t3: document.t3,
      t4: document.t4,
      ft3: document.ft3,
      ft4: document.ft4,
      tsh: document.tsh
    });

    const status = LabRequestStatus.create(document.status as 'pending' | 'complete' | 'cancelled');

    return new LabRequest(
      patientInfo,
      document.requestDate,
      tests,
      status,
      document._id,
      document.dateTaken,
      document.others,
      document.createdAt,
      document.updatedAt
    );
  }
}
