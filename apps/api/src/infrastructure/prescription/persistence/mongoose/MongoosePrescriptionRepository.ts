import { injectable } from 'tsyringe';
import mongoose from 'mongoose';
import { Prescription } from '@nx-starter/domain';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import { PrescriptionModel } from './PrescriptionSchema';
import { PrescriptionMapper } from '@nx-starter/application-shared';

/**
 * Mongoose implementation of IPrescriptionRepository
 * For MongoDB NoSQL database
 */
@injectable()
export class MongoosePrescriptionRepository implements IPrescriptionRepository {
  async getAll(): Promise<Prescription[]> {
    const documents = await PrescriptionModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async create(prescription: Prescription): Promise<string> {
    const document = new PrescriptionModel({
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medicationName: prescription.medications[0]?.medicationName?.value || '',
      dosage: prescription.medications[0]?.dosage?.value || '',
      instructions: prescription.medications[0]?.instructions?.value || '',
      prescribedDate: prescription.prescribedDate,
      expiryDate: prescription.expiryDate,
      isActive: prescription.status === 'active',
      createdAt: prescription.createdAt,
    });

    const saved = await document.save();
    return saved._id.toString();
  }

  async update(id: string, changes: Partial<Prescription>): Promise<void> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Prescription with ID ${id} not found`);
    }

    const updateData: any = {};

    // Handle medications array - for simplicity, just update with first medication
    if ((changes as any).medications && (changes as any).medications.length > 0) {
      const firstMedication = (changes as any).medications[0];
      updateData.medicationName = firstMedication.medicationName?.value || firstMedication.medicationName;
      updateData.dosage = firstMedication.dosage?.value || firstMedication.dosage;
      updateData.instructions = firstMedication.instructions?.value || firstMedication.instructions;
    }

    if (changes.expiryDate !== undefined) {
      updateData.expiryDate = changes.expiryDate;
    }

    // Map status to isActive
    if ((changes as any).status !== undefined) {
      updateData.isActive = (changes as any).status === 'active';
    }

    const result = await PrescriptionModel.updateOne({ _id: id }, updateData);

    if (result.matchedCount === 0) {
      throw new Error(`Prescription with ID ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Prescription with ID ${id} not found`);
    }

    const result = await PrescriptionModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new Error(`Prescription with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Prescription | undefined> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return undefined;
    }

    const document = await PrescriptionModel.findById(id).lean().exec();
    return document ? this.toDomain(document) : undefined;
  }

  async getByPatientId(patientId: string): Promise<Prescription[]> {
    const documents = await PrescriptionModel.find({ patientId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async getByDoctorId(doctorId: string): Promise<Prescription[]> {
    const documents = await PrescriptionModel.find({ doctorId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async getActive(): Promise<Prescription[]> {
    const documents = await PrescriptionModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async getExpired(): Promise<Prescription[]> {
    const currentDate = new Date();
    const documents = await PrescriptionModel.find({
      expiryDate: { $lt: currentDate },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  async getByMedicationName(medicationName: string): Promise<Prescription[]> {
    const documents = await PrescriptionModel.find({
      medicationName: { $regex: medicationName, $options: 'i' },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return documents.map(this.toDomain);
  }

  /**
   * Maps MongoDB document to domain entity
   */
  private toDomain(doc: any): Prescription {
    return PrescriptionMapper.fromPlainObject({
      id: doc._id.toString(),
      patientId: doc.patientId,
      doctorId: doc.doctorId,
      medicationName: doc.medicationName,
      dosage: doc.dosage,
      instructions: doc.instructions,
      prescribedDate: doc.prescribedDate,
      expiryDate: doc.expiryDate,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
    });
  }
}