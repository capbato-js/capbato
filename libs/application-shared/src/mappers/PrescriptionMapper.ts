import { Prescription } from '@nx-starter/domain';
import type { PrescriptionDto, CreatePrescriptionDto } from '../dto/PrescriptionDto';

/**
 * Mapper for converting between Prescription entities and DTOs
 */
export class PrescriptionMapper {
  /**
   * Maps a Prescription entity to a PrescriptionDto
   */
  static toDto(prescription: Prescription): PrescriptionDto {
    return {
      id: prescription.id?.value.toString() || '',
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medicationName: prescription.medicationName.value,
      dosage: prescription.dosage.value,
      instructions: prescription.instructions.value,
      prescribedDate: prescription.prescribedDate.toISOString(),
      expiryDate: prescription.expiryDate?.toISOString(),
      isActive: prescription.isActive,
      createdAt: prescription.createdAt.toISOString(),
    };
  }

  /**
   * Maps an array of Prescription entities to PrescriptionDtos
   */
  static toDtoArray(prescriptions: Prescription[]): PrescriptionDto[] {
    return prescriptions.map((prescription) => this.toDto(prescription));
  }

  /**
   * Maps a PrescriptionDto to a Prescription entity
   */
  static toDomain(dto: PrescriptionDto): Prescription {
    return new Prescription(
      dto.patientId,
      dto.doctorId,
      dto.medicationName,
      dto.dosage,
      dto.instructions,
      new Date(dto.prescribedDate),
      dto.id || undefined,
      dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      dto.isActive,
      new Date(dto.createdAt)
    );
  }

  /**
   * Maps a CreatePrescriptionDto to a Prescription entity
   */
  static createToDomain(dto: CreatePrescriptionDto): Prescription {
    return new Prescription(
      dto.patientId,
      dto.doctorId,
      dto.medicationName,
      dto.dosage,
      dto.instructions,
      dto.prescribedDate ? new Date(dto.prescribedDate) : new Date(),
      undefined,
      dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      dto.isActive !== undefined ? dto.isActive : true
    );
  }

  /**
   * Maps a plain object from database to Prescription entity
   * This method is useful for ORM mapping
   */
  static fromPlainObject(obj: {
    id: string;
    patientId: string;
    doctorId: string;
    medicationName: string;
    dosage: string;
    instructions: string;
    prescribedDate: Date;
    expiryDate?: Date;
    isActive: boolean;
    createdAt: Date;
  }): Prescription {
    return new Prescription(
      obj.patientId,
      obj.doctorId,
      obj.medicationName,
      obj.dosage,
      obj.instructions,
      obj.prescribedDate,
      obj.id,
      obj.expiryDate,
      obj.isActive,
      obj.createdAt
    );
  }

  /**
   * Maps Prescription entity to plain object for database storage
   */
  static toPlainObject(
    prescription: Prescription,
    id?: string
  ): {
    id?: string;
    patientId: string;
    doctorId: string;
    medicationName: string;
    dosage: string;
    instructions: string;
    prescribedDate: Date;
    expiryDate?: Date;
    isActive: boolean;
    createdAt: Date;
  } {
    return {
      ...(id && { id }),
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medicationName: prescription.medicationName.value,
      dosage: prescription.dosage.value,
      instructions: prescription.instructions.value,
      prescribedDate: prescription.prescribedDate,
      expiryDate: prescription.expiryDate,
      isActive: prescription.isActive,
      createdAt: prescription.createdAt,
    };
  }
}