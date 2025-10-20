import { injectable } from 'tsyringe';
import {
  ILabRequestRepository,
  LabRequestRepositoryFilter,
  LabRequest,
  LabRequestId,
  TopLabTestDto
} from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

@injectable()
export class InMemoryLabRequestRepository implements ILabRequestRepository {
  private readonly labRequests: Map<string, LabRequest> = new Map();

  async save(labRequest: LabRequest): Promise<LabRequest> {
    if (!labRequest.id) {
      // Create new lab request with generated dashless UUID
      const newId = generateId();
      const newLabRequest = new LabRequest(
        labRequest.patientInfo,
        labRequest.requestDate,
        labRequest.tests,
        labRequest.status,
        newId,
        labRequest.dateTaken,
        labRequest.others,
        labRequest.createdAt,
        new Date()
      );
      this.labRequests.set(newId, newLabRequest);
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

  async getById(id: string): Promise<LabRequest | null> {
    return this.labRequests.get(id) || null;
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
      .filter(lab => lab.status.value === 'completed');

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

  async getTopLabTests(query?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<TopLabTestDto[]> {
    let labRequests = Array.from(this.labRequests.values());

    // Filter by date range if provided
    if (query?.startDate && query?.endDate) {
      const startDate = new Date(query.startDate);
      const endDate = new Date(query.endDate);
      labRequests = labRequests.filter(
        (request) => request.requestDate >= startDate && request.requestDate <= endDate
      );
    }

    // Only count non-cancelled requests
    labRequests = labRequests.filter((request) => request.status.value !== 'cancelled');

    // Map of test keys to their metadata
    const testMetadata: Record<string, { name: string; category: string }> = {
      // Routine Tests
      cbcWithPlatelet: { name: 'CBC with Platelet', category: 'Routine' },
      pregnancyTest: { name: 'Pregnancy Test', category: 'Routine' },
      urinalysis: { name: 'Urinalysis', category: 'Routine' },
      fecalysis: { name: 'Fecalysis', category: 'Routine' },
      occultBloodTest: { name: 'Occult Blood Test', category: 'Routine' },

      // Serology Tests
      hepatitisBScreening: { name: 'Hepatitis B Screening', category: 'Serology' },
      hepatitisAScreening: { name: 'Hepatitis A Screening', category: 'Serology' },
      hepatitisCScreening: { name: 'Hepatitis C Screening', category: 'Serology' },
      hepatitisProfile: { name: 'Hepatitis Profile', category: 'Serology' },
      vdrlRpr: { name: 'VDRL/RPR', category: 'Serology' },
      crp: { name: 'CRP', category: 'Serology' },
      dengueNs1: { name: 'Dengue NS1', category: 'Serology' },
      aso: { name: 'ASO', category: 'Serology' },
      crf: { name: 'CRF', category: 'Serology' },
      raRf: { name: 'RA/RF', category: 'Serology' },
      tumorMarkers: { name: 'Tumor Markers', category: 'Serology' },
      ca125: { name: 'CA 125', category: 'Serology' },
      cea: { name: 'CEA', category: 'Serology' },
      psa: { name: 'PSA', category: 'Serology' },
      betaHcg: { name: 'Beta HCG', category: 'Serology' },

      // Blood Chemistry Tests
      fbs: { name: 'FBS', category: 'Blood Chemistry' },
      bun: { name: 'BUN', category: 'Blood Chemistry' },
      creatinine: { name: 'Creatinine', category: 'Blood Chemistry' },
      bloodUricAcid: { name: 'Blood Uric Acid', category: 'Blood Chemistry' },
      lipidProfile: { name: 'Lipid Profile', category: 'Blood Chemistry' },
      sgot: { name: 'SGOT', category: 'Blood Chemistry' },
      sgpt: { name: 'SGPT', category: 'Blood Chemistry' },
      alkalinePhosphatase: { name: 'Alkaline Phosphatase', category: 'Blood Chemistry' },
      sodium: { name: 'Sodium', category: 'Blood Chemistry' },
      potassium: { name: 'Potassium', category: 'Blood Chemistry' },
      hba1c: { name: 'HBA1C', category: 'Blood Chemistry' },

      // Thyroid Tests
      t3: { name: 'T3', category: 'Thyroid' },
      t4: { name: 'T4', category: 'Thyroid' },
      ft3: { name: 'FT3', category: 'Thyroid' },
      ft4: { name: 'FT4', category: 'Thyroid' },
      tsh: { name: 'TSH', category: 'Thyroid' },

      // Coagulation Tests
      ptPtt: { name: 'PT/PTT', category: 'Coagulation' },
      pt: { name: 'PT', category: 'Coagulation' },
      ptt: { name: 'PTT', category: 'Coagulation' },
      inr: { name: 'INR', category: 'Coagulation' },

      // Miscellaneous
      ecg: { name: 'ECG', category: 'Miscellaneous' },
    };

    // Count occurrences of each test
    const testCounts = new Map<string, number>();

    labRequests.forEach((request) => {
      const tests = request.tests.tests;

      // Routine tests
      Object.entries(tests.routine).forEach(([key, value]) => {
        if (value === true && testMetadata[key]) {
          testCounts.set(key, (testCounts.get(key) || 0) + 1);
        }
      });

      // Serology tests
      Object.entries(tests.serology).forEach(([key, value]) => {
        if (value === true && testMetadata[key]) {
          testCounts.set(key, (testCounts.get(key) || 0) + 1);
        }
      });

      // Blood chemistry tests
      Object.entries(tests.bloodChemistry).forEach(([key, value]) => {
        if (value === true && testMetadata[key]) {
          testCounts.set(key, (testCounts.get(key) || 0) + 1);
        }
      });

      // Thyroid tests
      Object.entries(tests.thyroid).forEach(([key, value]) => {
        if (value === true && testMetadata[key]) {
          testCounts.set(key, (testCounts.get(key) || 0) + 1);
        }
      });

      // Coagulation tests
      Object.entries(tests.coagulation).forEach(([key, value]) => {
        if (value === true && testMetadata[key]) {
          testCounts.set(key, (testCounts.get(key) || 0) + 1);
        }
      });

      // Miscellaneous tests
      Object.entries(tests.miscellaneous).forEach(([key, value]) => {
        if (value === true && testMetadata[key]) {
          testCounts.set(key, (testCounts.get(key) || 0) + 1);
        }
      });
    });

    // Calculate total tests for percentage
    const totalTests = Array.from(testCounts.values()).reduce((sum, count) => sum + count, 0);

    // Convert to DTOs and sort by count
    const topTests: TopLabTestDto[] = Array.from(testCounts.entries())
      .map(([testKey, count]) => ({
        testName: testMetadata[testKey].name,
        testKey,
        category: testMetadata[testKey].category,
        count,
        percentage: totalTests > 0 ? Number(((count / totalTests) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, query?.limit || 10);

    return topTests;
  }

  // Test helper methods
  clear(): void {
    this.labRequests.clear();
  }

  size(): number {
    return this.labRequests.size;
  }
}
