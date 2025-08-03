import { injectable } from 'tsyringe';
import { 
  IBloodChemistryRepository,
  BloodChemistryRepositoryFilter,
  BloodChemistry,
  BloodChemistryId 
} from '@nx-starter/domain';

@injectable()
export class InMemoryBloodChemistryRepository implements IBloodChemistryRepository {
  private readonly bloodChemistries: Map<string, BloodChemistry> = new Map();
  private currentId = 1;

  async save(bloodChemistry: BloodChemistry): Promise<BloodChemistry> {
    if (!bloodChemistry.id) {
      // Create new blood chemistry with generated ID
      const newBloodChemistry = new BloodChemistry(
        bloodChemistry.patientInfo,
        bloodChemistry.dateTaken,
        bloodChemistry.results,
        this.currentId.toString(),
        bloodChemistry.createdAt,
        new Date()
      );
      this.bloodChemistries.set(this.currentId.toString(), newBloodChemistry);
      this.currentId++;
      return newBloodChemistry;
    } else {
      // Update existing blood chemistry
      const updatedBloodChemistry = new BloodChemistry(
        bloodChemistry.patientInfo,
        bloodChemistry.dateTaken,
        bloodChemistry.results,
        bloodChemistry.id,
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
    this.currentId = 1;
  }

  size(): number {
    return this.bloodChemistries.size;
  }
}
