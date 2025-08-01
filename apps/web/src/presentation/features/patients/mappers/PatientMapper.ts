import { Patient, PatientDetails, GuardianDetails } from '../types';
import { Patient as DomainPatient, PatientDto } from '@nx-starter/application-shared';

/**
 * Maps domain Patient to frontend Patient type
 */
export function mapDomainPatientToFrontend(domainPatient: DomainPatient): Patient {
  return {
    id: domainPatient.id || '',
    patientNumber: domainPatient.patientNumber,
    firstName: domainPatient.firstName,
    lastName: domainPatient.lastName,
    fullName: `${domainPatient.firstName} ${domainPatient.lastName}`,
    dateOfBirth: domainPatient.dateOfBirth.toISOString().split('T')[0], // Convert to YYYY-MM-DD
    age: domainPatient.age,
    gender: domainPatient.gender as 'Male' | 'Female' | 'Other',
    phoneNumber: domainPatient.contactNumber,
    email: undefined, // Not available in domain model
    address: {
      street: domainPatient.address,
      city: '', // Domain model has single address string
      province: '',
      zipCode: ''
    },
    emergencyContact: {
      name: domainPatient.guardianName || '',
      relationship: domainPatient.guardianRelationship || '',
      phoneNumber: domainPatient.guardianContactNumber || ''
    },
    medicalHistory: [], // Not available in current domain model
    allergies: [], // Not available in current domain model
    bloodType: undefined, // Not available in current domain model
    createdAt: domainPatient.createdAt.toISOString(),
    updatedAt: domainPatient.updatedAt.toISOString()
  };
}

/**
 * Maps array of domain Patients to frontend Patient array
 */
export function mapDomainPatientsToFrontend(domainPatients: DomainPatient[]): Patient[] {
  return domainPatients.map(mapDomainPatientToFrontend);
}

/**
 * Maps API PatientDto to frontend PatientDetails type
 */
export function mapApiPatientDtoToPatientDetails(dto: PatientDto): PatientDetails {
  // Build full name considering middleName
  const fullName = [dto.firstName, dto.middleName, dto.lastName]
    .filter(Boolean)
    .join(' ');

  // Parse address parts
  const addressParts: string[] = [];
  if (dto.houseNumber) addressParts.push(dto.houseNumber);
  if (dto.streetName) addressParts.push(dto.streetName);
  if (dto.barangay) addressParts.push(dto.barangay);
  if (dto.cityMunicipality) addressParts.push(dto.cityMunicipality);
  if (dto.province) addressParts.push(dto.province);

  const patientAddress = dto.address || addressParts.join(', ') || '';

  // Build guardian details if available
  let guardian: GuardianDetails | undefined;
  if (dto.guardianName) {
    const guardianAddressParts: string[] = [];
    if (dto.guardianHouseNumber) guardianAddressParts.push(dto.guardianHouseNumber);
    if (dto.guardianStreetName) guardianAddressParts.push(dto.guardianStreetName);
    if (dto.guardianBarangay) guardianAddressParts.push(dto.guardianBarangay);
    if (dto.guardianCityMunicipality) guardianAddressParts.push(dto.guardianCityMunicipality);
    if (dto.guardianProvince) guardianAddressParts.push(dto.guardianProvince);

    guardian = {
      fullName: dto.guardianName,
      gender: dto.guardianGender as 'Male' | 'Female' | 'Other' || 'Other',
      relationship: dto.guardianRelationship || '',
      contactNumber: dto.guardianContactNumber || '',
      address: dto.guardianAddress || guardianAddressParts.join(', ') || ''
    };
  }

  return {
    id: dto.id,
    patientNumber: dto.patientNumber,
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName,
    dateOfBirth: dto.dateOfBirth,
    age: dto.age,
    gender: dto.gender as 'Male' | 'Female' | 'Other',
    phoneNumber: dto.contactNumber,
    email: undefined, // Not available in API DTO
    address: patientAddress,
    emergencyContact: {
      name: dto.guardianName || '',
      relationship: dto.guardianRelationship || '',
      phoneNumber: dto.guardianContactNumber || ''
    },
    medicalHistory: [], // Not available in current API DTO
    allergies: [], // Not available in current API DTO  
    bloodType: undefined, // Not available in current API DTO
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    guardian,
    appointments: [] // Will be populated separately or from another API
  };
}