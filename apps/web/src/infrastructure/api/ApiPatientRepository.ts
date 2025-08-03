import { injectable, inject } from 'tsyringe';
import { Patient } from '@nx-starter/application-shared';
import { IPatientRepository } from '@nx-starter/application-shared';
import { IPatientApiService } from './IPatientApiService';

/**
 * API-based PatientRepository implementation
 * Uses IPatientApiService for HTTP communication following Clean Architecture principles
 */
@injectable()
export class ApiPatientRepository implements IPatientRepository {
  constructor(
    @inject('IPatientApiService') private readonly apiService: IPatientApiService
  ) {}

  async getAll(): Promise<Patient[]> {
    const response = await this.apiService.getAllPatients();
    // For display purposes, create simple objects that match the Patient interface
    // without going through domain validation
    return response.data.map(dto => ({
      id: dto.id,
      patientNumber: dto.patientNumber || 'N/A',
      firstName: dto.firstName || 'Unknown',
      lastName: dto.lastName || 'Unknown',
      middleName: dto.middleName,
      dateOfBirth: new Date(dto.dateOfBirth),
      gender: dto.gender as 'Male' | 'Female',
      contactNumber: dto.contactNumber || 'N/A',
      address: dto.address || 'N/A',
      guardianName: dto.guardianName,
      guardianGender: dto.guardianGender as 'Male' | 'Female' | undefined,
      guardianRelationship: dto.guardianRelationship,
      guardianContactNumber: dto.guardianContactNumber,
      guardianAddress: dto.guardianAddress,
      createdAt: new Date(dto.createdAt || Date.now()),
      updatedAt: new Date(dto.updatedAt || Date.now()),
      
      // Add computed properties that might be used by the frontend
      get fullName() { 
        return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(' ');
      },
      get age() {
        const today = new Date();
        const birthDate = this.dateOfBirth;
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
    } as Patient));
  }

  // For the web app, we only need getAll for now. Other methods can throw not implemented
  async create(patient: Patient): Promise<string> {
    throw new Error('Create operation not implemented in web app');
  }

  async getById(id: string): Promise<Patient | undefined> {
    throw new Error('GetById operation not implemented in web app');
  }

  async getByPatientNumber(patientNumber: string): Promise<Patient | undefined> {
    throw new Error('GetByPatientNumber operation not implemented in web app');
  }

  async getByContactNumber(contactNumber: string): Promise<Patient | undefined> {
    throw new Error('GetByContactNumber operation not implemented in web app');
  }

  async update(id: string, changes: Partial<Patient>): Promise<void> {
    throw new Error('Update operation not implemented in web app');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Delete operation not implemented in web app');
  }

  async getTotalCount(): Promise<number> {
    const patients = await this.getAll();
    return patients.length;
  }

  async getCountByGender(): Promise<{ male: number; female: number }> {
    const patients = await this.getAll();
    const male = patients.filter(p => p.gender === 'Male').length;
    const female = patients.filter(p => p.gender === 'Female').length;
    return { male, female };
  }

  async getCountByAgeCategory(): Promise<{ children: number; adults: number; seniors: number }> {
    const patients = await this.getAll();
    const currentYear = new Date().getFullYear();
    
    let children = 0;
    let adults = 0;
    let seniors = 0;

    patients.forEach(patient => {
      const age = currentYear - patient.dateOfBirth.getFullYear();
      if (age < 18) {
        children++;
      } else if (age >= 60) {
        seniors++;
      } else {
        adults++;
      }
    });

    return { children, adults, seniors };
  }

  async countByPatientNumberPrefix(prefix: string): Promise<number> {
    const patients = await this.getAll();
    return patients.filter(p => p.patientNumber.startsWith(prefix)).length;
  }

  async existsByPatientNumber(patientNumber: string): Promise<boolean> {
    const patients = await this.getAll();
    return patients.some(p => p.patientNumber === patientNumber);
  }

  async existsByContactNumber(contactNumber: string, excludeId?: string): Promise<boolean> {
    const patients = await this.getAll();
    return patients.some(p => p.contactNumber === contactNumber && p.id !== excludeId);
  }

  async searchByName(searchTerm: string, limit?: number): Promise<Patient[]> {
    const patients = await this.getAll();
    const filtered = patients.filter(p => 
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.middleName && p.middleName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return limit ? filtered.slice(0, limit) : filtered;
  }

  async getByAgeRange(minAge: number, maxAge: number): Promise<Patient[]> {
    const patients = await this.getAll();
    const currentYear = new Date().getFullYear();
    
    return patients.filter(patient => {
      const age = currentYear - patient.dateOfBirth.getFullYear();
      return age >= minAge && age <= maxAge;
    });
  }

  async getByGender(gender: 'Male' | 'Female'): Promise<Patient[]> {
    const patients = await this.getAll();
    return patients.filter(p => p.gender === gender);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Patient[]> {
    const patients = await this.getAll();
    return patients.filter(p => 
      p.createdAt >= startDate && p.createdAt <= endDate
    );
  }

  async getWithGuardianInfo(): Promise<Patient[]> {
    const patients = await this.getAll();
    return patients.filter(p => p.guardianName && p.guardianName.trim() !== '');
  }

  async getWithoutGuardianInfo(): Promise<Patient[]> {
    const patients = await this.getAll();
    return patients.filter(p => !p.guardianName || p.guardianName.trim() === '');
  }
}