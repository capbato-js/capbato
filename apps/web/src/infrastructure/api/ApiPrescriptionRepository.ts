import { injectable, inject } from 'tsyringe';
import { Prescription } from '@nx-starter/domain';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import type { IPrescriptionApiService } from './IPrescriptionApiService';
import type { PrescriptionDto } from '@nx-starter/application-shared';
import { TOKENS, PrescriptionMapper } from '@nx-starter/application-shared';

// Extended prescription type to hold populated data
interface PrescriptionWithPopulatedData extends Prescription {
  _populatedPatient?: {
    id: string;
    patientNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    fullName: string;
  };
  _populatedDoctor?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    specialization?: string;
  };
}

/**
 * API-based PrescriptionRepository implementation
 * Uses IPrescriptionApiService for HTTP communication following Clean Architecture principles
 */
@injectable()
export class ApiPrescriptionRepository implements IPrescriptionRepository {
  constructor(
    @inject(TOKENS.PrescriptionApiService) private readonly apiService: IPrescriptionApiService
  ) {}

  async getAll(): Promise<Prescription[]> {
    const response = await this.apiService.getAllPrescriptions();
    return response.data.map(dto => this.mapDtoToPrescription(dto));
  }

  async create(prescription: Prescription): Promise<string> {
    const createDto = {
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medications: prescription.medications.map(medication => ({
        medicationName: medication.medicationNameValue,
        dosage: medication.dosageValue,
        instructions: medication.instructionsValue,
        frequency: medication.frequency,
        duration: medication.duration,
      })),
      prescribedDate: prescription.prescribedDate.toISOString(),
      expiryDate: prescription.expiryDate?.toISOString(),
      quantity: prescription.quantity,
      additionalNotes: prescription.additionalNotes,
      status: prescription.status,
    };

    const response = await this.apiService.createPrescription(createDto);
    return response.data.id;
  }

  async update(id: string, changes: Partial<Prescription>): Promise<void> {
    const updateDto = {
      ...(changes.patientId && { patientId: changes.patientId }),
      ...(changes.doctorId && { doctorId: changes.doctorId }),
      ...(changes.medications && { 
        medications: changes.medications.map(medication => ({
          medicationName: medication.medicationNameValue,
          dosage: medication.dosageValue,
          instructions: medication.instructionsValue,
          frequency: medication.frequency,
          duration: medication.duration,
        }))
      }),
      ...(changes.prescribedDate && { prescribedDate: changes.prescribedDate.toISOString() }),
      ...(changes.expiryDate && { expiryDate: changes.expiryDate.toISOString() }),
      ...(changes.quantity && { quantity: changes.quantity }),
      ...(changes.additionalNotes && { additionalNotes: changes.additionalNotes }),
      ...(changes.status && { status: changes.status }),
    };

    await this.apiService.updatePrescription(id, updateDto);
  }

  async delete(id: string): Promise<void> {
    await this.apiService.deletePrescription(id);
  }

  async getById(id: string): Promise<Prescription | undefined> {
    try {
      const response = await this.apiService.getPrescriptionById(id);
      return this.mapDtoToPrescription(response.data);
    } catch {
      // If not found, return undefined
      return undefined;
    }
  }

  async getByPatientId(patientId: string): Promise<Prescription[]> {
    const response = await this.apiService.getPrescriptionsByPatientId(patientId);
    return response.data.map(dto => this.mapDtoToPrescription(dto));
  }

  async getByDoctorId(doctorId: string): Promise<Prescription[]> {
    const response = await this.apiService.getPrescriptionsByDoctorId(doctorId);
    return response.data.map(dto => this.mapDtoToPrescription(dto));
  }

  async getActive(): Promise<Prescription[]> {
    const response = await this.apiService.getActivePrescriptions();
    return response.data.map(dto => this.mapDtoToPrescription(dto));
  }

  async getExpired(): Promise<Prescription[]> {
    const response = await this.apiService.getExpiredPrescriptions();
    return response.data.map(dto => this.mapDtoToPrescription(dto));
  }

  async getByMedicationName(medicationName: string): Promise<Prescription[]> {
    const response = await this.apiService.getPrescriptionsByMedicationName(medicationName);
    return response.data.map(dto => this.mapDtoToPrescription(dto));
  }

  /**
   * Maps API DTO to Prescription domain entity
   * Uses the proper PrescriptionMapper to ensure domain validation
   */
  private mapDtoToPrescription(dto: PrescriptionDto): Prescription {
    // Use the proper domain mapper which handles value objects correctly
    const prescription = PrescriptionMapper.toDomain(dto) as PrescriptionWithPopulatedData;

    // Preserve populated patient and doctor data for display purposes
    if (dto.patient) {
      prescription._populatedPatient = dto.patient;
    }
    if (dto.doctor) {
      prescription._populatedDoctor = dto.doctor;
    }

    return prescription as Prescription;
  }
}
