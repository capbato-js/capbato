import { injectable, inject } from 'tsyringe';
import { Patient } from '../../domain/Patient';
import { IPatientRepository } from '../../domain/IPatientRepository';
import { PhoneNumberService } from '../../domain/PhoneNumberService';
import { PatientNotFoundError, DuplicatePatientError } from '../../domain/PatientExceptions';
import type { UpdatePatientCommand } from '../../dto/PatientCommands';
import { TOKENS } from '../../di/tokens';
import { NameFormattingService } from '@nx-starter/domain';

/**
 * Use case for updating an existing patient
 * Handles all business logic and validation for patient updates
 */
@injectable()
export class UpdatePatientUseCase {
  constructor(
    @inject(TOKENS.PatientRepository) private patientRepository: IPatientRepository,
    @inject(TOKENS.PhoneNumberService) private phoneNumberService: PhoneNumberService
  ) {}

  async execute(command: UpdatePatientCommand): Promise<Patient> {
    // Get existing patient
    const existingPatient = await this.patientRepository.getById(command.id);
    if (!existingPatient) {
      throw new PatientNotFoundError(command.id);
    }

    // Validate phone numbers if provided
    if (command.contactNumber && !this.phoneNumberService.isValidPhilippineMobile(command.contactNumber)) {
      throw new Error('Invalid contact number format');
    }

    if (command.guardianContactNumber && !this.phoneNumberService.isValidPhilippineMobile(command.guardianContactNumber)) {
      throw new Error('Invalid guardian contact number format');
    }

    // Check for duplicate contact number if updating contact number
    if (command.contactNumber && command.contactNumber !== existingPatient.contactNumber) {
      const existingPatientByContact = await this.patientRepository.getByContactNumber(command.contactNumber);
      if (existingPatientByContact && existingPatientByContact.id !== command.id) {
        throw new DuplicatePatientError(command.contactNumber, 'contactNumber');
      }
    }

    // Format names using NameFormattingService if provided
    const formattedFirstName = command.firstName 
      ? NameFormattingService.formatToProperCase(command.firstName)
      : existingPatient.firstName;
    const formattedLastName = command.lastName 
      ? NameFormattingService.formatToProperCase(command.lastName)
      : existingPatient.lastName;
    const formattedMiddleName = command.middleName !== undefined
      ? (command.middleName ? NameFormattingService.formatToProperCase(command.middleName) : undefined)
      : existingPatient.middleName;
    const formattedGuardianName = command.guardianName !== undefined
      ? (command.guardianName ? NameFormattingService.formatToProperCase(command.guardianName) : undefined)
      : existingPatient.guardianName;

    // Sanitize phone numbers if provided
    const sanitizedContactNumber = command.contactNumber 
      ? this.phoneNumberService.validateAndSanitize(command.contactNumber)
      : existingPatient.contactNumber;
    const sanitizedGuardianContactNumber = command.guardianContactNumber !== undefined
      ? (command.guardianContactNumber ? this.phoneNumberService.validateAndSanitize(command.guardianContactNumber) : undefined)
      : existingPatient.guardianContactNumber;

    // Create updated patient entity with domain logic
    const updatedPatient = new Patient(
      existingPatient.patientNumber,
      formattedFirstName,
      formattedLastName,
      command.dateOfBirth ? new Date(command.dateOfBirth) : existingPatient.dateOfBirth,
      (command.gender as 'Male' | 'Female') || existingPatient.gender,
      sanitizedContactNumber,
      {
        houseNumber: command.houseNumber !== undefined ? command.houseNumber : existingPatient.houseNumber,
        streetName: command.streetName !== undefined ? command.streetName : existingPatient.streetName,
        province: command.province !== undefined ? command.province : existingPatient.province,
        cityMunicipality: command.cityMunicipality !== undefined ? command.cityMunicipality : existingPatient.cityMunicipality,
        barangay: command.barangay !== undefined ? command.barangay : existingPatient.barangay,
      },
      {
        id: existingPatient.id,
        middleName: formattedMiddleName,
        photoUrl: command.photoUrl !== undefined ? command.photoUrl : existingPatient.photoUrl,
        guardianName: formattedGuardianName,
        guardianGender: (command.guardianGender as 'Male' | 'Female' | undefined) !== undefined
          ? (command.guardianGender as 'Male' | 'Female' | undefined)
          : existingPatient.guardianGender,
        guardianRelationship: command.guardianRelationship !== undefined ? command.guardianRelationship : existingPatient.guardianRelationship,
        guardianContactNumber: sanitizedGuardianContactNumber,
        guardianAddressInfo: {
          houseNumber: command.guardianHouseNumber !== undefined ? command.guardianHouseNumber : existingPatient.guardianHouseNumber,
          streetName: command.guardianStreetName !== undefined ? command.guardianStreetName : existingPatient.guardianStreetName,
          province: command.guardianProvince !== undefined ? command.guardianProvince : existingPatient.guardianProvince,
          cityMunicipality: command.guardianCityMunicipality !== undefined ? command.guardianCityMunicipality : existingPatient.guardianCityMunicipality,
          barangay: command.guardianBarangay !== undefined ? command.guardianBarangay : existingPatient.guardianBarangay,
        },
        createdAt: existingPatient.createdAt,
        updatedAt: new Date(),
      }
    );

    // Validate business invariants (this will throw if invalid)
    updatedPatient.validate();

    // Persist using repository
    await this.patientRepository.update(command.id, updatedPatient);

    // Return the updated patient
    return updatedPatient;
  }
}