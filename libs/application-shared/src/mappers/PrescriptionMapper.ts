import { Prescription, Medication } from '@nx-starter/domain';
import type { PrescriptionDto, CreatePrescriptionDto, MedicationDto } from '../dto/PrescriptionDto';

/**
 * Mapper for converting between Prescription entities and DTOs
 */
export class PrescriptionMapper {
  /**
   * Maps a Prescription entity to a PrescriptionDto
   */
  static toDto(prescription: Prescription, patientData?: any, doctorData?: any): PrescriptionDto {
    // Convert Medication entities to DTOs
    const medicationDtos: MedicationDto[] = prescription.medications.map(medication => ({
      id: medication.stringId,
      medicationName: medication.medicationNameValue,
      dosage: medication.dosageValue,
      instructions: medication.instructionsValue,
      frequency: medication.frequency,
      duration: medication.duration,
    }));

    // For legacy compatibility, use the first medication if available
    const firstMedication = prescription.medications[0];

    const baseDto: PrescriptionDto = {
      id: prescription.id?.value.toString() || '',
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medications: medicationDtos,
      // Legacy single medication fields for backward compatibility
      medicationName: firstMedication?.medicationNameValue || '',
      dosage: firstMedication?.dosageValue || '',
      instructions: firstMedication?.instructionsValue || '',
      frequency: firstMedication?.frequency || '',
      duration: firstMedication?.duration || '',
      prescribedDate: prescription.prescribedDate.toISOString(),
      expiryDate: prescription.expiryDate?.toISOString(),
      quantity: prescription.quantity,
      additionalNotes: prescription.additionalNotes,
      status: prescription.status,
      createdAt: prescription.createdAt.toISOString(),
    };

    // If populated data is available, include it
    if (patientData && doctorData) {
      baseDto.patient = {
        id: patientData.id,
        patientNumber: patientData.patientNumber,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        middleName: patientData.middleName,
        fullName: `${patientData.firstName} ${patientData.middleName ? patientData.middleName + ' ' : ''}${patientData.lastName}`.trim(),
      };
      baseDto.doctor = {
        id: doctorData.id,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        fullName: `Dr. ${doctorData.firstName} ${doctorData.lastName}`.trim(),
        specialization: doctorData.specialization,
      };
    }
    
    return baseDto;
  }

  /**
   * Maps a Prescription entity to a PrescriptionDto (backward compatibility)
   */
  static toDtoBasic(prescription: Prescription): PrescriptionDto {
    return this.toDto(prescription);
  }

  /**
   * Maps an array of Prescription entities to PrescriptionDtos
   */
  static toDtoArray(prescriptions: Prescription[]): PrescriptionDto[] {
    return prescriptions.map(prescription => {
      // Access populated data if available
      const patientData = (prescription as any)._populatedPatient;
      const doctorData = (prescription as any)._populatedDoctor;
      
      return this.toDto(prescription, patientData, doctorData);
    });
  }

  /**
   * Maps a PrescriptionDto to a Prescription entity
   */
  static toDomain(dto: PrescriptionDto): Prescription {
    // Convert medication DTOs to domain entities
    const medications: Medication[] = dto.medications?.map(medicationDto => 
      new Medication(
        dto.id || "PENDING", // Use prescription ID from DTO
        medicationDto.medicationName,
        medicationDto.dosage,
        medicationDto.instructions,
        medicationDto.frequency,
        medicationDto.duration,
        medicationDto.id
      )
    ) || [];

    // If no medications array exists (legacy data), create one from legacy fields
    if (medications.length === 0 && dto.medicationName) {
      medications.push(new Medication(
        dto.id || "PENDING", // Use prescription ID from DTO
        dto.medicationName,
        dto.dosage,
        dto.instructions,
        dto.frequency,
        dto.duration
      ));
    }

    return new Prescription(
      dto.patientId,
      dto.doctorId,
      medications,
      new Date(dto.prescribedDate),
      dto.id || undefined,
      dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      dto.quantity,
      dto.additionalNotes,
      dto.status,
      new Date(dto.createdAt)
    );
  }

  /**
   * Maps a CreatePrescriptionDto to a Prescription entity
   */
  static createToDomain(dto: CreatePrescriptionDto): Prescription {
    // Convert medication DTOs to domain entities
    const medications: Medication[] = dto.medications?.map(medicationDto => 
      new Medication(
        "PENDING", // Temporary prescriptionId for creation
        medicationDto.medicationName,
        medicationDto.dosage,
        medicationDto.instructions,
        medicationDto.frequency,
        medicationDto.duration
      )
    ) || [];

    // If no medications array exists (legacy data), create one from legacy fields
    if (medications.length === 0 && dto.medicationName) {
      medications.push(new Medication(
        "PENDING", // Temporary prescriptionId for creation
        dto.medicationName,
        dto.dosage || '',
        dto.instructions || '',
        dto.frequency || '',
        dto.duration || ''
      ));
    }

    return new Prescription(
      dto.patientId,
      dto.doctorId,
      medications,
      dto.prescribedDate ? new Date(dto.prescribedDate) : new Date(),
      undefined,
      dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      dto.quantity,
      dto.additionalNotes,
      dto.status || 'active'
    );
  }

  /**
   * Convert a plain object to a Prescription domain entity
   * Handles both new medications array format and legacy individual medication fields
   */
  static fromPlainObject(data: Record<string, any>): Prescription {
    // Handle medications - either from medications array or legacy individual fields
    let medications: Medication[] = [];
    
    if (data['medications'] && Array.isArray(data['medications'])) {
      // New format: medications array
      medications = data['medications'].map((med: any) => new Medication(
        data['id'] || 'PENDING',
        med.medicationName || med.name,
        med.dosage,
        med.instructions,
        med.frequency,
        med.duration
      ));
    } else if (data['medicationName'] && data['dosage'] && data['frequency'] && data['duration']) {
      // Legacy format: individual medication fields
      medications = [new Medication(
        data['id'] || 'PENDING',
        data['medicationName'],
        data['dosage'],
        data['instructions'] || '',
        data['frequency'],
        data['duration']
      )];
    }

    const prescription = new Prescription(
      data['patientId'],
      data['doctorId'],
      medications,
      data['prescribedDate'] ? new Date(data['prescribedDate']) : new Date(),
      data['id'],
      data['expiryDate'] ? new Date(data['expiryDate']) : undefined,
      data['quantity'],
      data['additionalNotes'],
      data['status'] || 'active',
      data['createdAt'] ? new Date(data['createdAt']) : new Date()
    );

    // Attach populated data if available (for enhanced DTOs)
    if (data['patient']) {
      (prescription as any)._populatedPatient = data['patient'];
    }
    if (data['doctor']) {
      (prescription as any)._populatedDoctor = data['doctor'];
    }

    return prescription;
  }

  /**
   * Maps Prescription entity to plain object for database storage
   * Uses the first medication for backward compatibility with legacy database schema
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
    frequency: string;
    duration: string;
    prescribedDate: Date;
    expiryDate?: Date;
    quantity?: string;
    additionalNotes?: string;
    status: 'active' | 'completed' | 'discontinued' | 'on-hold';
    createdAt: Date;
  } {
    // Use the first medication for legacy compatibility
    const firstMedication = prescription.medications[0];
    
    return {
      ...(id && { id }),
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medicationName: firstMedication?.medicationNameValue || '',
      dosage: firstMedication?.dosageValue || '',
      instructions: firstMedication?.instructionsValue || '',
      frequency: firstMedication?.frequency || '',
      duration: firstMedication?.duration || '',
      prescribedDate: prescription.prescribedDate,
      expiryDate: prescription.expiryDate,
      quantity: prescription.quantity,
      additionalNotes: prescription.additionalNotes,
      status: prescription.status,
      createdAt: prescription.createdAt,
    };
  }
}