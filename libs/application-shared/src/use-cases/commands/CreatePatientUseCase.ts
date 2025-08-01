import { injectable, inject } from 'tsyringe';
import { Patient } from '../../domain/Patient';
import { IPatientRepository } from '../../domain/IPatientRepository';
import { PatientNumberService } from '../../domain/PatientNumberService';
import { PhoneNumberService } from '../../domain/PhoneNumberService';
import { DuplicatePatientError, PatientNumberGenerationError } from '../../domain/PatientExceptions';
import type { CreatePatientCommand } from '../../dto/PatientCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for creating a new patient
 * Handles all business logic and validation for patient creation
 */
@injectable()
export class CreatePatientUseCase {
  constructor(
    @inject(TOKENS.PatientRepository) private patientRepository: IPatientRepository,
    @inject(TOKENS.PatientNumberService) private patientNumberService: PatientNumberService,
    @inject(TOKENS.PhoneNumberService) private phoneNumberService: PhoneNumberService
  ) {}

  async execute(command: CreatePatientCommand): Promise<Patient> {
    // Validate phone numbers using domain service
    if (!this.phoneNumberService.isValidPhilippineMobile(command.contactNumber)) {
      throw new Error('Invalid contact number format');
    }

    if (command.guardianContactNumber && !this.phoneNumberService.isValidPhilippineMobile(command.guardianContactNumber)) {
      throw new Error('Invalid guardian contact number format');
    }

    // Check for duplicate contact number
    const existingPatientByContact = await this.patientRepository.getByContactNumber(command.contactNumber);
    if (existingPatientByContact) {
      throw new DuplicatePatientError(command.contactNumber, 'contactNumber');
    }

    // Generate patient number
    const patientNumber = await this.generatePatientNumber(command.lastName);

    // Sanitize phone numbers
    const sanitizedContactNumber = this.phoneNumberService.validateAndSanitize(command.contactNumber);
    const sanitizedGuardianContactNumber = command.guardianContactNumber 
      ? this.phoneNumberService.validateAndSanitize(command.guardianContactNumber)
      : undefined;

    // Create patient entity with domain logic
    const patient = new Patient(
      patientNumber,
      command.firstName,
      command.lastName,
      command.dateOfBirth,
      command.gender as 'Male' | 'Female',
      sanitizedContactNumber,
      {
        houseNumber: command.houseNumber,
        streetName: command.streetName,
        province: command.province,
        cityMunicipality: command.cityMunicipality,
        barangay: command.barangay,
      },
      {
        middleName: command.middleName,
        guardianName: command.guardianName,
        guardianGender: command.guardianGender as 'Male' | 'Female' | undefined,
        guardianRelationship: command.guardianRelationship,
        guardianContactNumber: sanitizedGuardianContactNumber,
        guardianAddressInfo: {
          houseNumber: command.guardianHouseNumber,
          streetName: command.guardianStreetName,
          province: command.guardianProvince,
          cityMunicipality: command.guardianCityMunicipality,
          barangay: command.guardianBarangay,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    // Validate business invariants (this will throw if invalid)
    patient.validate();

    // Persist using repository
    const id = await this.patientRepository.create(patient);

    // Return the created patient with ID
    return new Patient(
      patientNumber,
      command.firstName,
      command.lastName,
      command.dateOfBirth,
      command.gender as 'Male' | 'Female',
      sanitizedContactNumber,
      {
        houseNumber: command.houseNumber,
        streetName: command.streetName,
        province: command.province,
        cityMunicipality: command.cityMunicipality,
        barangay: command.barangay,
      },
      {
        id,
        middleName: command.middleName,
        guardianName: command.guardianName,
        guardianGender: command.guardianGender as 'Male' | 'Female' | undefined,
        guardianRelationship: command.guardianRelationship,
        guardianContactNumber: sanitizedGuardianContactNumber,
        guardianAddressInfo: {
          houseNumber: command.guardianHouseNumber,
          streetName: command.guardianStreetName,
          province: command.guardianProvince,
          cityMunicipality: command.guardianCityMunicipality,
          barangay: command.guardianBarangay,
        },
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      }
    );
  }

  private async generatePatientNumber(lastName: string): Promise<string> {
    try {
      const currentYear = new Date().getFullYear();
      const firstLetter = lastName.charAt(0).toUpperCase();
      const prefix = `${currentYear}-${firstLetter}`;
      
      // Count existing patients with the same prefix
      const existingCount = await this.patientRepository.countByPatientNumberPrefix(prefix);
      
      // Generate the patient number
      const patientNumber = this.patientNumberService.generatePatientNumber(lastName, existingCount);
      
      // Double-check that this patient number doesn't already exist
      const exists = await this.patientRepository.existsByPatientNumber(patientNumber);
      if (exists) {
        // This is unlikely but possible in high-concurrency scenarios
        // Try again with incremented count
        const retryPatientNumber = this.patientNumberService.generatePatientNumber(lastName, existingCount + 1);
        const retryExists = await this.patientRepository.existsByPatientNumber(retryPatientNumber);
        
        if (retryExists) {
          throw new PatientNumberGenerationError(lastName);
        }
        
        return retryPatientNumber;
      }
      
      return patientNumber;
    } catch (error) {
      if (error instanceof PatientNumberGenerationError) {
        throw error;
      }
      throw new PatientNumberGenerationError(lastName);
    }
  }
}