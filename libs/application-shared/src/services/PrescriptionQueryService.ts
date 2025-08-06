import { injectable, inject } from 'tsyringe';
import { IPrescriptionQueryService } from '../interfaces/IPrescriptionService';
import { Prescription } from '@nx-starter/domain';
import { GetAllPrescriptionsQueryHandler } from '../use-cases/queries/PrescriptionQueryHandlers';
import { GetPrescriptionByIdQueryHandler } from '../use-cases/queries/PrescriptionQueryHandlers';
import { GetPrescriptionsByPatientIdQueryHandler } from '../use-cases/queries/PrescriptionQueryHandlers';
import { GetPrescriptionsByDoctorIdQueryHandler } from '../use-cases/queries/PrescriptionQueryHandlers';
import { GetActivePrescriptionsQueryHandler } from '../use-cases/queries/PrescriptionQueryHandlers';
import { GetExpiredPrescriptionsQueryHandler } from '../use-cases/queries/PrescriptionQueryHandlers';
import { GetPrescriptionsByMedicationNameQueryHandler } from '../use-cases/queries/PrescriptionQueryHandlers';
import { TOKENS } from '../di/tokens';

/**
 * Prescription Query Service implementation following CQRS pattern
 * Orchestrates read operations through query handlers
 */
@injectable()
export class PrescriptionQueryService implements IPrescriptionQueryService {
  constructor(
    @inject(TOKENS.GetAllPrescriptionsQueryHandler)
    private readonly getAllPrescriptionsQueryHandler: GetAllPrescriptionsQueryHandler,
    @inject(TOKENS.GetPrescriptionByIdQueryHandler)
    private readonly getPrescriptionByIdQueryHandler: GetPrescriptionByIdQueryHandler,
    @inject(TOKENS.GetPrescriptionsByPatientIdQueryHandler)
    private readonly getPrescriptionsByPatientIdQueryHandler: GetPrescriptionsByPatientIdQueryHandler,
    @inject(TOKENS.GetPrescriptionsByDoctorIdQueryHandler)
    private readonly getPrescriptionsByDoctorIdQueryHandler: GetPrescriptionsByDoctorIdQueryHandler,
    @inject(TOKENS.GetActivePrescriptionsQueryHandler)
    private readonly getActivePrescriptionsQueryHandler: GetActivePrescriptionsQueryHandler,
    @inject(TOKENS.GetExpiredPrescriptionsQueryHandler)
    private readonly getExpiredPrescriptionsQueryHandler: GetExpiredPrescriptionsQueryHandler,
    @inject(TOKENS.GetPrescriptionsByMedicationNameQueryHandler)
    private readonly getPrescriptionsByMedicationNameQueryHandler: GetPrescriptionsByMedicationNameQueryHandler
  ) {}

  async getAllPrescriptions(): Promise<Prescription[]> {
    return await this.getAllPrescriptionsQueryHandler.execute();
  }

  async getPrescriptionById(id: string): Promise<Prescription> {
    return await this.getPrescriptionByIdQueryHandler.execute({ id });
  }

  async getPrescriptionsByPatientId(patientId: string): Promise<Prescription[]> {
    return await this.getPrescriptionsByPatientIdQueryHandler.execute({ patientId });
  }

  async getPrescriptionsByDoctorId(doctorId: string): Promise<Prescription[]> {
    return await this.getPrescriptionsByDoctorIdQueryHandler.execute({ doctorId });
  }

  async getActivePrescriptions(): Promise<Prescription[]> {
    return await this.getActivePrescriptionsQueryHandler.execute();
  }

  async getExpiredPrescriptions(): Promise<Prescription[]> {
    return await this.getExpiredPrescriptionsQueryHandler.execute();
  }

  async getPrescriptionsByMedicationName(medicationName: string): Promise<Prescription[]> {
    return await this.getPrescriptionsByMedicationNameQueryHandler.execute({ medicationName });
  }
}