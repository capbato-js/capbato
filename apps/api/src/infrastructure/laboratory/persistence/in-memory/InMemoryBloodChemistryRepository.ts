import { injectable } from 'tsyringe';
import { 
  IBloodChemistryRepository,
  BloodChemistryRepositoryFilter,
  BloodChemistry,
  BloodChemistryId 
} from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

@injectable()
export class InMemoryBloodChemistryRepository implements IBloodChemistryRepository {
  private readonly bloodChemistries: Map<string, BloodChemistry> = new Map();

  async save(bloodChemistry: BloodChemistry): Promise<BloodChemistry> {
    if (!bloodChemistry.id) {
      // Create new blood chemistry with generated dashless UUID
      const newId = generateId();
      const newBloodChemistry = BloodChemistry.reconstruct(
        newId,
        bloodChemistry.patientInfo,
        bloodChemistry.dateTaken,
        bloodChemistry.results,
        bloodChemistry.createdAt,
        new Date()
      );
      this.bloodChemistries.set(newId, newBloodChemistry);
      return newBloodChemistry;
    } else {
      // Update existing blood chemistry
      const updatedBloodChemistry = BloodChemistry.reconstruct(
        bloodChemistry.id,
        bloodChemistry.patientInfo,
        bloodChemistry.dateTaken,
        bloodChemistry.results,
        bloodChemistry.createdAt,
        new Date()
      );
      this.bloodChemistries.set(bloodChemistry.id.value, updatedBloodChemistry);
      return updatedBloodChemistry;
    }
  }

  async findById(id: BloodChemistryId): Promise<BloodChemistry | null> {
    return this.bloodChemistries.get(id.value) || null;
  }

  async findAll(_filter?: BloodChemistryRepositoryFilter): Promise<BloodChemistry[]> {
    const results = Array.from(this.bloodChemistries.values());

    // Note: Filters disabled due to domain model changes
    // TODO: Implement filters after domain model stabilization

    // Sort by creation date (newest first)
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByPatientId(_patientId: string): Promise<BloodChemistry[]> {
    // Note: Patient ID filter disabled due to domain model changes
    // TODO: Implement after patient ID mapping is defined
    const results = Array.from(this.bloodChemistries.values());
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findCompleted(): Promise<BloodChemistry[]> {
    // Note: Status filter disabled due to domain model changes
    // TODO: Implement after status mapping is defined
    const results = Array.from(this.bloodChemistries.values());
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async update(bloodChemistry: BloodChemistry): Promise<BloodChemistry> {
    if (!bloodChemistry.id) {
      throw new Error('Blood chemistry must have an ID to update');
    }

    if (!this.bloodChemistries.has(bloodChemistry.id.value)) {
      throw new Error('Blood chemistry not found');
    }

    return await this.save(bloodChemistry);
  }

  async delete(id: BloodChemistryId): Promise<void> {
    this.bloodChemistries.delete(id.value);
  }

  // Test helper methods
  clear(): void {
    this.bloodChemistries.clear();
  }

  size(): number {
    return this.bloodChemistries.size;
  }
}
