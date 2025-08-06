import { injectable } from 'tsyringe';
import { Prescription } from '@nx-starter/domain';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

/**
 * In-memory implementation of IPrescriptionRepository
 * Useful for development and testing
 */
@injectable()
export class InMemoryPrescriptionRepository implements IPrescriptionRepository {
  private prescriptions: Map<string, Prescription> = new Map();

  async getAll(): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async create(prescription: Prescription): Promise<string> {
    const id = generateId();
    const prescriptionWithId = new Prescription(
      prescription.patientId,
      prescription.doctorId,
      prescription.medicationName.value,
      prescription.dosage.value,
      prescription.instructions.value,
      prescription.frequency,
      prescription.duration,
      prescription.prescribedDate,
      id,
      prescription.expiryDate,
      prescription.quantity,
      prescription.additionalNotes,
      prescription.status,
      prescription.createdAt
    );

    this.prescriptions.set(id, prescriptionWithId);
    return id;
  }

  async update(id: string, changes: Partial<Prescription>): Promise<void> {
    const existingPrescription = this.prescriptions.get(id);
    if (!existingPrescription) {
      throw new Error(`Prescription with ID ${id} not found`);
    }

    // Create updated prescription with changes
    const updatedPrescription = new Prescription(
      existingPrescription.patientId,
      existingPrescription.doctorId,
      changes.medicationName !== undefined
        ? typeof changes.medicationName === 'string'
          ? changes.medicationName
          : changes.medicationName && typeof changes.medicationName === 'object' && 'value' in changes.medicationName
            ? (changes.medicationName as any).value
            : existingPrescription.medicationName.value
        : existingPrescription.medicationName.value,
      changes.dosage !== undefined
        ? typeof changes.dosage === 'string'
          ? changes.dosage
          : changes.dosage && typeof changes.dosage === 'object' && 'value' in changes.dosage
            ? (changes.dosage as any).value
            : existingPrescription.dosage.value
        : existingPrescription.dosage.value,
      changes.instructions !== undefined
        ? typeof changes.instructions === 'string'
          ? changes.instructions
          : changes.instructions && typeof changes.instructions === 'object' && 'value' in changes.instructions
            ? (changes.instructions as any).value
            : existingPrescription.instructions.value
        : existingPrescription.instructions.value,
      (changes as any).frequency !== undefined ? (changes as any).frequency : existingPrescription.frequency,
      (changes as any).duration !== undefined ? (changes as any).duration : existingPrescription.duration,
      existingPrescription.prescribedDate,
      id,
      changes.expiryDate !== undefined ? changes.expiryDate : existingPrescription.expiryDate,
      (changes as any).quantity !== undefined ? (changes as any).quantity : existingPrescription.quantity,
      (changes as any).additionalNotes !== undefined ? (changes as any).additionalNotes : existingPrescription.additionalNotes,
      (changes as any).status !== undefined ? (changes as any).status : existingPrescription.status,
      existingPrescription.createdAt
    );

    this.prescriptions.set(id, updatedPrescription);
  }

  async delete(id: string): Promise<void> {
    const deleted = this.prescriptions.delete(id);
    if (!deleted) {
      throw new Error(`Prescription with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Prescription | undefined> {
    return this.prescriptions.get(id);
  }

  async getByPatientId(patientId: string): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values())
      .filter(prescription => prescription.patientId === patientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getByDoctorId(doctorId: string): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values())
      .filter(prescription => prescription.doctorId === doctorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getActive(): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values())
      .filter(prescription => prescription.status === 'active')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getByStatus(status: 'active' | 'completed' | 'discontinued' | 'on-hold'): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values())
      .filter(prescription => prescription.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getExpired(): Promise<Prescription[]> {
    const currentDate = new Date();
    return Array.from(this.prescriptions.values())
      .filter(prescription => 
        prescription.expiryDate && prescription.expiryDate < currentDate
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getByMedicationName(medicationName: string): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values())
      .filter(prescription => 
        prescription.medicationName.value.toLowerCase().includes(medicationName.toLowerCase())
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Helper method to clear all prescriptions (useful for testing)
   */
  async clear(): Promise<void> {
    this.prescriptions.clear();
  }

  /**
   * Helper method to get count (useful for testing)
   */
  async count(): Promise<number> {
    return this.prescriptions.size;
  }
}