import { injectable } from 'tsyringe';
import { 
  IBloodChemistryRepository,
  BloodChemistryRepositoryFilter,
  BloodChemistry,
  BloodChemistryId,
  BloodChemistryPatientInfo,
  BloodChemistryResults
} from '@nx-starter/domain';
import { BloodChemistryModel, IBloodChemistryDocument } from './BloodChemistrySchema';

@injectable()
export class MongooseBloodChemistryRepository implements IBloodChemistryRepository {
  async save(bloodChemistry: BloodChemistry): Promise<BloodChemistry> {
    const document = bloodChemistry.id
      ? await BloodChemistryModel.findByIdAndUpdate(
          bloodChemistry.id.value,
          this.domainToDocument(bloodChemistry),
          { new: true, upsert: true }
        )
      : await BloodChemistryModel.create(this.domainToDocument(bloodChemistry));

    if (!document) {
      throw new Error('Failed to save blood chemistry');
    }

    return this.documentToDomain(document);
  }

  async findById(id: BloodChemistryId): Promise<BloodChemistry | null> {
    const document = await BloodChemistryModel.findById(id.value);
    return document ? this.documentToDomain(document) : null;
  }

  async findAll(filter?: BloodChemistryRepositoryFilter): Promise<BloodChemistry[]> {
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

    const documents = await BloodChemistryModel
      .find(query)
      .sort({ requestDate: -1 })
      .exec();

    return documents.map(doc => this.documentToDomain(doc));
  }

  async findByPatientId(patientId: string): Promise<BloodChemistry[]> {
    const documents = await BloodChemistryModel
      .find({ patientId })
      .sort({ requestDate: -1 })
      .exec();

    return documents.map(doc => this.documentToDomain(doc));
  }

  async findCompleted(): Promise<BloodChemistry[]> {
    const documents = await BloodChemistryModel
      .find({ status: 'complete' })
      .sort({ requestDate: -1 })
      .exec();

    return documents.map(doc => this.documentToDomain(doc));
  }

  async update(bloodChemistry: BloodChemistry): Promise<BloodChemistry> {
    if (!bloodChemistry.id) {
      throw new Error('Blood chemistry must have an ID to update');
    }

    const document = await BloodChemistryModel.findByIdAndUpdate(
      bloodChemistry.id.value,
      this.domainToDocument(bloodChemistry),
      { new: true }
    );

    if (!document) {
      throw new Error('Blood chemistry not found');
    }

    return this.documentToDomain(document);
  }

  async delete(id: BloodChemistryId): Promise<void> {
    await BloodChemistryModel.findByIdAndDelete(id.value);
  }

  private domainToDocument(bloodChemistry: BloodChemistry): Partial<IBloodChemistryDocument> {
    const doc: Partial<IBloodChemistryDocument> = {
      patientId: `BC-${Date.now()}`, // Generate a simple patient ID
      patientName: bloodChemistry.patientInfo.patientName,
      ageGender: `${bloodChemistry.patientInfo.age}/${bloodChemistry.patientInfo.sex}`,
      requestDate: bloodChemistry.dateTaken, // Use dateTaken as requestDate
      status: 'complete', // Default status
      dateTaken: bloodChemistry.dateTaken,
      others: '', // Default empty others
      createdAt: bloodChemistry.createdAt,
      updatedAt: bloodChemistry.updatedAt
    };

    // Map results to document fields
    const results = bloodChemistry.results.results;
    doc.fbs = results.fbs?.toString();
    doc.bun = results.bun?.toString();
    doc.creatinine = results.creatinine?.toString();
    doc.bloodUricAcid = results.uricAcid?.toString();
    doc.lipidProfile = results.cholesterol ? `Cholesterol: ${results.cholesterol}` : undefined;
    doc.sgot = results.sgot?.toString();
    doc.sgpt = results.sgpt?.toString();
    doc.alp = results.alkPhosphatase?.toString();
    doc.sodiumNa = results.sodium?.toString();
    doc.potassiumK = results.potassium?.toString();
    doc.hbalc = results.hbalc?.toString();

    if (bloodChemistry.id) {
      doc._id = bloodChemistry.id.value;
    }

    return doc;
  }

  private documentToDomain(document: IBloodChemistryDocument): BloodChemistry {
    const patientInfo = new BloodChemistryPatientInfo({
      patientName: document.patientName,
      age: parseInt(document.ageGender.split('/')[0]) || 0,
      sex: document.ageGender.split('/')[1] || 'unknown'
    });

    const results = new BloodChemistryResults({
      fbs: document.fbs ? parseFloat(document.fbs) : undefined,
      bun: document.bun ? parseFloat(document.bun) : undefined,
      creatinine: document.creatinine ? parseFloat(document.creatinine) : undefined,
      uricAcid: document.bloodUricAcid ? parseFloat(document.bloodUricAcid) : undefined,
      cholesterol: document.lipidProfile ? parseFloat(document.lipidProfile.replace(/[^\d.]/g, '')) || undefined : undefined,
      sgot: document.sgot ? parseFloat(document.sgot) : undefined,
      sgpt: document.sgpt ? parseFloat(document.sgpt) : undefined,
      alkPhosphatase: document.alp ? parseFloat(document.alp) : undefined,
      sodium: document.sodiumNa ? parseFloat(document.sodiumNa) : undefined,
      potassium: document.potassiumK ? parseFloat(document.potassiumK) : undefined,
      hbalc: document.hbalc ? parseFloat(document.hbalc) : undefined
    });

    return new BloodChemistry(
      patientInfo,
      document.dateTaken || document.requestDate,
      results,
      document._id,
      document.createdAt,
      document.updatedAt
    );
  }
}
