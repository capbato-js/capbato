import { injectable } from 'tsyringe';
import { Patient } from '@nx-starter/application-shared';
import { IPatientRepository } from '@nx-starter/application-shared';
import { PatientNotFoundError } from '@nx-starter/application-shared';
import { generateId } from '@nx-starter/utils-core';

/**
 * In-memory implementation of IPatientRepository
 * Useful for development and testing
 */
@injectable()
export class InMemoryPatientRepository implements IPatientRepository {
  private patients: Map<string, Patient> = new Map();

  async getAll(): Promise<Patient[]> {
    return Array.from(this.patients.values()).sort((a, b) => {
      // Sort by last name, then first name
      const lastNameCompare = a.lastName.localeCompare(b.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstName.localeCompare(b.firstName);
    });
  }

  async create(patient: Patient): Promise<string> {
    const id = generateId();
    const patientWithId = new Patient(
      patient.patientNumber,
      patient.firstName,
      patient.lastName,
      patient.dateOfBirth,
      patient.gender,
      patient.contactNumber,
      patient.address,
      {
        id,
        middleName: patient.middleName,
        guardianName: patient.guardianName,
        guardianGender: patient.guardianGender,
        guardianRelationship: patient.guardianRelationship,
        guardianContactNumber: patient.guardianContactNumber,
        guardianAddress: patient.guardianAddress,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      }
    );

    this.patients.set(id, patientWithId);
    return id;
  }

  async getById(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getByPatientNumber(patientNumber: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.patientNumber === patientNumber
    );
  }

  async getByContactNumber(contactNumber: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.contactNumber === contactNumber
    );
  }

  async update(id: string, changes: Partial<Patient>): Promise<void> {
    const existingPatient = this.patients.get(id);
    if (!existingPatient) {
      throw new PatientNotFoundError(id);
    }

    // Create updated patient with changes
    const updatedPatient = new Patient(
      existingPatient.patientNumber, // Patient number cannot be changed
      changes.firstName !== undefined ? changes.firstName : existingPatient.firstName,
      changes.lastName !== undefined ? changes.lastName : existingPatient.lastName,
      changes.dateOfBirth !== undefined ? changes.dateOfBirth : existingPatient.dateOfBirth,
      changes.gender !== undefined ? changes.gender : existingPatient.gender,
      changes.contactNumber !== undefined ? changes.contactNumber : existingPatient.contactNumber,
      changes.address !== undefined ? changes.address : existingPatient.address,
      {
        id: existingPatient.id,
        middleName: changes.middleName !== undefined ? changes.middleName : existingPatient.middleName,
        guardianName: changes.guardianName !== undefined ? changes.guardianName : existingPatient.guardianName,
        guardianGender: changes.guardianGender !== undefined ? changes.guardianGender : existingPatient.guardianGender,
        guardianRelationship: changes.guardianRelationship !== undefined ? changes.guardianRelationship : existingPatient.guardianRelationship,
        guardianContactNumber: changes.guardianContactNumber !== undefined ? changes.guardianContactNumber : existingPatient.guardianContactNumber,
        guardianAddress: changes.guardianAddress !== undefined ? changes.guardianAddress : existingPatient.guardianAddress,
        createdAt: existingPatient.createdAt,
        updatedAt: new Date(),
      }
    );

    this.patients.set(id, updatedPatient);
  }

  async delete(id: string): Promise<void> {
    const deleted = this.patients.delete(id);
    if (!deleted) {
      throw new PatientNotFoundError(id);
    }
  }

  async getTotalCount(): Promise<number> {
    return this.patients.size;
  }

  async getCountByGender(): Promise<{ male: number; female: number }> {
    const patients = Array.from(this.patients.values());
    const male = patients.filter((p) => p.gender === 'Male').length;
    const female = patients.filter((p) => p.gender === 'Female').length;
    
    return { male, female };
  }

  async getCountByAgeCategory(): Promise<{ children: number; adults: number; seniors: number }> {
    const patients = Array.from(this.patients.values());
    const children = patients.filter((p) => p.age < 18).length;
    const seniors = patients.filter((p) => p.age >= 60).length;
    const adults = patients.length - children - seniors;
    
    return { 
      children, 
      adults: Math.max(0, adults), 
      seniors 
    };
  }

  async countByPatientNumberPrefix(prefix: string): Promise<number> {
    return Array.from(this.patients.values()).filter(
      (patient) => patient.patientNumber.startsWith(prefix)
    ).length;
  }

  async existsByPatientNumber(patientNumber: string): Promise<boolean> {
    return Array.from(this.patients.values()).some(
      (patient) => patient.patientNumber === patientNumber
    );
  }

  async existsByContactNumber(contactNumber: string, excludeId?: string): Promise<boolean> {
    return Array.from(this.patients.values()).some(
      (patient) => 
        patient.contactNumber === contactNumber && 
        (excludeId ? patient.id !== excludeId : true)
    );
  }

  async searchByName(searchTerm: string, limit?: number): Promise<Patient[]> {
    const searchLower = searchTerm.toLowerCase();
    const results = Array.from(this.patients.values()).filter((patient) => {
      const firstName = patient.firstName.toLowerCase();
      const lastName = patient.lastName.toLowerCase();
      const middleName = patient.middleName?.toLowerCase() || '';
      
      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        middleName.includes(searchLower)
      );
    }).sort((a, b) => {
      // Sort by relevance (exact matches first, then by name)
      const aFullName = `${a.firstName} ${a.middleName || ''} ${a.lastName}`.toLowerCase();
      const bFullName = `${b.firstName} ${b.middleName || ''} ${b.lastName}`.toLowerCase();
      
      const aExact = aFullName.includes(searchLower);
      const bExact = bFullName.includes(searchLower);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      return a.lastName.localeCompare(b.lastName);
    });

    return limit ? results.slice(0, limit) : results;
  }

  async getByAgeRange(minAge: number, maxAge: number): Promise<Patient[]> {
    return Array.from(this.patients.values())
      .filter((patient) => {
        const age = patient.age;
        return age >= minAge && age <= maxAge;
      })
      .sort((a, b) => b.age - a.age); // Sort by age descending
  }

  async getByGender(gender: 'Male' | 'Female'): Promise<Patient[]> {
    return Array.from(this.patients.values())
      .filter((patient) => patient.gender === gender)
      .sort((a, b) => {
        const lastNameCompare = a.lastName.localeCompare(b.lastName);
        if (lastNameCompare !== 0) return lastNameCompare;
        return a.firstName.localeCompare(b.firstName);
      });
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Patient[]> {
    return Array.from(this.patients.values())
      .filter((patient) => {
        const createdAt = patient.createdAt;
        return createdAt >= startDate && createdAt <= endDate;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getWithGuardianInfo(): Promise<Patient[]> {
    return Array.from(this.patients.values())
      .filter((patient) => patient.hasGuardianInfo)
      .sort((a, b) => {
        const lastNameCompare = a.lastName.localeCompare(b.lastName);
        if (lastNameCompare !== 0) return lastNameCompare;
        return a.firstName.localeCompare(b.firstName);
      });
  }

  async getWithoutGuardianInfo(): Promise<Patient[]> {
    return Array.from(this.patients.values())
      .filter((patient) => !patient.hasGuardianInfo)
      .sort((a, b) => {
        const lastNameCompare = a.lastName.localeCompare(b.lastName);
        if (lastNameCompare !== 0) return lastNameCompare;
        return a.firstName.localeCompare(b.firstName);
      });
  }

  /**
   * Utility method to clear all patients (for testing)
   */
  async clear(): Promise<void> {
    this.patients.clear();
  }

  /**
   * Utility method to get all patients as array (for testing)
   */
  getAllSync(): Patient[] {
    return Array.from(this.patients.values());
  }

  /**
   * Utility method to seed test data
   */
  async seed(patients: Patient[]): Promise<void> {
    this.patients.clear();
    for (const patient of patients) {
      const id = patient.id || generateId();
      const patientWithId = new Patient(
        patient.patientNumber,
        patient.firstName,
        patient.lastName,
        patient.dateOfBirth,
        patient.gender,
        patient.contactNumber,
        patient.address,
        {
          id,
          middleName: patient.middleName,
          guardianName: patient.guardianName,
          guardianGender: patient.guardianGender,
          guardianRelationship: patient.guardianRelationship,
          guardianContactNumber: patient.guardianContactNumber,
          guardianAddress: patient.guardianAddress,
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt,
        }
      );
      this.patients.set(id, patientWithId);
    }
  }
}