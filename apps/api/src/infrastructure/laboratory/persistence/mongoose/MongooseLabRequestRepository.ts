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

  async getById(id: string): Promise<LabRequest | null> {
    const document = await LabRequestModel.findById(id);
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
    // Routine tests
    doc.cbcWithPlatelet = tests.routine.cbcWithPlatelet ? 'true' : '';
    doc.pregnancyTest = tests.routine.pregnancyTest ? 'true' : '';
    doc.urinalysis = tests.routine.urinalysis ? 'true' : '';
    doc.fecalysis = tests.routine.fecalysis ? 'true' : '';
    doc.occultBloodTest = tests.routine.occultBloodTest ? 'true' : '';
    
    // Serology tests
    doc.hepaBScreening = tests.serology.hepatitisBScreening ? 'true' : '';
    doc.hepaAScreening = tests.serology.hepatitisAScreening ? 'true' : '';
    doc.hepatitisProfile = tests.serology.hepatitisProfile ? 'true' : '';
    doc.vdrlRpr = tests.serology.vdrlRpr ? 'true' : '';
    doc.dengueNs1 = tests.serology.dengueNs1 ? 'true' : '';
    doc.ca125CeaPsa = (tests.serology.ca125 || tests.serology.cea || tests.serology.psa) ? 'true' : '';
    
    // Blood chemistry tests
    doc.fbs = tests.bloodChemistry.fbs ? 'true' : '';
    doc.bun = tests.bloodChemistry.bun ? 'true' : '';
    doc.creatinine = tests.bloodChemistry.creatinine ? 'true' : '';
    doc.bloodUricAcid = tests.bloodChemistry.bloodUricAcid ? 'true' : '';
    doc.lipidProfile = tests.bloodChemistry.lipidProfile ? 'true' : '';
    doc.sgot = tests.bloodChemistry.sgot ? 'true' : '';
    doc.sgpt = tests.bloodChemistry.sgpt ? 'true' : '';
    doc.alp = tests.bloodChemistry.alkalinePhosphatase ? 'true' : '';
    doc.sodiumNa = tests.bloodChemistry.sodium ? 'true' : '';
    doc.potassiumK = tests.bloodChemistry.potassium ? 'true' : '';
    doc.hbalc = tests.bloodChemistry.hba1c ? 'true' : '';
    
    // Miscellaneous tests
    doc.ecg = tests.miscellaneous.ecg ? 'true' : '';
    
    // Thyroid tests
    doc.t3 = tests.thyroid.t3 ? 'true' : '';
    doc.t4 = tests.thyroid.t4 ? 'true' : '';
    doc.ft3 = tests.thyroid.ft3 ? 'true' : '';
    doc.ft4 = tests.thyroid.ft4 ? 'true' : '';
    doc.tsh = tests.thyroid.tsh ? 'true' : '';

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
      routine: {
        cbcWithPlatelet: !!document.cbcWithPlatelet,
        pregnancyTest: !!document.pregnancyTest,
        urinalysis: !!document.urinalysis,
        fecalysis: !!document.fecalysis,
        occultBloodTest: !!document.occultBloodTest,
      },
      serology: {
        hepatitisBScreening: !!document.hepaBScreening,
        hepatitisAScreening: !!document.hepaAScreening,
        hepatitisCScreening: false, // Not stored in document
        hepatitisProfile: !!document.hepatitisProfile,
        vdrlRpr: !!document.vdrlRpr,
        crp: false, // Not stored in document
        dengueNs1: !!document.dengueNs1,
        aso: false, // Not stored in document
        crf: false, // Not stored in document
        raRf: false, // Not stored in document
        tumorMarkers: false, // Not stored in document
        ca125: !!document.ca125CeaPsa, // Combined field
        cea: !!document.ca125CeaPsa, // Combined field
        psa: !!document.ca125CeaPsa, // Combined field
        betaHcg: false, // Not stored in document
      },
      bloodChemistry: {
        fbs: !!document.fbs,
        bun: !!document.bun,
        creatinine: !!document.creatinine,
        bloodUricAcid: !!document.bloodUricAcid,
        lipidProfile: !!document.lipidProfile,
        sgot: !!document.sgot,
        sgpt: !!document.sgpt,
        alkalinePhosphatase: !!document.alp,
        sodium: !!document.sodiumNa,
        potassium: !!document.potassiumK,
        hba1c: !!document.hbalc,
      },
      miscellaneous: {
        ecg: !!document.ecg,
      },
      thyroid: {
        t3: !!document.t3,
        t4: !!document.t4,
        ft3: !!document.ft3,
        ft4: !!document.ft4,
        tsh: !!document.tsh,
      },
    });

    const status = LabRequestStatus.create(document.status);

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
