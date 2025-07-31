import { Patient } from '../types';
import { Patient as DomainPatient } from '@nx-starter/application-shared';

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