import { Patient } from '../domain/Patient';
import { AgeCalculationService } from '../domain/AgeCalculationService';
import type { PatientDto, CreatePatientDto, PatientListDto } from '../dto/PatientDto';

/**
 * Mapper for converting between Patient entities and DTOs
 */
export class PatientMapper {
  private static ageCalculationService = new AgeCalculationService();

  /**
   * Maps a Patient entity to a PatientDto
   */
  static toDto(patient: Patient): PatientDto {
    return {
      id: patient.id || '',
      patientNumber: patient.patientNumber,
      firstName: patient.firstName,
      lastName: patient.lastName,
      middleName: patient.middleName,
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
      age: patient.age, // Computed dynamically
      gender: patient.gender,
      contactNumber: patient.contactNumber,
      address: patient.address,
      
      // Guardian Information
      guardianName: patient.guardianName,
      guardianGender: patient.guardianGender,
      guardianRelationship: patient.guardianRelationship,
      guardianContactNumber: patient.guardianContactNumber,
      guardianAddress: patient.guardianAddress,
      
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
    };
  }

  /**
   * Maps a Patient entity to a PatientListDto (lighter version for lists)
   */
  static toListDto(patient: Patient): PatientListDto {
    return {
      id: patient.id || '',
      patientNumber: patient.patientNumber,
      firstName: patient.firstName,
      lastName: patient.lastName,
      middleName: patient.middleName,
      age: patient.age, // Computed dynamically
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
    };
  }

  /**
   * Maps an array of Patient entities to PatientDtos
   */
  static toDtoArray(patients: Patient[]): PatientDto[] {
    return patients.map((patient) => this.toDto(patient));
  }

  /**
   * Maps an array of Patient entities to PatientListDtos
   */
  static toListDtoArray(patients: Patient[]): PatientListDto[] {
    return patients.map((patient) => this.toListDto(patient));
  }

  /**
   * Maps a PatientDto to a Patient entity
   */
  static toDomain(dto: PatientDto): Patient {
    return new Patient(
      dto.patientNumber,
      dto.firstName,
      dto.lastName,
      new Date(dto.dateOfBirth),
      dto.gender as 'Male' | 'Female',
      dto.contactNumber,
      dto.address,
      {
        id: dto.id,
        middleName: dto.middleName,
        guardianName: dto.guardianName,
        guardianGender: dto.guardianGender as 'Male' | 'Female' | undefined,
        guardianRelationship: dto.guardianRelationship,
        guardianContactNumber: dto.guardianContactNumber,
        guardianAddress: dto.guardianAddress,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
      }
    );
  }

  /**
   * Maps a CreatePatientDto to a Patient entity (for creation)
   */
  static createToDomain(dto: CreatePatientDto, patientNumber: string): Patient {
    return new Patient(
      patientNumber,
      dto.firstName,
      dto.lastName,
      new Date(dto.dateOfBirth),
      dto.gender as 'Male' | 'Female',
      dto.contactNumber,
      dto.address,
      {
        middleName: dto.middleName,
        guardianName: dto.guardianName,
        guardianGender: dto.guardianGender as 'Male' | 'Female' | undefined,
        guardianRelationship: dto.guardianRelationship,
        guardianContactNumber: dto.guardianContactNumber,
        guardianAddress: dto.guardianAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
  }

  /**
   * Maps a plain object from database to Patient entity
   * This method is useful for ORM mapping
   */
  static fromPlainObject(obj: {
    id: string;
    patientNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: 'Male' | 'Female';
    contactNumber: string;
    address: string;
    guardianName?: string;
    guardianGender?: 'Male' | 'Female';
    guardianRelationship?: string;
    guardianContactNumber?: string;
    guardianAddress?: string;
    createdAt: Date;
    updatedAt: Date;
  }): Patient {
    return new Patient(
      obj.patientNumber,
      obj.firstName,
      obj.lastName,
      obj.dateOfBirth,
      obj.gender,
      obj.contactNumber,
      obj.address,
      {
        id: obj.id,
        middleName: obj.middleName,
        guardianName: obj.guardianName,
        guardianGender: obj.guardianGender,
        guardianRelationship: obj.guardianRelationship,
        guardianContactNumber: obj.guardianContactNumber,
        guardianAddress: obj.guardianAddress,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
      }
    );
  }

  /**
   * Maps Patient entity to plain object for database storage
   */
  static toPlainObject(
    patient: Patient,
    id?: string
  ): {
    id?: string;
    patientNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: 'Male' | 'Female';
    contactNumber: string;
    address: string;
    guardianName?: string;
    guardianGender?: 'Male' | 'Female';
    guardianRelationship?: string;
    guardianContactNumber?: string;
    guardianAddress?: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      ...(id && { id }),
      patientNumber: patient.patientNumber,
      firstName: patient.firstName,
      lastName: patient.lastName,
      middleName: patient.middleName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      contactNumber: patient.contactNumber,
      address: patient.address,
      guardianName: patient.guardianName,
      guardianGender: patient.guardianGender,
      guardianRelationship: patient.guardianRelationship,
      guardianContactNumber: patient.guardianContactNumber,
      guardianAddress: patient.guardianAddress,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }

  /**
   * Helper method to format patient name for display
   */
  static formatPatientName(patient: Patient): string {
    return patient.fullName;
  }

  /**
   * Helper method to format patient info for display (name + patient number)
   */
  static formatPatientInfo(patient: Patient): string {
    return `${patient.fullName} (${patient.patientNumber})`;
  }

  /**
   * Helper method to get patient age category for display
   */
  static getPatientAgeCategory(patient: Patient): string {
    const category = patient.ageCategory;
    const age = patient.age;
    
    switch (category) {
      case 'child':
        return `Child (${age} years old)`;
      case 'adult':
        return `Adult (${age} years old)`;
      case 'senior':
        return `Senior (${age} years old)`;
      default:
        return `${age} years old`;
    }
  }
}