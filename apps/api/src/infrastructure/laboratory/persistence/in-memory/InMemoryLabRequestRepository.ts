import { injectable } from 'tsyringe';
import { 
  ILabRequestRepository,
  LabRequestRepositoryFilter,
  LabRequest,
  LabRequestId 
} from '@nx-starter/domain';

@injectable()
export class InMemoryLabRequestRepository implements ILabRequestRepository {
  private readonly labRequests: Map<string, LabRequest> = new Map();
  private currentId = 1;

  async save(labRequest: LabRequest): Promise<LabRequest> {
    if (!labRequest.id) {
      // Create new lab request with generated ID
      const newLabRequest = new LabRequest(
        labRequest.patientInfo,
        labRequest.requestDate,
        labRequest.tests,
        labRequest.status,
        this.currentId.toString(),
        labRequest.dateTaken,
        labRequest.others,
        labRequest.createdAt,
        new Date()
      );
      this.labRequests.set(this.currentId.toString(), newLabRequest);
      this.currentId++;
      return newLabRequest;
    } else {
      // Update existing lab request
      const updatedLabRequest = new LabRequest(
        labRequest.patientInfo,
        labRequest.requestDate,
        labRequest.tests,
        labRequest.status,
        labRequest.id,
        labRequest.dateTaken,
        labRequest.others,
        labRequest.createdAt,
        new Date()
      );
      this.labRequests.set(labRequest.id.value, updatedLabRequest);
      return updatedLabRequest;
    }
  }

  async findById(id: LabRequestId): Promise<LabRequest | null> {
    return this.labRequests.get(id.value) || null;
  }

  async findAll(filter?: LabRequestRepositoryFilter): Promise<LabRequest[]> {
    let results = Array.from(this.labRequests.values());

    if (filter?.status) {
      results = results.filter(lab => lab.status.value === filter.status);
    }

    if (filter?.patientId) {
      results = results.filter(lab => lab.patientInfo.patientId === filter.patientId);
    }

    if (filter?.dateFrom && filter?.dateTo) {
      results = results.filter(lab => {
        const requestDate = lab.requestDate;
        return requestDate >= filter.dateFrom && requestDate <= filter.dateTo;
      });
    }

    // Sort by request date (newest first)
    return results.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
  }

  async findByPatientId(patientId: string): Promise<LabRequest[]> {
    const results = Array.from(this.labRequests.values())
      .filter(lab => lab.patientInfo.patientId === patientId);

    return results.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
  }

  async findCompleted(): Promise<LabRequest[]> {
    const results = Array.from(this.labRequests.values())
      .filter(lab => lab.status.value === 'complete');

    return results.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
  }

  async update(labRequest: LabRequest): Promise<LabRequest> {
    if (!labRequest.id) {
      throw new Error('Lab request must have an ID to update');
    }

    if (!this.labRequests.has(labRequest.id.value)) {
      throw new Error('Lab request not found');
    }

    return await this.save(labRequest);
  }

  async delete(id: LabRequestId): Promise<void> {
    this.labRequests.delete(id.value);
  }

  // Test helper methods
  clear(): void {
    this.labRequests.clear();
    this.currentId = 1;
  }

  size(): number {
    return this.labRequests.size;
  }
}
