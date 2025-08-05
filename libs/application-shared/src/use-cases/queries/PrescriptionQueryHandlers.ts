import { injectable, inject } from 'tsyringe';
import { Prescription, PrescriptionNotFoundException } from '@nx-starter/domain';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import type {
  GetPrescriptionByIdQuery,
  GetPrescriptionsByPatientIdQuery,
  GetPrescriptionsByDoctorIdQuery,
  GetPrescriptionsByMedicationNameQuery,
  PrescriptionStatsQueryResult,
} from '../../dto/PrescriptionQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all prescriptions
 */
@injectable()
export class GetAllPrescriptionsQueryHandler {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(): Promise<Prescription[]> {
    return await this.prescriptionRepository.getAll();
  }
}

/**
 * Query handler for getting a prescription by ID
 */
@injectable()
export class GetPrescriptionByIdQueryHandler {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(query: GetPrescriptionByIdQuery): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.getById(query.id);
    if (!prescription) {
      throw new PrescriptionNotFoundException(query.id);
    }
    return prescription;
  }
}

/**
 * Query handler for getting prescriptions by patient ID
 */
@injectable()
export class GetPrescriptionsByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(query: GetPrescriptionsByPatientIdQuery): Promise<Prescription[]> {
    return await this.prescriptionRepository.getByPatientId(query.patientId);
  }
}

/**
 * Query handler for getting prescriptions by doctor ID
 */
@injectable()
export class GetPrescriptionsByDoctorIdQueryHandler {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(query: GetPrescriptionsByDoctorIdQuery): Promise<Prescription[]> {
    return await this.prescriptionRepository.getByDoctorId(query.doctorId);
  }
}

/**
 * Query handler for getting active prescriptions
 */
@injectable()
export class GetActivePrescriptionsQueryHandler {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(): Promise<Prescription[]> {
    return await this.prescriptionRepository.getActive();
  }
}

/**
 * Query handler for getting expired prescriptions
 */
@injectable()
export class GetExpiredPrescriptionsQueryHandler {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(): Promise<Prescription[]> {
    return await this.prescriptionRepository.getExpired();
  }
}

/**
 * Query handler for getting prescriptions by medication name
 */
@injectable()
export class GetPrescriptionsByMedicationNameQueryHandler {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(query: GetPrescriptionsByMedicationNameQuery): Promise<Prescription[]> {
    return await this.prescriptionRepository.getByMedicationName(query.medicationName);
  }
}

/**
 * Query handler for getting prescription statistics
 */
@injectable()
export class GetPrescriptionStatsQueryHandler {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(): Promise<PrescriptionStatsQueryResult> {
    const allPrescriptions = await this.prescriptionRepository.getAll();
    const activePrescriptions = await this.prescriptionRepository.getActive();
    const expiredPrescriptions = await this.prescriptionRepository.getExpired();

    const totalCount = allPrescriptions.length;
    const activeCount = activePrescriptions.length;
    const expiredCount = expiredPrescriptions.length;
    const inactiveCount = totalCount - activeCount - expiredCount;

    // Get most prescribed medications
    const medicationCounts = allPrescriptions.reduce((acc, prescription) => {
      const medication = prescription.medicationNameValue;
      acc[medication] = (acc[medication] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPrescribedMedications = Object.entries(medicationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([medication, count]) => ({ medication, count }));

    return {
      totalCount,
      activeCount,
      expiredCount,
      inactiveCount,
      mostPrescribedMedications,
    };
  }
}